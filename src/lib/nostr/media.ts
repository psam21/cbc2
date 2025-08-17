import { NIP94Event, MediaMetadata } from '@/types/content'

interface MediaCacheEntry {
  metadata: MediaMetadata
  url: string
  timestamp: number
  checksum: string
}

interface MediaResolutionResult {
  url: string
  metadata: MediaMetadata
  thumbnailUrl?: string
  fallbackUrl?: string
}

class MediaResolver {
  private cache: Map<string, MediaCacheEntry> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  private readonly FALLBACK_IMAGES = {
    'image': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTUwTDIwMCAxMDBMMzAwIDE1MEwyMDAgMjAwTDEwMCAxNTBaIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjc3NDhCIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=',
    'audio': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNTAiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTE3MCAxMzBMMTkwIDE1MEwxNzAgMTcwTTIxMCAxMzBMMjMwIDE1MEwyMTAgMTcwIiBzdHJva2U9IiM2Nzc0OEIiIHN0cm9rZS13aWR0aD0iNCIvPgo8dGV4dCB4PSIyMDAiIHk9IjI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY3NzQ4QiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5BdWRpbyBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K',
    'video': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzY3NzQ4QiIvPgo8cGF0aCBkPSJNMTgwIDEzMEwyMjAgMTUwTDE4MCAxNzBaIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjc3NDhCIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPlZpZGVvIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=',
    'document': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMTUwIDEwMEwxNzAgMTAwTDE3MCAxMjBMMTUwIDEyMFoiIGZpbGw9IiM2Nzc0OEIiLz4KPHN2ZyB4PSIxNzAiIHk9IjExMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjEwMCI+CjxsaW5lIHgxPSIxODAiIHkxPSIxMjAiIHgyPSIyNDAiIHkyPSIxMjAiIHN0cm9rZT0iIzY3NzQ4QiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxsaW5lIHgxPSIxODAiIHkxPSIxMzAiIHgyPSIyNDAiIHkyPSIxMzAiIHN0cm9rZT0iIzY3NzQ4QiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxsaW5lIHgxPSIxODAiIHkxPSIxNDAiIHgyPSIyNDAiIHkyPSIxNDAiIHN0cm9rZT0iIzY3NzQ4QiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxsaW5lIHgxPSIxODAiIHkxPSIxNTAiIHgyPSIyNDAiIHkyPSIxNTAiIHN0cm9rZT0iIzY3NzQ4QiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxsaW5lIHgxPSIxODAiIHkxPSIxNjAiIHgyPSIyNDAiIHkyPSIxNjAiIHN0cm9rZT0iIzY3NzQ4QiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxsaW5lIHgxPSIxODAiIHkxPSIxNzAiIHgyPSIyNDAiIHkyPSIxNzAiIHN0cm9rZT0iIzY3NzQ4QiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo8dGV4dCB4PSIyMDAiIHk9IjI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY3NzQ4QiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5Eb2N1bWVudCBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K',
    '3d-model': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwTDMwMCAxNTBMMjAwIDIwMEwxMDAgMTUwWiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMTAwIDE1MEwyMDAgMjAwTDMwMCAxNTBMMjAwIDEwMFoiIGZpbGw9IiM2Nzc0OEIiLz4KPHN2ZyB4PSIxNzAiIHk9IjEyMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIj4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSIyMCIgZmlsbD0iIzY3NzQ4QiIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNzAiIHI9IjIwIiBmaWxsPSIjNjc3NDhCIi8+CjxjaXJjbGUgY3g9IjE4MCIgY3k9IjE2MCIgcj0iMjAiIGZpbGw9IiM2Nzc0OEIiLz4KPGNpcmNsZSBjeD0iMjIwIiBjeT0iMTYwIiByPSIyMCIgZmlsbD0iIzY3NzQ4QiIvPgo8L3N2Zz4KPHRleHQgeD0iMjAwIiB5PSIyNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2Nzc0OEIiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiI+My1EIG1vZGVsIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo='
  }

  /**
   * Resolve media from NIP-94 event or direct URL
   */
  async resolveMedia(eventOrUrl: NIP94Event | string): Promise<MediaResolutionResult> {
    try {
      if (typeof eventOrUrl === 'string') {
        return this.resolveFromUrl(eventOrUrl)
      } else {
        return this.resolveFromEvent(eventOrUrl)
      }
    } catch (error) {
      console.error('Media resolution failed:', error)
      return this.getFallbackResult('image')
    }
  }

  /**
   * Resolve media from NIP-94 event
   */
  private async resolveFromEvent(event: NIP94Event): Promise<MediaResolutionResult> {
    try {
      const content = JSON.parse(event.content)
      const tags = this.parseTags(event.tags)
      
      const url = tags.get('url')?.[0] || content.url || content.mediaUrl
      if (!url) {
        throw new Error('No media URL found in event')
      }

      const cacheKey = `${event.id}:${url}`
      const cached = this.cache.get(cacheKey)
      
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return {
          url: cached.url,
          metadata: cached.metadata,
          thumbnailUrl: tags.get('thumbnail')?.[0] || content.thumbnail
        }
      }

      // Validate checksum if provided
      const checksum = tags.get('checksum')?.[0] || content.checksum
      if (checksum) {
        const isValid = await this.validateChecksum(url, checksum)
        if (!isValid) {
          console.warn('Checksum validation failed for media:', url)
        }
      }

      const metadata: MediaMetadata = {
        width: content.width || content.dimensions?.width,
        height: content.height || content.dimensions?.height,
        duration: content.duration,
        fileSize: content.fileSize || content.size,
        mimeType: content.mimeType || content.mime_type || this.inferMimeType(url),
        checksum: checksum || ''
      }

      // Cache the result
      this.cache.set(cacheKey, {
        metadata,
        url,
        timestamp: Date.now(),
        checksum: checksum || ''
      })

      return {
        url,
        metadata,
        thumbnailUrl: tags.get('thumbnail')?.[0] || content.thumbnail
      }
    } catch (error) {
      console.error('Failed to resolve media from event:', error)
      return this.getFallbackResult('image')
    }
  }

  /**
   * Resolve media from direct URL
   */
  private async resolveFromUrl(url: string): Promise<MediaResolutionResult> {
    const cacheKey = `url:${url}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return {
        url: cached.url,
        metadata: cached.metadata
      }
    }

    try {
      const metadata = await this.fetchMediaMetadata(url)
      
      // Cache the result
      this.cache.set(cacheKey, {
        metadata,
        url,
        timestamp: Date.now(),
        checksum: ''
      })

      return { url, metadata }
    } catch (error) {
      console.error('Failed to resolve media from URL:', error)
      return this.getFallbackResult(this.inferMediaType(url))
    }
  }

  /**
   * Fetch media metadata from URL
   */
  private async fetchMediaMetadata(url: string): Promise<MediaMetadata> {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type') || this.inferMimeType(url)
      const contentLength = response.headers.get('content-length')
      
      return {
        mimeType: contentType,
        fileSize: contentLength ? parseInt(contentLength, 10) : undefined,
        checksum: ''
      }
    } catch (error) {
      console.error('Failed to fetch media metadata:', error)
      return {
        mimeType: this.inferMimeType(url),
        checksum: ''
      }
    }
  }

  /**
   * Validate checksum of media file
   */
  private async validateChecksum(url: string, expectedChecksum: string): Promise<boolean> {
    try {
      const response = await fetch(url)
      if (!response.ok) return false
      
      const arrayBuffer = await response.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const actualChecksum = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      
      return actualChecksum === expectedChecksum
    } catch (error) {
      console.error('Checksum validation failed:', error)
      return false
    }
  }

  /**
   * Infer MIME type from URL
   */
  private inferMimeType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase()
    const mimeTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'glb': 'model/gltf-binary',
      'gltf': 'model/gltf+json'
    }
    
    return mimeTypes[extension || ''] || 'application/octet-stream'
  }

  /**
   * Infer media type from MIME type
   */
  private inferMediaType(mimeType: string): keyof typeof this.FALLBACK_IMAGES {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('model/')) return '3d-model'
    return 'document'
  }

  /**
   * Get fallback result when media resolution fails
   */
  private getFallbackResult(type: keyof typeof this.FALLBACK_IMAGES): MediaResolutionResult {
    return {
      url: this.FALLBACK_IMAGES[type],
      metadata: {
        mimeType: 'image/svg+xml',
        checksum: ''
      },
      fallbackUrl: this.FALLBACK_IMAGES[type]
    }
  }

  /**
   * Parse tags into a Map for easy access
   */
  private parseTags(tags: string[][]): Map<string, string[]> {
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
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.CACHE_TTL) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: number } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.values()).length
    }
  }
}

// Export singleton instance
export const mediaResolver = new MediaResolver()
export default mediaResolver
