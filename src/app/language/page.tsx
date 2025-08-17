import React from 'react'
import { BookOpen, Headphones, Users, Award, Globe, Play } from 'lucide-react'

export default function LanguagePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-teal-700 text-white py-20">
        <div className="container-max text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Language Learning
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Learn languages in their cultural context. Discover traditional languages, 
              practice with native speakers, and immerse yourself in cultural understanding.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="section-padding">
        <div className="container-max text-center">
          <div>
            <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Language Learning Coming Soon
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              We're building a comprehensive language learning platform that connects 
              language acquisition with cultural understanding and community practice.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cultural Context</h3>
                <p className="text-gray-600 text-sm">
                  Learn languages within their cultural and historical framework
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <Headphones className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Audio Lessons</h3>
                <p className="text-gray-600 text-sm">
                  Practice pronunciation with native speakers and cultural examples
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Practice</h3>
                <p className="text-gray-600 text-sm">
                  Connect with language learners and native speakers worldwide
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <BookOpen className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Structured Modules</h3>
                <p className="text-gray-600 text-sm">
                  Progressive learning paths from beginner to advanced levels
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <Play className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Content</h3>
                <p className="text-gray-600 text-sm">
                  Engaging exercises, quizzes, and cultural immersion activities
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <Award className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                <p className="text-gray-600 text-sm">
                  Monitor your learning journey and celebrate achievements
                </p>
              </div>
            </div>
            
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 max-w-3xl mx-auto">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Why Cultural Context Matters
              </h3>
              <p className="text-green-800 text-sm">
                Language is more than just words and grammar—it's a window into culture, 
                history, and worldview. Our approach ensures you understand not just how 
                to speak, but why people speak the way they do.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
