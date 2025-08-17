'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface NostrContextType {
  isEnabled: boolean
  isConnected: boolean
  relayPool: any | null
  connect: () => Promise<void>
  disconnect: () => void
}

const NostrContext = createContext<NostrContextType | undefined>(undefined)

export function useNostr() {
  const context = useContext(NostrContext)
  if (context === undefined) {
    throw new Error('useNostr must be used within a NostrProvider')
  }
  return context
}

interface NostrProviderProps {
  children: ReactNode
}

export function NostrProvider({ children }: NostrProviderProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [relayPool, setRelayPool] = useState<any | null>(null)

  useEffect(() => {
    // Check if Nostr is enabled via environment variable
    const nostrEnabled = process.env.NEXT_PUBLIC_NOSTR_ENABLE === 'true'
    setIsEnabled(nostrEnabled)
    
    if (nostrEnabled) {
      initializeNostr()
    }
  }, [])

  const initializeNostr = async () => {
    try {
      // Temporarily disabled for build compatibility
      console.log('Nostr integration temporarily disabled for build compatibility')
      setIsConnected(false)
    } catch (error) {
      console.error('Failed to initialize Nostr:', error)
      setIsConnected(false)
    }
  }

  const connect = async () => {
    if (!isEnabled) return
    await initializeNostr()
  }

  const disconnect = () => {
    setRelayPool(null)
    setIsConnected(false)
  }

  const value: NostrContextType = {
    isEnabled,
    isConnected,
    relayPool,
    connect,
    disconnect,
  }

  return (
    <NostrContext.Provider value={value}>
      {children}
    </NostrContext.Provider>
  )
}
