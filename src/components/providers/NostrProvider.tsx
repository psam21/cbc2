'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { nostrService } from '@/lib/nostr/service'

interface NostrContextType {
  isEnabled: boolean
  isConnected: boolean
  isInitialized: boolean
  connectionStatus: {
    connected: number
    total: number
    relays: any[]
  }
  connect: () => Promise<void>
  disconnect: () => void
  getService: () => typeof nostrService
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
  const [isInitialized, setIsInitialized] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState({
    connected: 0,
    total: 0,
    relays: []
  })

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
      console.log('Initializing Nostr integration...')
      
      // Initialize the Nostr service
      await nostrService.initialize()
      
      // Get connection status
      const status = nostrService.getConnectionStatus()
      setConnectionStatus(status)
      
      setIsInitialized(true)
      setIsConnected(status.connected > 0)
      
      console.log('Nostr integration initialized successfully')
      
      // Set up periodic status updates
      const statusInterval = setInterval(() => {
        const currentStatus = nostrService.getConnectionStatus()
        setConnectionStatus(currentStatus)
        setIsConnected(currentStatus.connected > 0)
      }, 10000) // Update every 10 seconds
      
      // Cleanup interval on unmount
      return () => clearInterval(statusInterval)
    } catch (error) {
      console.error('Failed to initialize Nostr:', error)
      setIsConnected(false)
      setIsInitialized(false)
    }
  }

  const connect = async () => {
    if (!isEnabled) return
    await initializeNostr()
  }

  const disconnect = async () => {
    try {
      await nostrService.cleanup()
      setIsConnected(false)
      setIsInitialized(false)
      setConnectionStatus({ connected: 0, total: 0, relays: [] })
    } catch (error) {
      console.error('Failed to disconnect from Nostr:', error)
    }
  }

  const getService = () => nostrService

  const value: NostrContextType = {
    isEnabled,
    isConnected,
    isInitialized,
    connectionStatus,
    connect,
    disconnect,
    getService
  }

  return (
    <NostrContext.Provider value={value}>
      {children}
    </NostrContext.Provider>
  )
}
