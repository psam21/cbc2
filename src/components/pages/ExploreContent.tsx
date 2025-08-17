'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SearchInput } from '@/components/ui/SearchInput'
import { Pagination } from '@/components/ui/Pagination'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { MapPin, Users, BookOpen, Heart, ArrowRight, Globe, Loader2 } from 'lucide-react'
import { useQueryParamState } from '@/hooks/useQueryParamState'

// Real data structure for cultures
interface Culture {
  id: string
  name: string
  description: string
  region: string
  population?: number
  language: string[]
  exhibitionsCount: number
  resourcesCount: number
  storiesCount: number
  imageUrl?: string
}

interface SearchFilters {
  region: string[]
  language: string[]
  population: string[]
}

export function ExploreContent() {
  const [cultures, setCultures] = useState<Culture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const { queryParams, setQueryParams } = useQueryParamState<SearchFilters & { page: number }>({
    region: [],
    language: [],
    population: [],
    page: 1
  })

  // Fetch cultures data
  useEffect(() => {
    const fetchCultures = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual Nostr query for cultures
        // For now, show empty state
        // const result = await nostrService.getCultures({
        //   page: queryParams.page,
        //   filters: {
        //     region: queryParams.region,
        //     language: queryParams.language,
        //     population: queryParams.population
        //   }
        // })
        // setCultures(result.cultures)
        // setTotalPages(result.totalPages)
        // setTotalCount(result.totalCount)
        setCultures([])
        setTotalPages(1)
        setTotalCount(0)
      } catch (error) {
        console.error('Failed to fetch cultures:', error)
        setError('Failed to load cultures')
      } finally {
        setLoading(false)
      }
    }

    fetchCultures()
  }, [queryParams])

  const handleFilterChange = (filterType: keyof SearchFilters, values: string[]) => {
    setQueryParams({
      ...queryParams,
      [filterType]: values,
      page: 1 // Reset to first page when filters change
    })
  }

  const handlePageChange = (page: number) => {
    setQueryParams({ ...queryParams, page })
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8faff] to-[#fffdf8] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] mb-8">
              Explore Cultures
            </h1>
            <div className="flex justify-center">
              <div className="flex items-center gap-3 text-[#4A4A4A]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-lg">Loading cultures...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8faff] to-[#fffdf8] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] mb-8">
              Explore Cultures
            </h1>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-md mx-auto">
              <p className="text-[#4A4A4A] mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cultures.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8faff] to-[#fffdf8] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] mb-8">
              Explore Cultures
            </h1>
            <p className="text-xl text-[#4A4A4A] mb-8 max-w-2xl mx-auto">
              Discover diverse cultural traditions and stories from around the world
            </p>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-md mx-auto">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">No Cultures Available Yet</h2>
              <p className="text-[#4A4A4A] mb-6">Be the first to document a culture and share its stories!</p>
              <Link
                href="/contribute"
                className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
              >
                Start Contributing
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faff] to-[#fffdf8] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] mb-8">
            Explore Cultures
          </h1>
          <p className="text-xl text-[#4A4A4A] max-w-2xl mx-auto">
            Discover diverse cultural traditions and stories from around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                Search Cultures
              </label>
              <SearchInput
                placeholder="Search cultures, regions, languages..."
                onSearch={(query, filters) => {
                  // Handle search
                  console.log('Search:', query, filters)
                }}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Region Filter */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                  Region
                </label>
                <select
                  multiple
                  value={queryParams.region}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value)
                    handleFilterChange('region', values)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="africa">Africa</option>
                  <option value="asia">Asia</option>
                  <option value="europe">Europe</option>
                  <option value="americas">Americas</option>
                  <option value="oceania">Oceania</option>
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                  Language
                </label>
                <select
                  multiple
                  value={queryParams.language}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value)
                    handleFilterChange('language', values)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="indigenous">Indigenous</option>
                </select>
              </div>

              {/* Population Filter */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                  Population
                </label>
                <select
                  multiple
                  value={queryParams.population}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value)
                    handleFilterChange('population', values)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="small">Small (&lt; 10K)</option>
                  <option value="medium">Medium (10K - 100K)</option>
                  <option value="large">Large (100K - 1M)</option>
                  <option value="very-large">Very Large (&gt; 1M)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          <p className="text-[#4A4A4A]">
            Showing {cultures.length} of {totalCount} cultures
          </p>
        </div>

        {/* Cultures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cultures.map((culture, index) => (
            <motion.div
              key={culture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden hover:border-orange-200"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center">
                  <Globe className="w-24 h-24 text-orange-500" />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-[#4A4A4A] font-medium">{culture.region}</span>
                  </div>
                  {culture.population && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-[#4A4A4A]">{culture.population.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-2 group-hover:text-orange-600 transition-colors duration-200">
                  {culture.name}
                </h3>
                
                <p className="text-[#4A4A4A] mb-4 leading-relaxed line-clamp-3">
                  {culture.description}
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-orange-600">{culture.exhibitionsCount}</div>
                    <div className="text-xs text-[#4A4A4A] font-medium">Exhibitions</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{culture.resourcesCount}</div>
                    <div className="text-xs text-[#4A4A4A] font-medium">Resources</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{culture.storiesCount}</div>
                    <div className="text-xs text-[#4A4A4A] font-medium">Stories</div>
                  </div>
                </div>
                
                {/* Language tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {culture.language.slice(0, 2).map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                  {culture.language.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-[#4A4A4A] text-xs rounded-full font-medium">
                      +{culture.language.length - 2}
                    </span>
                  )}
                </div>
                
                <Link
                  href={`/explore/${culture.id}`}
                  className="inline-flex items-center text-orange-600 hover:text-orange-700 font-bold group-hover:translate-x-1 transition-transform duration-200"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
