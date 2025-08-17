'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Search, 
  Users, 
  MapPin, 
  Globe, 
  Calendar,
  MessageCircle,
  Star,
  Filter,
  UserPlus,
  Sparkles,
  Clock
} from 'lucide-react'
import { User, CommunityEvent } from '@/types/content'
import { useAuth } from '@/components/auth/AuthProvider'
import { identityService } from '@/lib/nostr/identity'
import { SearchInput } from '@/components/ui/SearchInput'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useQueryParamState } from '@/hooks/useQueryParamState'
import { useDebounce } from '@/hooks/useDebounce'
import { formatDate, formatTimeAgo } from '@/lib/utils'

// Mock community members
const mockMembers: User[] = [
  {
    id: 'pub1',
    npub: 'npub1mary',
    name: 'Mary Williams',
    displayName: 'Elder Mary',
    bio: 'Warlpiri elder and traditional storyteller with 50+ years of experience sharing Aboriginal culture.',
    avatar: '/api/placeholder/100/100',
    location: 'Northern Territory, Australia',
    languages: ['Warlpiri', 'English'],
    expertise: ['Traditional Stories', 'Dreamtime', 'Aboriginal Culture'],
    cultures: ['Aboriginal Australian'],
    createdAt: '2024-01-01T00:00:00Z',
    contributions: [],
    following: [],
    followers: ['pub2', 'pub3']
  },
  {
    id: 'pub2',
    npub: 'npub1james',
    name: 'James Mitchell',
    displayName: 'Cultural Researcher',
    bio: 'Anthropologist specializing in Pacific Island cultures and traditional knowledge preservation.',
    avatar: '/api/placeholder/100/100',
    location: 'Auckland, New Zealand',
    languages: ['English', 'Te Reo Māori'],
    expertise: ['Cultural Research', 'Pacific Studies', 'Documentation'],
    cultures: ['Māori', 'Pacific Islander'],
    createdAt: '2024-01-05T00:00:00Z',
    contributions: [],
    following: ['pub1'],
    followers: []
  }
]

// Mock upcoming events
const mockEvents: CommunityEvent[] = [
  {
    id: 'event1',
    title: 'Traditional Māori Storytelling Circle',
    description: 'Join us for an evening of traditional Māori stories and cultural sharing.',
    startDate: '2024-02-15T18:00:00Z',
    endDate: '2024-02-15T21:00:00Z',
    location: 'Community Center, Auckland',
    type: 'performance',
    culture: ['Māori'],
    organizer: 'pub2',
    attendees: ['pub1', 'pub2'],
    maxAttendees: 30,
    registrationRequired: true,
    tags: ['storytelling', 'māori', 'culture'],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  }
]

const MemberCard = ({ member, onFollow }: { member: User; onFollow: (id: string) => void }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-lg border p-6 hover:shadow-lg transition-all duration-200"
  >
    <div className="flex items-start gap-4">
      {member.avatar ? (
        <img 
          src={member.avatar} 
          alt={member.displayName || member.name}
          className="w-16 h-16 rounded-full object-cover"
        />
      ) : (
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-purple-600" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 truncate">
              {member.displayName || member.name}
            </h3>
            {member.location && (
              <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                <MapPin className="w-3 h-3" />
                <span>{member.location}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => onFollow(member.id)}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <UserPlus className="w-3 h-3" />
            Follow
          </button>
        </div>
        
        {member.bio && (
          <p className="text-gray-700 text-sm mt-2 line-clamp-2">
            {member.bio}
          </p>
        )}
        
        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {member.expertise.slice(0, 3).map((skill) => (
            <span 
              key={skill}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {member.expertise.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{member.expertise.length - 3} more
            </span>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
          <span>{member.contributions.length} contributions</span>
          <span>{member.followers.length} followers</span>
          <span className="text-green-600">Active</span>
        </div>
      </div>
    </div>
  </motion.div>
)

const EventCard = ({ event }: { event: CommunityEvent }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-lg border p-6 hover:shadow-lg transition-all duration-200"
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full capitalize">
        {event.type}
      </span>
    </div>
    
    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
      {event.description}
    </p>
    
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        {event.attendees.length} attending
        {event.maxAttendees && ` • ${event.maxAttendees - event.attendees.length} spots left`}
      </div>
      <Link
        href={`/community/events/${event.id}`}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        View Details
      </Link>
    </div>
  </motion.div>
)

export default function CommunityPage() {
  const { isAuthenticated } = useAuth()
  const [members, setMembers] = useState<User[]>([])
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('members')
  
  const { queryParams, setQueryParam } = useQueryParamState({ q: '', expertise: '' })
  const searchQuery = queryParams.q
  const expertiseFilter = queryParams.expertise
  const setSearchQuery = (value: string) => setQueryParam('q', value)
  const setExpertiseFilter = (value: string) => setQueryParam('expertise', value)
  
  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    const loadCommunityData = async () => {
      setLoading(true)
      
      try {
        // In production, these would be real Nostr queries
        setMembers(mockMembers)
        setEvents(mockEvents)
      } catch (error) {
        console.error('Failed to load community data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCommunityData()
  }, [])

  const handleFollow = async (memberId: string) => {
    if (!isAuthenticated) return
    
    try {
      // In production, this would use identityService.followUser
      console.log('Following user:', memberId)
    } catch (error) {
      console.error('Failed to follow user:', error)
    }
  }

  const filteredMembers = members.filter(member => {
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase()
      if (!member.name?.toLowerCase().includes(query) && 
          !member.displayName?.toLowerCase().includes(query) &&
          !member.bio?.toLowerCase().includes(query)) {
        return false
      }
    }
    
    if (expertiseFilter) {
      if (!member.expertise.some(skill => 
        skill.toLowerCase().includes(expertiseFilter.toLowerCase())
      )) {
        return false
      }
    }
    
    return true
  })

  const tabs = [
    { id: 'members', label: 'Community Members', icon: Users, count: members.length },
    { id: 'events', label: 'Upcoming Events', icon: Calendar, count: events.length }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with cultural practitioners, elders, and enthusiasts from around the world. 
            Share knowledge, learn from others, and build lasting relationships.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">{members.length}</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </div>
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{events.length}</div>
            <div className="text-sm text-gray-600">Upcoming Events</div>
          </div>
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {members.reduce((acc, m) => acc + m.cultures.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Cultures Represented</div>
          </div>
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {members.reduce((acc, m) => acc + m.languages.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Languages Spoken</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border mb-8">
          <div className="border-b">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'members' && (
              <div>
                {/* Search and Filters */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <SearchInput
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="Search members by name, skills, or interests..."
                    />
                  </div>
                  <select
                    value={expertiseFilter}
                    onChange={(e) => setExpertiseFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Expertise</option>
                    <option value="Traditional Stories">Traditional Stories</option>
                    <option value="Cultural Research">Cultural Research</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Dreamtime">Dreamtime</option>
                    <option value="Pacific Studies">Pacific Studies</option>
                  </select>
                </div>

                {/* Members Grid */}
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredMembers.map((member) => (
                      <MemberCard 
                        key={member.id} 
                        member={member} 
                        onFollow={handleFollow}
                      />
                    ))}
                  </div>
                )}

                {!loading && filteredMembers.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No members found matching your criteria</p>
                    <p className="text-sm mt-2">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="space-y-6">
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}

                {!loading && events.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming events</p>
                    <p className="text-sm mt-2">Check back soon for community gatherings</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Join Community CTA */}
        {!isAuthenticated && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 text-center">
            <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-purple-900 mb-2">
              Join Our Community
            </h3>
            <p className="text-purple-700 mb-4">
              Sign in to connect with cultural practitioners, join events, and contribute to 
              the preservation of cultural heritage.
            </p>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Sign In to Join
            </button>
          </div>
        )}
      </div>
    </div>
  )
}