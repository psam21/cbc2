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
  Twitter,
  Download,
  FileDown,
  Database,
  Headphones,
  Image,
  Info,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { formatDate } from '@/lib/utils'

export default function ProfilePage() {
  const { isAuthenticated, user, loading } = useAuth()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [exportLoading, setExportLoading] = useState(false)
  const [contributions, setContributions] = useState<any[]>([])

  useEffect(() => {
    const fetchContributions = async () => {
      if (!user?.pubkey) return
      try {
        // In a real application, you would fetch contributions from your Nostr client
        // For now, we'll simulate fetching a few contributions
        await new Promise(resolve => setTimeout(resolve, 1000))
        setContributions([
          {
            id: '1',
            title: 'Traditional Weaving Patterns',
            description: 'A detailed guide on traditional weaving techniques and patterns from our community.',
            type: 'Cultural Story',
            createdAt: '2023-10-20T10:00:00Z',
            updatedAt: '2023-10-20T10:00:00Z'
          },
          {
            id: '2',
            title: 'Elder Maria\'s Blessing Song',
            description: 'A beautiful blessing song recorded by Elder Maria, explaining its significance in our ceremonies.',
            type: 'Audio Story',
            createdAt: '2023-10-15T14:00:00Z',
            updatedAt: '2023-10-15T14:00:00Z'
          },
          {
            id: '3',
            title: 'Traditional Pottery Making',
            description: 'Step-by-step visual documentation of traditional pottery making techniques.',
            type: 'Visual Story',
            createdAt: '2023-10-10T09:00:00Z',
            updatedAt: '2023-10-10T09:00:00Z'
          }
        ])
      } catch (error) {
        console.error('Failed to fetch contributions:', error)
      }
    }
    fetchContributions()
  }, [user?.pubkey])

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
            error={new Error("You must be signed in to view your profile")} 
            reset={() => window.location.href = '/'} 
          />
        </div>
      </div>
    )
  }

  const handleDataExport = async () => {
    setExportLoading(true)
    
    try {
      // Simulate data export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create export data
      const exportData = {
        profile: {
          publicKey: user?.pubkey,
          displayName: user?.displayName,
          about: user?.about,
          website: user?.website,
          npub: user?.npub,
          exportDate: new Date().toISOString()
        },
        contributions: [
          // This would be populated with actual user contributions
          {
            id: 'example-1',
            type: 'cultural-story',
            title: 'Traditional Weaving Patterns',
            content: 'Example story content...',
            createdAt: '2025-01-15T10:00:00Z'
          }
        ],
        connections: [
          // User's connections and social graph
        ],
        metadata: {
          exportVersion: '1.0',
          platform: 'CultureBridge',
          format: 'JSON'
        }
      }
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `culturebridge-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExportLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'contributions', label: 'Contributions', icon: BookOpen },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'data', label: 'Data & Privacy', icon: Database },
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
                
                {/* Contributions Section */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-[#1A1A2E] mb-6">My Contributions</h3>
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="flex items-center justify-center gap-3 text-[#4A4A4A]">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Loading contributions...</span>
                      </div>
                    </div>
                  ) : contributions.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-[#1A1A2E] mb-2">No Contributions Yet</h4>
                      <p className="text-[#4A4A4A] mb-6">Start contributing to cultural preservation by sharing stories, resources, or creating exhibitions.</p>
                      <Link
                        href="/contribute"
                        className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
                      >
                        Start Contributing
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contributions.map((contribution) => (
                        <div key={contribution.id} className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-[#1A1A2E] mb-1">{contribution.title}</h4>
                              <p className="text-[#4A4A4A] text-sm mb-2">{contribution.description}</p>
                              <div className="flex items-center gap-4 text-xs text-[#4A4A4A]">
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                                  {contribution.type}
                                </span>
                                <span>{new Date(contribution.createdAt).toLocaleDateString()}</span>
                                {contribution.updatedAt !== contribution.createdAt && (
                                  <span>Updated {new Date(contribution.updatedAt).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 text-sm text-orange-600 hover:text-orange-700 font-medium">
                                Edit
                              </button>
                              <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Version Control & Edit History</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        All edits to your contributions are tracked with full version control. 
                        Previous versions are preserved on the Nostr network for data integrity.
                      </p>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Click "Edit" to create a new version of your contribution</li>
                        <li>• "View History" shows all previous versions and changes</li>
                        <li>• Original submissions are always preserved and verifiable</li>
                        <li>• Community can access version history for transparency</li>
                      </ul>
                    </div>
                  </div>
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

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Data Sovereignty & Export
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your cultural data belongs to you. Export your contributions and profile data 
                    in open formats to maintain full control and ownership.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <Database className="w-6 h-6 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-2">
                          Export Your Data
                        </h4>
                        <p className="text-sm text-blue-800 mb-4">
                          Download all your profile information, contributions, and connections 
                          in a portable JSON format. This includes your stories, media, and social graph.
                        </p>
                        <button
                          onClick={handleDataExport}
                          disabled={exportLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {exportLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Preparing Export...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              Export Data
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Data Portability
                      </h4>
                      <p className="text-sm text-gray-600">
                        Your exported data can be imported into other Nostr-compatible platforms, 
                        ensuring you're never locked into CultureBridge.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Decentralized Storage
                      </h4>
                      <p className="text-sm text-gray-600">
                        Your content is stored on decentralized networks, making it resistant 
                        to censorship and ensuring long-term preservation.
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">
                          Privacy & Control
                        </h4>
                        <p className="text-sm text-yellow-700">
                          You control your private keys and can revoke access at any time. 
                          Your cultural heritage data remains under your complete control.
                        </p>
                      </div>
                    </div>
                  </div>
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
