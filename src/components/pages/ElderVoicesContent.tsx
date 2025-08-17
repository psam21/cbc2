'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Play, 
  Pause,
  Star, 
  Users, 
  Clock, 
  MapPin,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  FileText,
  Calendar,
  User,
  Headphones,
  Download
} from 'lucide-react'
import { useNostr } from '@/components/providers/NostrProvider'
import { ElderStory, SearchFilters } from '@/types/content'
import { useQueryParamState } from '@/hooks/useQueryParamState'
import { useDebounce } from '@/hooks/useDebounce'
import { SearchInput } from '@/components/ui/SearchInput'
import { LoadingSpinner, SkeletonList } from '@/components/ui/LoadingSpinner'
import { EmptyState, ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { Pagination } from '@/components/ui/Pagination'
import { formatNumber, formatFileSize, formatDate, formatTimeAgo } from '@/lib/utils'

// Mock stories data for development
const mockStories: ElderStory[] = [
  {
    id: '1',
    title: 'The Legend of the Rainbow Serpent',
    story: 'In the Dreamtime, the Rainbow Serpent moved across the barren land, carving rivers and shaping mountains. This is the ancient story of creation, water, and the sacred landscape as told by the Aboriginal people.',
    summary: 'This powerful creation story tells of how the Rainbow Serpent carved the rivers and mountains of Australia, bringing water and life to the land.',
    culture: 'Aboriginal Australian',
    storyteller: 'Elder Mary Williams',
    storytellerBio: 'A respected elder from the Warlpiri people with over 50 years of storytelling experience.',
    audioUrl: 'https://example.com/rainbow-serpent.mp3',
    imageUrl: '/api/placeholder/400/300',
    transcript: 'Full transcript would be available here...',
    category: 'mythological',
    tags: ['dreamtime', 'creation', 'water', 'serpent'],
    createdAt: '2024-01-10T00:00:00Z',
    author: 'npub1aboriginal',
    rating: 4.8,
    ratingsCount: 156,
    featured: true
  },
  {
    id: '2',
    title: 'Lessons from the Tundra',
    story: 'Elder Joseph Kanguq shares essential traditional knowledge about surviving in the Arctic, including ice reading, animal behavior, and weather prediction passed down through generations.',
    summary: 'Essential traditional knowledge for Arctic survival, passed down through generations of Inuit people.',
    culture: 'Inuit',
    storyteller: 'Elder Joseph Kanguq',
    storytellerBio: 'A traditional hunter and elder who has lived on the land for over 70 years.',
    audioUrl: 'https://example.com/tundra-lessons.mp3',
    imageUrl: '/api/placeholder/400/300',
    transcript: 'Full transcript would be available here...',
    category: 'cultural',
    tags: ['survival', 'arctic', 'traditional-knowledge', 'ice'],
    createdAt: '2024-01-08T00:00:00Z',
    author: 'npub1inuit',
    rating: 4.9,
    ratingsCount: 89,
    featured: true
  },
  {
    id: '3',
    title: 'The Haka: Power and Tradition',
    story: 'Maori elder Wikitoria Te Rangi explains the cultural significance of haka, its role in Maori society, and demonstrates traditional movements that convey identity, strength, and community.',
    summary: 'A deep dive into the cultural and spiritual significance of haka in Maori society.',
    culture: 'Maori',
    storyteller: 'Elder Wikitoria Te Rangi',
    storytellerBio: 'A master of Maori cultural practices and traditional dance.',
    audioUrl: 'https://example.com/haka-tradition.mp3',
    imageUrl: '/api/placeholder/400/300',
    transcript: 'Full transcript would be available here...',
    category: 'cultural',
    tags: ['haka', 'tradition', 'performance', 'identity'],
    createdAt: '2024-01-05T00:00:00Z',
    author: 'npub1maori',
    rating: 4.7,
    ratingsCount: 234,
    featured: false
  },
  {
    id: '4',
    title: 'Songs of the Northern Lights',
    story: 'Sami elder Anna Somby shares traditional joik songs and explains their connection to the northern lights and reindeer herding traditions, preserving ancient musical heritage.',
    summary: 'Beautiful traditional joik songs that capture the essence of life in the Arctic, accompanied by cultural explanations.',
    culture: 'Sami',
    storyteller: 'Elder Anna Somby',
    storytellerBio: 'A traditional joiker and keeper of Sami musical traditions.',
    audioUrl: 'https://example.com/northern-lights-songs.mp3',
    imageUrl: '/api/placeholder/400/300',
    transcript: 'Full transcript would be available here...',
    category: 'cultural',
    tags: ['joik', 'northern-lights', 'reindeer', 'music'],
    createdAt: '2024-01-01T00:00:00Z',
    author: 'npub1sami',
    rating: 4.6,
    ratingsCount: 67,
    featured: false
  }
]

interface AudioPlayerProps {
  story: ElderStory
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
}

// Custom Audio Player Component
function AudioPlayer({ story, isPlaying, onPlay, onPause }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [isPlaying])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    
    const newTime = (parseFloat(e.target.value) / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds))
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <audio ref={audioRef} src={story.audioUrl} />
      
      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="100"
          value={duration > 0 ? (currentTime / duration) * 100 : 0}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => skip(-15)}
            className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          
          <button
            onClick={() => skip(15)}
            className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button onClick={toggleMute} className="text-gray-600 hover:text-primary-600">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume * 100}
            onChange={handleVolumeChange}
            className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
    </div>
  )
}

// Star Rating Component
function StarRating({ rating, ratingCount, storyId, onRate }: { 
  rating: number
  ratingCount: number 
  storyId: string
  onRate?: (rating: number) => void
}) {
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleRate = (newRating: number) => {
    setUserRating(newRating)
    onRate?.(newRating)
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleRate(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-4 h-4 ${
                star <= (hoveredRating || userRating || rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-600">
        {rating.toFixed(1)} ({formatNumber(ratingCount)})
      </span>
    </div>
  )
}

export function ElderVoicesContent() {
  const { isEnabled, isInitialized, getService } = useNostr()
  const [stories, setStories] = useState<ElderStory[]>(mockStories)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null)
  const [showTranscripts, setShowTranscripts] = useState<Set<string>>(new Set())
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  
  // URL state management
  const { queryParams, setQueryParams } = useQueryParamState<SearchFilters & { page: number }>({
    query: '',
    category: [],
    culture: [],
    language: [],
    page: 1,
    limit: 6,
    sortBy: 'newest'
  })

  // Load stories when params change
  useEffect(() => {
    loadStories()
  }, [isEnabled, isInitialized, queryParams])

  // Update search term when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm !== queryParams.query) {
      setQueryParams({ query: debouncedSearchTerm, page: 1 })
    }
  }, [debouncedSearchTerm, queryParams.query, setQueryParams])

  const loadStories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Filter mock data (TODO: replace with Nostr when getStories is implemented)
      let filtered = mockStories
      
      if (queryParams.query) {
        const searchTerm = queryParams.query.toLowerCase()
        filtered = filtered.filter(story =>
          story.title.toLowerCase().includes(searchTerm) ||
          story.story.toLowerCase().includes(searchTerm) ||
          story.culture.toLowerCase().includes(searchTerm) ||
          story.storyteller.toLowerCase().includes(searchTerm)
        )
      }
      
      if (queryParams.category?.length) {
        filtered = filtered.filter(story => 
          queryParams.category!.includes(story.category)
        )
      }
      
      if (queryParams.culture?.length) {
        filtered = filtered.filter(story => 
          queryParams.culture!.includes(story.culture)
        )
      }
      
      // Sort stories
      filtered.sort((a, b) => {
        switch (queryParams.sortBy) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          case 'popular':
            return b.ratingsCount - a.ratingsCount
          case 'rating':
            return b.rating - a.rating
          case 'name':
            return a.title.localeCompare(b.title)
          default:
            return 0
        }
      })
      
      // Paginate results
      const startIndex = ((queryParams.page || 1) - 1) * (queryParams.limit || 6)
      const endIndex = startIndex + (queryParams.limit || 6)
      setStories(filtered.slice(startIndex, endIndex))
      setTotalPages(Math.ceil(filtered.length / (queryParams.limit || 6)))
    } catch (err) {
      console.error('Failed to load stories:', err)
      setError('Failed to load stories. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [isEnabled, isInitialized, queryParams, getService])

  const handleFilterChange = (filterType: keyof SearchFilters, values: string[]) => {
    setQueryParams({ [filterType]: values, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setQueryParams({ page })
  }

  const handlePlay = (storyId: string) => {
    setCurrentPlaying(storyId)
  }

  const handlePause = () => {
    setCurrentPlaying(null)
  }

  const handleRate = (storyId: string, rating: number) => {
    // Update story rating in state (in real app, would save to Nostr)
    setStories(prev => prev.map(story =>
      story.id === storyId
        ? { ...story, rating: rating, ratingsCount: story.ratingsCount + 1 }
        : story
    ))
  }

  const toggleTranscript = (storyId: string) => {
    setShowTranscripts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(storyId)) {
        newSet.delete(storyId)
      } else {
        newSet.add(storyId)
      }
      return newSet
    })
  }

  const clearFilters = () => {
    setQueryParams({
      query: '',
      category: [],
      culture: [],
      language: [],
      page: 1
    })
    setSearchTerm('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 section-padding">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Elder Voices
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Listen to the wisdom and stories of cultural elders, preserving traditional knowledge and narratives for future generations.
          </p>
          {isEnabled && isInitialized && (
            <div className="mt-4 inline-flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live stories from Nostr network
            </div>
          )}
        </motion.div>

        {/* Error Boundary */}
        <ErrorBoundary error={error ? new Error(error) : undefined}>
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Stories
                </label>
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search stories..."
                  isLoading={loading}
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={queryParams.category?.[0] || ''}
                  className="input-field"
                  onChange={(e) => handleFilterChange('category', e.target.value ? [e.target.value] : [])}
                >
                  <option value="">All Categories</option>
                  <option value="creation-myth">Creation Myths</option>
                  <option value="traditional-knowledge">Traditional Knowledge</option>
                  <option value="cultural-practice">Cultural Practices</option>
                  <option value="music-tradition">Music & Songs</option>
                  <option value="crafts-tradition">Crafts & Arts</option>
                  <option value="spiritual-tradition">Spiritual Traditions</option>
                </select>
              </div>

              {/* Culture Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Culture
                </label>
                <select
                  value={queryParams.culture?.[0] || ''}
                  className="input-field"
                  onChange={(e) => handleFilterChange('culture', e.target.value ? [e.target.value] : [])}
                >
                  <option value="">All Cultures</option>
                  <option value="Aboriginal Australian">Aboriginal Australian</option>
                  <option value="Inuit">Inuit</option>
                  <option value="Maori">Maori</option>
                  <option value="Sami">Sami</option>
                  <option value="Navajo">Navajo</option>
                  <option value="Maya">Maya</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={queryParams.sortBy || 'newest'}
                  className="input-field"
                  onChange={(e) => setQueryParams({ sortBy: e.target.value as any, page: 1 })}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="popular">Most Played</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(queryParams.category?.length || queryParams.culture?.length || queryParams.query) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {queryParams.query && (
                  <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                    Search: "{queryParams.query}"
                  </span>
                )}
                {queryParams.category?.map(category => (
                  <span key={category} className="inline-flex items-center px-3 py-1 bg-secondary-100 text-secondary-800 text-sm rounded-full">
                    Category: {category.replace('-', ' ')}
                  </span>
                ))}
                {queryParams.culture?.map(culture => (
                  <span key={culture} className="inline-flex items-center px-3 py-1 bg-cultural-100 text-cultural-800 text-sm rounded-full">
                    Culture: {culture}
                  </span>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SkeletonList count={6} />
            </div>
          ) : stories.length === 0 ? (
            <EmptyState
              title="No stories found"
              description="Try adjusting your search criteria or filters to find more results."
              icon={<Heart className="w-8 h-8 text-gray-400" />}
              action={
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              }
            />
          ) : (
            <>
              {/* Stories Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
              >
                {stories.map((story, index) => {
                  const isPlaying = currentPlaying === story.id
                  const showTranscript = showTranscripts.has(story.id)
                  
                  return (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card group hover:shadow-2xl transition-all duration-300"
                    >
                      {/* Story Header */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                              {story.title}
                            </h3>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                <span>{story.storyteller}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{story.culture}</span>
                              </div>
                              <div className="flex items-center">
                                <Heart className="w-4 h-4 mr-1" />
                                <span>{story.category}</span>
                              </div>
                            </div>
                          </div>
                          
                          {story.featured && (
                            <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-4">
                          {story.story}
                        </p>
                        
                        {/* Audio Player */}
                        <AudioPlayer
                          story={story}
                          isPlaying={isPlaying}
                          onPlay={() => handlePlay(story.id)}
                          onPause={handlePause}
                        />
                      </div>
                      
                      {/* Story Content */}
                      <div className="p-6">
                        {/* Summary */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Story Summary</h4>
                          <p className="text-gray-600 text-sm">{story.summary}</p>
                        </div>
                        
                        {/* Storyteller Bio */}
                        {story.storytellerBio && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">About the Storyteller</h4>
                            <p className="text-gray-600 text-sm">{story.storytellerBio}</p>
                          </div>
                        )}
                        
                        {/* Transcript Toggle */}
                        <div className="mb-4">
                          <button
                            onClick={() => toggleTranscript(story.id)}
                            className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            {showTranscript ? 'Hide' : 'Show'} Transcript
                          </button>
                          
                          {showTranscript && (
                            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">
                                {story.transcript || 'Transcript not available for this story.'}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {/* Tags */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {story.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Metadata and Rating */}
                        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{formatTimeAgo(story.createdAt)}</span>
                            </div>
                          </div>
                          
                          <StarRating
                            rating={story.rating}
                            ratingCount={story.ratingsCount}
                            storyId={story.id}
                            onRate={(rating) => handleRate(story.id, rating)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={queryParams.page || 1}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="mt-8"
                />
              )}
            </>
          )}
        </ErrorBoundary>
      </div>
    </div>
  )
}
