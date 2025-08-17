'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  User, 
  Heart, 
  BookOpen, 
  Calendar, 
  TrendingUp,
  Users,
  FileText,
  Music,
  Image,
  Video,
  ArrowRight,
  Plus,
  ExternalLink,
  Award,
  MessageCircle
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function DashboardPage() {
  const { isAuthenticated, user, loading } = useAuth()
  const [stats, setStats] = useState({
    contributions: 0,
    cultures: 0,
    stories: 0,
    connections: 0,
    reactions: 0
  })

  useEffect(() => {
    if (isAuthenticated && user) {
      // Simulate fetching user stats
      setStats({
        contributions: Math.floor(Math.random() * 20) + 1,
        cultures: Math.floor(Math.random() * 5) + 1,
        stories: Math.floor(Math.random() * 10) + 1,
        connections: Math.floor(Math.random() * 50) + 5,
        reactions: Math.floor(Math.random() * 100) + 10
      })
    }
  }, [isAuthenticated, user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please Sign In
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to access your dashboard.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  const quickActions = [
    {
      title: 'Share a Story',
      description: 'Contribute your cultural narrative',
      icon: BookOpen,
      href: '/contribute?type=cultural-story',
      color: 'bg-blue-500'
    },
    {
      title: 'Upload Media',
      description: 'Share cultural artifacts',
      icon: Image,
      href: '/contribute?type=visual-story',
      color: 'bg-green-500'
    },
    {
      title: 'Record Audio',
      description: 'Preserve elder voices',
      icon: Music,
      href: '/contribute?type=audio-story',
      color: 'bg-purple-500'
    },
    {
      title: 'Connect',
      description: 'Find cultural practitioners',
      icon: Users,
      href: '/community',
      color: 'bg-orange-500'
    }
  ]

  const recentActivity = [
    {
      type: 'contribution',
      title: 'Shared "Traditional Weaving Patterns"',
      time: '2 hours ago',
      icon: FileText
    },
    {
      type: 'connection',
      title: 'Connected with Elder Maria Santos',
      time: '1 day ago',
      icon: Users
    },
    {
      type: 'reaction',
      title: 'Received 5 hearts on your story',
      time: '2 days ago',
      icon: Heart
    },
    {
      type: 'comment',
      title: 'New comment on "Ancient Recipes"',
      time: '3 days ago',
      icon: MessageCircle
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.displayName || 'Cultural Preservationist'}!
              </h1>
              <p className="text-gray-600">
                Continue your journey of cultural preservation and community building.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <User className="w-4 h-4" />
                View Profile
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Your Impact
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{stats.contributions}</div>
                  <div className="text-sm text-gray-600">Contributions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cultural-600">{stats.cultures}</div>
                  <div className="text-sm text-gray-600">Cultures</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.stories}</div>
                  <div className="text-sm text-gray-600">Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.connections}</div>
                  <div className="text-sm text-gray-600">Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{stats.reactions}</div>
                  <div className="text-sm text-gray-600">Reactions</div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <activity.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  href="/activity"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all activity →
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Profile Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  {user?.displayName || 'Cultural Contributor'}
                </h3>
                <p className="text-sm text-gray-600">
                  {user?.displayName ? `@${user.displayName.toLowerCase().replace(/\s+/g, '')}` : 'Community Member'}
                </p>
              </div>
              
              <div className="space-y-3">
                <Link
                  href="/profile"
                  className="block w-full px-4 py-2 text-center border border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-sm"
                >
                  Edit Profile
                </Link>
                <Link
                  href="/profile?tab=contributions"
                  className="block w-full px-4 py-2 text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                >
                  View Contributions
                </Link>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">
                Recent Achievements
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">First Contribution</p>
                    <p className="text-xs text-gray-600">Shared your first cultural story</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Community Builder</p>
                    <p className="text-xs text-gray-600">Made 5 community connections</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Community Spotlight */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-br from-primary-600 to-cultural-600 rounded-xl shadow-sm p-6 text-white"
            >
              <h3 className="font-semibold mb-2">
                Community Spotlight
              </h3>
              <p className="text-sm text-primary-100 mb-4">
                Join this week's cultural exchange session on traditional storytelling techniques.
              </p>
              <Link
                href="/community/events"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors text-sm"
              >
                Learn More
                <ExternalLink className="w-3 h-3" />
              </Link>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}
