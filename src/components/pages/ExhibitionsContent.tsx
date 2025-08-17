'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, MapPin, Star } from 'lucide-react'

export function ExhibitionsContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary-600 to-earth-700 text-white py-20">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Cultural Exhibitions
            </h1>
            <p className="text-xl md:text-2xl text-secondary-100 max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in cultural exhibitions that bring traditions to life through 
              artifacts, stories, and interactive experiences.
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
            <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exhibitions Coming Soon
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              We're working on bringing you immersive cultural exhibitions with artifacts, 
              virtual tours, and interactive experiences. This feature will be available soon!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                What to Expect
              </h3>
              <ul className="text-blue-800 text-left space-y-2">
                <li>• Virtual exhibitions with 360° artifact views</li>
                <li>• Cultural context and historical information</li>
                <li>• Interactive storytelling experiences</li>
                <li>• Integration with cultural institutions</li>
                <li>• Community-curated exhibitions</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
