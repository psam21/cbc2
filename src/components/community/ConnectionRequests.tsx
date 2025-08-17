'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  UserPlus, 
  Check, 
  X, 
  Clock, 
  Users, 
  MessageCircle,
  Star,
  UserCheck
} from 'lucide-react'
import { User } from '@/types/content'
import { useAuth } from '@/components/auth/AuthProvider'

interface ConnectionRequest {
  id: string
  from: User
  to: string
  message: string
  mentorshipInterest: boolean
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

interface ConnectionRequestsProps {
  isOpen: boolean
  onClose: () => void
}

export default function ConnectionRequests({ isOpen, onClose }: ConnectionRequestsProps) {
  const { user } = useAuth()
  const [requests, setRequests] = useState<ConnectionRequest[]>([])
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming')
  const [loading, setLoading] = useState(false)

  // Mock data - in production this would come from Nostr
  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      // Simulate loading
      setTimeout(() => {
        setRequests([
          {
            id: 'req1',
            from: {
              id: 'pub1',
              npub: 'npub1mary',
              name: 'Mary Williams',
              displayName: 'Elder Mary',
              bio: 'Warlpiri elder and traditional storyteller',
              avatar: '/api/placeholder/100/100',
              location: 'Northern Territory, Australia',
              languages: ['Warlpiri', 'English'],
              expertise: ['Traditional Stories', 'Dreamtime'],
              cultures: ['Aboriginal Australian'],
              createdAt: '2024-01-01T00:00:00Z',
              contributions: [],
              following: [],
              followers: []
            },
            to: user?.pubkey || '',
            message: 'I would love to connect and share stories about our cultural heritage. Your work on preserving traditional knowledge is inspiring.',
            mentorshipInterest: true,
            status: 'pending',
            createdAt: '2025-01-17T10:00:00Z'
          },
          {
            id: 'req2',
            from: {
              id: 'pub2',
              npub: 'npub1james',
              name: 'James Mitchell',
              displayName: 'Cultural Researcher',
              bio: 'Anthropologist specializing in Pacific Island cultures',
              avatar: '/api/placeholder/100/100',
              location: 'Auckland, New Zealand',
              languages: ['English', 'Te Reo Māori'],
              expertise: ['Cultural Research', 'Pacific Studies'],
              cultures: ['Māori', 'Pacific Islander'],
              createdAt: '2024-01-05T00:00:00Z',
              contributions: [],
              following: [],
              followers: []
            },
            to: user?.pubkey || '',
            message: 'I\'m interested in collaborating on cultural preservation projects. Would love to discuss potential partnerships.',
            mentorshipInterest: false,
            status: 'pending',
            createdAt: '2025-01-16T15:30:00Z'
          }
        ])
        setLoading(false)
      }, 1000)
    }
  }, [isOpen, user?.pubkey])

  const handleAccept = async (requestId: string) => {
    try {
      // In production, this would update Nostr and send notifications
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'accepted' as const } : req
      ))
    } catch (error) {
      console.error('Failed to accept request:', error)
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      // In production, this would update Nostr and send notifications
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      ))
    } catch (error) {
      console.error('Failed to reject request:', error)
    }
  }

  const incomingRequests = requests.filter(req => req.status === 'pending')
  const outgoingRequests = requests.filter(req => req.status === 'pending')
  const completedRequests = requests.filter(req => req.status !== 'pending')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Connection Requests</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your community connections and mentorship opportunities
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
              onClick={() => setActiveTab('incoming')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'incoming'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Incoming ({incomingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('outgoing')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'outgoing'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Outgoing ({outgoingRequests.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading connection requests...</p>
            </div>
          ) : activeTab === 'incoming' ? (
            <div className="space-y-4">
              {incomingRequests.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No pending connection requests</p>
                  <p className="text-sm mt-2">New requests will appear here</p>
                </div>
              ) : (
                incomingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {request.from.avatar ? (
                        <img 
                          src={request.from.avatar} 
                          alt={request.from.displayName || request.from.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {request.from.displayName || request.from.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {request.from.expertise.slice(0, 2).join(', ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {request.mentorshipInterest && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                Mentorship
                              </span>
                            )}
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mt-2">{request.message}</p>
                        
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleAccept(request.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            <Check className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {outgoingRequests.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No outgoing connection requests</p>
                  <p className="text-sm mt-2">Your sent requests will appear here</p>
                </div>
              ) : (
                outgoingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {request.from.avatar ? (
                        <img 
                          src={request.from.avatar} 
                          alt={request.from.displayName || request.from.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {request.from.displayName || request.from.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {request.from.expertise.slice(0, 2).join(', ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {request.mentorshipInterest && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                Mentorship
                              </span>
                            )}
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mt-2">{request.message}</p>
                      </div>
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
              {completedRequests.length} completed connections
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
