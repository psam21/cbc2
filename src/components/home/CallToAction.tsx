'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Users, Globe, BookOpen } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'

export function CallToAction() {
  const { isAuthenticated } = useAuth()
  return (
    <section className="relative bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] text-white py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-20" />
      
      {/* Cultural Motif Pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <pattern id="cta-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M0 25 Q12.5 0 25 25 T50 25" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
              <path d="M25 0 Q50 12.5 25 25 T25 50" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-pattern)" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-7xl font-extrabold mb-10 leading-tight tracking-tight">
              Join the Movement to Preserve
              <span className="block text-orange-400">Cultural Heritage</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-16 leading-relaxed max-w-4xl mx-auto font-light">
              Every culture has a story worth preserving. Whether you're a community member, 
              researcher, or cultural enthusiast, your contribution matters.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
              <div className="text-center group">
                <div className="w-24 h-24 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20">
                  <Heart className="w-12 h-12 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Share Stories</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Preserve elder voices and cultural narratives
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-24 h-24 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20">
                  <Users className="w-12 h-12 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Connect Communities</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Build bridges between cultures worldwide
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-24 h-24 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20">
                  <BookOpen className="w-12 h-12 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Learn & Grow</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Access educational resources and knowledge
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
              <Link
                href={isAuthenticated ? "/contribute" : "/auth/signup"}
                className="inline-flex items-center justify-center px-12 py-6 bg-orange-600 text-white text-xl font-bold rounded-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl min-w-[280px]"
              >
                Share Your Heritage
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link
                href="/explore"
                className="inline-flex items-center justify-center px-12 py-6 border-2 border-white text-white hover:bg-white hover:text-[#1A1A2E] text-xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 min-w-[280px]"
              >
                Explore Cultures
                <Globe className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
              </Link>
            </div>
            
            <div className="pt-12 border-t border-white border-opacity-20">
              <p className="text-gray-300 text-lg">
                Already contributing? <Link href="/community" className="text-orange-400 hover:text-orange-300 underline font-semibold">Join our community</Link> to connect with other cultural preservationists.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Elements - More Subtle */}
      <div className="absolute top-32 right-16 w-40 h-40 bg-orange-400 bg-opacity-5 rounded-full" />
      <div className="absolute bottom-32 left-16 w-32 h-32 bg-orange-400 bg-opacity-5 rounded-full" />
    </section>
  )
}
