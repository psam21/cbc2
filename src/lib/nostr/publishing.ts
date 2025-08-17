// Publishing service for creating and submitting content to Nostr
// Handles NIP-94 file uploads, NIP-33 content creation, and HTTP auth

import { NostrEvent, Culture, Exhibition, Resource, ElderStory } from '@/types/content'
import { identityService } from './identity'
import { nostrService } from './service'

export interface ContentSubmission {
  type: 'culture' | 'exhibition' | 'resource' | 'story'
  title: string
  description: string
  content?: string
  culture?: string[]
  category?: string
  tags?: string[]
  media?: File[]
  metadata?: Record<string, any>
}

export interface MediaUpload {
  file: File
  type: 'image' | 'audio' | 'video' | 'document'
  description?: string
}

export interface PublishingResult {
  success: boolean
  eventId?: string
  error?: string
  mediaUrls?: string[]
}

class PublishingService {
  private uploadEndpoint = process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT || '/api/upload'
  
  // Main content publishing method
  async publishContent(submission: ContentSubmission): Promise<PublishingResult> {
    try {
      // Ensure user is authenticated
      if (!identityService.getAuthState().isAuthenticated) {
        throw new Error('Must be authenticated to publish content')
      }

      // Upload media files first if present
      let mediaUrls: string[] = []
      if (submission.media && submission.media.length > 0) {
        mediaUrls = await this.uploadMediaFiles(submission.media)
      }

      // Create the appropriate Nostr event based on content type
      const event = await this.createContentEvent(submission, mediaUrls)
      
      if (!event) {
        throw new Error('Failed to create content event')
      }

      // Publish to Nostr relays
      const published = await nostrService.publishEvent(event)
      
      if (published) {
        return {
          success: true,
          eventId: event.id,
          mediaUrls
        }
      } else {
        throw new Error('Failed to publish to Nostr relays')
      }

    } catch (error) {
      console.error('Publishing failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown publishing error'
      }
    }
  }

  // Upload media files and create NIP-94 file metadata events
  private async uploadMediaFiles(files: File[]): Promise<string[]> {
    const urls: string[] = []
    
    for (const file of files) {
      try {
        // Upload file to storage service
        const uploadUrl = await this.uploadFile(file)
        
        // Create NIP-94 file metadata event
        const fileMetadataEvent = await this.createFileMetadataEvent(file, uploadUrl)
        
        if (fileMetadataEvent) {
          await nostrService.publishEvent(fileMetadataEvent)
          urls.push(uploadUrl)
        }
        
      } catch (error) {
        console.error('Failed to upload file:', file.name, error)
        // Continue with other files
      }
    }
    
    return urls
  }

  // Upload single file using HTTP auth (NIP-98)
  private async uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    
    // Create NIP-98 auth header
    const authHeader = await this.createAuthHeader('POST', this.uploadEndpoint)
    
    const response = await fetch(this.uploadEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': authHeader
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const result = await response.json()
    return result.url
  }

  // Create NIP-98 HTTP authorization header
  private async createAuthHeader(method: string, url: string): Promise<string> {
    const authEvent = {
      kind: 27235, // NIP-98 HTTP auth
      content: '',
      tags: [
        ['u', url],
        ['method', method],
        ['payload', ''], // Would be request body hash for non-GET requests
      ],
      created_at: Math.floor(Date.now() / 1000)
    }

    const signedEvent = await identityService.signEvent(authEvent)
    
    if (!signedEvent) {
      throw new Error('Failed to sign auth event')
    }

    // Encode the event as base64 for the Authorization header
    const eventJson = JSON.stringify(signedEvent)
    const encoded = btoa(eventJson)
    
    return `Nostr ${encoded}`
  }

  // Create NIP-94 file metadata event
  private async createFileMetadataEvent(file: File, url: string): Promise<NostrEvent | null> {
    try {
      const fileHash = await this.calculateFileHash(file)
      
      const event = {
        kind: 1063, // NIP-94 file metadata
        content: file.name,
        tags: [
          ['url', url],
          ['m', file.type],
          ['x', fileHash],
          ['size', file.size.toString()],
          ['alt', file.name]
        ],
        created_at: Math.floor(Date.now() / 1000)
      }

      return await identityService.signEvent(event)
    } catch (error) {
      console.error('Failed to create file metadata event:', error)
      return null
    }
  }

  // Calculate SHA-256 hash of file
  private async calculateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // Create content event based on submission type
  private async createContentEvent(submission: ContentSubmission, mediaUrls: string[]): Promise<NostrEvent | null> {
    const baseEvent = {
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['title', submission.title],
        ['summary', submission.description],
        ...submission.tags?.map(tag => ['t', tag]) || [],
        ...submission.culture?.map(culture => ['l', culture, 'culture']) || [],
        ...mediaUrls.map(url => ['r', url])
      ]
    }

    switch (submission.type) {
      case 'culture':
        return this.createCultureEvent(submission, baseEvent)
        
      case 'exhibition':
        return this.createExhibitionEvent(submission, baseEvent)
        
      case 'resource':
        return this.createResourceEvent(submission, baseEvent)
        
      case 'story':
        return this.createStoryEvent(submission, baseEvent)
        
      default:
        throw new Error(`Unknown content type: ${submission.type}`)
    }
  }

  // Create NIP-33 culture event (kind 30001)
  private async createCultureEvent(submission: ContentSubmission, baseEvent: any): Promise<NostrEvent | null> {
    const event = {
      ...baseEvent,
      kind: 30001,
      content: submission.content || submission.description,
      tags: [
        ...baseEvent.tags,
        ['d', this.generateIdentifier(submission.title)],
        ['l', submission.metadata?.region || '', 'region'],
        ...submission.metadata?.languages?.map((lang: string) => ['l', lang, 'language']) || []
      ]
    }

    return await identityService.signEvent(event)
  }

  // Create NIP-33 exhibition event (kind 30002)
  private async createExhibitionEvent(submission: ContentSubmission, baseEvent: any): Promise<NostrEvent | null> {
    const event = {
      ...baseEvent,
      kind: 30002,
      content: submission.content || submission.description,
      tags: [
        ...baseEvent.tags,
        ['d', this.generateIdentifier(submission.title)],
        ['l', submission.category || '', 'category'],
        ['l', submission.metadata?.region || '', 'region']
      ]
    }

    return await identityService.signEvent(event)
  }

  // Create NIP-33 resource event (kind 30003)
  private async createResourceEvent(submission: ContentSubmission, baseEvent: any): Promise<NostrEvent | null> {
    const event = {
      ...baseEvent,
      kind: 30003,
      content: submission.description,
      tags: [
        ...baseEvent.tags,
        ['d', this.generateIdentifier(submission.title)],
        ['l', submission.category || '', 'category'],
        ['l', submission.metadata?.type || 'document', 'type']
      ]
    }

    return await identityService.signEvent(event)
  }

  // Create NIP-23 long-form story event
  private async createStoryEvent(submission: ContentSubmission, baseEvent: any): Promise<NostrEvent | null> {
    const event = {
      ...baseEvent,
      kind: 23,
      content: submission.content || submission.description,
      tags: [
        ...baseEvent.tags,
        ['d', this.generateIdentifier(submission.title)],
        ['l', submission.category || 'personal', 'category']
      ]
    }

    return await identityService.signEvent(event)
  }

  // Generate unique identifier for replaceable events
  private generateIdentifier(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50) + '-' + Date.now().toString(36)
  }

  // Validate content submission
  validateSubmission(submission: ContentSubmission): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!submission.title?.trim()) {
      errors.push('Title is required')
    }

    if (!submission.description?.trim()) {
      errors.push('Description is required')
    }

    if (submission.title && submission.title.length > 200) {
      errors.push('Title must be less than 200 characters')
    }

    if (submission.description && submission.description.length > 2000) {
      errors.push('Description must be less than 2000 characters')
    }

    if (submission.type === 'story' && !submission.content) {
      errors.push('Story content is required')
    }

    if (submission.media && submission.media.length > 10) {
      errors.push('Maximum 10 files allowed')
    }

    // Check file sizes
    if (submission.media) {
      for (const file of submission.media) {
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
          errors.push(`File ${file.name} is too large (max 50MB)`)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Get content guidelines for different types
  getContentGuidelines(type: string): { title: string; guidelines: string[] } {
    const guidelines = {
      culture: {
        title: 'Culture Contribution Guidelines',
        guidelines: [
          'Ensure accuracy and respect for cultural traditions',
          'Include proper attribution and sources',
          'Respect sacred or sensitive information protocols',
          'Use inclusive and respectful language',
          'Provide cultural context and background',
          'Include relevant images or media when possible'
        ]
      },
      exhibition: {
        title: 'Exhibition Guidelines',
        guidelines: [
          'Curate content with clear thematic connection',
          'Include high-quality images and descriptions',
          'Provide cultural and historical context',
          'Respect intellectual property and attribution',
          'Create engaging narrative flow',
          'Include diverse perspectives when relevant'
        ]
      },
      resource: {
        title: 'Resource Sharing Guidelines',
        guidelines: [
          'Ensure resources are accurate and verified',
          'Include proper licensing information',
          'Provide clear descriptions and metadata',
          'Check file formats are accessible',
          'Include cultural sensitivity notes if needed',
          'Verify content is appropriate for all audiences'
        ]
      },
      story: {
        title: 'Elder Stories Guidelines',
        guidelines: [
          'Obtain proper permission from storytellers',
          'Include cultural context and significance',
          'Respect traditional protocols for story sharing',
          'Provide accurate transcriptions if including audio',
          'Include storyteller background and credentials',
          'Respect any restrictions on story sharing'
        ]
      }
    }

    return guidelines[type as keyof typeof guidelines] || {
      title: 'Content Guidelines',
      guidelines: ['Follow community standards and respect cultural protocols']
    }
  }
}

// Global instance
export const publishingService = new PublishingService()
