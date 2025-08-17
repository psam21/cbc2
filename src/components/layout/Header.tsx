'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Globe, Users, BookOpen, Download, Calendar, Heart, Search, User, LogIn } from 'lucide-react'
import { useNostr } from '@/components/providers/NostrProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoginModal } from '@/components/auth/LoginModal'
import { UserProfile } from '@/components/auth/UserProfile'
import { SearchInput } from '@/components/ui/SearchInput'

const navigation = [
  { name: 'Explore', href: '/explore', icon: Globe, hasDropdown: true },
  { name: 'Exhibitions', href: '/exhibitions', icon: BookOpen },
  { name: 'Community', href: '/community', icon: Users, hasDropdown: true },
  { name: 'Resources', href: '/downloads', icon: Download },
  { name: 'About', href: '/about', icon: Globe },
]

const exploreDropdown = [
  { name: 'Cultures', href: '/explore', icon: Globe },
  { name: 'Elder Voices', href: '/elder-voices', icon: Heart },
  { name: 'Language Learning', href: '/language', icon: BookOpen },
]

const communityDropdown = [
  { name: 'Share Stories', href: '/contribute', icon: Heart },
  { name: 'Discussions', href: '/community', icon: Users },
  { name: 'Events', href: '/community', icon: Calendar },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [userProfileOpen, setUserProfileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const { isEnabled, isConnected, connect } = useNostr()
  const { isAuthenticated, user } = useAuth()

  const handleDropdownToggle = (navName: string) => {
    setActiveDropdown(activeDropdown === navName ? null : navName)
  }

  return (
    <header className="bg-white shadow-xl border-b border-gray-100 sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Culture Bridge</span>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-[#1A1A2E]">Culture Bridge</span>
            </div>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-xl p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.hasDropdown && (exploreDropdown.some(d => d.href === pathname) || communityDropdown.some(d => d.href === pathname)))
            return (
              <div key={item.name} className="relative">
                <button
                  onClick={() => item.hasDropdown ? handleDropdownToggle(item.name) : null}
                  className={`text-sm font-semibold leading-6 transition-all duration-300 px-4 py-3 rounded-xl relative group flex items-center gap-2 ${
                    isActive
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-[#4A4A4A] hover:text-[#1A1A2E] hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                  {item.hasDropdown && (
                    <svg className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  {/* Underline animation on hover */}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full ${
                    isActive ? 'w-full' : ''
                  }`}></span>
                </button>
                
                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    {item.name === 'Explore' ? exploreDropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        href={dropdownItem.href}
                        className="flex items-center gap-3 px-4 py-3 text-[#4A4A4A] hover:text-[#1A1A2E] hover:bg-orange-50 transition-colors"
                      >
                        <dropdownItem.icon className="w-4 h-4" />
                        {dropdownItem.name}
                      </Link>
                    )) : communityDropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        href={dropdownItem.href}
                        className="flex items-center gap-3 px-4 py-3 text-[#4A4A4A] hover:text-[#1A1A2E] hover:bg-orange-50 transition-colors"
                      >
                        <dropdownItem.icon className="w-4 h-4" />
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          
          {/* Start Here Option */}
          <Link
            href="/start-here"
            className="text-sm font-semibold leading-6 transition-all duration-300 px-4 py-3 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
          >
            Start Here
          </Link>
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
          <div className="relative">
            <SearchInput 
              placeholder="Search cultures, stories..."
              onSearch={(query: string, filters: Record<string, string[]>) => {
                console.log('Search:', query, filters)
                // Handle search with filters
              }}
              className="w-80"
            />
          </div>
          
          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isEnabled && (
              <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-[#4A4A4A] font-medium">
                  {isConnected ? 'Nostr Connected' : 'Nostr Disconnected'}
                </span>
                {!isConnected && (
                  <button
                    onClick={connect}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium ml-2"
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
                  className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white text-sm font-bold rounded-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Share Your Heritage
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setUserProfileOpen(!userProfileOpen)}
                    className="flex items-center gap-3 p-2 text-[#4A4A4A] hover:text-[#1A1A2E] transition-colors hover:bg-gray-100 rounded-xl"
                  >
                    {user?.picture ? (
                      <img 
                        src={user.picture} 
                        alt={user.displayName || 'User'}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-bold">
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
              <div className="flex items-center space-x-4">
                <Link
                  href="/explore"
                  className="text-sm text-[#4A4A4A] hover:text-orange-600 transition-colors font-medium"
                >
                  Browse Cultures
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm text-[#4A4A4A] hover:text-orange-600 transition-colors font-medium"
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A2E] text-white rounded-xl hover:bg-[#2A2A3E] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm font-bold"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
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
