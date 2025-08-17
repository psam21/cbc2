// Identity and user management for Nostr integration
// Handles NIP-05, NIP-07, NIP-26 delegation, and user profiles

import { NostrEvent, User, Contribution } from '@/types/content'
import { nostrService } from './service'

export interface NostrIdentity {
  npub: string
  pubkey: string
  nip05?: string
  verified: boolean
  displayName?: string
  picture?: string
  about?: string
  banner?: string
  website?: string
  lud16?: string // Lightning address
}

export interface AuthState {
  isAuthenticated: boolean
  user: NostrIdentity | null
  loading: boolean
  error: string | null
}

class IdentityService {
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  }

  private listeners: ((state: AuthState) => void)[] = []

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.authState))
  }

  // Get current auth state
  getAuthState(): AuthState {
    return this.authState
  }

  // Login with NIP-07 extension (nos2x, Alby, etc.)
  async loginWithExtension(): Promise<NostrIdentity | null> {
    this.authState.loading = true
    this.authState.error = null
    this.notifyListeners()

    try {
      // Check if NIP-07 extension is available
      if (!window.nostr) {
        throw new Error('Nostr extension not found. Please install nos2x, Alby, or another NIP-07 compatible extension.')
      }

      // Get public key from extension
      const pubkey = await window.nostr.getPublicKey()
      const npub = this.pubkeyToNpub(pubkey)

      // Fetch user profile (kind 0 event)
      const profile = await this.fetchUserProfile(pubkey)
      
      // Verify NIP-05 if present
      let nip05Verified = false
      if (profile?.nip05) {
        nip05Verified = await this.verifyNIP05(profile.nip05, pubkey)
      }

      const identity: NostrIdentity = {
        npub,
        pubkey,
        nip05: profile?.nip05,
        verified: nip05Verified,
        displayName: profile?.display_name || profile?.name,
        picture: profile?.picture,
        about: profile?.about,
        banner: profile?.banner,
        website: profile?.website,
        lud16: profile?.lud16
      }

      this.authState = {
        isAuthenticated: true,
        user: identity,
        loading: false,
        error: null
      }

      // Store in localStorage for persistence
      localStorage.setItem('nostr_identity', JSON.stringify(identity))
      
      this.notifyListeners()
      return identity

    } catch (error) {
      this.authState = {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      }
      this.notifyListeners()
      return null
    }
  }

  // Logout
  logout() {
    this.authState = {
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    }
    localStorage.removeItem('nostr_identity')
    this.notifyListeners()
  }

  // Restore session from localStorage
  async restoreSession(): Promise<boolean> {
    const stored = localStorage.getItem('nostr_identity')
    if (!stored) return false

    try {
      const identity: NostrIdentity = JSON.parse(stored)
      
      // Verify the session is still valid
      if (window.nostr) {
        const currentPubkey = await window.nostr.getPublicKey()
        if (currentPubkey !== identity.pubkey) {
          this.logout()
          return false
        }
      }

      this.authState = {
        isAuthenticated: true,
        user: identity,
        loading: false,
        error: null
      }
      this.notifyListeners()
      return true

    } catch (error) {
      this.logout()
      return false
    }
  }

  // Fetch user profile from Nostr (kind 0 event)
  private async fetchUserProfile(pubkey: string): Promise<any> {
    try {
      const events = await nostrService.queryEvents({
        kinds: [0],
        authors: [pubkey],
        limit: 1
      })

      if (events.length > 0) {
        return JSON.parse(events[0].content)
      }
      return null
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      return null
    }
  }

  // Verify NIP-05 identity
  private async verifyNIP05(nip05: string, pubkey: string): Promise<boolean> {
    try {
      const [name, domain] = nip05.split('@')
      if (!name || !domain) return false

      const response = await fetch(`https://${domain}/.well-known/nostr.json?name=${name}`)
      const data = await response.json()

      return data.names?.[name] === pubkey
    } catch (error) {
      console.error('NIP-05 verification failed:', error)
      return false
    }
  }

  // Convert pubkey to npub format
  private pubkeyToNpub(pubkey: string): string {
    // This would use a proper bech32 encoding library in production
    return `npub1${pubkey.slice(0, 16)}...`
  }

  // Sign event with NIP-07 extension
  async signEvent(event: Partial<NostrEvent>): Promise<NostrEvent | null> {
    if (!window.nostr || !this.authState.isAuthenticated) {
      throw new Error('Not authenticated or no Nostr extension available')
    }

    try {
      return await window.nostr.signEvent(event)
    } catch (error) {
      console.error('Failed to sign event:', error)
      return null
    }
  }

  // Get user contributions across all content types
  async getUserContributions(pubkey?: string): Promise<Contribution[]> {
    const targetPubkey = pubkey || this.authState.user?.pubkey
    if (!targetPubkey) return []

    try {
      // Query all content types authored by this user
      const events = await nostrService.queryEvents({
        kinds: [1, 23, 30001, 30002, 30003], // Text notes, long-form, cultures, exhibitions, resources
        authors: [targetPubkey],
        limit: 100
      })

      return events.map(event => ({
        id: event.id,
        type: this.getContentTypeFromKind(event.kind),
        title: this.extractTitle(event),
        description: this.extractDescription(event),
        createdAt: new Date(event.created_at * 1000).toISOString(),
        updatedAt: new Date(event.created_at * 1000).toISOString()
      }))

    } catch (error) {
      console.error('Failed to fetch user contributions:', error)
      return []
    }
  }

  // Get user profile for display
  async getUserProfile(pubkey: string): Promise<User | null> {
    try {
      const profile = await this.fetchUserProfile(pubkey)
      const contributions = await this.getUserContributions(pubkey)

      if (!profile) return null

      return {
        id: pubkey,
        npub: this.pubkeyToNpub(pubkey),
        name: profile.name,
        displayName: profile.display_name || profile.name,
        bio: profile.about,
        avatar: profile.picture,
        website: profile.website,
        location: profile.location,
        languages: [], // Would extract from profile or contributions
        expertise: [], // Would extract from contributions/labels
        cultures: [], // Would extract from contributions
        createdAt: new Date().toISOString(), // Would get from first event
        contributions,
        following: [], // Would query contact lists (kind 3)
        followers: [] // Would query who follows this user
      }
    } catch (error) {
      console.error('Failed to get user profile:', error)
      return null
    }
  }

  // Follow/unfollow user (NIP-03 contact lists)
  async followUser(pubkey: string): Promise<boolean> {
    if (!this.authState.isAuthenticated) return false

    try {
      // Get current contact list
      const contactEvents = await nostrService.queryEvents({
        kinds: [3],
        authors: [this.authState.user!.pubkey],
        limit: 1
      })

      const currentContacts = contactEvents.length > 0 
        ? contactEvents[0].tags.filter(tag => tag[0] === 'p').map(tag => tag[1])
        : []

      // Add new contact if not already following
      if (!currentContacts.includes(pubkey)) {
        const newContactList = [
          ...currentContacts.map(pk => ['p', pk]),
          ['p', pubkey]
        ]

        const event = await this.signEvent({
          kind: 3,
          content: '',
          tags: newContactList,
          created_at: Math.floor(Date.now() / 1000)
        })

        if (event) {
          await nostrService.publishEvent(event)
          return true
        }
      }

      return false
    } catch (error) {
      console.error('Failed to follow user:', error)
      return false
    }
  }

  // Check if user is following another user
  async isFollowing(pubkey: string): Promise<boolean> {
    if (!this.authState.isAuthenticated) return false

    try {
      const contactEvents = await nostrService.queryEvents({
        kinds: [3],
        authors: [this.authState.user!.pubkey],
        limit: 1
      })

      if (contactEvents.length > 0) {
        const contacts = contactEvents[0].tags
          .filter(tag => tag[0] === 'p')
          .map(tag => tag[1])
        return contacts.includes(pubkey)
      }

      return false
    } catch (error) {
      console.error('Failed to check following status:', error)
      return false
    }
  }

  private getContentTypeFromKind(kind: number): 'culture' | 'exhibition' | 'resource' | 'story' | 'event' {
    switch (kind) {
      case 30001: return 'culture'
      case 30002: return 'exhibition'  
      case 30003: return 'resource'
      case 23: return 'story'
      default: return 'story'
    }
  }

  private extractTitle(event: NostrEvent): string {
    // Extract title from content or title tag
    const titleTag = event.tags.find(tag => tag[0] === 'title')
    if (titleTag) return titleTag[1]

    // Fallback to first line of content
    const firstLine = event.content.split('\n')[0]
    return firstLine.length > 50 ? firstLine.slice(0, 50) + '...' : firstLine
  }

  private extractDescription(event: NostrEvent): string {
    // Extract summary from content
    return event.content.length > 200 
      ? event.content.slice(0, 200) + '...'
      : event.content
  }
}

// Global instance
export const identityService = new IdentityService()

// Type declarations for NIP-07
declare global {
  interface Window {
    nostr?: {
      getPublicKey(): Promise<string>
      signEvent(event: Partial<NostrEvent>): Promise<NostrEvent>
      getRelays?(): Promise<Record<string, {read: boolean, write: boolean}>>
      nip04?: {
        encrypt(pubkey: string, plaintext: string): Promise<string>
        decrypt(pubkey: string, ciphertext: string): Promise<string>
      }
    }
  }
}
