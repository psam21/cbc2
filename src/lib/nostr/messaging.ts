// Messaging system for community interactions
// Handles NIP-04 encrypted DMs, NIP-10 threaded comments, and notifications

import { NostrEvent } from '@/types/content'
import { identityService } from './identity'
import { nostrService } from './service'
import { nostrClient } from './client'

export interface Message {
  id: string
  from: string
  to: string
  content: string
  encrypted: boolean
  timestamp: number
  read: boolean
  replyTo?: string
}

export interface Comment {
  id: string
  author: string
  content: string
  timestamp: number
  replyTo?: string
  replies: Comment[]
  eventId: string // The content being commented on
  reactions: Record<string, number>
}

export interface Notification {
  id: string
  type: 'mention' | 'reply' | 'reaction' | 'follow' | 'message'
  from: string
  content: string
  timestamp: number
  read: boolean
  relatedEventId?: string
}

class MessagingService {
  private messageCache = new Map<string, Message[]>()
  private commentCache = new Map<string, Comment[]>()
  private notifications: Notification[] = []
  
  // Send encrypted direct message (NIP-04)
  async sendDirectMessage(to: string, content: string): Promise<boolean> {
    try {
      if (!identityService.getAuthState().isAuthenticated) {
        throw new Error('Must be authenticated to send messages')
      }

      // Encrypt the message content
      if (!window.nostr?.nip04) {
        throw new Error('NIP-04 encryption not supported by this extension')
      }

      const encryptedContent = await window.nostr.nip04.encrypt(to, content)
      
      const messageEvent = {
        kind: 4, // NIP-04 encrypted direct message
        content: encryptedContent,
        tags: [['p', to]],
        created_at: Math.floor(Date.now() / 1000)
      }

      const signedEvent = await identityService.signEvent(messageEvent)
      if (!signedEvent) {
        throw new Error('Failed to sign message')
      }

      // TODO: Implement actual event publishing
      const published = true // await nostrService.publishEvent(signedEvent)
      console.log('Publishing message event:', signedEvent)
      
      if (published) {
        // Add to local cache
        const message: Message = {
          id: signedEvent.id,
          from: signedEvent.pubkey,
          to,
          content,
          encrypted: true,
          timestamp: signedEvent.created_at,
          read: false
        }
        
        this.addToMessageCache(to, message)
        return true
      }

      return false
    } catch (error) {
      console.error('Failed to send direct message:', error)
      return false
    }
  }

  // Get conversation with a user
  async getConversation(withPubkey: string): Promise<Message[]> {
    const cached = this.messageCache.get(withPubkey)
    if (cached) return cached

    try {
      const userPubkey = identityService.getAuthState().user?.pubkey
      if (!userPubkey) return []

      // Query messages between users
      const events = await nostrClient.queryEvents({
        kinds: [4],
        authors: [userPubkey, withPubkey],
        tags: [['p', userPubkey], ['p', withPubkey]],
        limit: 100
      })

      const messages: Message[] = []

      for (const event of events) {
        try {
          let content = event.content
          let encrypted = true

          // Decrypt if it's an encrypted message
          if (window.nostr?.nip04) {
            const otherPubkey = event.pubkey === userPubkey ? withPubkey : event.pubkey
            content = await window.nostr.nip04.decrypt(otherPubkey, event.content)
          }

          const message: Message = {
            id: event.id,
            from: event.pubkey,
            to: event.tags.find(tag => tag[0] === 'p')?.[1] || '',
            content,
            encrypted,
            timestamp: event.created_at,
            read: true // Assume read for now
          }

          messages.push(message)
        } catch (error) {
          console.error('Failed to decrypt message:', error)
          // Skip messages that can't be decrypted
        }
      }

      // Sort by timestamp
      messages.sort((a, b) => a.timestamp - b.timestamp)
      
      this.messageCache.set(withPubkey, messages)
      return messages

    } catch (error) {
      console.error('Failed to load conversation:', error)
      return []
    }
  }

  // Add comment to content (NIP-10)
  async addComment(eventId: string, content: string, replyTo?: string): Promise<boolean> {
    try {
      if (!identityService.getAuthState().isAuthenticated) {
        throw new Error('Must be authenticated to comment')
      }

      const tags = [
        ['e', eventId, '', 'root']
      ]

      if (replyTo) {
        tags.push(['e', replyTo, '', 'reply'])
      }

      const commentEvent = {
        kind: 1, // Text note
        content,
        tags,
        created_at: Math.floor(Date.now() / 1000)
      }

      const signedEvent = await identityService.signEvent(commentEvent)
      if (!signedEvent) {
        throw new Error('Failed to sign comment')
      }

      // TODO: Implement actual event publishing
      const published = true // await nostrService.publishEvent(signedEvent)
      console.log('Publishing message event:', signedEvent)
      
      if (published) {
        // Add to local cache
        const comment: Comment = {
          id: signedEvent.id,
          author: signedEvent.pubkey,
          content,
          timestamp: signedEvent.created_at,
          replyTo,
          replies: [],
          eventId,
          reactions: {}
        }
        
        this.addToCommentCache(eventId, comment)
        return true
      }

      return false
    } catch (error) {
      console.error('Failed to add comment:', error)
      return false
    }
  }

  // Get comments for content
  async getComments(eventId: string): Promise<Comment[]> {
    const cached = this.commentCache.get(eventId)
    if (cached) return cached

    try {
      // Query comments referencing this event
      const events = await nostrClient.queryEvents({
        kinds: [1],
        tags: [['e', eventId]],
        limit: 100
      })

      const comments: Comment[] = []
      const commentMap = new Map<string, Comment>()

      // First pass: create all comments
      for (const event of events) {
        const comment: Comment = {
          id: event.id,
          author: event.pubkey,
          content: event.content,
          timestamp: event.created_at,
          replyTo: this.extractReplyTo(event),
          replies: [],
          eventId,
          reactions: {}
        }

        comments.push(comment)
        commentMap.set(event.id, comment)
      }

      // Second pass: build reply threads
      const rootComments: Comment[] = []
      
      for (const comment of comments) {
        if (comment.replyTo && commentMap.has(comment.replyTo)) {
          // This is a reply to another comment
          const parentComment = commentMap.get(comment.replyTo)!
          parentComment.replies.push(comment)
        } else {
          // This is a root comment
          rootComments.push(comment)
        }
      }

      // Sort root comments by timestamp
      rootComments.sort((a, b) => a.timestamp - b.timestamp)

      // Sort replies within each thread
      const sortReplies = (comment: Comment) => {
        comment.replies.sort((a, b) => a.timestamp - b.timestamp)
        comment.replies.forEach(sortReplies)
      }
      
      rootComments.forEach(sortReplies)

      this.commentCache.set(eventId, rootComments)
      return rootComments

    } catch (error) {
      console.error('Failed to load comments:', error)
      return []
    }
  }

  // React to content or comment (NIP-25)
  async addReaction(eventId: string, reaction: string): Promise<boolean> {
    try {
      if (!identityService.getAuthState().isAuthenticated) {
        throw new Error('Must be authenticated to react')
      }

      const reactionEvent = {
        kind: 7, // NIP-25 reaction
        content: reaction,
        tags: [
          ['e', eventId],
          ['k', '1'] // Reacting to kind 1 events
        ],
        created_at: Math.floor(Date.now() / 1000)
      }

      const signedEvent = await identityService.signEvent(reactionEvent)
      if (!signedEvent) {
        throw new Error('Failed to sign reaction')
      }

      // TODO: Implement actual event publishing
      console.log('Publishing reaction event:', signedEvent)
      return true // await nostrService.publishEvent(signedEvent)

    } catch (error) {
      console.error('Failed to add reaction:', error)
      return false
    }
  }

  // Get notifications for current user
  async getNotifications(): Promise<Notification[]> {
    const userPubkey = identityService.getAuthState().user?.pubkey
    if (!userPubkey) return []

    try {
      // Query mentions and replies
      const mentionEvents = await nostrClient.queryEvents({
        kinds: [1],
        tags: [['p', userPubkey]],
        limit: 50
      })

      const notifications: Notification[] = []

      for (const event of mentionEvents) {
        // Skip own events
        if (event.pubkey === userPubkey) continue

        const notification: Notification = {
          id: event.id,
          type: event.tags.some(tag => tag[0] === 'e') ? 'reply' : 'mention',
          from: event.pubkey,
          content: event.content.slice(0, 100),
          timestamp: event.created_at,
          read: false,
          relatedEventId: event.tags.find(tag => tag[0] === 'e')?.[1]
        }

        notifications.push(notification)
      }

      // Sort by timestamp (newest first)
      notifications.sort((a, b) => b.timestamp - a.timestamp)

      this.notifications = notifications
      return notifications

    } catch (error) {
      console.error('Failed to load notifications:', error)
      return []
    }
  }

  // Mark notification as read
  markNotificationRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  }

  // Private helper methods
  private addToMessageCache(withPubkey: string, message: Message) {
    const existing = this.messageCache.get(withPubkey) || []
    existing.push(message)
    existing.sort((a, b) => a.timestamp - b.timestamp)
    this.messageCache.set(withPubkey, existing)
  }

  private addToCommentCache(eventId: string, comment: Comment) {
    const existing = this.commentCache.get(eventId) || []
    existing.push(comment)
    existing.sort((a, b) => a.timestamp - b.timestamp)
    this.commentCache.set(eventId, existing)
  }

  private extractReplyTo(event: NostrEvent): string | undefined {
    const eTags = event.tags.filter(tag => tag[0] === 'e')
    
    // Look for reply marker
    const replyTag = eTags.find(tag => tag[3] === 'reply')
    if (replyTag) return replyTag[1]

    // If no reply marker, last e tag is usually the reply
    if (eTags.length > 1) {
      return eTags[eTags.length - 1][1]
    }

    return undefined
  }

  // Clear caches
  clearCache() {
    this.messageCache.clear()
    this.commentCache.clear()
    this.notifications = []
  }
}

// Global instance
export const messagingService = new MessagingService()
