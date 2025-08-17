import { nostrClient } from './client'
import { NostrAdapters } from './adapters'
import { mediaResolver } from './media'
import { labelTaxonomy } from './labels'
import {
  Culture,
  Exhibition,
  Resource,
  ElderStory,
  SearchFilters,
  PaginatedResponse,
  NostrEvent,
  NIP33Event,
  NIP23Event,
  NIP94Event,
  NIP25Event,
  NIP68Event
} from '@/types/content'

export interface NostrQueryOptions {
  limit?: number
  since?: number
  until?: number
  authors?: string[]
  kinds?: number[]
  tags?: string[][]
  timeout?: number
}

export class NostrService {
  private isInitialized = false
  private initializationPromise: Promise<void> | null = null

  /**
   * Initialize the Nostr service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return
    
    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = this.performInitialization()
    return this.initializationPromise
  }

  private async performInitialization(): Promise<void> {
    try {
      console.log('Initializing Nostr service...')
      
      // Wait for client to be ready
      await this.waitForClient()
      
      // Load initial data
      await this.loadInitialData()
      
      this.isInitialized = true
      console.log('Nostr service initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Nostr service:', error)
      throw error
    }
  }

  /**
   * Wait for Nostr client to be ready
   */
  private async waitForClient(): Promise<void> {
    let attempts = 0
    const maxAttempts = 30 // 30 seconds
    
    while (attempts < maxAttempts) {
      const status = nostrClient.getConnectionStatus()
      if (status.connected > 0) {
        return
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      attempts++
    }
    
    throw new Error('Nostr client failed to connect within timeout')
  }

  /**
   * Load initial data for the platform
   */
  private async loadInitialData(): Promise<void> {
    try {
      // Load labels for taxonomy
      const labelEvents = await nostrClient.queryEvents({
        kinds: [1985], // NIP-68
        limit: 1000
      })
      labelTaxonomy.processEvents(labelEvents as NIP68Event[])
      
      console.log('Initial data loaded:', {
        labels: labelTaxonomy.getStatistics().totalLabels,
        relays: nostrClient.getConnectionStatus()
      })
    } catch (error) {
      console.error('Failed to load initial data:', error)
    }
  }

  /**
   * Get cultures with pagination and filters
   */
  async getCultures(filters: SearchFilters = {}): Promise<PaginatedResponse<Culture>> {
    await this.ensureInitialized()
    
    try {
      const queryOptions: NostrQueryOptions = {
        kinds: [30001], // NIP-33 kind 30001
        limit: filters.limit || 20
      }

      // Add tag filters
      if (filters.region?.length) {
        queryOptions.tags = [['region', ...filters.region]]
      }
      if (filters.culture?.length) {
        queryOptions.tags = [['culture', ...filters.culture]]
      }
      if (filters.language?.length) {
        queryOptions.tags = [['language', ...filters.language]]
      }

      const events = await nostrClient.queryEvents(queryOptions)
      const cultures = NostrAdapters.culturesFromEvents(events as NIP33Event[])
      
      // Populate counts (this would be optimized in production)
      for (const culture of cultures) {
        culture.exhibitionsCount = await this.getCultureExhibitionsCount(culture.id)
        culture.resourcesCount = await this.getCultureResourcesCount(culture.id)
        culture.storiesCount = await this.getCultureStoriesCount(culture.id)
      }

      return {
        data: cultures,
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: cultures.length, // In production, this would be a separate count query
          totalPages: Math.ceil(cultures.length / (filters.limit || 20)),
          hasNext: false, // Would be calculated based on total
          hasPrev: filters.page ? filters.page > 1 : false
        }
      }
    } catch (error) {
      console.error('Failed to get cultures:', error)
      throw error
    }
  }

  /**
   * Get exhibitions with pagination and filters
   */
  async getExhibitions(filters: SearchFilters = {}): Promise<PaginatedResponse<Exhibition>> {
    await this.ensureInitialized()
    
    try {
      const queryOptions: NostrQueryOptions = {
        kinds: [30002], // NIP-33 kind 30002
        limit: filters.limit || 20
      }

      // Add tag filters
      if (filters.culture?.length) {
        queryOptions.tags = [['culture', ...filters.culture]]
      }
      if (filters.category?.length) {
        queryOptions.tags = [['category', ...filters.category]]
      }
      if (filters.region?.length) {
        queryOptions.tags = [['region', ...filters.region]]
      }

      const events = await nostrClient.queryEvents(queryOptions)
      const exhibitions = NostrAdapters.exhibitionsFromEvents(events as NIP33Event[])
      
      // Populate artifacts for each exhibition
      for (const exhibition of exhibitions) {
        exhibition.artifacts = await this.getExhibitionArtifacts(exhibition.id)
      }

      return {
        data: exhibitions,
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: exhibitions.length,
          totalPages: Math.ceil(exhibitions.length / (filters.limit || 20)),
          hasNext: false,
          hasPrev: filters.page ? filters.page > 1 : false
        }
      }
    } catch (error) {
      console.error('Failed to get exhibitions:', error)
      throw error
    }
  }

  /**
   * Get resources with pagination and filters
   */
  async getResources(filters: SearchFilters = {}): Promise<PaginatedResponse<Resource>> {
    await this.ensureInitialized()
    
    try {
      const queryOptions: NostrQueryOptions = {
        kinds: [30003], // NIP-33 kind 30003
        limit: filters.limit || 20
      }

      // Add tag filters
      if (filters.type?.length) {
        queryOptions.tags = [['type', ...filters.type]]
      }
      if (filters.category?.length) {
        queryOptions.tags = [['category', ...filters.category]]
      }
      if (filters.culture?.length) {
        queryOptions.tags = [['culture', ...filters.culture]]
      }

      const events = await nostrClient.queryEvents(queryOptions)
      const resources = NostrAdapters.resourcesFromEvents(events as NIP33Event[])

      return {
        data: resources,
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: resources.length,
          totalPages: Math.ceil(resources.length / (filters.limit || 20)),
          hasNext: false,
          hasPrev: filters.page ? filters.page > 1 : false
        }
      }
    } catch (error) {
      console.error('Failed to get resources:', error)
      throw error
    }
  }

  /**
   * Get elder stories with pagination and filters
   */
  async getElderStories(filters: SearchFilters = {}): Promise<PaginatedResponse<ElderStory>> {
    await this.ensureInitialized()
    
    try {
      const queryOptions: NostrQueryOptions = {
        kinds: [23], // NIP-23
        limit: filters.limit || 20
      }

      // Add tag filters
      if (filters.culture?.length) {
        queryOptions.tags = [['culture', ...filters.culture]]
      }
      if (filters.category?.length) {
        queryOptions.tags = [['category', ...filters.category]]
      }

      const events = await nostrClient.queryEvents(queryOptions)
      const stories = NostrAdapters.elderStoriesFromEvents(events as NIP23Event[])
      
      // Populate ratings for each story
      const storyIds = stories.map(story => story.id)
      const ratings = await this.getStoriesRatings(storyIds)
      
      for (const story of stories) {
        const rating = ratings.get(story.id)
        if (rating) {
          story.rating = rating.rating / rating.count
          story.ratingsCount = rating.count
        }
      }

      return {
        data: stories,
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: stories.length,
          totalPages: Math.ceil(stories.length / (filters.limit || 20)),
          hasNext: false,
          hasPrev: filters.page ? filters.page > 1 : false
        }
      }
    } catch (error) {
      console.error('Failed to get elder stories:', error)
      throw error
    }
  }

  /**
   * Get artifacts for an exhibition
   */
  async getExhibitionArtifacts(exhibitionId: string): Promise<any[]> {
    try {
      const events = await nostrClient.queryEvents({
        kinds: [1063], // NIP-94
        tags: [['e', exhibitionId]], // Reference to exhibition
        limit: 50
      })
      
      return NostrAdapters.artifactsFromEvents(events as NIP94Event[])
    } catch (error) {
      console.error('Failed to get exhibition artifacts:', error)
      return []
    }
  }

  /**
   * Get ratings for stories
   */
  async getStoriesRatings(storyIds: string[]): Promise<Map<string, { rating: number; count: number }>> {
    try {
      const events = await nostrClient.queryEvents({
        kinds: [7], // NIP-25
        tags: storyIds.map(id => ['e', id]), // Reference to stories
        limit: 1000
      })
      
      return NostrAdapters.ratingsFromEvents(events as NIP25Event[])
    } catch (error) {
      console.error('Failed to get story ratings:', error)
      return new Map()
    }
  }

  /**
   * Get culture counts
   */
  private async getCultureExhibitionsCount(cultureId: string): Promise<number> {
    try {
      const events = await nostrClient.queryEvents({
        kinds: [30002],
        tags: [['culture', cultureId]],
        limit: 1
      })
      return events.length
    } catch (error) {
      return 0
    }
  }

  private async getCultureResourcesCount(cultureId: string): Promise<number> {
    try {
      const events = await nostrClient.queryEvents({
        kinds: [30003],
        tags: [['culture', cultureId]],
        limit: 1
      })
      return events.length
    } catch (error) {
      return 0
    }
  }

  private async getCultureStoriesCount(cultureId: string): Promise<number> {
    try {
      const events = await nostrClient.queryEvents({
        kinds: [23],
        tags: [['culture', cultureId]],
        limit: 1
      })
      return events.length
    } catch (error) {
      return 0
    }
  }

  /**
   * Search across all content types
   */
  async search(query: string, filters: SearchFilters = {}): Promise<{
    cultures: Culture[]
    exhibitions: Exhibition[]
    resources: Resource[]
    stories: ElderStory[]
  }> {
    await this.ensureInitialized()
    
    try {
      const [cultures, exhibitions, resources, stories] = await Promise.all([
        this.getCultures({ ...filters, query }),
        this.getExhibitions({ ...filters, query }),
        this.getResources({ ...filters, query }),
        this.getElderStories({ ...filters, query })
      ])

      return {
        cultures: cultures.data,
        exhibitions: exhibitions.data,
        resources: resources.data,
        stories: stories.data
      }
    } catch (error) {
      console.error('Search failed:', error)
      throw error
    }
  }

  /**
   * Get available labels for filtering
   */
  getAvailableLabels() {
    return {
      regions: labelTaxonomy.getLabelsByNamespace('region'),
      cultures: labelTaxonomy.getLabelsByNamespace('culture'),
      categories: labelTaxonomy.getLabelsByNamespace('category'),
      languages: labelTaxonomy.getLabelsByNamespace('language'),
      types: labelTaxonomy.getLabelsByNamespace('type')
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return nostrClient.getConnectionStatus()
  }

  /**
   * Ensure service is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    try {
      await nostrClient.disconnect()
      labelTaxonomy.clear()
      this.isInitialized = false
      this.initializationPromise = null
    } catch (error) {
      console.error('Cleanup failed:', error)
    }
  }
}

// Export singleton instance
export const nostrService = new NostrService()
export default nostrService
