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
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Platform Impact
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Our community has made significant progress in preserving cultural heritage 
            through collaborative efforts and shared knowledge.
          </p>
          {isEnabled && isInitialized && (
            <div className="mt-6 inline-flex items-center text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              {loading ? 'Calculating live metrics...' : 'Live metrics from Nostr network'}
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className={`w-24 h-24 bg-${stat.color.split('-')[1]}-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-${stat.color.split('-')[1]}-200 transition-colors duration-200`}>
                <stat.icon className={`w-12 h-12 text-${stat.color.split('-')[1]}-600`} />
              </div>
              
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-900">{stat.value}</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">{stat.name}</h3>
              <p className="text-gray-600 leading-relaxed">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Growth Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center space-x-3 bg-green-50 text-green-700 px-8 py-4 rounded-full border border-green-200">
            <TrendingUp className="w-6 h-6" />
            <span className="font-semibold text-lg">Growing daily with new contributions</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
