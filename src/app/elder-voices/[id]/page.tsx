'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Play, 
  Pause,
  Star, 
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  FileText,
  Calendar,
  User,
  Headphones,
  Heart,
  Share2,
  MessageCircle,
  Clock,
  MapPin
} from 'lucide-react'
import { ElderStory } from '@/types/content'
import { useNostr } from '@/components/providers/NostrProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { formatDate, formatTimeAgo } from '@/lib/utils'

// Mock data
const mockStories: ElderStory[] = [
  {
    id: '1',
    title: 'The Legend of the Rainbow Serpent',
    story: 'In the Dreamtime, the Rainbow Serpent moved across the barren land, carving rivers and shaping mountains. This is the ancient story of creation, water, and the sacred landscape as told by the Aboriginal people. The Rainbow Serpent is one of the most powerful and widespread ancestral beings in Aboriginal Dreamtime stories. It is associated with water, rain, rivers, and the fertility of the land. The serpent created the landscape as it moved across the earth, leaving behind rivers, mountains, and valleys. This story teaches about the importance of water and the connection between all living things.',
    summary: 'This powerful creation story tells of how the Rainbow Serpent carved the rivers and mountains of Australia, bringing water and life to the land.',
    culture: 'Aboriginal Australian',
    storyteller: 'Elder Mary Williams',
    storytellerBio: 'A respected elder from the Warlpiri people with over 50 years of storytelling experience. Mary has dedicated her life to preserving and sharing the traditional stories of her people.',
    audioUrl: 'https://example.com/rainbow-serpent.mp3',
    imageUrl: '/api/placeholder/800/450',
    transcript: `[00:00] In the beginning, in the Dreamtime, the land was flat and empty. No rivers flowed, no mountains stood, no life existed.

[00:15] Then came the Rainbow Serpent, the great ancestral being, moving across the barren earth with tremendous power.

[00:30] As the Rainbow Serpent moved, its massive body carved deep channels in the earth. These became the rivers and streams that give life to the land.

[00:45] Where the serpent rested, mountains formed. Where it coiled, valleys appeared. The landscape took shape under its mighty presence.

[01:00] The Rainbow Serpent brought the first rains, filling the rivers it had carved. With water came life - plants, animals, and eventually, people.

[01:15] This is why we must always respect the water and the land. They are gifts from the Rainbow Serpent, our ancestral creator.

[01:30] The Rainbow Serpent continues to watch over us, appearing in the sky after rain as the rainbow, reminding us of the eternal connection between earth, water, and sky.`,
    category: 'mythological',
    tags: ['dreamtime', 'creation', 'water', 'serpent', 'landscape'],
    createdAt: '2024-01-10T00:00:00Z',
    author: 'npub1aboriginal',
    rating: 4.8,
    ratingsCount: 156,
    featured: true
  }
]

const StarRating = ({ rating, ratingsCount, onRate }: {
  rating: number
  ratingsCount: number
  onRate?: (rating: number) => void
}) => {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate?.(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
          >
            <Star 
              className={`w-5 h-5 ${
                star <= (hoverRating || rating) 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-600">
        {rating.toFixed(1)} ({ratingsCount} ratings)
      </span>
    </div>
  )
}

const AudioPlayer = ({ audioUrl, title }: { audioUrl?: string; title: string }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlayPause = () => {
    if (!audioRef.current || !audioUrl) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const skipTime = (seconds: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!audioUrl) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <Headphones className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">Audio not available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Audio Story</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onEnded={() => setIsPlaying(false)}
        muted={isMuted}
        volume={volume}
      />

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={() => skipTime(-15)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button 
          onClick={togglePlayPause}
          className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        
        <button 
          onClick={() => skipTime(15)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default function ElderStoryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [story, setStory] = useState<ElderStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTranscript, setShowTranscript] = useState(false)
  const { nostrEnabled } = useNostr()

  useEffect(() => {
    const loadStory = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // In production, this would query Nostr NIP-23 events
        const storyId = params.id as string
        const foundStory = mockStories.find(s => s.id === storyId)
        
        if (!foundStory) {
          setError('Story not found')
          return
        }
        
        setStory(foundStory)
      } catch (err) {
        setError('Failed to load story details')
        console.error('Error loading story:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStory()
  }, [params.id, nostrEnabled])

  const handleRating = (rating: number) => {
    if (!story) return
    
    // In production, this would send a NIP-25 reaction event
    console.log('Rating submitted:', rating)
    // Optimistic update
    setStory({
      ...story,
      rating: ((story.rating * story.ratingsCount) + rating) / (story.ratingsCount + 1),
      ratingsCount: story.ratingsCount + 1
    })
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

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorBoundary 
            error={error || 'Story not found'} 
            reset={() => router.back()} 
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Elder Voices
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

        {/* Story Header */}
        <div className="bg-white rounded-lg border p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{story.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{story.storyteller}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{story.culture}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(story.createdAt)}</span>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
                  {story.category}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {story.summary}
              </p>

              <StarRating 
                rating={story.rating} 
                ratingsCount={story.ratingsCount}
                onRate={handleRating}
              />
            </div>

            <div>
              {story.imageUrl && (
                <img 
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-full aspect-[4/3] object-cover rounded-lg"
                />
              )}
            </div>
          </div>
        </div>

        {/* Audio Player */}
        <div className="mb-8">
          <AudioPlayer audioUrl={story.audioUrl} title={story.title} />
        </div>

        {/* Story Content */}
        <div className="bg-white rounded-lg border p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">The Story</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {story.story}
            </p>
          </div>

          {/* Tags */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Story Themes</h3>
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag) => (
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

        {/* Transcript */}
        {story.transcript && (
          <div className="bg-white rounded-lg border p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Audio Transcript</h2>
              <button 
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-4 h-4" />
                {showTranscript ? 'Hide' : 'Show'} Transcript
              </button>
            </div>
            
            {showTranscript && (
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                  {story.transcript}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Storyteller Bio */}
        {story.storytellerBio && (
          <div className="bg-white rounded-lg border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Storyteller</h2>
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.storyteller}</h3>
                <p className="text-gray-700 leading-relaxed">{story.storytellerBio}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
