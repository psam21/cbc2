'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Globe, Users, BookOpen, Download, Calendar, Heart, Search, User, LogIn, ChevronDown, Settings, LogOut } from 'lucide-react'
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
  const { isAuthenticated, user, logout } = useAuth()

  const handleDropdownToggle = (navName: string) => {
    setActiveDropdown(activeDropdown === navName ? null : navName)
  }

  const handleSignOut = () => {
    logout()
    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-earth-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-earth-500 to-earth-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <span className="font-display font-extrabold text-2xl text-earth-800 group-hover:text-earth-700 transition-colors">
              CultureBridge
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  href={item.href}
                  className="px-4 py-3 rounded-xl relative group text-earth-600 hover:text-earth-800 hover:bg-earth-50 transition-all duration-200 font-medium"
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                  </div>
                  {/* Underline animation */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-nature-500 transition-all duration-300 group-hover:w-full"></div>
                </Link>
                
                {/* Dropdown menus */}
                {item.hasDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-earth-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {item.name === 'Explore' && (
                      <div className="py-2">
                        {exploreDropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="flex items-center space-x-3 px-4 py-3 text-earth-600 hover:text-earth-800 hover:bg-earth-50 transition-colors"
                          >
                            <subItem.icon className="w-4 h-4" />
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                    {item.name === 'Community' && (
                      <div className="py-2">
                        {communityDropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="flex items-center space-x-3 px-4 py-3 text-earth-600 hover:text-earth-800 hover:bg-earth-50 transition-colors"
                          >
                            <subItem.icon className="w-4 h-4" />
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {/* Start Here Link */}
            <Link
              href="/explore"
              className="px-4 py-2 text-nature-600 hover:text-nature-700 font-medium transition-colors"
            >
              Start Here
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden lg:block">
              <SearchInput
                placeholder="Search cultures, stories..."
                onSearch={(query, filters) => {
                  // Handle search
                  console.log('Search:', query, filters)
                }}
                className="w-72"
              />
            </div>

            {/* Nostr Connection Status */}
            {isEnabled && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-nature-50 text-nature-700 rounded-lg text-sm font-medium">
                <div className="w-2 h-2 bg-nature-500 rounded-full animate-pulse"></div>
                <span>Connected</span>
              </div>
            )}

            {/* User Actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Share Your Heritage Button */}
                <Link
                  href="/contribute"
                  className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 bg-accent-600 text-white rounded-xl hover:bg-accent-700 transition-colors font-medium"
                >
                  <Heart className="w-4 h-4" />
                  <span>Share Your Heritage</span>
                </Link>
                
                {/* User Profile */}
                <div className="relative">
                  <button
                    onClick={() => setUserProfileOpen(!userProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-earth-50 transition-colors"
                  >
                    {user?.picture ? (
                      <img 
                        src={user.picture} 
                        alt={user.displayName || 'User'}
                        className="w-8 h-8 rounded-full object-cover border-2 border-earth-200"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-earth-100 to-earth-200 rounded-full flex items-center justify-center border-2 border-earth-200">
                        <User className="w-4 h-4 text-earth-600" />
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4 text-earth-600" />
                  </button>
                  
                  {userProfileOpen && (
                    <UserProfile 
                      isOpen={userProfileOpen} 
                      onClose={() => setUserProfileOpen(false)} 
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/signin"
                  className="px-6 py-2 bg-earth-700 text-white rounded-xl hover:bg-earth-800 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2 border border-earth-700 text-earth-700 rounded-xl hover:bg-earth-700 hover:text-white transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-earth-600 hover:text-earth-800 hover:bg-earth-50 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-earth-100">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <SearchInput
              placeholder="Search cultures, stories..."
              onSearch={(query, filters) => {
                // Handle search
                console.log('Search:', query, filters)
              }}
              className="w-full"
            />
            
            {/* Mobile Navigation */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-earth-600 hover:text-earth-800 hover:bg-earth-50 rounded-xl transition-colors font-medium"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
            
            {/* Mobile User Actions */}
            {isAuthenticated ? (
              <div className="space-y-3 pt-4 border-t border-earth-100">
                <Link
                  href="/contribute"
                  className="flex items-center space-x-3 px-4 py-3 bg-accent-600 text-white rounded-xl font-medium"
                >
                  <Heart className="w-4 h-4" />
                  <span>Share Your Heritage</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center space-x-3 px-4 py-3 text-earth-600 hover:text-earth-800 hover:bg-earth-50 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-earth-600 hover:text-earth-800 hover:bg-earth-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-4 border-t border-earth-100">
                <Link
                  href="/auth/signin"
                  className="block w-full text-center px-6 py-3 bg-earth-700 text-white rounded-xl hover:bg-earth-800 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block w-full text-center px-6 py-3 border border-earth-700 text-earth-700 rounded-xl hover:bg-earth-700 hover:text-white transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
