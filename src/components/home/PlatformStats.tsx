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
  growth: number
}

// Fallback stats when Nostr is not available
const fallbackStats: PlatformStat[] = [
  {
    id: 1,
    name: 'Cultures',
    value: '150+',
    icon: Globe,
    description: 'Indigenous and traditional communities',
    color: 'from-primary-500 to-primary-600',
    growth: 12
  },
  {
    id: 2,
    name: 'Languages',
    value: '80+',
    icon: BookOpen,
    description: 'Preserved and documented',
    color: 'from-secondary-500 to-secondary-600',
    growth: 8
  },
  {
    id: 3,
    name: 'Stories',
    value: '2,500+',
    icon: Heart,
    description: 'Elder voices and narratives',
    color: 'from-cultural-500 to-cultural-600',
    growth: 25
  },
  {
    id: 4,
    name: 'Contributors',
    value: '500+',
    icon: Users,
    description: 'Active community members',
    color: 'from-earth-500 to-earth-600',
    growth: 18
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
          color: 'from-primary-500 to-primary-600',
          growth: 12
        },
        {
          id: 2,
          name: 'Languages',
          value: formatNumber(uniqueLanguages),
          icon: BookOpen,
          description: 'Preserved and documented',
          color: 'from-secondary-500 to-secondary-600',
          growth: 8
        },
        {
          id: 3,
          name: 'Stories',
          value: formatNumber(stories.pagination.total),
          icon: Heart,
          description: 'Elder voices and narratives',
          color: 'from-cultural-500 to-cultural-600',
          growth: 25
        },
        {
          id: 4,
          name: 'Contributors',
          value: formatNumber(uniqueContributors),
          icon: Users,
          description: 'Active community members',
          color: 'from-earth-500 to-earth-600',
          growth: 18
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
    <section className="bg-gradient-to-br from-earth-50 to-nature-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-6xl font-display font-extrabold text-earth-800 mb-8 leading-tight tracking-tight">
            Platform Impact
          </h2>
          <p className="text-xl md:text-2xl text-earth-600 max-w-4xl mx-auto leading-relaxed font-light">
            See how CultureBridge is making a difference in cultural preservation worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-28 h-28 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300 border border-earth-100 group-hover:border-nature-200">
                <stat.icon className="w-14 h-14 text-nature-600" />
              </div>
              <div className="text-6xl font-display font-extrabold text-earth-800 mb-4 group-hover:text-nature-700 transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-2xl font-heading font-bold text-earth-700 mb-2">
                {stat.name}
              </div>
              <div className="text-earth-600 text-lg">
                {stat.description}
              </div>
              
              {/* Growth indicator */}
              <div className="mt-4 flex items-center justify-center space-x-1">
                <TrendingUp className="w-4 h-4 text-nature-600" />
                <span className="text-sm text-nature-600 font-medium">
                  +{stat.growth}% this month
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
