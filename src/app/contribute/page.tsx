'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, Heart, Users, Globe, BookOpen, Star, FileText, Image, Music, ArrowLeft } from 'lucide-react'
import { ContributeForm } from '@/components/contribute/ContributeForm'

export default function ContributePage() {
  const [showForm, setShowForm] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('')
  const router = useRouter()

  const handleGetStarted = (type: string) => {
    setSelectedType(type)
    setShowForm(true)
  }

  const handleSuccess = (eventId: string) => {
    // Redirect to appropriate page after successful submission
    setTimeout(() => {
      router.push(`/profile?tab=contributions`)
    }, 2000)
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Contribution Options
            </button>
          </div>
          
          <ContributeForm
            initialType={selectedType}
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share Your Cultural Heritage
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help preserve and share cultural knowledge with the world. Contribute stories, 
            artifacts, traditions, and wisdom from your community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cultural Stories (Index 9) */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Cultural Stories
                </h3>
                <p className="text-gray-600 mb-4">
                  Share written narratives, traditional tales, oral histories, and cultural documentation from your community.
                </p>
                <button
                  onClick={() => handleGetStarted('cultural-story')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </motion.div>

              {/* Audio Stories (Index 10) */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Music className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Audio Stories
                </h3>
                <p className="text-gray-600 mb-4">
                  Record and preserve audio narratives, traditional songs, chants, and spoken cultural knowledge.
                </p>
                <button
                  onClick={() => handleGetStarted('audio-story')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Get Started
                </button>
              </motion.div>

              {/* Visual Stories (Index 11) */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Image className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Visual Stories
                </h3>
                <p className="text-gray-600 mb-4">
                  Share photos, videos, artwork, and visual documentation that tell your cultural story.
                </p>
                <button
                  onClick={() => handleGetStarted('visual-story')}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Get Started
                </button>
              </motion.div>

              {/* Cultural Art (Index 12) */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Cultural Art
                </h3>
                <p className="text-gray-600 mb-4">
                  Document traditional crafts, artifacts, ceremonial objects, and artistic expressions.
                </p>
                <button
                  onClick={() => handleGetStarted('cultural-art')}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Get Started
                </button>
              </motion.div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What You Can Share
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Traditional Stories</p>
                    <p className="text-sm text-gray-600">Oral histories and legends</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Image className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Cultural Artifacts</p>
                    <p className="text-sm text-gray-600">Photos and descriptions</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Music className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Traditional Music</p>
                    <p className="text-sm text-gray-600">Songs and instruments</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Educational Resources</p>
                    <p className="text-sm text-gray-600">Documents and guides</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Cultural Sensitivity
              </h3>
              <p className="text-sm text-blue-800">
                We respect the sacred nature of cultural knowledge. Our platform 
                includes protocols for sensitive content and ensures communities 
                maintain control over their cultural heritage.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">
                Powered by Nostr
              </h3>
              <p className="text-sm text-purple-800">
                Your contributions are published to the decentralized Nostr network, 
                ensuring your cultural content remains under your community's control forever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
