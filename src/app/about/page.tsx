import React from 'react'
import { Heart, Users, Globe, BookOpen, Shield, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-700 to-gray-900 text-white py-20">
        <div className="container-max text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Culture Bridge
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to preserve cultural heritage through technology, 
              connecting communities and preserving traditions for future generations.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center max-w-4xl mx-auto">
            <Heart className="w-16 h-16 text-primary-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Culture Bridge exists to bridge the gap between traditional cultural knowledge 
              and modern technology. We believe that every culture has valuable wisdom to share, 
              and that technology can help preserve and disseminate this knowledge in respectful, 
              accessible ways.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at Culture Bridge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Respect</h3>
              <p className="text-gray-600">
                We approach all cultures with deep respect and sensitivity, 
                ensuring traditional knowledge is shared appropriately.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                We believe in the power of community-driven preservation 
                and collaborative knowledge sharing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-cultural-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-cultural-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Diversity</h3>
              <p className="text-gray-600">
                We celebrate and preserve the incredible diversity of human 
                culture and expression worldwide.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Education</h3>
              <p className="text-gray-600">
                We're committed to making cultural knowledge accessible 
                and educational for learners of all ages.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Preservation</h3>
              <p className="text-gray-600">
                We're dedicated to preserving cultural heritage for 
                future generations through sustainable technology.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in everything we do, from 
                technology to cultural representation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="section-padding bg-white">
        <div className="container-max text-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              More About Us Coming Soon
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              We're working on expanding this page with more details about our team, 
              our story, and our approach to cultural preservation.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                What's Coming
              </h3>
              <ul className="text-blue-800 text-left space-y-2">
                <li>• Team profiles and cultural backgrounds</li>
                <li>• Our journey and founding story</li>
                <li>• Cultural preservation philosophy</li>
                <li>• Partnerships and collaborations</li>
                <li>• Impact metrics and success stories</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
