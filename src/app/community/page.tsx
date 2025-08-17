'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SearchInput } from '@/components/ui/SearchInput'
import ConnectionRequest from '@/components/community/ConnectionRequest'
import ConnectionRequests from '@/components/community/ConnectionRequests'
import CommunityGovernance from '@/components/community/CommunityGovernance'
import LiveSessions from '@/components/community/LiveSessions'
import { User } from '@/types/content'
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Globe, 
  Heart, 
  BookOpen, 
  Award,
  Loader2,
  Plus
} from 'lucide-react'
import { useQueryParamState } from '@/hooks/useQueryParamState'

// Real data structures
interface CommunityEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: 'workshop' | 'discussion' | 'celebration' | 'learning'
  attendees: number
  maxAttendees: number
  host: User
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('members')
  const [members, setMembers] = useState<User[]>([])
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConnectionRequest, setShowConnectionRequest] = useState(false)
  const [showConnectionRequests, setShowConnectionRequests] = useState(false)
  const [selectedMember, setSelectedMember] = useState<User | null>(null)

  const { queryParams, setQueryParam } = useQueryParamState({ q: '', expertise: '' })

  // Fetch community data
  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual Nostr queries
        // For now, show empty state
        // const [membersData, eventsData] = await Promise.all([
        //   nostrService.getCommunityMembers(),
        //   nostrService.getCommunityEvents()
        // ])
        // setMembers(membersData)
        // setEvents(eventsData)
        setMembers([])
        setEvents([])
      } catch (error) {
        console.error('Failed to fetch community data:', error)
        setError('Failed to load community data')
      } finally {
        setLoading(false)
      }
    }

    fetchCommunityData()
  }, [])

  const handleFollow = (id: string) => {
    // TODO: Implement follow functionality with Nostr
    console.log('Follow user:', id)
  }

  const handleConnect = (member: User) => {
    setSelectedMember(member)
    setShowConnectionRequest(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8faff] to-[#fffdf8] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] mb-8">
              Community
            </h1>
            <div className="flex justify-center">
              <div className="flex items-center gap-3 text-[#4A4A4A]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-lg">Loading community...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8faff] to-[#fffdf8] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] mb-8">
              Community
            </h1>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-md mx-auto">
              <p className="text-[#4A4A4A] mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const MemberCard = ({ member, onFollow, onConnect }: { member: User; onFollow: (id: string) => void; onConnect: (member: User) => void }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {member.avatar ? (
            <img 
              src={member.avatar} 
              alt={member.displayName || member.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-purple-100 rounded-full flex items-center justify-center border-2 border-gray-200">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-bold text-[#1A1A2E] truncate">
              {member.displayName || member.name}
            </h3>
            {/* Online status would come from Nostr presence */}
          </div>
          
          <p className="text-[#4A4A4A] text-sm mb-3">
            {member.npub.slice(0, 8)}...{member.npub.slice(-8)}
          </p>
          
          {member.bio && (
            <p className="text-[#4A4A4A] text-sm mb-3 line-clamp-2">
              {member.bio}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {member.expertise.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
            {member.expertise.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-[#4A4A4A] text-xs rounded-full font-medium">
                +{member.expertise.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-[#4A4A4A] mb-4">
            <Globe className="w-4 h-4" />
            <span>{member.location}</span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onFollow(member.id)}
              className="px-4 py-2 border border-gray-300 text-[#4A4A4A] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Follow
            </button>
            <button
              onClick={() => onConnect(member)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const EventCard = ({ event }: { event: CommunityEvent }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-purple-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1A1A2E]">{event.title}</h3>
            <p className="text-sm text-[#4A4A4A]">{event.date} at {event.time}</p>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          event.type === 'workshop' ? 'bg-blue-100 text-blue-700' :
          event.type === 'discussion' ? 'bg-green-100 text-green-700' :
          event.type === 'celebration' ? 'bg-purple-100 text-purple-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {event.type}
        </span>
      </div>
      
      <p className="text-[#4A4A4A] text-sm mb-4 line-clamp-2">
        {event.description}
      </p>
      
      <div className="flex items-center justify-between text-sm text-[#4A4A4A] mb-4">
        <div className="flex items-center space-x-1">
          <Globe className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>{event.attendees}/{event.maxAttendees}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {event.host.avatar ? (
            <img 
              src={event.host.avatar} 
              alt={event.host.displayName || event.host.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          )}
          <span className="text-sm text-[#4A4A4A]">Hosted by {event.host.displayName || event.host.name}</span>
        </div>
        
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
          Join Event
        </button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faff] to-[#fffdf8] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] mb-8">
            Community
          </h1>
          <p className="text-xl text-[#4A4A4A] max-w-3xl mx-auto">
            Connect with cultural practitioners, participate in events, and contribute to our shared mission of preserving cultural heritage
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {[
            { id: 'members', label: 'Members', icon: Users, count: members.length },
            { id: 'events', label: 'Events', icon: Calendar, count: events.length },
            { id: 'governance', label: 'Governance', icon: Award, count: 0 },
            { id: 'sessions', label: 'Live Sessions', icon: MessageSquare, count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 mx-2 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-[#4A4A4A] hover:bg-orange-50 border border-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'members' && (
          <div>
            {/* Search and Actions */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1">
                  <SearchInput
                    placeholder="Search members by name, skills, or interests..."
                    onSearch={(query, filters) => {
                      // Handle search
                      console.log('Search:', query, filters)
                    }}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConnectionRequests(true)}
                    className="px-6 py-3 border border-orange-600 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors font-medium"
                  >
                    Connection Requests
                  </button>
                  <button
                    onClick={() => setShowConnectionRequest(true)}
                    className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Invite Members</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Members Grid */}
            {members.length === 0 ? (
              <div className="text-center">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-md mx-auto">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">No Community Members Yet</h2>
                  <p className="text-[#4A4A4A] mb-6">Be the first to join our cultural preservation community!</p>
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
                  >
                    Join Community
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onFollow={handleFollow}
                    onConnect={handleConnect}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            {/* Events Header */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Community Events</h2>
                  <p className="text-[#4A4A4A]">Join workshops, discussions, and celebrations</p>
                </div>
                
                <button className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium">
                  Create Event
                </button>
              </div>
            </div>

            {/* Events Grid */}
            {events.length === 0 ? (
              <div className="text-center">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-md mx-auto">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">No Events Scheduled</h2>
                  <p className="text-[#4A4A4A] mb-6">Be the first to create a community event!</p>
                  <button className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors">
                    Create Event
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'governance' && (
          <CommunityGovernance 
            isOpen={true}
            onClose={() => {}}
          />
        )}

        {activeTab === 'sessions' && (
          <LiveSessions 
            isOpen={true}
            onClose={() => {}}
          />
        )}
      </div>

      {/* Modals */}
      {showConnectionRequest && selectedMember && (
        <ConnectionRequest
          member={selectedMember}
          onClose={() => setShowConnectionRequest(false)}
          onSendRequest={(memberId, message, mentorshipInterest) => {
            // TODO: Implement connection request with Nostr
            console.log('Connection request:', { memberId, message, mentorshipInterest })
            setShowConnectionRequest(false)
          }}
        />
      )}

      {showConnectionRequests && (
        <ConnectionRequests
          isOpen={showConnectionRequests}
          onClose={() => setShowConnectionRequests(false)}
        />
      )}
    </div>
  )
}