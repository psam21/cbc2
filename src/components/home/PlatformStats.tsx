'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Globe, BookOpen, Heart, TrendingUp } from 'lucide-react'
import { useNostr } from '@/components/providers/NostrProvider'
import { formatNumber } from '@/lib/utils'

interface PlatformStat {
  id: number
  name: string
  value: string
  icon: React.ComponentType<any>
  description: string
  color: string
}

// Fallback stats when Nostr is not available
const fallbackStats: PlatformStat[] = [
  {
    id: 1,
    name: 'Cultures',
    value: '150+',
    icon: Globe,
    description: 'Indigenous and traditional communities',
    color: 'from-primary-500 to-primary-600'
  },
  {
    id: 2,
    name: 'Languages',
    value: '80+',
    icon: BookOpen,
    description: 'Preserved and documented',
    color: 'from-secondary-500 to-secondary-600'
  },
  {
    id: 3,
    name: 'Stories',
    value: '2,500+',
    icon: Heart,
    description: 'Elder voices and narratives',
    color: 'from-cultural-500 to-cultural-600'
  },
  {
    id: 4,
    name: 'Contributors',
    value: '500+',
    icon: Users,
    description: 'Active community members',
    color: 'from-earth-500 to-earth-600'
  }
]

export function PlatformStats() {
  const { isEnabled, isInitialized, getService } = useNostr()
  const [stats, setStats] = useState<PlatformStat[]>(fallbackStats)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEnabled && isInitialized) {
      loadPlatformStats()
    }
  }, [isEnabled, isInitialized])

  const loadPlatformStats = async () => {
    try {
      setLoading(true)
      
      const service = getService()
      
      // Run parallel queries to get actual counts
      const [cultures, exhibitions, resources, stories] = await Promise.all([
        service.getCultures({ limit: 1 }),
        service.getExhibitions({ limit: 1 }),
        service.getResources({ limit: 1 }),
        service.getElderStories({ limit: 1 })
      ])

      // Calculate unique languages and contributors
      const allCultures = await service.getCultures({ limit: 100 })
      const uniqueLanguages = new Set(
        allCultures.data.flatMap(culture => culture.language)
      ).size

      const uniqueContributors = new Set(
        [...allCultures.data, ...exhibitions.data, ...resources.data, ...stories.data]
          .map(item => item.author)
      ).size

      const realStats: PlatformStat[] = [
        {
          id: 1,
          name: 'Cultures',
          value: formatNumber(cultures.pagination.total),
          icon: Globe,
          description: 'Indigenous and traditional communities',
          color: 'from-primary-500 to-primary-600'
        },
        {
          id: 2,
          name: 'Languages',
          value: formatNumber(uniqueLanguages),
          icon: BookOpen,
          description: 'Preserved and documented',
          color: 'from-secondary-500 to-secondary-600'
        },
        {
          id: 3,
          name: 'Stories',
          value: formatNumber(stories.pagination.total),
          icon: Heart,
          description: 'Elder voices and narratives',
          color: 'from-cultural-500 to-cultural-600'
        },
        {
          id: 4,
          name: 'Contributors',
          value: formatNumber(uniqueContributors),
          icon: Users,
          description: 'Active community members',
          color: 'from-earth-500 to-earth-600'
        }
      ]

      setStats(realStats)
    } catch (err) {
      console.error('Failed to load platform stats:', err)
      // Keep fallback stats
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-gradient-to-br from-[#f8faff] to-[#fffdf8] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold text-[#1A1A2E] mb-8 leading-tight tracking-tight">
            Platform Impact
          </h2>
          <p className="text-xl md:text-2xl text-[#4A4A4A] max-w-4xl mx-auto leading-relaxed font-light">
            Our community has made significant progress in preserving cultural heritage 
            through collaborative efforts and shared knowledge.
          </p>
          {isEnabled && isInitialized && (
            <div className="mt-8 inline-flex items-center text-sm text-green-600 bg-green-50 px-6 py-3 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              {loading ? 'Calculating live metrics...' : 'Live metrics from Nostr network'}
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className={`w-28 h-28 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-8 group-hover:shadow-xl transition-all duration-300 border border-gray-100`}>
                <stat.icon className={`w-14 h-14 text-${stat.color.split('-')[1]}-600`} />
              </div>
              
              <div className="mb-6">
                <span className="text-6xl font-extrabold text-[#1A1A2E]">{stat.value}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-[#1A1A2E] mb-4">{stat.name}</h3>
              <p className="text-[#4A4A4A] leading-relaxed text-lg">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Growth Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 text-center"
        >
          <div className="inline-flex items-center space-x-4 bg-white text-green-700 px-8 py-4 rounded-full border border-green-200 shadow-lg">
            <TrendingUp className="w-6 h-6" />
            <span className="font-bold text-lg">Growing daily with new contributions</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
