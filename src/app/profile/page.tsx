'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  User, 
  Settings, 
  Heart, 
  BookOpen,
  MapPin,
  Globe,
  Calendar,
  Shield,
  ExternalLink,
  Edit,
  Copy,
  Check,
  Github,
  Twitter
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { formatDate } from '@/lib/utils'

export default function ProfilePage() {
  const { isAuthenticated, user, loading } = useAuth()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const handleCopyNpub = async () => {
    if (!user?.npub) return
    
    try {
      await navigator.clipboard.writeText(user.npub)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy npub:', error)
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

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorBoundary 
            error="You must be signed in to view your profile" 
            reset={() => window.location.href = '/'} 
          />
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'contributions', label: 'Contributions', icon: BookOpen },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg border mb-8 overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600 relative">
            {user.banner && (
              <img 
                src={user.banner} 
                alt="Profile banner"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Profile Info */}
          <div className="p-8">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative -mt-16">
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.displayName || 'User'}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white"
                  />
                ) : (
                  <div className="w-24 h-24 bg-purple-100 rounded-full border-4 border-white flex items-center justify-center">
                    <User className="w-12 h-12 text-purple-600" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {user.displayName || 'Anonymous User'}
                    </h1>
                    
                    {user.nip05 && (
                      <div className="flex items-center gap-2 text-green-600 mb-2">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">{user.nip05}</span>
                        {user.verified && <span className="text-xs">✓ Verified</span>}
                      </div>
                    )}

                    {user.about && (
                      <p className="text-gray-700 mb-4 max-w-2xl">
                        {user.about}
                      </p>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {user.website && (
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          Website
                        </a>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {formatDate(new Date().toISOString())}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/profile/settings"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Npub */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Nostr Public Key
                  </label>
                  <p className="text-sm font-mono text-gray-700 break-all">
                    {user.npub}
                  </p>
                </div>
                <button
                  onClick={handleCopyNpub}
                  className="ml-4 flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Contributions</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Favorites</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border">
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
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm mt-2">Start contributing to see your activity here</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contributions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">My Contributions</h3>
                  <Link
                    href="/contribute"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Add Contribution
                  </Link>
                </div>
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No contributions yet</p>
                  <p className="text-sm mt-2">Share your cultural knowledge with the community</p>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Favorite Content</h3>
                <div className="text-center py-12 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No favorites yet</p>
                  <p className="text-sm mt-2">Heart content you love to save it here</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Nostr Identity</h4>
                    <p className="text-sm text-blue-800">
                      Your profile is managed through your Nostr extension. To update your information, 
                      edit your profile in your Nostr client and it will sync automatically.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Privacy & Security</h4>
                    <p className="text-sm text-yellow-800">
                      Your data is stored on the Nostr network. You control your private keys and can 
                      delete or modify your content at any time through your Nostr extension.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
