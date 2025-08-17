'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { identityService, AuthState, NostrIdentity } from '@/lib/nostr/identity'

interface AuthContextType extends AuthState {
  login: () => Promise<NostrIdentity | null>
  logout: () => void
  followUser: (pubkey: string) => Promise<boolean>
  isFollowing: (pubkey: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(identityService.getAuthState())

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = identityService.subscribe(setAuthState)

    // Try to restore session on mount
    identityService.restoreSession()

    return unsubscribe
  }, [])

  const login = async () => {
    return await identityService.loginWithExtension()
  }

  const logout = () => {
    identityService.logout()
  }

  const followUser = async (pubkey: string) => {
    return await identityService.followUser(pubkey)
  }

  const isFollowing = async (pubkey: string) => {
    return await identityService.isFollowing(pubkey)
  }

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    followUser,
    isFollowing
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
