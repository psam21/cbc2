'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Users, Globe, BookOpen, Shield } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'

export function CallToAction() {
  const { isAuthenticated } = useAuth()
  return (
    <section className="relative overflow-hidden py-24">
      {/* Dark Earthy Background - Based on theming guide */}
      <div className="absolute inset-0 bg-gradient-to-br from-earth-800 via-earth-900 to-earth-800" />
      
      {/* Cultural Motif Pattern - Top Left */}
      <div className="absolute top-0 left-0 w-96 h-96 opacity-5">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <pattern id="cultural-pattern-cta" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 Q10 0 20 20 T40 20" stroke="#f5f0e6" strokeWidth="1" fill="none" opacity="0.3"/>
              <path d="M20 0 Q40 10 20 20 T20 40" stroke="#f5f0e6" strokeWidth="1" fill="none" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cultural-pattern-cta)" />
        </svg>
      </div>
      
      {/* Cultural Motif Pattern - Bottom Right */}
      <div className="absolute bottom-0 right-0 w-80 h-80 opacity-5">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <pattern id="cultural-pattern-cta-2" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="2" fill="#f5f0e6" opacity="0.4"/>
              <path d="M0 15 Q15 0 30 15 T60 15" stroke="#f5f0e6" strokeWidth="1" fill="none" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cultural-pattern-cta-2)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-display font-extrabold text-white mb-8 leading-tight tracking-tight">
              Join the Movement to
              <span className="block text-nature-400">Preserve Cultural Heritage</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-earth-100 max-w-3xl mx-auto leading-relaxed mb-12">
              Every story shared, every tradition documented, and every culture celebrated 
              brings us closer to a world where diversity thrives and heritage endures.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <Link 
                href="/contribute" 
                className="inline-flex items-center justify-center px-12 py-6 bg-nature-600 text-white text-xl font-bold rounded-xl hover:bg-nature-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl min-w-[280px]"
              >
                Share Your Heritage
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link 
                href="/explore" 
                className="inline-flex items-center justify-center px-12 py-6 border-2 border-white text-white text-xl font-semibold rounded-xl hover:bg-white hover:text-earth-800 transition-all duration-300 transform hover:scale-105 min-w-[280px]"
              >
                Explore Cultures
              </Link>
            </div>
          </motion.div>
          
          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center group">
              <div className="bg-white bg-opacity-10 rounded-2xl p-8 border border-white border-opacity-20 group-hover:bg-opacity-20 transition-all duration-300">
                <div className="w-20 h-20 bg-nature-500 bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-10 h-10 text-nature-400" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-4">Community-Driven</h3>
                <p className="text-earth-100 leading-relaxed">
                  Built by and for cultural communities, ensuring authentic representation and respectful preservation
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white bg-opacity-10 rounded-2xl p-8 border border-white border-opacity-20 group-hover:bg-opacity-20 transition-all duration-300">
                <div className="w-20 h-20 bg-accent-500 bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-accent-400" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-4">Decentralized</h3>
                <p className="text-earth-100 leading-relaxed">
                  Powered by Nostr protocol for censorship-resistant, community-owned cultural preservation
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white bg-opacity-10 rounded-2xl p-8 border border-white border-opacity-20 group-hover:bg-opacity-20 transition-all duration-300">
                <div className="w-20 h-20 bg-earth-500 bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-10 h-10 text-earth-400" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-4">Global Reach</h3>
                <p className="text-earth-100 leading-relaxed">
                  Connecting cultures worldwide through technology that respects and celebrates diversity
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
