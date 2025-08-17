'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  BookOpen,
  Star,
  Globe,
  Calendar,
  User,
  ExternalLink,
  Heart,
  Share2,
  Download
} from 'lucide-react'
import { Culture, Exhibition, Resource, ElderStory } from '@/types/content'
import { useNostr } from '@/components/providers/NostrProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { formatNumber, formatDate } from '@/lib/utils'

// Mock data - will be replaced with Nostr queries
const mockCultures: Culture[] = [
  {
    id: '1',
    name: 'Māori',
    description: 'Indigenous Polynesian people of New Zealand with rich cultural traditions including the haka, traditional tattoos (tā moko), and strong spiritual connections to the land.',
    region: 'Oceania',
    language: ['Te Reo Māori', 'English'],
    population: 775000,
    imageUrl: '/api/placeholder/800/400',
    heroImage: '/api/placeholder/1200/600',
    tags: ['indigenous', 'polynesian', 'new-zealand', 'haka', 'ta-moko'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'npub1maori',
    exhibitionsCount: 12,
    resourcesCount: 45,
    storiesCount: 23
  },
  {
    id: '2',
    name: 'Inuit',
    description: 'Indigenous peoples inhabiting the Arctic regions of Canada, Greenland, and Alaska, known for their deep understanding of ice, traditional hunting techniques, and oral storytelling traditions.',
    region: 'North America',
    language: ['Inuktitut', 'English', 'French'],
    population: 150000,
    imageUrl: '/api/placeholder/800/400',
    heroImage: '/api/placeholder/1200/600',
    tags: ['indigenous', 'arctic', 'canada', 'hunting', 'storytelling'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'npub1inuit',
    exhibitionsCount: 8,
    resourcesCount: 32,
    storiesCount: 18
  }
]

const RelatedContentSection = ({ title, count, linkTo, description }: {
  title: string
  count: number
  linkTo: string
  description: string
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-lg border p-6 hover:shadow-lg transition-all duration-200"
  >
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold text-blue-600">{formatNumber(count)}</span>
      <Link 
        href={linkTo}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        View All <ExternalLink className="w-4 h-4" />
      </Link>
    </div>
  </motion.div>
)

export default function CultureDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [culture, setCulture] = useState<Culture | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { nostrEnabled } = useNostr()

  useEffect(() => {
    const loadCulture = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // In production, this would query Nostr NIP-33 kind 30001 events
        const cultureId = params.id as string
        const foundCulture = mockCultures.find(c => c.id === cultureId)
        
        if (!foundCulture) {
          setError('Culture not found')
          return
        }
        
        setCulture(foundCulture)
      } catch (err) {
        setError('Failed to load culture details')
        console.error('Error loading culture:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCulture()
  }, [params.id, nostrEnabled])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error || !culture) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorBoundary 
            error={error || 'Culture not found'} 
            reset={() => router.back()} 
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-black/30" />
        <img 
          src={culture.heroImage || culture.imageUrl} 
          alt={culture.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </button>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {culture.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{culture.region}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{formatNumber(culture.population || 0)} people</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{culture.language.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About {culture.name}</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {culture.description}
              </p>
              
              {/* Tags */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Cultural Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {culture.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RelatedContentSection 
                title="Exhibitions"
                count={culture.exhibitionsCount}
                linkTo={`/exhibitions?culture=${encodeURIComponent(culture.name)}`}
                description="Curated exhibitions showcasing cultural artifacts and history"
              />
              <RelatedContentSection 
                title="Resources"
                count={culture.resourcesCount}
                linkTo={`/downloads?culture=${encodeURIComponent(culture.name)}`}
                description="Educational materials, documents, and multimedia resources"
              />
              <RelatedContentSection 
                title="Elder Stories"
                count={culture.storiesCount}
                linkTo={`/elder-voices?culture=${encodeURIComponent(culture.name)}`}
                description="Traditional stories and wisdom from community elders"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Culture Stats */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Culture Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Region</label>
                  <p className="text-gray-900">{culture.region}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Languages</label>
                  <p className="text-gray-900">{culture.language.join(', ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Population</label>
                  <p className="text-gray-900">{formatNumber(culture.population || 0)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900">{formatDate(culture.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Heart className="w-4 h-4" />
                  Follow Culture
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share Culture
                </button>
                <Link 
                  href={`/contribute?culture=${encodeURIComponent(culture.name)}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Contribute Content
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
