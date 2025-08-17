'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, MapPin, Users, Star } from 'lucide-react'

// Mock data - in production this would come from Nostr NIP-51 lists
const featuredExhibitions = [
  {
    id: '1',
    title: 'Maori Carving Traditions',
    culture: 'Maori',
    category: 'craft' as const,
    region: 'New Zealand',
    description: 'Explore the ancient art of Maori wood carving, from traditional meeting houses to contemporary interpretations.',
    imageUrl: '/api/placeholder/400/300',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    location: 'Auckland Museum',
    featured: true,
    rating: 4.8,
    reviewsCount: 127
  },
  {
    id: '2',
    title: 'Inuit Survival Wisdom',
    culture: 'Inuit',
    category: 'history' as const,
    region: 'Arctic',
    description: 'Discover traditional Inuit knowledge of hunting, navigation, and survival in the harsh Arctic environment.',
    imageUrl: '/api/placeholder/400/300',
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    location: 'Canadian Museum of History',
    featured: true,
    rating: 4.9,
    reviewsCount: 89
  },
  {
    id: '3',
    title: 'Aboriginal Dreamtime Stories',
    culture: 'Aboriginal Australians',
    category: 'storytelling' as const,
    region: 'Australia',
    description: 'Immerse yourself in the spiritual and cultural narratives that have been passed down for thousands of years.',
    imageUrl: '/api/placeholder/400/300',
    startDate: '2024-03-01',
    endDate: '2024-09-30',
    location: 'National Museum of Australia',
    featured: true,
    rating: 4.7,
    reviewsCount: 156
  }
]

type ExhibitionCategory = 'art' | 'history' | 'ceremony' | 'craft' | 'music' | 'dance' | 'storytelling'

const categoryColors: Record<ExhibitionCategory, string> = {
  art: 'from-purple-500 to-purple-600',
  history: 'from-blue-500 to-blue-600',
  ceremony: 'from-green-500 to-green-600',
  craft: 'from-orange-500 to-orange-600',
  music: 'from-pink-500 to-pink-600',
  dance: 'from-red-500 to-red-600',
  storytelling: 'from-indigo-500 to-indigo-600'
}

export function FeaturedExhibitions() {
  return (
    <section className="bg-white section-padding">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Exhibitions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience immersive cultural exhibitions that bring traditions to life through 
            artifacts, stories, and interactive experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredExhibitions.map((exhibition, index) => (
            <motion.div
              key={exhibition.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card group hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden rounded-t-xl">
                <div className={`w-full h-full bg-gradient-to-br ${categoryColors[exhibition.category]} flex items-center justify-center`}>
                  <Calendar className="w-16 h-16 text-white opacity-80" />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                
                {/* Featured Badge */}
                {exhibition.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                    Featured
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-primary-600 capitalize">
                    {exhibition.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{exhibition.rating}</span>
                    <span className="text-xs text-gray-500">({exhibition.reviewsCount})</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                  {exhibition.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {exhibition.description}
                </p>
                
                <div className="space-y-2 mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{exhibition.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <Link
                  href={`/exhibitions/${exhibition.id}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group-hover:translate-x-1 transition-transform duration-200"
                >
                  View Exhibition
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/exhibitions"
            className="btn-outline text-lg px-8 py-4 group"
          >
            View All Exhibitions
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
