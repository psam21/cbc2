'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Vote, 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  BarChart3,
  FileText,
  Lightbulb,
  X
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'

interface GovernanceProposal {
  id: string
  title: string
  description: string
  category: 'content-policy' | 'funding' | 'platform-features' | 'community-guidelines'
  status: 'active' | 'passed' | 'rejected' | 'expired'
  startDate: string
  endDate: string
  totalVotes: number
  yesVotes: number
  noVotes: number
  abstainVotes: number
  quorum: number
  createdBy: string
  createdAt: string
}

interface CommunityGovernanceProps {
  isOpen: boolean
  onClose: () => void
}

export default function CommunityGovernance({ isOpen, onClose }: CommunityGovernanceProps) {
  const { isAuthenticated, user } = useAuth()
  const [proposals, setProposals] = useState<GovernanceProposal[]>([])
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')
  const [loading, setLoading] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<GovernanceProposal | null>(null)

  // Mock data - in production this would come from Nostr
  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      // Simulate loading
      setTimeout(() => {
        setProposals([
          {
            id: 'prop1',
            title: 'Content Sensitivity Guidelines Update',
            description: 'Proposal to update our content sensitivity guidelines to better protect sacred cultural knowledge while maintaining accessibility for educational purposes.',
            category: 'content-policy',
            status: 'active',
            startDate: '2025-01-15T00:00:00Z',
            endDate: '2025-01-25T00:00:00Z',
            totalVotes: 45,
            yesVotes: 32,
            noVotes: 8,
            abstainVotes: 5,
            quorum: 50,
            createdBy: 'pub1',
            createdAt: '2025-01-10T00:00:00Z'
          },
          {
            id: 'prop2',
            title: 'Community Funding for Elder Story Collection',
            description: 'Allocate community funds to support the collection and preservation of elder stories from endangered language communities.',
            category: 'funding',
            status: 'active',
            startDate: '2025-01-20T00:00:00Z',
            endDate: '2025-01-30T00:00:00Z',
            totalVotes: 28,
            yesVotes: 25,
            noVotes: 2,
            abstainVotes: 1,
            quorum: 50,
            createdBy: 'pub2',
            createdAt: '2025-01-15T00:00:00Z'
          },
          {
            id: 'prop3',
            title: 'Enhanced Language Learning Features',
            description: 'Proposal to add gamified language learning features and progress tracking to improve user engagement with language preservation.',
            category: 'platform-features',
            status: 'passed',
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-01-10T00:00:00Z',
            totalVotes: 67,
            yesVotes: 58,
            noVotes: 6,
            abstainVotes: 3,
            quorum: 50,
            createdBy: 'pub3',
            createdAt: '2024-12-25T00:00:00Z'
          }
        ])
        setLoading(false)
      }, 1000)
    }
  }, [isOpen])

  const handleVote = async (proposalId: string, vote: 'yes' | 'no' | 'abstain') => {
    if (!isAuthenticated) return

    try {
      // In production, this would update Nostr and send notifications
      setProposals(prev => prev.map(prop => {
        if (prop.id === proposalId) {
          const newTotalVotes = prop.totalVotes + 1
          const newYesVotes = vote === 'yes' ? prop.yesVotes + 1 : prop.yesVotes
          const newNoVotes = vote === 'no' ? prop.noVotes + 1 : prop.noVotes
          const newAbstainVotes = vote === 'abstain' ? prop.abstainVotes + 1 : prop.abstainVotes
          
          return {
            ...prop,
            totalVotes: newTotalVotes,
            yesVotes: newYesVotes,
            noVotes: newNoVotes,
            abstainVotes: newAbstainVotes
          }
        }
        return prop
      }))
    } catch (error) {
      console.error('Failed to submit vote:', error)
    }
  }

  const activeProposals = proposals.filter(prop => prop.status === 'active')
  const completedProposals = proposals.filter(prop => prop.status !== 'active')

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'content-policy': return <FileText className="w-4 h-4" />
      case 'funding': return <TrendingUp className="w-4 h-4" />
      case 'platform-features': return <Lightbulb className="w-4 h-4" />
      case 'community-guidelines': return <Users className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'content-policy': return 'bg-blue-100 text-blue-800'
      case 'funding': return 'bg-green-100 text-green-800'
      case 'platform-features': return 'bg-purple-100 text-purple-800'
      case 'community-guidelines': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'passed': return 'bg-blue-100 text-blue-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Community Governance</h2>
            <p className="text-sm text-gray-600 mt-1">
              Participate in platform decisions and shape the future of cultural preservation
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'active'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Vote className="w-4 h-4" />
              Active Proposals ({activeProposals.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Completed ({completedProposals.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading governance proposals...</p>
            </div>
          ) : activeTab === 'active' ? (
            <div className="space-y-4">
              {activeProposals.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Vote className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active proposals</p>
                  <p className="text-sm mt-2">New proposals will appear here</p>
                </div>
              ) : (
                activeProposals.map((proposal) => (
                  <div key={proposal.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(proposal.category)}`}>
                          {getCategoryIcon(proposal.category)}
                          {proposal.category.replace('-', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </span>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Ends {new Date(proposal.endDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs mt-1">
                          {Math.ceil((new Date(proposal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {proposal.title}
                    </h3>
                    
                    <p className="text-gray-700 mb-4">
                      {proposal.description}
                    </p>

                    {/* Voting Progress */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Voting Progress</span>
                        <span className="text-sm text-gray-600">
                          {proposal.totalVotes} votes • {proposal.totalVotes >= proposal.quorum ? 'Quorum reached' : `${proposal.quorum - proposal.totalVotes} more needed`}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Yes</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${(proposal.yesVotes / Math.max(proposal.totalVotes, 1)) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{proposal.yesVotes}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">No</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full" 
                                style={{ width: `${(proposal.noVotes / Math.max(proposal.totalVotes, 1)) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{proposal.noVotes}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Abstain</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gray-400 h-2 rounded-full" 
                                style={{ width: `${(proposal.abstainVotes / Math.max(proposal.totalVotes, 1)) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{proposal.abstainVotes}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Voting Actions */}
                    {isAuthenticated ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleVote(proposal.id, 'yes')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Vote Yes
                        </button>
                        <button
                          onClick={() => handleVote(proposal.id, 'no')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Vote No
                        </button>
                        <button
                          onClick={() => handleVote(proposal.id, 'abstain')}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                          Abstain
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          Sign in to participate in community governance
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {completedProposals.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No completed proposals</p>
                  <p className="text-sm mt-2">Completed proposals will appear here</p>
                </div>
              ) : (
                completedProposals.map((proposal) => (
                  <div key={proposal.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(proposal.category)}`}>
                          {getCategoryIcon(proposal.category)}
                          {proposal.category.replace('-', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </span>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Ended {new Date(proposal.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {proposal.title}
                    </h3>
                    
                    <p className="text-gray-700 mb-4">
                      {proposal.description}
                    </p>

                    {/* Final Results */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Final Results</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">{proposal.yesVotes}</div>
                          <div className="text-sm text-gray-600">Yes Votes</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-600">{proposal.noVotes}</div>
                          <div className="text-sm text-gray-600">No Votes</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-600">{proposal.abstainVotes}</div>
                          <div className="text-sm text-gray-600">Abstain</div>
                        </div>
                      </div>
                      <div className="text-center mt-3">
                        <span className="text-sm text-gray-600">
                          Total: {proposal.totalVotes} votes • 
                          {proposal.yesVotes > proposal.noVotes ? ' PASSED' : ' REJECTED'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {proposals.length} total proposals
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
