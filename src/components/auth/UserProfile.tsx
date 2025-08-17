'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  User, 
  LogOut, 
  Settings, 
  Heart, 
  BookOpen, 
  MessageCircle,
  Globe,
  MapPin,
  Calendar,
  ExternalLink,
  Shield,
  Copy,
  Check
} from 'lucide-react'
import { useAuth } from './AuthProvider'
import { formatDate } from '@/lib/utils'

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, logout } = useAuth()
  const [copied, setCopied] = useState(false)

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

  const handleLogout = () => {
    logout()
    onClose()
  }

  if (!isOpen || !user) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50"
    >
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-start gap-4">
          {user.picture ? (
            <img 
              src={user.picture} 
              alt={user.displayName || 'User'}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-purple-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {user.displayName || 'Anonymous User'}
            </h3>
            {user.nip05 && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <Shield className="w-3 h-3" />
                <span className="truncate">{user.nip05}</span>
                {user.verified && <span className="text-xs">✓</span>}
              </div>
            )}
            {user.about && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {user.about}
              </p>
            )}
          </div>
        </div>

        {/* Npub */}
        <div className="mt-4 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Nostr Public Key
              </label>
              <p className="text-sm font-mono text-gray-700 truncate">
                {user.npub}
              </p>
            </div>
            <button
              onClick={handleCopyNpub}
              className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">0</div>
            <div className="text-xs text-gray-600">Contributions</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">0</div>
            <div className="text-xs text-gray-600">Following</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">0</div>
            <div className="text-xs text-gray-600">Followers</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <User className="w-4 h-4" />
          View Profile
        </Link>
        
        <Link
          href="/profile/contributions"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          My Contributions
        </Link>
        
        <Link
          href="/profile/favorites"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Heart className="w-4 h-4" />
          Favorites
        </Link>
        
        <Link
          href="/profile/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>

        {user.website && (
          <a
            href={user.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Website
          </a>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </motion.div>
  )
}
