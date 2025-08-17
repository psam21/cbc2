'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Calendar,
  MapPin,
  Eye,
  Heart,
  Share2,
  Clock,
  User,
  Star,
  BookOpen,
  Image as ImageIcon,
  Play
} from 'lucide-react'
import { Exhibition, SearchFilters } from '@/types/content'
import { useNostr } from '@/components/providers/NostrProvider'
import { useQueryParamState } from '@/hooks/useQueryParamState'
import { useDebounce } from '@/hooks/useDebounce'
import { SearchInput } from '@/components/ui/SearchInput'
import { LoadingSpinner, SkeletonList } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/ErrorBoundary'
import { Pagination } from '@/components/ui/Pagination'
import { formatDate, formatTimeAgo } from '@/lib/utils'

// Enhanced mock exhibitions data for E4 implementation
const mockExhibitions: Exhibition[] = [
  {
    id: '1',
    title: 'Dreamtime Stories in Contemporary Art',
    description: 'A powerful exhibition showcasing how traditional Aboriginal Dreamtime stories continue to inspire and inform contemporary Australian art. This collection bridges ancient storytelling traditions with modern artistic expression.',
    shortDescription: 'Contemporary interpretations of traditional Aboriginal Dreamtime stories through visual art.',
    culture: 'Aboriginal Australian',
    category: 'art',
    region: 'Australia',
    imageUrl: '/api/placeholder/400/300',
    heroImage: '/api/placeholder/800/500',
    artifacts: [
      {
        id: 'art1',
        name: 'Rainbow Serpent Painting',
        description: 'Modern acrylic interpretation of the Rainbow Serpent creation story',
        type: 'image',
        mediaUrl: '/api/placeholder/600/400',
        thumbnailUrl: '/api/placeholder/200/150',
        metadata: {
          width: 600,
          height: 400,
          mimeType: 'image/jpeg',
          checksum: 'abc123'
        },
        tags: ['rainbow-serpent', 'creation', 'contemporary']
      },
      {
        id: 'art2',
        name: 'Traditional Dance Video',
        description: 'Recording of traditional dance performance',
        type: 'video',
        mediaUrl: '/api/placeholder/video.mp4',
        thumbnailUrl: '/api/placeholder/300/200',
        metadata: {
          duration: 180,
          mimeType: 'video/mp4',
          checksum: 'def456'
        },
        tags: ['dance', 'traditional', 'ceremony']
      }
    ],
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-03-15T00:00:00Z',
    location: 'National Gallery of Australia, Canberra',
    tags: ['dreamtime', 'contemporary-art', 'aboriginal', 'storytelling'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'npub1aboriginal',
    featured: true
  },
  {
    id: '2',
    title: 'Traditional Māori Crafts: Weaving Heritage',
    description: 'An immersive exhibition celebrating the ancient art of Māori weaving and carving. Discover the intricate techniques, cultural significance, and contemporary applications of traditional Māori craftsmanship.',
    shortDescription: 'Explore the rich tradition of Māori weaving and carving techniques.',
    culture: 'Māori',
    category: 'craft',
    region: 'New Zealand',
    imageUrl: '/api/placeholder/400/300',
    heroImage: '/api/placeholder/800/500',
    artifacts: [
      {
        id: 'craft1',
        name: 'Traditional Flax Kete',
        description: 'Hand-woven flax basket using traditional techniques',
        type: 'image',
        mediaUrl: '/api/placeholder/500/400',
        thumbnailUrl: '/api/placeholder/200/150',
        metadata: {
          width: 500,
          height: 400,
          mimeType: 'image/jpeg',
          checksum: 'ghi789'
        },
        tags: ['weaving', 'flax', 'traditional']
      }
    ],
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-04-01T00:00:00Z',
    location: 'Te Papa Museum, Wellington',
    tags: ['māori', 'weaving', 'craft', 'traditional'],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    author: 'npub1maori',
    featured: false
  }
]

const categories = [
  { value: 'art', label: 'Art & Visual Culture' },
  { value: 'history', label: 'Historical Heritage' },
  { value: 'ceremony', label: 'Ceremonies & Rituals' },
  { value: 'craft', label: 'Traditional Crafts' },
  { value: 'music', label: 'Music & Performance' },
  { value: 'dance', label: 'Dance & Movement' },
  { value: 'storytelling', label: 'Oral Traditions' }
]

const regions = [
  { value: 'oceania', label: 'Oceania' },
  { value: 'north-america', label: 'North America' },
  { value: 'south-america', label: 'South America' },
  { value: 'africa', label: 'Africa' },
  { value: 'asia', label: 'Asia' },
  { value: 'europe', label: 'Europe' }
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'ending-soon', label: 'Ending Soon' },
  { value: 'alphabetical', label: 'A-Z' }
]

const ExhibitionCard = ({ exhibition }: { exhibition: Exhibition }) => {
  const isOngoing = exhibition.startDate && exhibition.endDate && 
    new Date() >= new Date(exhibition.startDate) && 
    new Date() <= new Date(exhibition.endDate)
  
  const isUpcoming = exhibition.startDate && new Date() < new Date(exhibition.startDate)
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg border overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img 
          src={exhibition.imageUrl} 
          alt={exhibition.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          {exhibition.featured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            isOngoing ? 'bg-green-500 text-white' :
            isUpcoming ? 'bg-blue-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {isOngoing ? 'Ongoing' : isUpcoming ? 'Upcoming' : 'Past'}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            {exhibition.artifacts.length}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {exhibition.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span className="capitalize">{exhibition.culture}</span>
              <span>•</span>
              <span className="capitalize">{exhibition.category}</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
          {exhibition.shortDescription}
        </p>
        
        {exhibition.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{exhibition.location}</span>
          </div>
        )}
        
        {exhibition.endDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4" />
            <span>
              {isOngoing && `Ends ${formatDate(exhibition.endDate)}`}
              {isUpcoming && `Opens ${formatDate(exhibition.startDate!)}`}
              {!isOngoing && !isUpcoming && `Ended ${formatDate(exhibition.endDate)}`}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>2.1k views</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>156</span>
            </div>
          </div>
          
          <Link
            href={`/exhibitions/${exhibition.id}`}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            View Exhibition
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export function ExhibitionsContent() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  const { isEnabled } = useNostr()

  // URL state management
  const { queryParams, setQueryParam } = useQueryParamState({
    q: '', 
    category: '', 
    region: '', 
    sort: 'newest', 
    page: '1'
  })
  const searchQuery = queryParams.q
  const category = queryParams.category
  const region = queryParams.region
  const sortBy = queryParams.sort
  const page = queryParams.page
  const setSearchQuery = (value: string) => setQueryParam('q', value)
  const setCategory = (value: string) => setQueryParam('category', value)
  const setRegion = (value: string) => setQueryParam('region', value)
  const setSortBy = (value: string) => setQueryParam('sort', value)
  const setPage = (value: string) => setQueryParam('page', value)

  const debouncedSearch = useDebounce(searchQuery, 300)

  const loadExhibitions = useCallback(async () => {
    setLoading(true)
    
    try {
      // In production, this would query Nostr NIP-33 kind 30002 events
      let filtered = [...mockExhibitions]
      
      // Apply search filter
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase()
        filtered = filtered.filter(exhibition => 
          exhibition.title.toLowerCase().includes(query) ||
          exhibition.description.toLowerCase().includes(query) ||
          exhibition.culture.toLowerCase().includes(query) ||
          exhibition.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      // Apply category filter
      if (category) {
        filtered = filtered.filter(exhibition => exhibition.category === category)
      }
      
      // Apply region filter (simplified)
      if (region) {
        filtered = filtered.filter(exhibition => 
          exhibition.region.toLowerCase().includes(region.toLowerCase())
        )
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'oldest':
          filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          break
        case 'alphabetical':
          filtered.sort((a, b) => a.title.localeCompare(b.title))
          break
        case 'ending-soon':
          filtered.sort((a, b) => {
            if (!a.endDate || !b.endDate) return 0
            return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
          })
          break
        case 'newest':
        default:
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
      }
      
      setExhibitions(filtered)
      setTotalResults(filtered.length)
      
    } catch (error) {
      console.error('Failed to load exhibitions:', error)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, category, region, sortBy, isEnabled])

  useEffect(() => {
    loadExhibitions()
  }, [loadExhibitions])

  const clearFilters = () => {
    setSearchQuery('')
    setCategory('')
    setRegion('')
    setSortBy('newest')
    setPage('1')
  }

  const hasActiveFilters = searchQuery || category || region || sortBy !== 'newest'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Cultural Exhibitions
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore curated collections of cultural artifacts, stories, and traditions from around the world.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search exhibitions by title, culture, or theme..."
            />
          </div>
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {totalResults} exhibition{totalResults !== 1 ? 's' : ''} found
            </span>
            <button
              onClick={clearFilters}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <SkeletonList count={6} />
      )}

      {/* Results */}
      {!loading && (
        <>
          {exhibitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {exhibitions.map((exhibition) => (
                <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No exhibitions found"
              description={hasActiveFilters ? 
                "Try adjusting your search criteria or clearing filters" :
                "Check back soon for new cultural exhibitions"
              }
              action={hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Clear filters
                </button>
              ) : undefined}
            />
          )}
        </>
      )}

      {/* Pagination */}
      {!loading && exhibitions.length > 0 && (
        <div className="mt-12">
          <Pagination
            currentPage={parseInt(page)}
            totalPages={Math.ceil(totalResults / 12)}
            onPageChange={(newPage) => setPage(newPage.toString())}
          />
        </div>
      )}
    </div>
  )
}