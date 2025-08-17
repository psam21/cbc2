'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, MapPin, Users, Star, Loader2 } from 'lucide-react'

// Real data structure for exhibitions
interface Exhibition {
  id: string
  title: string
  culture: string
  category: ExhibitionCategory
  region: string
  description: string
  imageUrl?: string
  startDate: string
  endDate: string
  location: string
  featured: boolean
  rating: number
  reviewsCount: number
}

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
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch featured exhibitions
  useEffect(() => {
    const fetchFeaturedExhibitions = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual Nostr query for featured exhibitions
        // For now, show empty state
        // const featured = await nostrService.getFeaturedExhibitions({ limit: 3 })
        // setExhibitions(featured)
        setExhibitions([])
      } catch (error) {
        console.error('Failed to fetch featured exhibitions:', error)
        setError('Failed to load featured exhibitions')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedExhibitions()
  }, [])

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-[#f8faff] to-[#fffdf8] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-[#1A1A2E] mb-8 leading-tight tracking-tight">
              Featured Exhibitions
            </h2>
            <p className="text-xl md:text-2xl text-[#4A4A4A] max-w-4xl mx-auto leading-relaxed font-light">
              Experience immersive cultural exhibitions that bring traditions to life through 
              artifacts, stories, and interactive experiences.
            </p>
          </motion.div>
          
          <div className="flex justify-center">
            <div className="flex items-center gap-3 text-[#4A4A4A]">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading featured exhibitions...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-gradient-to-br from-[#f8faff] to-[#fffdf8] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-[#1A1A2E] mb-8 leading-tight tracking-tight">
              Featured Exhibitions
            </h2>
            <p className="text-xl md:text-2xl text-[#4A4A4A] max-w-4xl mx-auto leading-relaxed font-light">
              Experience immersive cultural exhibitions that bring traditions to life through 
              artifacts, stories, and interactive experiences.
            </p>
          </motion.div>
          
          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
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
      </section>
    )
  }

  if (exhibitions.length === 0) {
    return (
      <section className="bg-gradient-to-br from-[#f8faff] to-[#fffdf8] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-[#1A1A2E] mb-8 leading-tight tracking-tight">
              Featured Exhibitions
            </h2>
            <p className="text-xl md:text-2xl text-[#4A4A4A] max-w-4xl mx-auto leading-relaxed font-light">
              Experience immersive cultural exhibitions that bring traditions to life through 
              artifacts, stories, and interactive experiences.
            </p>
          </motion.div>
          
          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <p className="text-[#4A4A4A] mb-4">No featured exhibitions available yet.</p>
              <p className="text-[#4A4A4A] mb-6">Be the first to create a cultural exhibition!</p>
              <Link
                href="/exhibitions"
                className="inline-flex items-center justify-center px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
              >
                Browse All Exhibitions
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-br from-[#f8faff] to-[#fffdf8] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold text-[#1A1A2E] mb-8 leading-tight tracking-tight">
            Featured Exhibitions
          </h2>
          <p className="text-xl md:text-2xl text-[#4A4A4A] max-w-4xl mx-auto leading-relaxed font-light">
            Experience immersive cultural exhibitions that bring traditions to life through 
            artifacts, stories, and interactive experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-24">
          {exhibitions.map((exhibition, index) => (
            <motion.div
              key={exhibition.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group overflow-hidden hover:border-orange-200"
            >
              <div className="relative h-64 overflow-hidden">
                <div className={`w-full h-full bg-gradient-to-br ${categoryColors[exhibition.category]} flex items-center justify-center`}>
                  <Calendar className="w-24 h-24 text-white opacity-80" />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                
                {/* Featured Badge */}
                {exhibition.featured && (
                  <div className="absolute top-4 right-4 bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Featured
                  </div>
                )}
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-orange-600 capitalize bg-orange-50 px-3 py-1 rounded-full">
                    {exhibition.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-bold text-[#1A1A2E]">{exhibition.rating}</span>
                    <span className="text-xs text-[#4A4A4A]">({exhibition.reviewsCount})</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-[#1A1A2E] mb-3 group-hover:text-orange-600 transition-colors duration-200">
                  {exhibition.title}
                </h3>
                
                <p className="text-[#4A4A4A] mb-6 leading-relaxed line-clamp-3">
                  {exhibition.description}
                </p>
                
                <div className="space-y-3 mb-6 text-sm text-[#4A4A4A]">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{exhibition.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">
                      {new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <Link
                  href={`/exhibitions/${exhibition.id}`}
                  className="inline-flex items-center text-orange-600 hover:text-orange-700 font-bold group-hover:translate-x-1 transition-transform duration-200"
                >
                  View Exhibition
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/exhibitions"
            className="inline-flex items-center justify-center px-12 py-6 border-2 border-[#1A1A2E] text-[#1A1A2E] text-xl font-bold rounded-xl hover:bg-[#1A1A2E] hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            View All Exhibitions
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
