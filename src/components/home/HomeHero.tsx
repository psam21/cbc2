'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Globe, Heart, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

export function HomeHero() {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#1A1A2E] mb-10 leading-tight tracking-tight">
              <span className="block">Preserving Cultural Heritage</span>
              <span className="block text-orange-600">Through Technology</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#4A4A4A] mb-16 max-w-4xl mx-auto leading-relaxed font-light">
              Discover, explore, and contribute to the preservation of diverse cultures from around the world. 
              Connect with communities, access resources, and learn about traditions that shape our humanity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-24">
              <Link 
                href="/explore" 
                className="inline-flex items-center justify-center px-12 py-6 bg-orange-600 text-white text-xl font-bold rounded-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[280px]"
              >
                Explore Cultures
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link 
                href="/contribute" 
                className="inline-flex items-center justify-center px-12 py-6 border-2 border-[#1A1A2E] text-[#1A1A2E] text-xl font-bold rounded-xl hover:bg-[#1A1A2E] hover:text-white transition-all duration-300 transform hover:scale-105 min-w-[280px]"
              >
                Share Your Heritage
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
