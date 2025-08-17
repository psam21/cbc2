'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Key, 
  User, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Shield,
  ExternalLink,
  Download
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function SignUpPage() {
  const router = useRouter()
  const { login, isAuthenticated, loading } = useAuth()
  const [step, setStep] = useState<'welcome' | 'extension' | 'connecting' | 'profile' | 'success'>('welcome')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [error, setError] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile')
    }
  }, [isAuthenticated, router])

  const handleGetStarted = () => {
    if (typeof window !== 'undefined' && window.nostr) {
      setStep('connecting')
      handleNostrLogin()
    } else {
      setStep('extension')
    }
  }

  const handleNostrLogin = async () => {
    try {
      setError('')
      const identity = await login()
      
      if (identity) {
        setStep('profile')
      } else {
        setError('Failed to connect. Please try again.')
        setStep('extension')
      }
    } catch (err) {
      setError('Failed to connect. Please ensure your Nostr extension is unlocked.')
      setStep('extension')
    }
  }

  const handleProfileSubmit = () => {
    // Here you would normally update the user's profile via Nostr
    // For now, we'll just redirect to success
    setStep('success')
    setTimeout(() => {
      router.push('/profile')
    }, 2000)
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
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Join CultureBridge
              </h1>
              <p className="text-xl text-gray-600">
                Create your decentralized identity and start preserving cultural heritage
              </p>
            </motion.div>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {['welcome', 'extension', 'profile', 'success'].map((stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === stepName || (['connecting'].includes(step) && stepName === 'extension')
                      ? 'bg-primary-600 text-white'
                      : index < ['welcome', 'extension', 'profile', 'success'].indexOf(step)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index < ['welcome', 'extension', 'profile', 'success'].indexOf(step) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 3 && (
                    <div className={`w-12 h-1 mx-2 ${
                      index < ['welcome', 'extension', 'profile', 'success'].indexOf(step)
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            
            {/* Welcome Step */}
            {step === 'welcome' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10 text-primary-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to the Future of Cultural Preservation
                </h2>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  CultureBridge uses Nostr, a decentralized protocol, to ensure you own your cultural data and identity. 
                  No corporate control, no censorship - just authentic community-driven preservation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <Shield className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 mb-1">Own Your Data</h3>
                    <p className="text-sm text-gray-600">Complete control over your cultural contributions</p>
                  </div>
                  <div className="text-center">
                    <Key className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 mb-1">Secure Identity</h3>
                    <p className="text-sm text-gray-600">Cryptographic keys ensure authenticity</p>
                  </div>
                  <div className="text-center">
                    <ExternalLink className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 mb-1">Censorship-Resistant</h3>
                    <p className="text-sm text-gray-600">Your heritage is preserved forever</p>
                  </div>
                </div>

                <button
                  onClick={handleGetStarted}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="mt-4 text-sm text-gray-500">
                  Already have an account? <Link href="/auth/signin" className="text-primary-600 hover:text-primary-700">Sign in</Link>
                </p>
              </div>
            )}

            {/* Extension Step */}
            {(step === 'extension' || step === 'connecting') && (
              <div>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key className={`w-8 h-8 text-primary-600 ${step === 'connecting' ? 'animate-pulse' : ''}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {step === 'connecting' ? 'Connecting...' : 'Connect Your Nostr Identity'}
                  </h2>
                  <p className="text-gray-600">
                    {step === 'connecting' 
                      ? 'Please approve the connection in your Nostr extension.'
                      : 'You need a Nostr extension to create your decentralized identity.'
                    }
                  </p>
                </div>

                {step === 'connecting' ? (
                  <div className="text-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : typeof window !== 'undefined' && window.nostr ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Nostr extension detected
                          </p>
                          <p className="text-sm text-green-600">
                            Click below to connect and create your identity
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setStep('connecting')
                        handleNostrLogin()
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Key className="w-4 h-4" />
                      Connect Identity
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        Choose a Nostr extension to install. After installation, refresh this page to continue.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {extensions.map((extension) => (
                        <a
                          key={extension.name}
                          href={extension.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
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
              </div>
            )}

            {/* Profile Step */}
            {step === 'profile' && (
              <div>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Complete Your Profile
                  </h2>
                  <p className="text-gray-600">
                    Set up your NIP-05 identifier and tell the community about yourself.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Username (NIP-05 Identifier)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        placeholder="yourusername"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-2 text-gray-500">@culturebridge.app</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      This creates your human-readable Nostr identifier
                    </p>
                  </div>

                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about your cultural background or interests..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      Website (Optional)
                    </label>
                    <input
                      type="url"
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://your-website.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handleProfileSubmit}
                    disabled={!username || !displayName}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    Complete Setup
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to CultureBridge!
                </h2>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Your decentralized identity has been created successfully. You can now contribute content, 
                  connect with communities, and help preserve cultural heritage for future generations.
                </p>

                <div className="bg-primary-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-primary-800">
                    Redirecting to your profile in a moment...
                  </p>
                </div>

                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Go to Profile
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

          </motion.div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need help? Check our <Link href="/about" className="text-primary-600 hover:text-primary-700">documentation</Link> or{' '}
              <Link href="/community" className="text-primary-600 hover:text-primary-700">contact the community</Link>.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
