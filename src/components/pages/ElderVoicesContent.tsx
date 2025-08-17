'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Play, Star, Users, Clock, MapPin } from 'lucide-react'

export function ElderVoicesContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-600 to-rose-700 text-white py-20">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Elder Voices
            </h1>
            <p className="text-xl md:text-2xl text-pink-100 max-w-3xl mx-auto leading-relaxed">
              Listen to the wisdom and stories of cultural elders, preserving traditional 
              knowledge and narratives for future generations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="section-padding">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Heart className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stories Coming Soon
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              We're working on bringing you authentic elder voices and cultural narratives 
              with audio playback, transcripts, and community ratings.
            </p>
            
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-pink-900 mb-6">
                What You'll Experience
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <Play className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-pink-900">Audio Stories</h4>
                    <p className="text-pink-800 text-sm">
                      Listen to authentic narratives in original languages
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Star className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-pink-900">Community Ratings</h4>
                    <p className="text-pink-800 text-sm">
                      Rate and review stories to help others discover
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-pink-900">Cultural Context</h4>
                    <p className="text-pink-800 text-sm">
                      Learn about the cultural background of each story
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-pink-900">Timeless Wisdom</h4>
                    <p className="text-pink-800 text-sm">
                      Access knowledge passed down through generations
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-gray-600">
              <p>
                These stories will be carefully curated and respectfully presented, 
                ensuring that cultural traditions are preserved with the dignity they deserve.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
