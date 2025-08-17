'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Download, 
  FileText, 
  Headphones, 
  Video, 
  Image, 
  Database,
  Globe,
  Filter,
  ExternalLink,
  Eye,
  Clock,
  HardDrive,
  Star,
  Calendar,
  User,
  Tag,
  AlertCircle
} from 'lucide-react'
import { useNostr } from '@/components/providers/NostrProvider'
import { Resource, SearchFilters } from '@/types/content'
import { useQueryParamState } from '@/hooks/useQueryParamState'
import { useDebounce } from '@/hooks/useDebounce'
import { SearchInput } from '@/components/ui/SearchInput'
import { LoadingSpinner, SkeletonList } from '@/components/ui/LoadingSpinner'
import { EmptyState, ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { Pagination } from '@/components/ui/Pagination'
import { formatNumber, formatFileSize, formatDate, formatTimeAgo } from '@/lib/utils'

// Mock data for development
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Maori Traditional Songs Collection',
    description: 'A comprehensive collection of traditional Maori songs with English translations and cultural context.',
    type: 'audio',
    category: 'education',
    culture: ['Maori'],
    language: ['Te Reo Māori', 'English'],
    downloadUrl: 'https://example.com/maori-songs.zip',
    fileSize: 45000000, // 45MB
    mimeType: 'application/zip',
    imageUrl: '/api/placeholder/300/200',
    tags: ['traditional', 'music', 'language'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    author: 'npub1maori',
    downloads: 1234,
    featured: true
  },
  {
    id: '2',
    title: 'Inuit Survival Techniques Manual',
    description: 'Traditional survival techniques and skills passed down through generations of Inuit peoples.',
    type: 'document',
    category: 'education',
    culture: ['Inuit'],
    language: ['English', 'Inuktitut'],
    downloadUrl: 'https://example.com/inuit-survival.pdf',
    fileSize: 12500000, // 12.5MB
    mimeType: 'application/pdf',
    imageUrl: '/api/placeholder/300/200',
    tags: ['survival', 'traditional-knowledge', 'arctic'],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    author: 'npub1inuit',
    downloads: 856,
    featured: false
  },
  {
    id: '3',
    title: 'Aboriginal Dreamtime Stories Dataset',
    description: 'Digitized collection of Aboriginal Dreamtime stories with metadata and cultural annotations.',
    type: 'dataset',
    category: 'research',
    culture: ['Aboriginal Australian'],
    language: ['English', 'Various Aboriginal languages'],
    downloadUrl: 'https://example.com/dreamtime-dataset.json',
    fileSize: 8900000, // 8.9MB
    mimeType: 'application/json',
    imageUrl: '/api/placeholder/300/200',
    tags: ['storytelling', 'mythology', 'research'],
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
    author: 'npub1aboriginal',
    downloads: 432,
    featured: true
  },
  {
    id: '4',
    title: 'Navajo Weaving Patterns Video Tutorial',
    description: 'Step-by-step video guide for traditional Navajo weaving patterns and techniques.',
    type: 'video',
    category: 'art',
    culture: ['Navajo'],
    language: ['English', 'Navajo'],
    downloadUrl: 'https://example.com/navajo-weaving.mp4',
    fileSize: 187000000, // 187MB
    mimeType: 'video/mp4',
    imageUrl: '/api/placeholder/300/200',
    tags: ['weaving', 'art', 'traditional-crafts'],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    author: 'npub1navajo',
    downloads: 567,
    featured: false
  },
  {
    id: '5',
    title: 'Sami Joik Musical Recordings',
    description: 'Traditional Sami joik (yoik) recordings with cultural explanations and historical context.',
    type: 'audio',
    category: 'preservation',
    culture: ['Sami'],
    language: ['Sami', 'Norwegian', 'Swedish'],
    downloadUrl: 'https://example.com/sami-joik.flac',
    fileSize: 95000000, // 95MB
    mimeType: 'audio/flac',
    imageUrl: '/api/placeholder/300/200',
    tags: ['joik', 'music', 'oral-tradition'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'npub1sami',
    downloads: 234,
    featured: false
  },
  {
    id: '6',
    title: 'Maya Calendar System Explained',
    description: 'Comprehensive guide to understanding the Maya calendar system with interactive examples.',
    type: 'document',
    category: 'education',
    culture: ['Maya'],
    language: ['English', 'Spanish'],
    downloadUrl: 'https://example.com/maya-calendar.pdf',
    fileSize: 15600000, // 15.6MB
    mimeType: 'application/pdf',
    imageUrl: '/api/placeholder/300/200',
    tags: ['calendar', 'astronomy', 'mathematics'],
    createdAt: '2023-12-20T00:00:00Z',
    updatedAt: '2023-12-20T00:00:00Z',
    author: 'npub1maya',
    downloads: 1023,
    featured: true
  }
]

const resourceTypeIcons = {
  document: FileText,
  audio: Headphones,
  video: Video,
  image: Image,
  dataset: Database,
  software: Globe
}

const resourceTypeColors = {
  document: 'text-blue-600 bg-blue-50',
  audio: 'text-green-600 bg-green-50',
  video: 'text-red-600 bg-red-50',
  image: 'text-purple-600 bg-purple-50',
  dataset: 'text-orange-600 bg-orange-50',
  software: 'text-indigo-600 bg-indigo-50'
}

export function DownloadsContent() {
  const { isEnabled, isInitialized, getService } = useNostr()
  const [resources, setResources] = useState<Resource[]>(mockResources)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set())
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  
  // URL state management
  const { queryParams, setQueryParams } = useQueryParamState<SearchFilters & { page: number }>({
    query: '',
    type: [],
    category: [],
    culture: [],
    language: [],
    page: 1,
    limit: 12,
    sortBy: 'newest'
  })

  // Load resources when params change
  useEffect(() => {
    loadResources()
  }, [isEnabled, isInitialized, queryParams])

  // Update search term when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm !== queryParams.query) {
      setQueryParams({ query: debouncedSearchTerm, page: 1 })
    }
  }, [debouncedSearchTerm, queryParams.query, setQueryParams])

  const loadResources = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (isEnabled && isInitialized) {
        const service = getService()
        const result = await service.getResources(queryParams)
        setResources(result.data)
        setTotalPages(result.pagination.totalPages)
      } else {
        // Filter mock data
        let filtered = mockResources
        
        if (queryParams.query) {
          const searchTerm = queryParams.query.toLowerCase()
          filtered = filtered.filter(resource =>
            resource.title.toLowerCase().includes(searchTerm) ||
            resource.description.toLowerCase().includes(searchTerm) ||
            resource.culture.some(c => c.toLowerCase().includes(searchTerm))
          )
        }
        
        if (queryParams.type?.length) {
          filtered = filtered.filter(resource => 
            queryParams.type!.includes(resource.type)
          )
        }
        
        if (queryParams.category?.length) {
          filtered = filtered.filter(resource => 
            queryParams.category!.includes(resource.category)
          )
        }
        
        if (queryParams.culture?.length) {
          filtered = filtered.filter(resource => 
            resource.culture.some(culture => queryParams.culture!.includes(culture))
          )
        }
        
        // Sort resources
        filtered.sort((a, b) => {
          switch (queryParams.sortBy) {
            case 'newest':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            case 'oldest':
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            case 'popular':
              return b.downloads - a.downloads
            case 'name':
              return a.title.localeCompare(b.title)
            default:
              return 0
          }
        })
        
        // Paginate results
        const startIndex = ((queryParams.page || 1) - 1) * (queryParams.limit || 12)
        const endIndex = startIndex + (queryParams.limit || 12)
        setResources(filtered.slice(startIndex, endIndex))
        setTotalPages(Math.ceil(filtered.length / (queryParams.limit || 12)))
      }
    } catch (err) {
      console.error('Failed to load resources:', err)
      setError('Failed to load resources. Please try again.')
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

  const handleDownload = async (resource: Resource) => {
    try {
      setDownloadingIds(prev => new Set(Array.from(prev).concat(resource.id)))
      
      // Create a temporary download link
      const link = document.createElement('a')
      link.href = resource.downloadUrl
      link.download = resource.title
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Simulate download tracking delay
      setTimeout(() => {
        setDownloadingIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(resource.id)
          return newSet
        })
      }, 1000)
      
    } catch (err) {
      console.error('Download failed:', err)
      setDownloadingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(resource.id)
        return newSet
      })
    }
  }

  const clearFilters = () => {
    setQueryParams({
      query: '',
      type: [],
      category: [],
      culture: [],
      language: [],
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
            Cultural Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access educational materials, documents, and resources for learning about diverse cultures and traditions.
          </p>
          {isEnabled && isInitialized && (
            <div className="mt-4 inline-flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live resources from Nostr network
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
                  Search Resources
                </label>
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search resources..."
                  isLoading={loading}
                />
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={queryParams.type?.[0] || ''}
                  className="input-field"
                  onChange={(e) => handleFilterChange('type', e.target.value ? [e.target.value] : [])}
                >
                  <option value="">All Types</option>
                  <option value="document">Documents</option>
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                  <option value="image">Images</option>
                  <option value="dataset">Datasets</option>
                  <option value="software">Software</option>
                </select>
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
                  <option value="education">Education</option>
                  <option value="research">Research</option>
                  <option value="preservation">Preservation</option>
                  <option value="community">Community</option>
                  <option value="art">Art</option>
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
                  <option value="popular">Most Downloaded</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(queryParams.type?.length || queryParams.category?.length || queryParams.culture?.length || queryParams.query) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {queryParams.query && (
                  <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                    Search: "{queryParams.query}"
                  </span>
                )}
                {queryParams.type?.map(type => (
                  <span key={type} className="inline-flex items-center px-3 py-1 bg-secondary-100 text-secondary-800 text-sm rounded-full">
                    Type: {type}
                  </span>
                ))}
                {queryParams.category?.map(category => (
                  <span key={category} className="inline-flex items-center px-3 py-1 bg-cultural-100 text-cultural-800 text-sm rounded-full">
                    Category: {category}
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
          ) : resources.length === 0 ? (
            <EmptyState
              title="No resources found"
              description="Try adjusting your search criteria or filters to find more results."
              icon={<Download className="w-8 h-8 text-gray-400" />}
              action={
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              }
            />
          ) : (
            <>
              {/* Resources Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              >
                {resources.map((resource, index) => {
                  const TypeIcon = resourceTypeIcons[resource.type] || FileText
                  const typeColor = resourceTypeColors[resource.type] || 'text-gray-600 bg-gray-50'
                  const isDownloading = downloadingIds.has(resource.id)
                  
                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card group hover:shadow-2xl transition-all duration-300"
                    >
                      {/* Resource Image/Icon */}
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                          <TypeIcon className="w-16 h-16 text-primary-400" />
                        </div>
                        
                        {/* Type Badge */}
                        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${typeColor}`}>
                          {resource.type}
                        </div>
                        
                        {/* Featured Badge */}
                        {resource.featured && (
                          <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        {/* Title and Description */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                          {resource.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {resource.description}
                        </p>
                        
                        {/* Metadata */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <HardDrive className="w-3 h-3 mr-1" />
                              <span>{formatFileSize(resource.fileSize)}</span>
                            </div>
                            <div className="flex items-center">
                              <Download className="w-3 h-3 mr-1" />
                              <span>{formatNumber(resource.downloads)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{formatTimeAgo(resource.createdAt)}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="w-3 h-3 mr-1" />
                            <span>{resource.author.slice(0, 12)}...</span>
                          </div>
                        </div>
                        
                        {/* Culture and Language tags */}
                        <div className="space-y-2 mb-4">
                          {/* Culture tags */}
                          <div className="flex flex-wrap gap-1">
                            {resource.culture.slice(0, 2).map((culture) => (
                              <span
                                key={culture}
                                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                              >
                                {culture}
                              </span>
                            ))}
                            {resource.culture.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{resource.culture.length - 2}
                              </span>
                            )}
                          </div>
                          
                          {/* Language tags */}
                          <div className="flex flex-wrap gap-1">
                            {resource.language.slice(0, 2).map((lang) => (
                              <span
                                key={lang}
                                className="px-2 py-1 bg-secondary-50 text-secondary-700 text-xs rounded-full"
                              >
                                {lang}
                              </span>
                            ))}
                            {resource.language.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{resource.language.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(resource)}
                            disabled={isDownloading}
                            className="btn-primary-sm flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDownloading ? (
                              <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </>
                            )}
                          </button>
                          
                          <Link
                            href={`/downloads/${resource.id}`}
                            className="btn-outline-sm flex items-center justify-center"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
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
