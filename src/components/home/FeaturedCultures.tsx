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
    <section className="bg-gray-50 section-padding">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Cultures
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the rich traditions and stories of cultures from around the world. 
            Each culture represents unique perspectives and valuable heritage.
          </p>
          {isEnabled && isInitialized && (
            <div className="mt-4 inline-flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live data from Nostr network
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {cultures.map((culture, index) => (
            <motion.div
              key={culture.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card group hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden rounded-t-xl">
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-cultural-100 flex items-center justify-center">
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
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group-hover:translate-x-1 transition-transform duration-200"
                >
                  Learn More
                  <ArrowRight className="ml-1 w-4 h-4" />
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
            className="btn-outline text-lg px-8 py-4 group"
          >
            Explore All Cultures
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
