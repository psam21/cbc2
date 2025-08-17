'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Users, Globe, BookOpen } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'

export function CallToAction() {
  const { isAuthenticated } = useAuth()
  return (
    <section className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-purple-700 text-white py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Join the Movement to Preserve
              <span className="block text-yellow-200">Cultural Heritage</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-orange-100 mb-12 leading-relaxed max-w-4xl mx-auto">
              Every culture has a story worth preserving. Whether you're a community member, 
              researcher, or cultural enthusiast, your contribution matters.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              <div className="text-center group">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-30 transition-all duration-200">
                  <Heart className="w-10 h-10 text-yellow-200" />
                </div>
                <h3 className="text-xl font-bold mb-3">Share Stories</h3>
                <p className="text-orange-100 leading-relaxed">
                  Preserve elder voices and cultural narratives
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-30 transition-all duration-200">
                  <Users className="w-10 h-10 text-yellow-200" />
                </div>
                <h3 className="text-xl font-bold mb-3">Connect Communities</h3>
                <p className="text-orange-100 leading-relaxed">
                  Build bridges between cultures worldwide
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-30 transition-all duration-200">
                  <BookOpen className="w-10 h-10 text-yellow-200" />
                </div>
                <h3 className="text-xl font-bold mb-3">Learn & Grow</h3>
                <p className="text-orange-100 leading-relaxed">
                  Access educational resources and knowledge
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href={isAuthenticated ? "/contribute" : "/auth/signup"}
                className="inline-flex items-center justify-center px-10 py-5 bg-white text-orange-700 hover:bg-gray-100 font-bold text-xl rounded-xl transition-all duration-200 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
              >
                Share Your Heritage
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link
                href="/explore"
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white hover:bg-white hover:text-orange-700 font-bold text-xl rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Explore Cultures
                <Globe className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
              </Link>
            </div>
            
            <div className="pt-12 border-t border-white border-opacity-20">
              <p className="text-orange-100 text-lg">
                Already contributing? <Link href="/community" className="text-yellow-200 hover:text-yellow-100 underline font-semibold">Join our community</Link> to connect with other cultural preservationists.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Elements - More Subtle */}
      <div className="absolute top-32 right-16 w-40 h-40 bg-white bg-opacity-5 rounded-full" />
      <div className="absolute bottom-32 left-16 w-32 h-32 bg-white bg-opacity-5 rounded-full" />
    </section>
  )
}
