'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Users, MapPin, BookOpen } from 'lucide-react'
import { useNostr } from '@/components/providers/NostrProvider'
import { Culture } from '@/types/content'
import { LoadingSpinner, SkeletonCard } from '@/components/ui/LoadingSpinner'
import { formatNumber } from '@/lib/utils'

// Fallback data when Nostr is not available
const fallbackCultures = [
  {
    id: '1',
    name: 'Maori',
    region: 'New Zealand',
    description: 'Indigenous Polynesian people of New Zealand with rich cultural traditions including haka, carving, and storytelling.',
    imageUrl: '/api/placeholder/400/300',
    population: 775000,
    language: ['Te Reo Māori', 'English'],
    exhibitionsCount: 12,
    resourcesCount: 45,
    storiesCount: 89,
    tags: ['indigenous', 'polynesian'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'npub1maori',
    heroImage: '/api/placeholder/400/300'
  },
  {
    id: '2',
    name: 'Inuit',
    region: 'Arctic',
    description: 'Indigenous peoples inhabiting the Arctic regions of Canada, Greenland, and Alaska with unique survival traditions.',
    imageUrl: '/api/placeholder/400/300',
    population: 160000,
    language: ['Inuktitut', 'Inupiaq', 'Yupik'],
    exhibitionsCount: 8,
    resourcesCount: 32,
    storiesCount: 67,
    tags: ['indigenous', 'arctic'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'npub1inuit',
    heroImage: '/api/placeholder/400/300'
  },
  {
    id: '3',
    name: 'Aboriginal Australians',
    region: 'Australia',
    description: 'First Nations peoples of Australia with the world\'s oldest continuous living culture spanning over 65,000 years.',
    imageUrl: '/api/placeholder/400/300',
    population: 798000,
    language: ['Various Aboriginal languages'],
    exhibitionsCount: 15,
    resourcesCount: 78,
    storiesCount: 156,
    tags: ['indigenous', 'ancient'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'npub1aboriginal',
    heroImage: '/api/placeholder/400/300'
  }
] as Culture[]

export function FeaturedCultures() {
  const { isEnabled, isInitialized, getService } = useNostr()
  const [cultures, setCultures] = useState<Culture[]>(fallbackCultures)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEnabled && isInitialized) {
      loadFeaturedCultures()
    }
  }, [isEnabled, isInitialized])

  const loadFeaturedCultures = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const service = getService()
      // Get featured cultures from NIP-51 lists or top cultures
      const result = await service.getCultures({ limit: 3, sortBy: 'popular' })
      
      if (result.data.length > 0) {
        setCultures(result.data.slice(0, 3))
      }
    } catch (err) {
      console.error('Failed to load featured cultures:', err)
      setError('Using cached featured cultures')
      // Keep fallback data
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Featured Cultures
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover diverse cultural traditions and stories from around the world
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">{error}</p>
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            {cultures.map((culture, index) => (
              <motion.div
                key={culture.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group overflow-hidden"
              >
                <div className="relative h-56 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-orange-400" />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                </div>
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 font-medium">{culture.region}</span>
                    </div>
                    {culture.population && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{formatNumber(culture.population)}</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200">
                    {culture.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                    {culture.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-6 mb-8 text-center">
                    <div>
                      <div className="text-xl font-bold text-orange-600">{culture.exhibitionsCount}</div>
                      <div className="text-sm text-gray-500 font-medium">Exhibitions</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">{culture.resourcesCount}</div>
                      <div className="text-sm text-gray-500 font-medium">Resources</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-purple-600">{culture.storiesCount}</div>
                      <div className="text-sm text-gray-500 font-medium">Stories</div>
                    </div>
                  </div>
                  
                  {/* Language tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {culture.language.slice(0, 2).map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                    {culture.language.length > 2 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
                        +{culture.language.length - 2}
                      </span>
                    )}
                  </div>
                  
                  <Link
                    href={`/explore/${culture.id}`}
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold group-hover:translate-x-1 transition-transform duration-200"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/explore"
            className="inline-flex items-center justify-center px-10 py-5 border-2 border-orange-600 text-orange-600 text-xl font-semibold rounded-xl hover:bg-orange-600 hover:text-white transition-all duration-200 transform hover:scale-105"
          >
            Explore All Cultures
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
