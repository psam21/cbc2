'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Key, Download, ExternalLink, Shield, Check } from 'lucide-react'
import { useAuth } from './AuthProvider'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string
}

export function LoginModal({ isOpen, onClose, redirectTo }: LoginModalProps) {
  const { login, loading, error } = useAuth()
  const [step, setStep] = useState<'extensions' | 'connecting' | 'success'>('extensions')

  const handleLogin = async () => {
    setStep('connecting')
    const identity = await login()
    
    if (identity) {
      setStep('success')
      setTimeout(() => {
        onClose()
        if (redirectTo) {
          window.location.href = redirectTo
        }
      }, 1500)
    } else {
      setStep('extensions')
    }
  }

  const extensions = [
    {
      name: 'nos2x',
      description: 'Lightweight browser extension for Nostr',
      url: 'https://github.com/fiatjaf/nos2x',
      logo: '🔑'
    },
    {
      name: 'Alby',
      description: 'Bitcoin Lightning & Nostr extension',
      url: 'https://getalby.com/',
      logo: '⚡'
    },
    {
      name: 'Flamingo',
      description: 'User-friendly Nostr extension',
      url: 'https://flamingo.me/',
      logo: '🦩'
    }
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {step === 'extensions' && 'Connect with Nostr'}
              {step === 'connecting' && 'Connecting...'}
              {step === 'success' && 'Connected!'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'extensions' && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-gray-600">
                    Connect your Nostr identity to contribute content and engage with the community.
                  </p>
                </div>

                {/* Check for existing extension */}
                {typeof window !== 'undefined' && window.nostr ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Nostr extension detected
                          </p>
                          <p className="text-sm text-green-600">
                            Click below to connect your identity
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Key className="w-4 h-4" />
                      {loading ? 'Connecting...' : 'Connect Identity'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        You need a Nostr extension to sign in. Choose one below:
                      </p>
                    </div>

                    <div className="space-y-3">
                      {extensions.map((extension) => (
                        <a
                          key={extension.name}
                          href={extension.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                        >
                          <span className="text-2xl">{extension.logo}</span>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {extension.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {extension.description}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      ))}
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                      After installing an extension, refresh this page and try again.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
              </>
            )}

            {step === 'connecting' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Key className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-gray-600 mb-2">Connecting to your Nostr identity...</p>
                <p className="text-sm text-gray-500">
                  Please approve the connection in your Nostr extension.
                </p>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-900 font-medium mb-2">Successfully connected!</p>
                <p className="text-sm text-gray-600">
                  You can now contribute content and engage with the community.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                What is Nostr?
              </h4>
              <p className="text-xs text-gray-600">
                Nostr is a decentralized protocol that gives you control over your identity and data. 
                Your content and connections are yours, not locked in any platform.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
