'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Key, 
  User, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Shield,
  ExternalLink,
  LogIn
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  const { login, isAuthenticated, loading } = useAuth()
  const [step, setStep] = useState<'signin' | 'connecting' | 'success'>('signin')
  const [error, setError] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const destination = redirectTo || '/profile'
      router.push(destination)
    }
  }, [isAuthenticated, router, redirectTo])

  const handleSignIn = async () => {
    try {
      setError('')
      setStep('connecting')
      
      const identity = await login()
      
      if (identity) {
        setStep('success')
        setTimeout(() => {
          const destination = redirectTo || '/profile'
          router.push(destination)
        }, 1500)
      } else {
        setError('Failed to connect. Please ensure your Nostr extension is unlocked.')
        setStep('signin')
      }
    } catch (err) {
      setError('Failed to connect. Please try again.')
      setStep('signin')
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-cultural-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome Back
              </h1>
              <p className="text-lg text-gray-600">
                Sign in to your CultureBridge account
              </p>
            </motion.div>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            
            {step === 'signin' && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Connect with Nostr
                  </h2>
                  <p className="text-gray-600">
                    Use your decentralized identity to sign in securely
                  </p>
                </div>

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
                            Click below to sign in with your identity
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSignIn}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                    >
                      <Key className="w-4 h-4" />
                      Sign In with Nostr
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        You need a Nostr extension to sign in. Install one below:
                      </p>
                    </div>

                    <div className="space-y-3">
                      {extensions.map((extension) => (
                        <a
                          key={extension.name}
                          href={extension.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
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
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account yet?{' '}
                    <Link 
                      href="/auth/signup" 
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Create one now
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {step === 'connecting' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Key className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Connecting...
                </h2>
                <p className="text-gray-600 mb-4">
                  Please approve the connection in your Nostr extension.
                </p>
                <LoadingSpinner size="md" />
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Successfully signed in!
                </h2>
                <p className="text-gray-600 mb-4">
                  Welcome back to CultureBridge. Redirecting you now...
                </p>
                
                <div className="bg-primary-50 rounded-lg p-4">
                  <p className="text-sm text-primary-800">
                    {redirectTo ? 'Taking you back to where you left off...' : 'Redirecting to your profile...'}
                  </p>
                </div>
              </div>
            )}

          </motion.div>

          {/* Educational Footer */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Why Nostr?
            </h3>
            <p className="text-xs text-gray-600">
              Nostr gives you true ownership of your identity and data. Your cultural contributions 
              remain yours, protected from censorship and corporate control.
            </p>
          </div>

          {/* Help Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Check our{' '}
              <Link href="/about" className="text-primary-600 hover:text-primary-700">
                documentation
              </Link>
              {' '}or{' '}
              <Link href="/community" className="text-primary-600 hover:text-primary-700">
                contact support
              </Link>
              .
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
