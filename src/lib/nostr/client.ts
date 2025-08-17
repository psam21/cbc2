import { NostrEvent, NIP01Event, NIP23Event, NIP33Event, NIP51Event, NIP94Event, NIP25Event, NIP68Event } from '@/types/content'

// Relay configuration
const RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://relay.nostr.band',
  'wss://relay.current.fyi'
]

interface RelayConnection {
  url: string
  status: 'connecting' | 'connected' | 'failed' | 'disconnected'
  lastSeen: number
  latency: number
}

interface QueryOptions {
  limit?: number
  since?: number
  until?: number
  authors?: string[]
  kinds?: number[]
  tags?: string[][]
  timeout?: number
}

class NostrClient {
  private relays: Map<string, RelayConnection> = new Map()
  private eventCache: Map<string, { event: NostrEvent; timestamp: number }> = new Map()
  private queryCache: Map<string, { events: NostrEvent[]; timestamp: number }> = new Map()
  private websockets: Map<string, WebSocket> = new Map()
  private eventListeners: Map<string, Set<(event: NostrEvent) => void>> = new Map()
  private isInitialized = false

  constructor() {
    this.initializeRelays()
  }

  private async initializeRelays() {
    if (this.isInitialized) return
    
    console.log('Initializing Nostr relays...')
    
    for (const relayUrl of RELAYS) {
      this.relays.set(relayUrl, {
        url: relayUrl,
        status: 'connecting',
        lastSeen: 0,
        latency: 0
      })
      
      try {
        await this.connectToRelay(relayUrl)
      } catch (error) {
        console.error(`Failed to connect to ${relayUrl}:`, error)
        this.relays.get(relayUrl)!.status = 'failed'
      }
    }
    
    this.isInitialized = true
  }

  private async connectToRelay(relayUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(relayUrl)
      
      ws.onopen = () => {
        console.log(`Connected to relay: ${relayUrl}`)
        this.relays.get(relayUrl)!.status = 'connected'
        this.relays.get(relayUrl)!.lastSeen = Date.now()
        this.websockets.set(relayUrl, ws)
        resolve()
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleRelayMessage(relayUrl, data)
        } catch (error) {
          console.error('Failed to parse relay message:', error)
        }
      }
      
      ws.onerror = (error) => {
        console.error(`WebSocket error for ${relayUrl}:`, error)
        this.relays.get(relayUrl)!.status = 'failed'
        reject(error)
      }
      
      ws.onclose = () => {
        console.log(`Disconnected from relay: ${relayUrl}`)
        this.relays.get(relayUrl)!.status = 'disconnected'
        this.websockets.delete(relayUrl)
      }
      
      // Set timeout
      setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close()
          reject(new Error(`Connection timeout for ${relayUrl}`))
        }
      }, 10000)
    })
  }

  private handleRelayMessage(relayUrl: string, data: any) {
    if (Array.isArray(data) && data.length >= 3) {
      const [type, subscriptionId, eventData] = data
      
      if (type === 'EVENT' && eventData) {
        const event = eventData as NostrEvent
        this.cacheEvent(event)
        this.notifyEventListeners(event)
      }
    }
  }

  private cacheEvent(event: NostrEvent) {
    this.eventCache.set(event.id, {
      event,
      timestamp: Date.now()
    })
    
    // Clean up old cache entries (older than 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    Array.from(this.eventCache.entries()).forEach(([id, entry]) => {
      if (entry.timestamp < fiveMinutesAgo) {
        this.eventCache.delete(id)
      }
    })
  }

  private notifyEventListeners(event: NostrEvent) {
    // Notify general event listeners
    const generalListeners = this.eventListeners.get('*')
    if (generalListeners) {
      generalListeners.forEach(listener => listener(event))
    }
    
    // Notify specific event type listeners
    const typeListeners = this.eventListeners.get(`kind:${event.kind}`)
    if (typeListeners) {
      typeListeners.forEach(listener => listener(event))
    }
  }

  public async queryEvents(options: QueryOptions = {}): Promise<NostrEvent[]> {
    const cacheKey = this.generateCacheKey(options)
    const cached = this.queryCache.get(cacheKey)
    
    // Return cached results if they're less than 5 minutes old
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.events
    }
    
    const events = await this.queryRelays(options)
    
    // Cache the results
    this.queryCache.set(cacheKey, {
      events,
      timestamp: Date.now()
    })
    
    return events
  }

  private async queryRelays(options: QueryOptions): Promise<NostrEvent[]> {
    const connectedRelays = Array.from(this.websockets.keys())
    if (connectedRelays.length === 0) {
      throw new Error('No relays connected')
    }
    
    const subscriptionId = this.generateSubscriptionId()
    const filter = this.buildFilter(options)
    
    const promises = connectedRelays.map(async (relayUrl) => {
      try {
        return await this.queryRelay(relayUrl, subscriptionId, filter, options.timeout || 5000)
      } catch (error) {
        console.error(`Query failed for ${relayUrl}:`, error)
        return []
      }
    })
    
    const results = await Promise.allSettled(promises)
    const allEvents: NostrEvent[] = []
    
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allEvents.push(...result.value)
      }
    }
    
    // Remove duplicates and sort by creation time
    const uniqueEvents = this.deduplicateEvents(allEvents)
    return uniqueEvents.sort((a, b) => b.created_at - a.created_at)
  }

  private async queryRelay(relayUrl: string, subscriptionId: string, filter: any, timeout: number): Promise<NostrEvent[]> {
    return new Promise((resolve, reject) => {
      const ws = this.websockets.get(relayUrl)
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        reject(new Error(`Relay ${relayUrl} not connected`))
        return
      }
      
      const events: NostrEvent[] = []
      const timeoutId = setTimeout(() => {
        resolve(events)
      }, timeout)
      
      const messageHandler = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data)
          if (Array.isArray(data) && data.length >= 3) {
            const [type, subId, eventData] = data
            
            if (subId === subscriptionId && type === 'EVENT' && eventData) {
              events.push(eventData as NostrEvent)
            } else if (subId === subscriptionId && type === 'EOSE') {
              clearTimeout(timeoutId)
              ws.removeEventListener('message', messageHandler)
              resolve(events)
            }
          }
        } catch (error) {
          console.error('Failed to parse relay message:', error)
        }
      }
      
      ws.addEventListener('message', messageHandler)
      
      // Send subscription request
      const request = ['REQ', subscriptionId, filter]
      ws.send(JSON.stringify(request))
    })
  }

  private buildFilter(options: QueryOptions): any {
    const filter: any = {}
    
    if (options.limit) filter.limit = options.limit
    if (options.since) filter.since = options.since
    if (options.until) filter.until = options.until
    if (options.authors && options.authors.length > 0) filter.authors = options.authors
    if (options.kinds && options.kinds.length > 0) filter.kinds = options.kinds
    if (options.tags && options.tags.length > 0) {
      for (const [key, value] of options.tags) {
        if (!filter[`#${key}`]) filter[`#${key}`] = []
        filter[`#${key}`].push(value)
      }
    }
    
    return filter
  }

  private generateCacheKey(options: QueryOptions): string {
    return JSON.stringify(options)
  }

  private generateSubscriptionId(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  private deduplicateEvents(events: NostrEvent[]): NostrEvent[] {
    const seen = new Set<string>()
    return events.filter(event => {
      if (seen.has(event.id)) return false
      seen.add(event.id)
      return true
    })
  }

  public addEventListener(eventType: string, listener: (event: NostrEvent) => void) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set())
    }
    this.eventListeners.get(eventType)!.add(listener)
  }

  public removeEventListener(eventType: string, listener: (event: NostrEvent) => void) {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      listeners.delete(listener)
    }
  }

  public getConnectionStatus(): { connected: number; total: number; relays: RelayConnection[] } {
    const connected = Array.from(this.relays.values()).filter(r => r.status === 'connected').length
    const total = this.relays.size
    return {
      connected,
      total,
      relays: Array.from(this.relays.values())
    }
  }

  public async disconnect() {
    Array.from(this.websockets.entries()).forEach(([relayUrl, ws]) => {
      ws.close()
    })
    this.websockets.clear()
    this.relays.clear()
    this.isInitialized = false
  }
}

// Export singleton instance
export const nostrClient = new NostrClient()
export default nostrClient
