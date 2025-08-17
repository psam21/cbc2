'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Users, MapPin, BookOpen } from 'lucide-react'

// Mock data - in production this would come from Nostr NIP-51 lists
const featuredCultures = [
  {
    id: '1',
    name: 'Maori',
    region: 'New Zealand',
    description: 'Indigenous Polynesian people of New Zealand with rich cultural traditions including haka, carving, and storytelling.',
    imageUrl: '/api/placeholder/400/300',
    population: '775,000',
    languages: ['Te Reo Māori', 'English'],
    exhibitionsCount: 12,
    resourcesCount: 45,
    storiesCount: 89
  },
  {
    id: '2',
    name: 'Inuit',
    region: 'Arctic',
    description: 'Indigenous peoples inhabiting the Arctic regions of Canada, Greenland, and Alaska with unique survival traditions.',
    imageUrl: '/api/placeholder/400/300',
    population: '160,000',
    languages: ['Inuktitut', 'Inupiaq', 'Yupik'],
    exhibitionsCount: 8,
    resourcesCount: 32,
    storiesCount: 67
  },
  {
    id: '3',
    name: 'Aboriginal Australians',
    region: 'Australia',
    description: 'First Nations peoples of Australia with the world\'s oldest continuous living culture spanning over 65,000 years.',
    imageUrl: '/api/placeholder/400/300',
    population: '798,000',
    languages: ['250+ Indigenous languages'],
    exhibitionsCount: 15,
    resourcesCount: 78,
    storiesCount: 156
  }
]

export function FeaturedCultures() {
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
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredCultures.map((culture, index) => (
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
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{culture.region}</span>
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
