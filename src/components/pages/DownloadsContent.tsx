'use client'

import React from 'react'
import { Download, FileText, Headphones, Video, Image, Database } from 'lucide-react'

export function DownloadsContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cultural-600 to-purple-700 text-white py-20">
        <div className="container-max text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Cultural Resources
            </h1>
            <p className="text-xl md:text-2xl text-cultural-100 max-w-3xl mx-auto leading-relaxed">
              Access educational materials, documents, and resources for learning about 
              diverse cultures and traditions from around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="section-padding">
        <div className="container-max text-center">
          <div>
            <Download className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Resources Coming Soon
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              We're building a comprehensive library of cultural resources including 
              documents, audio recordings, videos, and educational materials.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Documents</h3>
                <p className="text-gray-600 text-sm">
                  Research papers, cultural guides, and educational materials
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <Headphones className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Audio</h3>
                <p className="text-gray-600 text-sm">
                  Language lessons, traditional music, and oral histories
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <Video className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Video</h3>
                <p className="text-gray-600 text-sm">
                  Cultural performances, documentaries, and tutorials
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <Image className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Images</h3>
                <p className="text-gray-600 text-sm">
                  Artwork, photographs, and visual cultural materials
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <Database className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Datasets</h3>
                <p className="text-gray-600 text-sm">
                  Cultural data, language resources, and research datasets
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
