import { 
  Culture, 
  Exhibition, 
  Resource, 
  ElderStory, 
  Artifact, 
  MediaMetadata,
  NostrEvent,
  NIP33Event,
  NIP23Event,
  NIP94Event,
  NIP25Event,
  NIP68Event,
  Label
} from '@/types/content'

export class NostrAdapters {
  /**
   * Convert NIP-33 kind 30001 events to Culture objects
   */
  static culturesFromEvents(events: NIP33Event[]): Culture[] {
    return events
      .filter(event => event.kind === 30001)
      .map(event => {
        try {
          const content = JSON.parse(event.content)
          const tags = this.parseTags(event.tags)
          
          return {
            id: event.id,
            name: content.name || tags.get('name')?.[0] || 'Unknown Culture',
            description: content.description || content.summary || '',
            region: tags.get('region')?.[0] || content.region || 'Unknown',
            language: tags.get('language') || content.languages || [],
            population: content.population,
            imageUrl: tags.get('image')?.[0] || content.image,
            heroImage: tags.get('hero')?.[0] || content.heroImage || content.image,
            tags: Array.from(tags.keys()).filter(key => !['name', 'region', 'language', 'image', 'hero'].includes(key)),
            createdAt: new Date(event.created_at * 1000).toISOString(),
            updatedAt: new Date(event.created_at * 1000).toISOString(),
            author: event.pubkey,
            exhibitionsCount: 0,
            resourcesCount: 0,
            storiesCount: 0
          } as Culture
        } catch (error) {
          console.error('Failed to parse culture event:', error, event)
          return null
        }
      })
      .filter((culture): culture is Culture => culture !== null)
  }

  /**
   * Convert NIP-33 kind 30002 events to Exhibition objects
   */
  static exhibitionsFromEvents(events: NIP33Event[]): Exhibition[] {
    return events
      .filter(event => event.kind === 30002)
      .map(event => {
        try {
          const content = JSON.parse(event.content)
          const tags = this.parseTags(event.tags)
          
          return {
            id: event.id,
            title: content.title || tags.get('title')?.[0] || 'Untitled Exhibition',
            description: content.description || content.summary || '',
            shortDescription: content.shortDescription || content.description?.substring(0, 150) || '',
            culture: tags.get('culture')?.[0] || content.culture || 'Unknown',
            category: this.parseCategory(tags.get('category')?.[0] || content.category),
            region: tags.get('region')?.[0] || content.region || 'Unknown',
            imageUrl: tags.get('image')?.[0] || content.image,
            heroImage: tags.get('hero')?.[0] || content.heroImage || content.image,
            artifacts: [],
            startDate: content.startDate || content.start_date,
            endDate: content.endDate || content.end_date,
            location: content.location || tags.get('location')?.[0],
            tags: Array.from(tags.keys()).filter(key => !['title', 'culture', 'category', 'region', 'image', 'hero', 'location'].includes(key)),
            createdAt: new Date(event.created_at * 1000).toISOString(),
            updatedAt: new Date(event.created_at * 1000).toISOString(),
            author: event.pubkey,
            featured: tags.get('featured')?.[0] === 'true' || content.featured === true
          } as Exhibition
        } catch (error) {
          console.error('Failed to parse exhibition event:', error, event)
          return null
        }
      })
      .filter((exhibition): exhibition is Exhibition => exhibition !== null)
  }

  /**
   * Convert NIP-33 kind 30003 events to Resource objects
   */
  static resourcesFromEvents(events: NIP33Event[]): Resource[] {
    return events
      .filter(event => event.kind === 30003)
      .map(event => {
        try {
          const content = JSON.parse(event.content)
          const tags = this.parseTags(event.tags)
          
          return {
            id: event.id,
            title: content.title || tags.get('title')?.[0] || 'Untitled Resource',
            description: content.description || content.summary || '',
            type: this.parseResourceType(tags.get('type')?.[0] || content.type),
            category: this.parseResourceCategory(tags.get('category')?.[0] || content.category),
            culture: tags.get('culture') || content.cultures || [],
            language: tags.get('language') || content.languages || [],
            downloadUrl: tags.get('download')?.[0] || content.downloadUrl || content.url,
            fileSize: content.fileSize || content.size || 0,
            mimeType: content.mimeType || content.mime_type || 'application/octet-stream',
            imageUrl: tags.get('image')?.[0] || content.image,
            tags: Array.from(tags.keys()).filter(key => !['title', 'type', 'category', 'culture', 'language', 'download', 'image'].includes(key)),
            createdAt: new Date(event.created_at * 1000).toISOString(),
            updatedAt: new Date(event.created_at * 1000).toISOString(),
            author: event.pubkey,
            downloads: 0,
            featured: tags.get('featured')?.[0] === 'true' || content.featured === true
          } as Resource
        } catch (error) {
          console.error('Failed to parse resource event:', error, event)
          return null
        }
      })
      .filter((resource): resource is Resource => resource !== null)
  }

  /**
   * Convert NIP-23 events to ElderStory objects
   */
  static elderStoriesFromEvents(events: NIP23Event[]): ElderStory[] {
    return events
      .filter(event => event.kind === 23)
      .map(event => {
        try {
          const content = JSON.parse(event.content)
          const tags = this.parseTags(event.tags)
          
          return {
            id: event.id,
            title: content.title || tags.get('title')?.[0] || 'Untitled Story',
            story: content.story || content.content || '',
            summary: content.summary || content.description || content.story?.substring(0, 200) || '',
            culture: tags.get('culture')?.[0] || content.culture || 'Unknown',
            storyteller: tags.get('storyteller')?.[0] || content.storyteller || content.author || 'Unknown',
            storytellerBio: content.storytellerBio || content.bio,
            audioUrl: tags.get('audio')?.[0] || content.audioUrl || content.audio,
            imageUrl: tags.get('image')?.[0] || content.image,
            transcript: content.transcript,
            category: this.parseStoryCategory(tags.get('category')?.[0] || content.category),
            tags: Array.from(tags.keys()).filter(key => !['title', 'culture', 'storyteller', 'audio', 'image', 'category'].includes(key)),
            createdAt: new Date(event.created_at * 1000).toISOString(),
            author: event.pubkey,
            rating: 0,
            ratingsCount: 0,
            featured: tags.get('featured')?.[0] === 'true' || content.featured === true
          } as ElderStory
        } catch (error) {
          console.error('Failed to parse elder story event:', error, event)
          return null
        }
      })
      .filter((story): story is ElderStory => story !== null)
  }

  /**
   * Convert NIP-94 events to Artifact objects
   */
  static artifactsFromEvents(events: NIP94Event[]): Artifact[] {
    return events
      .filter(event => event.kind === 1063)
      .map(event => {
        try {
          const content = JSON.parse(event.content)
          const tags = this.parseTags(event.tags)
          
          return {
            id: event.id,
            name: content.name || tags.get('name')?.[0] || 'Untitled Artifact',
            description: content.description || content.summary || '',
            type: this.parseArtifactType(tags.get('type')?.[0] || content.type),
            mediaUrl: tags.get('url')?.[0] || content.url || content.mediaUrl,
            thumbnailUrl: tags.get('thumbnail')?.[0] || content.thumbnail,
            metadata: {
              width: content.width || content.dimensions?.width,
              height: content.height || content.dimensions?.height,
              duration: content.duration,
              fileSize: content.fileSize || content.size,
              mimeType: content.mimeType || content.mime_type || 'application/octet-stream',
              checksum: tags.get('checksum')?.[0] || content.checksum || ''
            },
            tags: Array.from(tags.keys()).filter(key => !['name', 'type', 'url', 'thumbnail', 'checksum'].includes(key))
          } as Artifact
        } catch (error) {
          console.error('Failed to parse artifact event:', error, event)
          return null
        }
      })
      .filter((artifact): artifact is Artifact => artifact !== null)
  }

  /**
   * Convert NIP-25 events to ratings
   */
  static ratingsFromEvents(events: NIP25Event[]): Map<string, { rating: number; count: number }> {
    const ratings = new Map<string, { rating: number; count: number }>()
    
    for (const event of events) {
      if (event.kind === 7) {
        const content = event.content
        const tags = this.parseTags(event.tags)
        const targetEventId = tags.get('e')?.[0]
        
        if (targetEventId && content) {
          const rating = this.parseRating(content)
          if (rating > 0) {
            const existing = ratings.get(targetEventId) || { rating: 0, count: 0 }
            existing.rating += rating
            existing.count += 1
            ratings.set(targetEventId, existing)
          }
        }
      }
    }
    
    return ratings
  }

  /**
   * Convert NIP-68 events to Label objects
   */
  static labelsFromEvents(events: NIP68Event[]): Label[] {
    const labelMap = new Map<string, number>()
    
    for (const event of events) {
      if (event.kind === 1985) {
        const tags = this.parseTags(event.tags)
        const namespace = tags.get('l')?.[0]
        const value = tags.get('value')?.[0]
        
        if (namespace && value) {
          const key = `${namespace}:${value}`
          labelMap.set(key, (labelMap.get(key) || 0) + 1)
        }
      }
    }
    
    return Array.from(labelMap.entries()).map(([key, count]) => {
      const [namespace, value] = key.split(':', 2)
      return {
        namespace: namespace as Label['namespace'],
        value,
        count
      }
    })
  }

  /**
   * Parse tags into a Map for easy access
   */
  private static parseTags(tags: string[][]): Map<string, string[]> {
    const tagMap = new Map<string, string[]>()
    
    for (const [key, value] of tags) {
      if (!tagMap.has(key)) {
        tagMap.set(key, [])
      }
      tagMap.get(key)!.push(value)
    }
    
    return tagMap
  }

  /**
   * Parse exhibition category
   */
  private static parseCategory(category?: string): Exhibition['category'] {
    const validCategories: Exhibition['category'][] = ['art', 'history', 'ceremony', 'craft', 'music', 'dance', 'storytelling']
    return validCategories.includes(category as any) ? category as Exhibition['category'] : 'art'
  }

  /**
   * Parse resource type
   */
  private static parseResourceType(type?: string): Resource['type'] {
    const validTypes: Resource['type'][] = ['document', 'audio', 'video', 'image', 'dataset', 'software']
    return validTypes.includes(type as any) ? type as Resource['type'] : 'document'
  }

  /**
   * Parse resource category
   */
  private static parseResourceCategory(category?: string): Resource['category'] {
    const validCategories: Resource['category'][] = ['education', 'research', 'preservation', 'community', 'art']
    return validCategories.includes(category as any) ? category as Resource['category'] : 'education'
  }

  /**
   * Parse story category
   */
  private static parseStoryCategory(category?: string): ElderStory['category'] {
    const validCategories: ElderStory['category'][] = ['personal', 'historical', 'mythological', 'cultural', 'spiritual']
    return validCategories.includes(category as any) ? category as ElderStory['category'] : 'cultural'
  }

  /**
   * Parse artifact type
   */
  private static parseArtifactType(type?: string): Artifact['type'] {
    const validTypes: Artifact['type'][] = ['image', 'audio', 'video', 'document', '3d-model']
    return validTypes.includes(type as any) ? type as Artifact['type'] : 'image'
  }

  /**
   * Parse rating from content string
   */
  private static parseRating(content: string): number {
    // Try to parse as number first
    const num = parseFloat(content)
    if (!isNaN(num) && num >= 1 && num <= 5) {
      return num
    }
    
    // Try to parse emoji ratings
    const emojiRatings: { [key: string]: number } = {
      '⭐': 1, '⭐⭐': 2, '⭐⭐⭐': 3, '⭐⭐⭐⭐': 4, '⭐⭐⭐⭐⭐': 5,
      '1': 1, '2': 2, '3': 3, '4': 4, '5': 5
    }
    
    return emojiRatings[content] || 0
  }
}
