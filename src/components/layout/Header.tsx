'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Globe, Users, BookOpen, Download, Calendar, Heart, Search, User, LogIn } from 'lucide-react'
import { useNostr } from '@/components/providers/NostrProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoginModal } from '@/components/auth/LoginModal'
import { UserProfile } from '@/components/auth/UserProfile'

const navigation = [
  { name: 'Home', href: '/', icon: Globe },
  { name: 'Explore Cultures', href: '/explore', icon: Globe },
  { name: 'Exhibitions', href: '/exhibitions', icon: BookOpen },
  { name: 'Resources', href: '/downloads', icon: Download },
  { name: 'Elder Voices', href: '/elder-voices', icon: Heart },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Language', href: '/language', icon: BookOpen },
  { name: 'About', href: '/about', icon: Globe },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [userProfileOpen, setUserProfileOpen] = useState(false)
  const pathname = usePathname()
  const { isEnabled, isConnected, connect } = useNostr()
  const { isAuthenticated, user } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Culture Bridge</span>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-cultural-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Culture Bridge</span>
            </div>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold leading-6 transition-colors duration-200 ${
                  isActive
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-900 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cultures, stories..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
            />
          </div>
          
          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isEnabled && (
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Nostr Connected' : 'Nostr Disconnected'}
                </span>
                {!isConnected && (
                  <button
                    onClick={connect}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Connect
                  </button>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  href="/contribute"
                  className="btn-primary text-sm"
                >
                  Share Your Heritage
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setUserProfileOpen(!userProfileOpen)}
                    className="flex items-center gap-2 p-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {user?.picture ? (
                      <img 
                        src={user.picture} 
                        alt={user.displayName || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium">
                      {user?.displayName || 'Profile'}
                    </span>
                  </button>
                  
                  {userProfileOpen && (
                    <UserProfile 
                      isOpen={userProfileOpen} 
                      onClose={() => setUserProfileOpen(false)} 
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/explore"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Browse Cultures
                </Link>
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Culture Bridge</span>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-cultural-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">Culture Bridge</span>
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors duration-200 ${
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
                <div className="py-6">
                  <Link
                    href="/contribute"
                    className="btn-primary w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Share Your Heritage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
