'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  Eye, 
  Heart, 
  Share2,
  Star,
  Image as ImageIcon,
  Play,
  Volume2,
  Download,
  BookOpen,
  Tag
} from 'lucide-react'
import Link from 'next/link'
import { Exhibition } from '@/types/content'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatDate } from '@/lib/utils'

// Mock exhibition data - in production this would come from Nostr
const mockExhibition: Exhibition = {
  id: '1',
  title: 'Dreamtime Stories in Contemporary Art',
  description: 'A powerful exhibition showcasing how traditional Aboriginal Dreamtime stories continue to inspire and inform contemporary Australian art. This collection bridges ancient storytelling traditions with modern artistic expression, demonstrating the enduring relevance of cultural narratives in contemporary society.\n\nThrough a carefully curated selection of artworks, installations, and multimedia presentations, visitors will explore how contemporary artists draw upon the rich tapestry of Dreamtime stories to create meaningful connections between past and present. The exhibition features works that reinterpret traditional motifs, symbols, and narratives through modern artistic techniques and contemporary perspectives.\n\nEach piece in the collection tells a story of cultural continuity and adaptation, highlighting how Aboriginal artists and their collaborators maintain the spiritual and cultural significance of Dreamtime narratives while exploring new forms of expression. The exhibition also includes interactive elements that allow visitors to engage with the stories and gain deeper understanding of their cultural context.',
  shortDescription: 'Contemporary interpretations of traditional Aboriginal Dreamtime stories through visual art.',
  culture: 'Aboriginal Australian',
  category: 'art',
  region: 'Australia',
  imageUrl: '/api/placeholder/400/300',
  heroImage: '/api/placeholder/1200/600',
  artifacts: [
    {
      id: 'art1',
      name: 'Rainbow Serpent Painting',
      description: 'Modern acrylic interpretation of the Rainbow Serpent creation story, featuring vibrant colors and contemporary artistic techniques while maintaining the spiritual significance of the original narrative.',
      type: 'image',
      mediaUrl: '/api/placeholder/800/600',
      thumbnailUrl: '/api/placeholder/200/150',
      metadata: {
        width: 800,
        height: 600,
        mimeType: 'image/jpeg',
        checksum: 'abc123'
      },
      tags: ['rainbow-serpent', 'creation', 'contemporary', 'acrylic']
    },
    {
      id: 'art2',
      name: 'Traditional Dance Performance',
      description: 'Recording of traditional dance performance showcasing ceremonial movements and cultural expressions passed down through generations.',
      type: 'video',
      mediaUrl: '/api/placeholder/video.mp4',
      thumbnailUrl: '/api/placeholder/300/200',
      metadata: {
        duration: 180,
        mimeType: 'video/mp4',
        checksum: 'def456'
      },
      tags: ['dance', 'traditional', 'ceremony', 'performance']
    },
    {
      id: 'art3',
      name: 'Ceremonial Object Collection',
      description: 'Collection of traditional ceremonial objects including ritual tools, sacred items, and cultural artifacts used in traditional ceremonies.',
      type: 'image',
      mediaUrl: '/api/placeholder/600/400',
      thumbnailUrl: '/api/placeholder/200/150',
      metadata: {
        width: 600,
        height: 400,
        mimeType: 'image/jpeg',
        checksum: 'ghi789'
      },
      tags: ['ceremonial', 'ritual', 'sacred', 'traditional']
    }
  ],
  startDate: '2024-01-15T00:00:00Z',
  endDate: '2024-03-15T00:00:00Z',
  location: 'National Gallery of Australia, Canberra',
  tags: ['dreamtime', 'contemporary-art', 'aboriginal', 'storytelling', 'cultural-heritage', 'modern-art'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  author: 'npub1aboriginal',
  featured: true
}

export default function ExhibitionDetailPage() {
  const params = useParams()
  const [exhibition, setExhibition] = useState<Exhibition | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const loadExhibition = async () => {
      setLoading(true)
      
      try {
        // In production, this would query Nostr for the specific exhibition
        // For now, we'll use mock data
        setTimeout(() => {
          setExhibition(mockExhibition)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Failed to load exhibition:', error)
        setLoading(false)
      }
    }

    if (params.id) {
      loadExhibition()
    }
  }, [params.id])

  const handleLike = () => {
    setLiked(!liked)
    // In production, this would send a Nostr event
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: exhibition?.title,
          text: exhibition?.shortDescription,
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        // Show toast notification
        alert('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Failed to share:', error)
    }
  }

  const isOngoing = exhibition?.startDate && exhibition?.endDate && 
    new Date() >= new Date(exhibition.startDate) && 
    new Date() <= new Date(exhibition.endDate)
  
  const isUpcoming = exhibition?.startDate && new Date() < new Date(exhibition.startDate)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (!exhibition) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Exhibition Not Found</h1>
            <p className="text-gray-600 mb-6">The exhibition you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/exhibitions"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse All Exhibitions
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/exhibitions"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Exhibitions
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-lg overflow-hidden mb-8">
          <div className="relative">
            <img 
              src={exhibition.heroImage} 
              alt={exhibition.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              {exhibition.featured && (
                <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Featured
                </span>
              )}
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                isOngoing ? 'bg-green-500 text-white' :
                isUpcoming ? 'bg-blue-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {isOngoing ? 'Ongoing' : isUpcoming ? 'Upcoming' : 'Past'}
              </span>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {exhibition.title}
                </h1>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {exhibition.shortDescription}
                </p>
                
                <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Curated by {exhibition.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{exhibition.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {isOngoing && exhibition.endDate && `Ends ${formatDate(exhibition.endDate)}`}
                      {isUpcoming && exhibition.startDate && `Opens ${formatDate(exhibition.startDate)}`}
                      {!isOngoing && !isUpcoming && exhibition.endDate && `Ended ${formatDate(exhibition.endDate)}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>2.1k views</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Heart className="w-4 h-4" />
                    <span>156 likes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ImageIcon className="w-4 h-4" />
                    <span>{exhibition.artifacts.length} artifacts</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleLike}
                  className={`p-3 rounded-lg transition-colors ${
                    liked 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {exhibition.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Exhibition</h2>
          <div className="prose prose-lg max-w-none">
            {exhibition.description.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Artifacts Gallery */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Exhibition Artifacts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibition.artifacts.map((artifact) => (
              <motion.div
                key={artifact.id}
                whileHover={{ y: -2 }}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="relative">
                  <img 
                    src={artifact.thumbnailUrl} 
                    alt={artifact.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full flex items-center gap-1">
                      {artifact.type === 'video' ? <Play className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                      {artifact.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{artifact.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {artifact.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {artifact.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedArtifact(artifact.id)}
                      className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Related Exhibitions */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Related Exhibitions</h2>
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Related exhibitions will appear here</p>
            <p className="text-sm mt-2">Based on culture, category, and themes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
