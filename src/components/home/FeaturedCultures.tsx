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
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-6xl font-display font-extrabold text-earth-800 mb-8 leading-tight tracking-tight">
            Featured Cultures
          </h2>
          <p className="text-xl md:text-2xl text-earth-600 max-w-4xl mx-auto leading-relaxed font-light">
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
            <p className="text-earth-600 mb-4">{error}</p>
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
            {cultures.map((culture, index) => (
              <motion.div
                key={culture.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-earth-100 group overflow-hidden hover:border-nature-200 cursor-pointer"
              >
                {/* Image with 3:2 aspect ratio */}
                <div className="relative h-48 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-earth-100 to-nature-100 flex items-center justify-center">
                    <BookOpen className="w-24 h-24 text-earth-500" />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                  
                  {/* Story Count Badge */}
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-earth-800 shadow-lg">
                    {culture.storiesCount} stories
                  </div>
                  
                  {/* Region Badge */}
                  <div className="absolute top-4 left-4 bg-nature-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    {culture.region}
                  </div>
                </div>
                
                <div className="p-8">
                  {/* Culture Name + Hook */}
                  <h3 className="text-2xl font-heading font-bold text-earth-800 mb-2 group-hover:text-nature-600 transition-colors duration-200">
                    {culture.name}
                  </h3>
                  <p className="text-earth-600 mb-4 leading-relaxed line-clamp-2 font-medium">
                    {culture.description}
                  </p>
                  
                  {/* Language Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {culture.language.slice(0, 2).map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-nature-50 text-nature-700 text-sm rounded-full font-medium border border-nature-200"
                      >
                        {lang}
                      </span>
                    ))}
                    {culture.language.length > 2 && (
                      <span className="px-3 py-1 bg-earth-100 text-earth-600 text-sm rounded-full font-medium">
                        +{culture.language.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div className="bg-earth-50 rounded-lg p-3">
                      <div className="text-xl font-bold text-nature-600">{culture.exhibitionsCount}</div>
                      <div className="text-xs text-earth-600 font-medium">Exhibitions</div>
                    </div>
                    <div className="bg-earth-50 rounded-lg p-3">
                      <div className="text-xl font-bold text-accent-600">{culture.resourcesCount}</div>
                      <div className="text-xs text-earth-600 font-medium">Resources</div>
                    </div>
                    <div className="bg-earth-50 rounded-lg p-3">
                      <div className="text-xl font-bold text-earth-600">{culture.storiesCount}</div>
                      <div className="text-xs text-earth-600 font-medium">Stories</div>
                    </div>
                  </div>
                  
                  {/* Call to Action */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/explore/${culture.id}`}
                      className="inline-flex items-center text-nature-600 hover:text-nature-700 font-bold group-hover:translate-x-1 transition-transform duration-200"
                    >
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                    
                    <div className="text-sm text-earth-600">
                      {culture.population && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {formatNumber(culture.population)}
                        </span>
                      )}
                    </div>
                  </div>
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
            className="inline-flex items-center justify-center px-12 py-6 border-2 border-earth-700 text-earth-700 text-xl font-bold rounded-xl hover:bg-earth-700 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Explore All Cultures
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
