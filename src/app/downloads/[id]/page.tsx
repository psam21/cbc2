'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  FileText, 
  Headphones, 
  Video, 
  Image, 
  Database,
  Calendar,
  User,
  Clock,
  HardDrive,
  Star,
  ExternalLink,
  Play,
  Share2,
  Heart,
  AlertCircle
} from 'lucide-react'
import { Resource } from '@/types/content'
import { useNostr } from '@/components/providers/NostrProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { formatFileSize, formatDate, formatTimeAgo } from '@/lib/utils'

// Mock data
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Māori Traditional Songs Collection',
    description: 'A comprehensive collection of traditional Māori songs with English translations and cultural context. This archive includes waiata (songs), haka, and karakia (prayers) that have been passed down through generations. Each recording is accompanied by detailed cultural notes explaining the significance, proper pronunciation, and appropriate contexts for performance.',
    type: 'audio',
    category: 'education',
    culture: ['Māori'],
    language: ['Te Reo Māori', 'English'],
    downloadUrl: 'https://example.com/maori-songs.zip',
    fileSize: 45000000, // 45MB
    mimeType: 'application/zip',
    imageUrl: '/api/placeholder/400/300',
    tags: ['traditional', 'music', 'language', 'waiata', 'haka'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    author: 'npub1maori',
    downloads: 1234,
    featured: true
  }
]

const getFileIcon = (type: string) => {
  switch (type) {
    case 'document': return FileText
    case 'audio': return Headphones
    case 'video': return Video
    case 'image': return Image
    case 'dataset': return Database
    default: return FileText
  }
}

const PreviewSection = ({ resource }: { resource: Resource }) => {
  const [showPreview, setShowPreview] = useState(false)
  
  if (resource.type === 'image') {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={resource.imageUrl || '/api/placeholder/800/450'} 
            alt={resource.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    )
  }

  if (resource.type === 'audio') {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Preview</h3>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Audio preview not available in demo</p>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto">
            <Play className="w-4 h-4" />
            Play Sample
          </button>
        </div>
      </div>
    )
  }

  if (resource.type === 'video') {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Preview</h3>
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center text-white">
            <Video className="w-12 h-12 mx-auto mb-4 opacity-60" />
            <p className="opacity-80">Video preview not available in demo</p>
            <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors mx-auto">
              <Play className="w-4 h-4" />
              Play Video
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Preview</h3>
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Document preview not available</p>
        <p className="text-sm text-gray-500">Download to view full content</p>
      </div>
    </div>
  )
}

export default function ResourceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const { nostrEnabled } = useNostr()

  useEffect(() => {
    const loadResource = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // In production, this would query Nostr NIP-33 kind 30003 events
        const resourceId = params.id as string
        const foundResource = mockResources.find(r => r.id === resourceId)
        
        if (!foundResource) {
          setError('Resource not found')
          return
        }
        
        setResource(foundResource)
      } catch (err) {
        setError('Failed to load resource details')
        console.error('Error loading resource:', err)
      } finally {
        setLoading(false)
      }
    }

    loadResource()
  }, [params.id, nostrEnabled])

  const handleDownload = async () => {
    if (!resource) return
    
    setDownloading(true)
    try {
      // In production, this would handle actual file downloads
      window.open(resource.downloadUrl, '_blank')
      
      // Track download
      console.log('Download tracked for resource:', resource.id)
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorBoundary 
            error={error || 'Resource not found'} 
            reset={() => router.back()} 
          />
        </div>
      </div>
    )
  }

  const FileIcon = getFileIcon(resource.type)

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </button>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart className="w-4 h-4" />
              Favorite
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Resource Header */}
            <div className="bg-white rounded-lg border p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <FileIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{resource.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="capitalize">{resource.type}</span>
                    <span>•</span>
                    <span className="capitalize">{resource.category}</span>
                    <span>•</span>
                    <span>{formatFileSize(resource.fileSize)}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {resource.description}
              </p>

              {/* Tags */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
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

            {/* Preview Section */}
            <PreviewSection resource={resource} />

            {/* Related Resources */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Resources</h3>
              <p className="text-gray-600 text-sm">
                More resources from the {resource.culture.join(', ')} culture coming soon.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Section */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Download</h3>
              
              <button 
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Downloading...' : 'Download Resource'}
              </button>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">File Size:</span>
                  <span className="text-gray-900">{formatFileSize(resource.fileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="text-gray-900">{resource.mimeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Downloads:</span>
                  <span className="text-gray-900">{resource.downloads.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Resource Info */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Culture</label>
                  <p className="text-gray-900">{resource.culture.join(', ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Language</label>
                  <p className="text-gray-900">{resource.language.join(', ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Category</label>
                  <p className="text-gray-900 capitalize">{resource.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Added</label>
                  <p className="text-gray-900">{formatDate(resource.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900">{formatTimeAgo(resource.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Usage Guidelines */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800 mb-2">Usage Guidelines</h3>
                  <p className="text-sm text-yellow-700">
                    Please respect cultural protocols when using this resource. Some content may be sacred or have specific usage restrictions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
