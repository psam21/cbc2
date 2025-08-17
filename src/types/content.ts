// Core content types for the Culture Bridge platform
// These types map to Nostr events and UI components

export interface Culture {
  id: string
  name: string
  description: string
  region: string
  language: string[]
  population?: number
  imageUrl?: string
  heroImage?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  author: string
  exhibitionsCount: number
  resourcesCount: number
  storiesCount: number
}

export interface Exhibition {
  id: string
  title: string
  description: string
  shortDescription: string
  culture: string
  category: 'art' | 'history' | 'ceremony' | 'craft' | 'music' | 'dance' | 'storytelling'
  region: string
  imageUrl?: string
  heroImage?: string
  artifacts: Artifact[]
  startDate?: string
  endDate?: string
  location?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  author: string
  featured: boolean
}

export interface Artifact {
  id: string
  name: string
  description: string
  type: 'image' | 'audio' | 'video' | 'document' | '3d-model'
  mediaUrl: string
  thumbnailUrl?: string
  metadata: MediaMetadata
  tags: string[]
}

export interface MediaMetadata {
  width?: number
  height?: number
  duration?: number
  fileSize?: number
  mimeType: string
  checksum: string
}

export interface Resource {
  id: string
  title: string
  description: string
  type: 'document' | 'audio' | 'video' | 'image' | 'dataset' | 'software'
  category: 'education' | 'research' | 'preservation' | 'community' | 'art'
  culture: string[]
  language: string[]
  downloadUrl: string
  fileSize: number
  mimeType: string
  imageUrl?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  author: string
  downloads: number
  featured: boolean
}

export interface ElderStory {
  id: string
  title: string
  story: string
  summary: string
  culture: string
  storyteller: string
  storytellerBio?: string
  audioUrl?: string
  imageUrl?: string
  transcript?: string
  category: 'personal' | 'historical' | 'mythological' | 'cultural' | 'spiritual'
  tags: string[]
  createdAt: string
  author: string
  rating: number
  ratingsCount: number
  featured: boolean
}

export interface User {
  id: string
  npub: string
  name?: string
  displayName?: string
  bio?: string
  avatar?: string
  website?: string
  location?: string
  languages: string[]
  expertise: string[]
  cultures: string[]
  createdAt: string
  contributions: Contribution[]
  following: string[]
  followers: string[]
}

export interface Contribution {
  id: string
  type: 'culture' | 'exhibition' | 'resource' | 'story' | 'event'
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface CommunityEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  type: 'workshop' | 'celebration' | 'ceremony' | 'performance' | 'discussion'
  culture: string[]
  organizer: string
  attendees: string[]
  maxAttendees?: number
  registrationRequired: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Label {
  namespace: 'region' | 'culture' | 'category' | 'language' | 'type'
  value: string
  count: number
}

export interface SearchFilters {
  query?: string
  region?: string[]
  culture?: string[]
  category?: string[]
  language?: string[]
  type?: string[]
  tags?: string[]
  dateRange?: {
    start: string
    end: string
  }
  sortBy?: 'relevance' | 'newest' | 'oldest' | 'popular' | 'name'
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface NostrEvent {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  sig: string
}

// NIP-specific types
export interface NIP01Event extends NostrEvent {
  kind: 1
}

export interface NIP23Event extends NostrEvent {
  kind: 23
}

export interface NIP33Event extends NostrEvent {
  kind: 30002 | 30001 | 30003
}

export interface NIP51Event extends NostrEvent {
  kind: 51
}

export interface NIP94Event extends NostrEvent {
  kind: 1063
}

export interface NIP25Event extends NostrEvent {
  kind: 7
}

export interface NIP68Event extends NostrEvent {
  kind: 1985
}
