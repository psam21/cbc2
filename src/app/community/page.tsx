import React from 'react'
import { Users, Calendar, MessageCircle, Heart } from 'lucide-react'

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-earth-600 to-purple-700 text-white py-20">
        <div className="container-max text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Community
            </h1>
            <p className="text-xl md:text-2xl text-earth-100 max-w-3xl mx-auto leading-relaxed">
              Connect with cultural practitioners, researchers, and enthusiasts from around the world. 
              Share knowledge, attend events, and build meaningful relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="section-padding">
        <div className="container-max text-center">
          <div>
            <Users className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Community Features Coming Soon
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              We're building a vibrant community platform where cultural preservationists 
              can connect, collaborate, and share their passion for heritage.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Member Profiles</h3>
                <p className="text-gray-600 text-sm">
                  Showcase your cultural expertise and contributions
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Events</h3>
                <p className="text-gray-600 text-sm">
                  Attend cultural workshops, celebrations, and discussions
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Discussions</h3>
                <p className="text-gray-600 text-sm">
                  Engage in meaningful conversations about cultural preservation
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connections</h3>
                <p className="text-gray-600 text-sm">
                  Build relationships with like-minded cultural practitioners
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
