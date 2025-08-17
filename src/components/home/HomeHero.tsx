'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Globe, Heart, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

export function HomeHero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-purple-50 opacity-30" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="block">Preserving Cultural Heritage</span>
              <span className="block text-orange-600">Through Technology</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Discover, explore, and contribute to the preservation of diverse cultures from around the world. 
              Connect with communities, access resources, and learn about traditions that shape our humanity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <Link 
                href="/explore" 
                className="inline-flex items-center justify-center px-10 py-5 bg-orange-600 text-white text-xl font-semibold rounded-xl hover:bg-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explore Cultures
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link 
                href="/contribute" 
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-orange-600 text-orange-600 text-xl font-semibold rounded-xl hover:bg-orange-600 hover:text-white transition-all duration-200 transform hover:scale-105"
              >
                Share Your Heritage
              </Link>
            </div>
          </motion.div>
          
          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            <div className="text-center group">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors duration-200">
                <Globe className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Discover Cultures</h3>
              <p className="text-gray-600 leading-relaxed">
                Explore diverse traditions, languages, and customs from communities worldwide
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors duration-200">
                <Heart className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Preserve Stories</h3>
              <p className="text-gray-600 leading-relaxed">
                Listen to elder voices and preserve cultural narratives for future generations
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors duration-200">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Learn & Connect</h3>
              <p className="text-gray-600 leading-relaxed">
                Access educational resources and connect with cultural practitioners
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Elements - More Subtle */}
      <div className="absolute top-32 right-16 w-40 h-40 bg-orange-200 rounded-full opacity-10" />
      <div className="absolute bottom-32 left-16 w-32 h-32 bg-purple-200 rounded-full opacity-10" />
    </section>
  )
}
