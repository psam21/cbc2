'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Globe, Heart, BookOpen, Search, Users, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

// Real data structure for platform statistics
interface PlatformStats {
  storiesCount: number
  languagesCount: number
  contributorsCount: number
  communitiesCount: number
}

const searchExamples = ['Yoruba weaving', 'Ladakh lullabies', 'Maori carving', 'Inuit survival', 'Aboriginal dreamtime']

export function HomeHero() {
  const [currentStat, setCurrentStat] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch real platform statistics
  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        // TODO: Replace with actual Nostr query for platform statistics
        // For now, show loading state
        setLoading(false)
        // In production, this would fetch from Nostr:
        // const stats = await nostrService.getPlatformStats()
        // setPlatformStats(stats)
      } catch (error) {
        console.error('Failed to fetch platform stats:', error)
        setLoading(false)
      }
    }

    fetchPlatformStats()
  }, [])

  // Generate proof stats from real data or show loading
  const proofStats = platformStats ? [
    { count: platformStats.storiesCount.toLocaleString(), label: 'stories preserved', detail: `across ${platformStats.communitiesCount} communities` },
    { count: platformStats.languagesCount.toString(), label: 'languages documented', detail: 'from endangered to thriving' },
    { count: platformStats.contributorsCount.toLocaleString(), label: 'contributors', detail: 'elders, scholars, community members' }
  ] : [
    { count: '...', label: 'stories preserved', detail: 'across communities' },
    { count: '...', label: 'languages documented', detail: 'from endangered to thriving' },
    { count: '...', label: 'contributors', detail: 'elders, scholars, community members' }
  ]

  // Rotate through proof stats
  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setCurrentStat((prev) => (prev + 1) % proofStats.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [loading, proofStats.length])

  return (
    <section className="relative overflow-hidden">
      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fffdf8] via-white to-[#f8faff]" />
      
      {/* Cultural Motif Pattern - Top Right */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <pattern id="cultural-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 Q10 0 20 20 T40 20" stroke="#1A1A2E" strokeWidth="1" fill="none" opacity="0.3"/>
              <path d="M20 0 Q40 10 20 20 T20 40" stroke="#1A1A2E" strokeWidth="1" fill="none" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cultural-pattern)" />
        </svg>
      </div>
      
      {/* Cultural Motif Pattern - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-80 h-80 opacity-5">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <pattern id="cultural-pattern-2" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="2" fill="#1A1A2E" opacity="0.4"/>
              <path d="M0 15 Q15 0 30 15 T60 15" stroke="#1A1A2E" strokeWidth="1" fill="none" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cultural-pattern-2)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-24 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Emotional Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#1A1A2E] mb-8 leading-tight tracking-tight">
              <span className="block">Preserve living cultures</span>
              <span className="block text-orange-600">with the people who hold them</span>
            </h1>
            
            {/* Proof Element - Rotating Stats */}
            <motion.div
              key={currentStat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-lg border border-gray-100">
                <Users className="w-6 h-6 text-orange-600" />
                <div className="text-left">
                  <span className="text-2xl font-bold text-[#1A1A2E]">{proofStats[currentStat].count}</span>
                  <span className="text-lg text-[#4A4A4A] ml-2">{proofStats[currentStat].label}</span>
                  <div className="text-sm text-[#4A4A4A]">{proofStats[currentStat].detail}</div>
                </div>
              </div>
            </motion.div>
            
            {/* Enhanced Search */}
            <div className="mb-12">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cultures, stories, traditions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-lg"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white px-6 py-2 rounded-xl hover:bg-orange-700 transition-colors">
                  Search
                </button>
              </div>
              {/* Search Examples */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="text-sm text-[#4A4A4A]">Try:</span>
                {searchExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(example)}
                    className="text-sm text-orange-600 hover:text-orange-700 px-3 py-1 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Single Primary CTA + Secondary */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <Link 
                href="/explore" 
                className="inline-flex items-center justify-center px-12 py-6 bg-orange-600 text-white text-xl font-bold rounded-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl min-w-[280px]"
              >
                Explore Cultures
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link 
                href="/contribute" 
                className="inline-flex items-center justify-center px-12 py-6 border-2 border-[#1A1A2E] text-[#1A1A2E] text-xl font-semibold rounded-xl hover:bg-[#1A1A2E] hover:text-white transition-all duration-300 transform hover:scale-105 min-w-[280px]"
              >
                Share Your Story
              </Link>
            </div>
          </motion.div>
          
          {/* Feature Highlights with Enhanced Card Styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            <div className="text-center group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group-hover:border-orange-200">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-12 h-12 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A2E] mb-4">Discover Cultures</h3>
                <p className="text-[#4A4A4A] leading-relaxed text-lg">
                  Explore diverse traditions, languages, and customs from communities worldwide
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group-hover:border-purple-200">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-12 h-12 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A2E] mb-4">Preserve Stories</h3>
                <p className="text-[#4A4A4A] leading-relaxed text-lg">
                  Listen to elder voices and preserve cultural narratives for future generations
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group-hover:border-blue-200">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A2E] mb-4">Learn & Connect</h3>
                <p className="text-[#4A4A4A] leading-relaxed text-lg">
                  Access educational resources and connect with cultural practitioners
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
