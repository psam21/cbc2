'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Users, BookOpen, Search, Filter, Globe } from 'lucide-react'
import { useNostr } from '@/components/providers/NostrProvider'
import { Culture, SearchFilters } from '@/types/content'
import { nostrService } from '@/lib/nostr'
import { useQueryParamState } from '@/hooks/useQueryParamState'
import { useDebounce } from '@/hooks/useDebounce'
import { SearchInput } from '@/components/ui/SearchInput'
import { LoadingSpinner, SkeletonList } from '@/components/ui/LoadingSpinner'
import { EmptyState, ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { Pagination } from '@/components/ui/Pagination'
import { formatNumber } from '@/lib/utils'

// Mock data - in production this would come from Nostr NIP-33 kind 30001 events
const mockCultures: Culture[] = [
  {
    id: '1',
    name: 'Maori',
    description: 'Indigenous Polynesian people of New Zealand with rich cultural traditions.',
    region: 'Oceania',
    language: ['Maori', 'English'],
    population: 775000,
    imageUrl: '/images/maori-culture.jpg',
    heroImage: '/images/maori-hero.jpg',
    tags: ['indigenous', 'polynesian', 'new-zealand'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'npub1maori',
    exhibitionsCount: 12,
    resourcesCount: 45,
    storiesCount: 23
  },
  {
    id: '2',
    name: 'Inuit',
    description: 'Indigenous peoples inhabiting the Arctic regions of Canada, Greenland, and Alaska.',
    region: 'North America',
    language: ['Inuktitut', 'English', 'French'],
    population: 150000,
    imageUrl: '/images/inuit-culture.jpg',
    heroImage: '/images/inuit-hero.jpg',
    tags: ['indigenous', 'arctic', 'canada'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'npub1inuit',
    exhibitionsCount: 8,
    resourcesCount: 32,
    storiesCount: 18
  },
  {
    id: '3',
    name: 'Sami',
    description: 'Indigenous Finno-Ugric people inhabiting the Arctic area of Sápmi.',
    region: 'Europe',
    language: ['Sami', 'Norwegian', 'Swedish', 'Finnish'],
    population: 80000,
    imageUrl: '/images/sami-culture.jpg',
    heroImage: '/images/sami-hero.jpg',
    tags: ['indigenous', 'arctic', 'scandinavia'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'npub1sami',
    exhibitionsCount: 15,
    resourcesCount: 28,
    storiesCount: 31
  },
  {
    id: '4',
    name: 'Aboriginal Australian',
    description: 'Indigenous peoples of Australia with the world\'s oldest continuous culture.',
    region: 'Oceania',
    language: ['Various Aboriginal languages', 'English'],
    population: 812000,
    imageUrl: '/images/aboriginal-culture.jpg',
    heroImage: '/images/aboriginal-hero.jpg',
    tags: ['indigenous', 'australia', 'ancient'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'npub1aboriginal',
    exhibitionsCount: 22,
    resourcesCount: 67,
    storiesCount: 89
  },
  {
    id: '5',
    name: 'Navajo',
    description: 'Indigenous people of the Southwestern United States with rich artistic traditions.',
    region: 'North America',
    language: ['Navajo', 'English'],
    population: 399494,
    imageUrl: '/images/navajo-culture.jpg',
    heroImage: '/images/navajo-hero.jpg',
    tags: ['indigenous', 'southwest', 'art'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'npub1navajo',
    exhibitionsCount: 18,
    resourcesCount: 41,
    storiesCount: 27
  },
  {
    id: '6',
    name: 'Maya',
    description: 'Indigenous Mesoamerican civilization with advanced knowledge of astronomy and mathematics.',
    region: 'Central America',
    language: ['Various Mayan languages', 'Spanish'],
    population: 6000000,
    imageUrl: '/images/maya-culture.jpg',
    heroImage: '/images/maya-hero.jpg',
    tags: ['indigenous', 'mesoamerica', 'ancient'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'npub1maya',
    exhibitionsCount: 25,
    resourcesCount: 73,
    storiesCount: 56
  }
]

export default function ExploreContent() {
  const { isEnabled, isInitialized, getService } = useNostr()
  const [cultures, setCultures] = useState<Culture[]>(mockCultures)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  
  // URL state management
  const { queryParams, setQueryParams } = useQueryParamState<SearchFilters & { page: number }>({
    query: '',
    region: [],
    language: [],
    category: [],
    page: 1,
    limit: 12,
    sortBy: 'newest'
  })

  // Load cultures when params change
  useEffect(() => {
    loadCultures()
  }, [isEnabled, isInitialized, queryParams])

  // Update search term when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm !== queryParams.query) {
      setQueryParams({ query: debouncedSearchTerm, page: 1 })
    }
  }, [debouncedSearchTerm, queryParams.query, setQueryParams])

  const loadCultures = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (isEnabled && isInitialized) {
        const service = getService()
        const result = await service.getCultures(queryParams)
        setCultures(result.data)
        setTotalPages(result.pagination.totalPages)
      } else {
        // Filter mock data
        let filtered = mockCultures
        
        if (queryParams.query) {
          const searchTerm = queryParams.query.toLowerCase()
          filtered = filtered.filter(culture =>
            culture.name.toLowerCase().includes(searchTerm) ||
            culture.description.toLowerCase().includes(searchTerm) ||
            culture.region.toLowerCase().includes(searchTerm)
          )
        }
        
        if (queryParams.region?.length) {
          filtered = filtered.filter(culture => 
            queryParams.region!.includes(culture.region)
          )
        }
        
        if (queryParams.language?.length) {
          filtered = filtered.filter(culture => 
            culture.language.some(lang => queryParams.language!.includes(lang))
          )
        }
        
        // Paginate results
        const startIndex = ((queryParams.page || 1) - 1) * (queryParams.limit || 12)
        const endIndex = startIndex + (queryParams.limit || 12)
        setCultures(filtered.slice(startIndex, endIndex))
        setTotalPages(Math.ceil(filtered.length / (queryParams.limit || 12)))
      }
    } catch (err) {
      console.error('Failed to load cultures:', err)
      setError('Failed to load cultures. Please try again.')
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

  const clearFilters = () => {
    setQueryParams({
      query: '',
      region: [],
      language: [],
      category: [],
      page: 1
    })
    setSearchTerm('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 section-padding">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Cultural Heritage
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the rich traditions, stories, and wisdom of communities from around the world.
          </p>
          {isEnabled && isInitialized && (
            <div className="mt-4 inline-flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Connected to Nostr network - Live data
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Cultures
                </label>
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search by name, description, or region..."
                  isLoading={loading}
                />
              </div>

              {/* Region Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <select
                  value={queryParams.region?.[0] || ''}
                  className="input-field"
                  onChange={(e) => handleFilterChange('region', e.target.value ? [e.target.value] : [])}
                >
                  <option value="">All Regions</option>
                  <option value="North America">North America</option>
                  <option value="South America">South America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="Africa">Africa</option>
                  <option value="Oceania">Oceania</option>
                  <option value="Arctic">Arctic</option>
                  <option value="Australia">Australia</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Central America">Central America</option>
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
                  <option value="name">Name</option>
                  <option value="popular">Popular</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(queryParams.region?.length || queryParams.language?.length || queryParams.query) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {queryParams.query && (
                  <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                    Search: "{queryParams.query}"
                  </span>
                )}
                {queryParams.region?.map(region => (
                  <span key={region} className="inline-flex items-center px-3 py-1 bg-secondary-100 text-secondary-800 text-sm rounded-full">
                    {region}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SkeletonList count={12} />
            </div>
          ) : cultures.length === 0 ? (
            <EmptyState
              title="No cultures found"
              description="Try adjusting your search criteria or filters to find more results."
              icon={<Globe className="w-8 h-8 text-gray-400" />}
              action={
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              }
            />
          ) : (
            <>
              {/* Cultures Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              >
                {cultures.map((culture, index) => (
                  <motion.div
                    key={culture.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="culture-card group"
                  >
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-primary-400" />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{culture.region}</span>
                        </div>
                        {culture.population && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{formatNumber(culture.population)}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                        {culture.name}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {culture.description}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-primary-600">{culture.exhibitionsCount}</div>
                          <div className="text-xs text-gray-500">Exhibitions</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-secondary-600">{culture.resourcesCount}</div>
                          <div className="text-xs text-gray-500">Resources</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-cultural-600">{culture.storiesCount}</div>
                          <div className="text-xs text-gray-500">Stories</div>
                        </div>
                      </div>
                      
                      {/* Language tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {culture.language.slice(0, 2).map((lang) => (
                          <span
                            key={lang}
                            className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                          >
                            {lang}
                          </span>
                        ))}
                        {culture.language.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{culture.language.length - 2}
                          </span>
                        )}
                      </div>
                      
                      <Link
                        href={`/explore/${culture.id}`}
                        className="btn-primary-sm w-full"
                      >
                        Explore Culture
                      </Link>
                    </div>
                  </motion.div>
                ))}
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
