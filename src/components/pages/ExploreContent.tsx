'use client'

import React, { useState, useEffect } from 'react'
import { useNostr } from '@/components/providers/NostrProvider'
import { Culture, SearchFilters } from '@/types/content'
import { nostrService } from '@/lib/nostr'

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
  const [filteredCultures, setFilteredCultures] = useState<Culture[]>(mockCultures)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<SearchFilters>({
    region: [],
    language: [],
    category: []
  })

  // Load cultures from Nostr when enabled and initialized
  useEffect(() => {
    if (isEnabled && isInitialized) {
      loadCulturesFromNostr()
    }
  }, [isEnabled, isInitialized])

  const loadCulturesFromNostr = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const service = getService()
      const result = await service.getCultures(filters)
      
      setCultures(result.data)
      setFilteredCultures(result.data)
    } catch (err) {
      console.error('Failed to load cultures from Nostr:', err)
      setError('Failed to load cultures. Using cached data.')
      // Fall back to mock data
      setCultures(mockCultures)
      setFilteredCultures(mockCultures)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType: keyof SearchFilters, values: string[]) => {
    const newFilters = { ...filters, [filterType]: values }
    setFilters(newFilters)
    
    // Apply filters to current cultures
    let filtered = cultures
    
    if (newFilters.region?.length) {
      filtered = filtered.filter(culture => 
        newFilters.region!.includes(culture.region)
      )
    }
    
    if (newFilters.language?.length) {
      filtered = filtered.filter(culture => 
        culture.language.some(lang => newFilters.language!.includes(lang))
      )
    }
    
    setFilteredCultures(filtered)
  }

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCultures(cultures)
      return
    }
    
    const searchTerm = query.toLowerCase()
    const results = cultures.filter(culture =>
      culture.name.toLowerCase().includes(searchTerm) ||
      culture.description.toLowerCase().includes(searchTerm) ||
      culture.region.toLowerCase().includes(searchTerm) ||
      culture.language.some(lang => lang.toLowerCase().includes(searchTerm))
    )
    
    setFilteredCultures(results)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading cultures from Nostr network...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Indigenous Cultures
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the rich traditions, stories, and wisdom of indigenous communities from around the world.
            {isEnabled && isInitialized && (
              <span className="block text-sm text-green-600 mt-2">
                🔗 Connected to Nostr network - Live data enabled
              </span>
            )}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Cultures
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, description, or region..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Region Filter */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                Region
              </label>
              <select
                id="region"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => handleFilterChange('region', e.target.value ? [e.target.value] : [])}
              >
                <option value="">All Regions</option>
                <option value="North America">North America</option>
                <option value="South America">South America</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Africa">Africa</option>
                <option value="Oceania">Oceania</option>
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                id="language"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => handleFilterChange('language', e.target.value ? [e.target.value] : [])}
              >
                <option value="">All Languages</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Maori">Maori</option>
                <option value="Inuktitut">Inuktitut</option>
                <option value="Sami">Sami</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cultures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCultures.map((culture) => (
            <div key={culture.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={culture.imageUrl || '/images/culture-placeholder.jpg'}
                  alt={culture.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{culture.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{culture.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{culture.region}</span>
                  <span>{culture.population?.toLocaleString()} people</span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>{culture.exhibitionsCount} exhibitions</span>
                  <span>{culture.resourcesCount} resources</span>
                  <span>{culture.storiesCount} stories</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {culture.language.slice(0, 2).map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                  {culture.language.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{culture.language.length - 2} more
                    </span>
                  )}
                </div>
                
                <button className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                  Explore Culture
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCultures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No cultures found matching your criteria.</p>
            <button
              onClick={() => {
                setFilters({ region: [], language: [], category: [] })
                setFilteredCultures(cultures)
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-700 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
