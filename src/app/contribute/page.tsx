import React from 'react'
import { Upload, Heart, Users, Globe, BookOpen, Star } from 'lucide-react'

export default function ContributePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-cultural-700 text-white py-20">
        <div className="container-max text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Share Your Heritage
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Contribute to the preservation of cultural heritage by sharing your knowledge, 
              stories, and traditions with the world.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="section-padding">
        <div className="container-max text-center">
          <div>
            <Upload className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contribution Platform Coming Soon
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              We're building a comprehensive platform for cultural contributions that will 
              make it easy to share and preserve your cultural heritage.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Stories & Narratives</h3>
                <p className="text-gray-600 text-sm">
                  Share personal stories, family histories, and cultural narratives
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cultural Knowledge</h3>
                <p className="text-gray-600 text-sm">
                  Contribute traditional knowledge, practices, and wisdom
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <Globe className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Language Resources</h3>
                <p className="text-gray-600 text-sm">
                  Help preserve languages through lessons, translations, and examples
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Art & Media</h3>
                <p className="text-gray-600 text-sm">
                  Share traditional art, music, dance, and cultural performances
                </p>
              </div>
            </div>
            
            <div className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-8 max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold text-primary-900 mb-4">
                Why Contribute?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-primary-800 mb-2">Preserve Heritage</h4>
                  <p className="text-primary-700 text-sm">
                    Ensure your cultural traditions are preserved for future generations
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-800 mb-2">Connect Communities</h4>
                  <p className="text-primary-700 text-sm">
                    Build bridges between cultures and foster understanding
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-800 mb-2">Share Wisdom</h4>
                  <p className="text-primary-700 text-sm">
                    Pass on valuable knowledge and life lessons to others
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-800 mb-2">Build Legacy</h4>
                  <p className="text-primary-700 text-sm">
                    Create a lasting impact on cultural preservation efforts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
