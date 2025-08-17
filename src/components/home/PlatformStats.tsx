'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Users, Globe, BookOpen, Heart, TrendingUp } from 'lucide-react'

const stats = [
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
            Platform Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our community has made significant progress in preserving cultural heritage 
            through collaborative efforts and shared knowledge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-10 h-10 text-white" />
              </div>
              
              <div className="mb-2">
                <span className="text-4xl font-bold text-gray-900">{stat.value}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{stat.name}</h3>
              <p className="text-gray-600 text-sm">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Growth Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-6 py-3 rounded-full">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Growing daily with new contributions</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
