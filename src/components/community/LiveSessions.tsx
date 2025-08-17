'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Video, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Star,
  Play,
  Pause,
  Mic,
  MicOff,
  VideoOff,
  MessageCircle,
  Share2,
  BookOpen,
  Music,
  Camera,
  Globe,
  X
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'

interface LiveSession {
  id: string
  title: string
  description: string
  type: 'webinar' | 'workshop' | 'language-lesson' | 'storytelling' | 'cultural-demonstration'
  startTime: string
  endTime: string
  timezone: string
  location: string
  host: {
    name: string
    avatar: string
    expertise: string[]
    cultures: string[]
  }
  attendees: number
  maxAttendees: number
  registrationRequired: boolean
  tags: string[]
  status: 'upcoming' | 'live' | 'ended' | 'cancelled'
  recordingUrl?: string
  materials?: string[]
}

interface LiveSessionsProps {
  isOpen: boolean
  onClose: () => void
}

export default function LiveSessions({ isOpen, onClose }: LiveSessionsProps) {
  const { isAuthenticated, user } = useAuth()
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'past'>('upcoming')
  const [loading, setLoading] = useState(false)
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null)
  const [isInSession, setIsInSession] = useState(false)

  // Mock data - in production this would come from Nostr
  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      // Simulate loading
      setTimeout(() => {
        setSessions([
          {
            id: 'session1',
            title: 'Traditional Māori Weaving Workshop',
            description: 'Join Elder Hine for a hands-on workshop learning traditional Māori weaving techniques. Learn about the cultural significance of different patterns and create your own small piece.',
            type: 'workshop',
            startTime: '2025-01-20T18:00:00Z',
            endTime: '2025-01-20T20:00:00Z',
            timezone: 'Pacific/Auckland',
            location: 'Virtual Workshop',
            host: {
              name: 'Elder Hine',
              avatar: '/api/placeholder/100/100',
              expertise: ['Traditional Weaving', 'Māori Culture', 'Cultural Arts'],
              cultures: ['Māori']
            },
            attendees: 15,
            maxAttendees: 20,
            registrationRequired: true,
            tags: ['weaving', 'māori', 'workshop', 'traditional-arts'],
            status: 'upcoming'
          },
          {
            id: 'session2',
            title: 'Aboriginal Dreamtime Stories',
            description: 'Listen to traditional Dreamtime stories from Warlpiri elder Mary Williams, sharing ancient wisdom and cultural knowledge passed down through generations.',
            type: 'storytelling',
            startTime: '2025-01-18T19:00:00Z',
            endTime: '2025-01-18T20:30:00Z',
            timezone: 'Australia/Darwin',
            location: 'Virtual Storytelling Circle',
            host: {
              name: 'Elder Mary Williams',
              avatar: '/api/placeholder/100/100',
              expertise: ['Traditional Stories', 'Dreamtime', 'Aboriginal Culture'],
              cultures: ['Aboriginal Australian']
            },
            attendees: 45,
            maxAttendees: 100,
            registrationRequired: false,
            tags: ['dreamtime', 'aboriginal', 'stories', 'cultural-wisdom'],
            status: 'live'
          },
          {
            id: 'session3',
            title: 'Introduction to Te Reo Māori',
            description: 'Begin your journey learning Te Reo Māori with cultural context and pronunciation guidance. Perfect for beginners interested in Māori language and culture.',
            type: 'language-lesson',
            startTime: '2025-01-17T17:00:00Z',
            endTime: '2025-01-17T18:00:00Z',
            timezone: 'Pacific/Auckland',
            location: 'Virtual Classroom',
            host: {
              name: 'Kaiako James',
              avatar: '/api/placeholder/100/100',
              expertise: ['Te Reo Māori', 'Language Teaching', 'Māori Culture'],
              cultures: ['Māori']
            },
            attendees: 28,
            maxAttendees: 30,
            registrationRequired: true,
            tags: ['te-reo', 'māori', 'language-learning', 'beginners'],
            status: 'ended',
            recordingUrl: 'https://example.com/recording',
            materials: ['Pronunciation Guide', 'Basic Vocabulary', 'Cultural Notes']
          }
        ])
        setLoading(false)
      }, 1000)
    }
  }, [isOpen])

  const handleJoinSession = async (sessionId: string) => {
    if (!isAuthenticated) return

    try {
      // In production, this would connect to the live session
      setSelectedSession(sessions.find(s => s.id === sessionId) || null)
      setIsInSession(true)
    } catch (error) {
      console.error('Failed to join session:', error)
    }
  }

  const handleRegister = async (sessionId: string) => {
    if (!isAuthenticated) return

    try {
      // In production, this would register the user for the session
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, attendees: s.attendees + 1 } : s
      ))
    } catch (error) {
      console.error('Failed to register for session:', error)
    }
  }

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming')
  const liveSessions = sessions.filter(s => s.status === 'live')
  const pastSessions = sessions.filter(s => s.status === 'ended')

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'webinar': return <Video className="w-4 h-4" />
      case 'workshop': return <BookOpen className="w-4 h-4" />
      case 'language-lesson': return <Globe className="w-4 h-4" />
      case 'storytelling': return <Mic className="w-4 h-4" />
      case 'cultural-demonstration': return <Camera className="w-4 h-4" />
      default: return <Video className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'webinar': return 'bg-blue-100 text-blue-800'
      case 'workshop': return 'bg-green-100 text-green-800'
      case 'language-lesson': return 'bg-purple-100 text-purple-800'
      case 'storytelling': return 'bg-orange-100 text-orange-800'
      case 'cultural-demonstration': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'live': return 'bg-green-100 text-green-800'
      case 'ended': return 'bg-gray-100 text-gray-600'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Live Cultural Exchange Sessions</h2>
            <p className="text-sm text-gray-600 mt-1">
              Join live workshops, language lessons, and cultural demonstrations from around the world
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Upcoming ({upcomingSessions.length})
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'live'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Video className="w-4 h-4" />
              Live Now ({liveSessions.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'past'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              Past Sessions ({pastSessions.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading sessions...</p>
            </div>
          ) : activeTab === 'upcoming' ? (
            <div className="space-y-4">
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming sessions</p>
                  <p className="text-sm mt-2">New sessions will be announced here</p>
                </div>
              ) : (
                upcomingSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(session.type)}`}>
                          {getTypeIcon(session.type)}
                          {session.type.replace('-', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(session.startTime).toLocaleDateString()}
                        </div>
                        <div className="text-xs mt-1">
                          {new Date(session.startTime).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {session.title}
                    </h3>
                    
                    <p className="text-gray-700 mb-4">
                      {session.description}
                    </p>

                    {/* Host Info */}
                    <div className="flex items-center gap-3 mb-4">
                      {session.host.avatar ? (
                        <img 
                          src={session.host.avatar} 
                          alt={session.host.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{session.host.name}</h4>
                        <p className="text-sm text-gray-600">
                          {session.host.expertise.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    </div>

                    {/* Session Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{session.attendees}/{session.maxAttendees} attendees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{new Date(session.startTime).toLocaleTimeString()} - {new Date(session.endTime).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span>{session.timezone}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {session.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {session.registrationRequired ? (
                        <button
                          onClick={() => handleRegister(session.id)}
                          disabled={session.attendees >= session.maxAttendees}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Users className="w-4 h-4" />
                          {session.attendees >= session.maxAttendees ? 'Full' : 'Register'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinSession(session.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          Join Session
                        </button>
                      )}
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === 'live' ? (
            <div className="space-y-4">
              {liveSessions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No live sessions currently</p>
                  <p className="text-sm mt-2">Check upcoming sessions for future events</p>
                </div>
              ) : (
                liveSessions.map((session) => (
                  <div key={session.id} className="border-2 border-green-500 rounded-lg p-6 bg-green-50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-800 font-medium">LIVE NOW</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {session.title}
                    </h3>
                    
                    <p className="text-gray-700 mb-4">
                      {session.description}
                    </p>

                    {/* Live Session Controls */}
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Session Controls</h4>
                        <span className="text-sm text-gray-600">
                          {session.attendees} people watching
                        </span>
                      </div>
                      
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          <Pause className="w-4 h-4" />
                          Pause
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          <Mic className="w-4 h-4" />
                          Mute
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          <VideoOff className="w-4 h-4" />
                          Stop Video
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          Chat
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleJoinSession(session.id)}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
                    >
                      <Play className="w-5 h-5" />
                      Join Live Session
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {pastSessions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No past sessions</p>
                  <p className="text-sm mt-2">Completed sessions will appear here</p>
                </div>
              ) : (
                pastSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(session.type)}`}>
                          {getTypeIcon(session.type)}
                          {session.type.replace('-', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(session.startTime).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {session.title}
                    </h3>
                    
                    <p className="text-gray-700 mb-4">
                      {session.description}
                    </p>

                    {/* Recording and Materials */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-3">Session Resources</h4>
                      <div className="space-y-3">
                        {session.recordingUrl && (
                          <div className="flex items-center gap-3">
                            <Video className="w-5 h-5 text-blue-600" />
                            <a 
                              href={session.recordingUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Watch Recording
                            </a>
                          </div>
                        )}
                        {session.materials && session.materials.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Materials:</h5>
                            <div className="space-y-1">
                              {session.materials.map((material, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                  <BookOpen className="w-4 h-4" />
                                  {material}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Video className="w-4 h-4" />
                        Watch Recording
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {sessions.length} total sessions
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
