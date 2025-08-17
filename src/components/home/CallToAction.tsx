'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Users, Globe, BookOpen } from 'lucide-react'

export function CallToAction() {
  return (
    <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-cultural-700 text-white section-padding">
      <div className="container-max">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Join the Movement to Preserve
              <span className="block text-yellow-200">Cultural Heritage</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              Every culture has a story worth preserving. Whether you're a community member, 
              researcher, or cultural enthusiast, your contribution matters.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-yellow-200" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Share Stories</h3>
                <p className="text-primary-100 text-sm">
                  Preserve elder voices and cultural narratives
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-yellow-200" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Connect Communities</h3>
                <p className="text-primary-100 text-sm">
                  Build bridges between cultures worldwide
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-yellow-200" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Learn & Grow</h3>
                <p className="text-primary-100 text-sm">
                  Access educational resources and knowledge
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contribute"
                className="bg-white text-primary-700 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg group shadow-lg hover:shadow-xl"
              >
                Start Contributing
                <ArrowRight className="ml-2 w-5 h-5 inline group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link
                href="/explore"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-700 font-semibold py-4 px-8 rounded-lg transition-all duration-200 text-lg group"
              >
                Explore Cultures
                <Globe className="ml-2 w-5 h-5 inline group-hover:rotate-12 transition-transform duration-200" />
              </Link>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white border-opacity-20">
              <p className="text-primary-100 text-sm">
                Already contributing? <Link href="/community" className="text-yellow-200 hover:text-yellow-100 underline">Join our community</Link> to connect with other cultural preservationists.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full" />
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-white bg-opacity-10 rounded-full" />
    </section>
  )
}
