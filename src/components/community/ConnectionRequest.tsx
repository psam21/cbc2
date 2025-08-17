'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, MessageCircle, Star, Users, X } from 'lucide-react'
import { User } from '@/types/content'
import { useAuth } from '@/components/auth/AuthProvider'

interface ConnectionRequestProps {
  member: User
  onClose: () => void
  onSendRequest: (memberId: string, message: string, mentorshipInterest: boolean) => void
}

export default function ConnectionRequest({ member, onClose, onSendRequest }: ConnectionRequestProps) {
  const { isAuthenticated } = useAuth()
  const [message, setMessage] = useState('')
  const [mentorshipInterest, setMentorshipInterest] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated || !message.trim()) return

    setSending(true)
    try {
      await onSendRequest(member.id, message, mentorshipInterest)
      onClose()
    } catch (error) {
      console.error('Failed to send connection request:', error)
    } finally {
      setSending(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <UserPlus className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sign In Required
            </h3>
            <p className="text-gray-600 mb-4">
              You need to be signed in to connect with community members.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Connect with {member.displayName || member.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            {member.avatar ? (
              <img 
                src={member.avatar} 
                alt={member.displayName || member.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            )}
            <div>
              <h4 className="font-medium text-gray-900">
                {member.displayName || member.name}
              </h4>
              <p className="text-sm text-gray-600">
                {member.expertise.slice(0, 2).join(', ')}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mentorship Interest */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="mentorship"
              checked={mentorshipInterest}
              onChange={(e) => setMentorshipInterest(e.target.checked)}
              className="mt-1"
            />
            <div>
              <label htmlFor="mentorship" className="text-sm font-medium text-gray-700">
                I'm interested in mentorship
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Indicate if you'd like to learn from this practitioner's expertise
              </p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Connection Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Introduce yourself and explain why you'd like to connect..."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Send Request
                </>
              )}
            </button>
          </div>
        </form>

        {/* Mentorship Benefits */}
        {mentorshipInterest && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Mentorship Benefits
                </h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Direct guidance from experienced practitioners</li>
                  <li>• Cultural knowledge transfer and preservation</li>
                  <li>• Community building and networking</li>
                  <li>• Skill development and learning opportunities</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
