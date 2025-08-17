'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Filter, X, TrendingUp, Clock, Globe, Heart, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface SearchSuggestion {
  id: string
  type: 'culture' | 'story' | 'exhibition' | 'language' | 'region'
  title: string
  subtitle: string
  icon: React.ComponentType<any>
  href: string
}

interface FacetFilter {
  id: string
  label: string
  options: { value: string; label: string; count: number }[]
}

const trendingSearches = [
  'Yoruba weaving', 'Ladakh lullabies', 'Maori carving', 'Inuit survival', 'Aboriginal dreamtime'
]

const recentSearches = [
  'Traditional medicine', 'Ancient pottery', 'Folk music', 'Sacred ceremonies'
]

const searchSuggestions: SearchSuggestion[] = [
  {
    id: '1',
    type: 'culture',
    title: 'Maori',
    subtitle: 'Indigenous Polynesian people of New Zealand',
    icon: Globe,
    href: '/explore/maori'
  },
  {
    id: '2',
    type: 'story',
    title: 'Traditional Weaving Patterns',
    subtitle: 'Ancient techniques from various cultures',
    icon: Heart,
    href: '/stories/weaving-patterns'
  },
  {
    id: '3',
    type: 'exhibition',
    title: 'Sacred Ceremonies',
    subtitle: 'Cultural rituals and traditions',
    icon: BookOpen,
    href: '/exhibitions/sacred-ceremonies'
  }
]

const facetFilters: FacetFilter[] = [
  {
    id: 'region',
    label: 'Region',
    options: [
      { value: 'africa', label: 'Africa', count: 156 },
      { value: 'asia', label: 'Asia', count: 234 },
      { value: 'europe', label: 'Europe', count: 189 },
      { value: 'americas', label: 'Americas', count: 198 },
      { value: 'oceania', label: 'Oceania', count: 67 }
    ]
  },
  {
    id: 'language',
    label: 'Language',
    options: [
      { value: 'english', label: 'English', count: 445 },
      { value: 'spanish', label: 'Spanish', count: 123 },
      { value: 'french', label: 'French', count: 89 },
      { value: 'indigenous', label: 'Indigenous', count: 234 }
    ]
  },
  {
    id: 'theme',
    label: 'Theme',
    options: [
      { value: 'art', label: 'Art & Craft', count: 167 },
      { value: 'music', label: 'Music & Dance', count: 134 },
      { value: 'food', label: 'Food & Cuisine', count: 98 },
      { value: 'medicine', label: 'Traditional Medicine', count: 76 }
    ]
  },
  {
    id: 'media',
    label: 'Media Type',
    options: [
      { value: 'story', label: 'Stories', count: 456 },
      { value: 'video', label: 'Videos', count: 234 },
      { value: 'audio', label: 'Audio', count: 189 },
      { value: 'image', label: 'Images', count: 345 }
    ]
  }
]

interface SearchInputProps {
  placeholder?: string
  onSearch?: (query: string, filters: Record<string, string[]>) => void
  className?: string
}

export function SearchInput({ placeholder = "Search cultures, stories, traditions...", onSearch, className = "" }: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
        setShowFilters(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    if (query.trim()) {
      const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5)
      setSearchHistory(newHistory)
      onSearch?.(query, selectedFilters)
      setIsExpanded(false)
      setShowFilters(false)
    }
  }

  const handleFilterChange = (facetId: string, value: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const current = prev[facetId] || []
      if (checked) {
        return { ...prev, [facetId]: [...current, value] }
      } else {
        return { ...prev, [facetId]: current.filter(v => v !== value) }
      }
    })
  }

  const clearFilters = () => {
    setSelectedFilters({})
  }

  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).flat().length
  }

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Main Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsExpanded(true)
          }}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full pl-12 pr-24 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-lg"
        />
        
        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-20 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            getActiveFilterCount() > 0
              ? 'bg-orange-100 text-orange-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4 inline mr-1" />
          {getActiveFilterCount() > 0 && (
            <span className="bg-orange-600 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
        
        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white px-6 py-2 rounded-xl hover:bg-orange-700 transition-colors font-medium"
        >
          Search
        </button>
      </div>

      {/* Expanded Search Interface */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          >
            {/* Search Suggestions */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trending Searches */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    Trending Searches
                  </h3>
                  <div className="space-y-2">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    Recent Searches
                  </h3>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search Suggestions */}
              {query && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Results</h3>
                  <div className="space-y-2">
                    {searchSuggestions.map((suggestion) => (
                      <Link
                        key={suggestion.id}
                        href={suggestion.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <suggestion.icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{suggestion.title}</div>
                          <div className="text-sm text-gray-600">{suggestion.subtitle}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Faceted Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Refine Your Search</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {facetFilters.map((facet) => (
                <div key={facet.id}>
                  <h4 className="font-medium text-gray-900 mb-3">{facet.label}</h4>
                  <div className="space-y-2">
                    {facet.options.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters[facet.id]?.includes(option.value) || false}
                          onChange={(e) => handleFilterChange(facet.id, option.value, e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                        <span className="text-xs text-gray-500">({option.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
