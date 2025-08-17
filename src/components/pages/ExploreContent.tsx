'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Filter, Globe, MapPin, Users, BookOpen, ArrowRight, Star } from 'lucide-react'
import { Culture, SearchFilters } from '@/types/content'

// Mock data - in production this would come from Nostr NIP-33 kind 30001 events
const mockCultures: Culture[] = [
  {
    id: '1',
    name: 'Maori',
    description: 'Indigenous Polynesian people of New Zealand with rich cultural traditions including haka, carving, and storytelling.',
    region: 'Oceania',
    language: ['Te Reo Māori', 'English'],
    population: 775000,
    imageUrl: '/api/placeholder/400/300',
    heroImage: '/api/placeholder/800/400',
    tags: ['indigenous', 'polynesian', 'new-zealand', 'haka', 'carving'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    author: 'npub1maori',
    exhibitionsCount: 12,
    resourcesCount: 45,
    storiesCount: 89
  },
  {
    id: '2',
    name: 'Inuit',
    description: 'Indigenous peoples inhabiting the Arctic regions of Canada, Greenland, and Alaska with unique survival traditions.',
    region: 'North America',
    language: ['Inuktitut', 'Inupiaq', 'Yupik'],
    population: 160000,
    imageUrl: '/api/placeholder/400/300',
    heroImage: '/api/placeholder/800/400',
    tags: ['indigenous', 'arctic', 'survival', 'hunting', 'navigation'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    author: 'npub1inuit',
    exhibitionsCount: 8,
    resourcesCount: 32,
    storiesCount: 67
  },
  {
    id: '3',
    name: 'Aboriginal Australians',
    description: 'First Nations peoples of Australia with the world\'s oldest continuous living culture spanning over 65,000 years.',
    region: 'Oceania',
    language: ['250+ Indigenous languages'],
    population: 798000,
    imageUrl: '/api/placeholder/400/300',
    heroImage: '/api/placeholder/800/400',
    tags: ['indigenous', 'australia', 'dreamtime', 'storytelling', 'art'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    author: 'npub1aboriginal',
    exhibitionsCount: 15,
    resourcesCount: 78,
    storiesCount: 156
  },
  {
    id: '4',
    name: 'Sami',
    description: 'Indigenous Finno-Ugric people inhabiting Sápmi, which encompasses large parts of Norway, Sweden, Finland, and Russia.',
    region: 'Europe',
    language: ['Sami languages', 'Norwegian', 'Swedish', 'Finnish', 'Russian'],
    population: 80000,
    imageUrl: '/api/placeholder/400/300',
    heroImage: '/api/placeholder/800/400',
    tags: ['indigenous', 'europe', 'reindeer', 'herding', 'crafts'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    author: 'npub1sami',
    exhibitionsCount: 6,
    resourcesCount: 28,
    storiesCount: 43
  },
  {
    id: '5',
    name: 'Navajo',
    description: 'Native American people of the Southwestern United States with rich traditions in weaving, silversmithing, and sandpainting.',
    region: 'North America',
    language: ['Navajo', 'English'],
    population: 399494,
    imageUrl: '/api/placeholder/400/300',
    heroImage: '/api/placeholder/800/400',
    tags: ['indigenous', 'north-america', 'weaving', 'silversmithing', 'sandpainting'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    author: 'npub1navajo',
    exhibitionsCount: 9,
    resourcesCount: 34,
    storiesCount: 78
  },
  {
    id: '6',
    name: 'Yoruba',
    description: 'Ethnic group of West Africa, primarily in Nigeria, with rich traditions in art, music, religion, and philosophy.',
    region: 'Africa',
    language: ['Yoruba', 'English'],
    population: 45000000,
    imageUrl: '/api/placeholder/400/300',
    heroImage: '/api/placeholder/800/400',
    tags: ['african', 'west-africa', 'art', 'music', 'religion', 'philosophy'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    author: 'npub1yoruba',
    exhibitionsCount: 11,
    resourcesCount: 56,
    storiesCount: 92
  }
]

const regions = ['All Regions', 'Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']
const categories = ['All Categories', 'Indigenous', 'Traditional', 'Modern', 'Urban', 'Rural']

export function ExploreContent() {
  const [cultures, setCultures] = useState<Culture[]>(mockCultures)
  const [filteredCultures, setFilteredCultures] = useState<Culture[]>(mockCultures)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    region: [],
    category: [],
    sortBy: 'relevance'
  })
  const [showFilters, setShowFilters] = useState(false)

  // Filter cultures based on search criteria
  useEffect(() => {
    let filtered = [...cultures]

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter(culture => 
        culture.name.toLowerCase().includes(query) ||
        culture.description.toLowerCase().includes(query) ||
        culture.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Region filter
    if (filters.region && filters.region.length > 0 && !filters.region.includes('All Regions')) {
      filtered = filtered.filter(culture => filters.region?.includes(culture.region))
    }

    // Category filter
    if (filters.category && filters.category.length > 0 && !filters.category.includes('All Categories')) {
      filtered = filtered.filter(culture => 
        filters.category?.some(cat => 
          culture.tags.some(tag => tag.toLowerCase().includes(cat.toLowerCase()))
        )
      )
    }

    // Sorting
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'popular':
        filtered.sort((a, b) => (b.exhibitionsCount + b.resourcesCount + b.storiesCount) - (a.exhibitionsCount + a.resourcesCount + a.storiesCount))
        break
      default: // relevance
        // Keep original order for relevance
        break
    }

    setFilteredCultures(filtered)
  }, [filters, cultures])

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }))
  }

  const handleFilterChange = (type: keyof SearchFilters, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [type]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-cultural-700 text-white py-20">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Explore Cultures
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Discover the rich diversity of human culture from around the world. 
              Learn about traditions, languages, and communities that shape our global heritage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container-max py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cultures, traditions, or keywords..."
                value={filters.query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="relevance">Most Relevant</option>
              <option value="name">Name A-Z</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <div className="grid grid-cols-2 gap-2">
                    {regions.map((region) => (
                      <label key={region} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.region?.includes(region) || region === 'All Regions'}
                          onChange={(e) => {
                            if (region === 'All Regions') {
                              handleFilterChange('region', [])
                            } else {
                              const current = filters.region || []
                              const newRegions = e.target.checked 
                                ? [...current, region]
                                : current.filter(r => r !== region)
                              handleFilterChange('region', newRegions)
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{region}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.category?.includes(category) || category === 'All Categories'}
                          onChange={(e) => {
                            if (category === 'All Categories') {
                              handleFilterChange('category', [])
                            } else {
                              const current = filters.category || []
                              const newCategories = e.target.checked 
                                ? [...current, category]
                                : current.filter(c => c !== category)
                              handleFilterChange('category', newCategories)
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="section-padding">
        <div className="container-max">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredCultures.length} Culture{filteredCultures.length !== 1 ? 's' : ''} Found
              </h2>
              {filters.query && (
                <p className="text-gray-600 mt-1">
                  Showing results for "{filters.query}"
                </p>
              )}
            </div>
            
            {filteredCultures.length > 0 && (
              <div className="text-sm text-gray-500 mt-2 sm:mt-0">
                Sorted by {filters.sortBy === 'relevance' ? 'relevance' : filters.sortBy}
              </div>
            )}
          </div>

          {/* Cultures Grid */}
          {filteredCultures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCultures.map((culture, index) => (
                <motion.div
                  key={culture.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card group hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-cultural-100 flex items-center justify-center">
                      <Globe className="w-16 h-16 text-primary-400" />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{culture.region}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                      {culture.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {culture.description}
                    </p>
                    
                    {/* Language Info */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-1">Languages:</div>
                      <div className="flex flex-wrap gap-1">
                        {culture.language.slice(0, 3).map((lang, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {lang}
                          </span>
                        ))}
                        {culture.language.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{culture.language.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Content Counts */}
                    <div className="grid grid-cols-3 gap-4 mb-6 text-center">
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
                    
                    <Link
                      href={`/explore/${culture.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group-hover:translate-x-1 transition-transform duration-200"
                    >
                      Learn More
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No cultures found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setFilters({
                    query: '',
                    region: [],
                    category: [],
                    sortBy: 'relevance'
                  })
                }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
