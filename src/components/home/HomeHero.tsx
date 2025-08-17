'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Globe, Heart, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

export function HomeHero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-cultural-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-gray-200" />
      
      <div className="container-max section-padding relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Preserving Cultural Heritage
              <span className="block bg-gradient-to-r from-primary-600 to-cultural-600 bg-clip-text text-transparent">Through Technology</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover, explore, and contribute to the preservation of diverse cultures from around the world. 
              Connect with communities, access resources, and learn about traditions that shape our humanity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/explore" className="btn-primary text-lg px-8 py-4 group">
                Explore Cultures
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link href="/contribute" className="btn-outline text-lg px-8 py-4">
                Share Your Heritage
              </Link>
            </div>
          </motion.div>
          
          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover Cultures</h3>
              <p className="text-gray-600">
                Explore diverse traditions, languages, and customs from communities worldwide
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-cultural-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-cultural-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Preserve Stories</h3>
              <p className="text-gray-600">
                Listen to elder voices and preserve cultural narratives for future generations
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Learn & Connect</h3>
              <p className="text-gray-600">
                Access educational resources and connect with cultural practitioners
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-primary-200 to-transparent rounded-full opacity-20" />
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-cultural-200 to-transparent rounded-full opacity-20" />
    </section>
  )
}
