'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  X, 
  Save, 
  Eye, 
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Tag
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Exhibition, Culture, Resource, ElderStory } from '@/types/content'
import { SearchInput } from '@/components/ui/SearchInput'

interface ExhibitionCuratorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (exhibition: Partial<Exhibition>) => void
}

// Mock content items that can be curated into exhibitions
const mockContentItems = [
  {
    id: 'content1',
    type: 'culture',
    title: 'Traditional Aboriginal Dreamtime Stories',
    description: 'Collection of traditional Dreamtime stories from various Aboriginal communities',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'content2',
    type: 'exhibition',
    title: 'Māori Weaving Techniques',
    description: 'Documentation of traditional Māori weaving methods and patterns',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'content3',
    type: 'resource',
    title: 'Pacific Island Dance Traditions',
    description: 'Video documentation of traditional Pacific Island dance performances',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'content4',
    type: 'story',
    title: 'Indigenous Language Preservation',
    description: 'Stories about efforts to preserve endangered indigenous languages',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
]

export default function ExhibitionCurator({ isOpen, onClose, onSave }: ExhibitionCuratorProps) {
  const { isAuthenticated, user } = useAuth()
  const [step, setStep] = useState<'details' | 'content' | 'preview'>('details')
  const [exhibition, setExhibition] = useState<Partial<Exhibition>>({
    title: '',
    description: '',
    shortDescription: '',
    culture: '',
    category: 'art',
    region: '',
    tags: [],
    startDate: '',
    endDate: '',
    location: '',
    artifacts: []
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContent, setSelectedContent] = useState<any[]>([])
  const [filteredContent, setFilteredContent] = useState<any[]>(mockContentItems)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setStep('details')
      setExhibition({
        title: '',
        description: '',
        shortDescription: '',
        culture: '',
        category: 'art',
        region: '',
        tags: [],
        startDate: '',
        endDate: '',
        location: '',
        artifacts: []
      })
      setSelectedContent([])
      setSearchQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    const filtered = mockContentItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredContent(filtered)
  }, [searchQuery])

  const handleAddContent = (content: any) => {
    if (!selectedContent.find(item => item.id === content.id)) {
      setSelectedContent([...selectedContent, content])
    }
  }

  const handleRemoveContent = (contentId: string) => {
    setSelectedContent(selectedContent.filter(item => item.id !== contentId))
  }

  const handleMoveContent = (contentId: string, direction: 'up' | 'down') => {
    const index = selectedContent.findIndex(item => item.id === contentId)
    if (index === -1) return

    const newContent = [...selectedContent]
    if (direction === 'up' && index > 0) {
      [newContent[index], newContent[index - 1]] = [newContent[index - 1], newContent[index]]
    } else if (direction === 'down' && index < newContent.length - 1) {
      [newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]]
    }
    setSelectedContent(newContent)
  }

  const handleSave = async () => {
    if (!isAuthenticated) return

    setLoading(true)
    try {
      // Convert selected content to artifacts
      const artifacts = selectedContent.map((content, index) => ({
        id: `artifact-${index}`,
        name: content.title,
        description: content.description,
        type: (content.type === 'story' ? 'document' : content.type === 'exhibition' ? 'image' : 'video') as 'image' | 'audio' | 'video' | 'document' | '3d-model',
        mediaUrl: '/api/placeholder/600/400',
        thumbnailUrl: '/api/placeholder/200/150',
        metadata: {
          width: 600,
          height: 400,
          mimeType: 'image/jpeg',
          checksum: `checksum-${index}`
        },
        tags: content.type === 'culture' ? ['cultural', 'traditional'] : [content.type]
      }))

      const finalExhibition = {
        ...exhibition,
        artifacts,
        author: user?.pubkey || 'unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await onSave(finalExhibition)
      onClose()
    } catch (error) {
      console.error('Failed to save exhibition:', error)
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    if (step === 'details') {
      return exhibition.title && exhibition.description && exhibition.culture
    }
    if (step === 'content') {
      return selectedContent.length > 0
    }
    return true
  }

  const nextStep = () => {
    if (step === 'details') setStep('content')
    else if (step === 'content') setStep('preview')
  }

  const prevStep = () => {
    if (step === 'content') setStep('details')
    else if (step === 'preview') setStep('content')
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
            <h2 className="text-xl font-semibold text-gray-900">Curate Exhibition</h2>
            <p className="text-sm text-gray-600 mt-1">
              Create a community-curated exhibition from existing cultural content
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="border-b">
          <div className="flex">
            <div className={`flex-1 px-6 py-4 text-center ${
              step === 'details' ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'
            }`}>
              <div className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm flex items-center justify-center">
                  1
                </span>
                Exhibition Details
              </div>
            </div>
            <div className={`flex-1 px-6 py-4 text-center ${
              step === 'content' ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'
            }`}>
              <div className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm flex items-center justify-center">
                  2
                </span>
                Select Content
              </div>
            </div>
            <div className={`flex-1 px-6 py-4 text-center ${
              step === 'preview' ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'
            }`}>
              <div className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm flex items-center justify-center">
                  3
                </span>
                Preview & Publish
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 'details' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Exhibition Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exhibition Title *
                  </label>
                  <input
                    type="text"
                    value={exhibition.title}
                    onChange={(e) => setExhibition(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter exhibition title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Culture *
                  </label>
                  <input
                    type="text"
                    value={exhibition.culture}
                    onChange={(e) => setExhibition(prev => ({ ...prev, culture: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Aboriginal Australian"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={exhibition.category}
                    onChange={(e) => setExhibition(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="art">Art & Visual Culture</option>
                    <option value="history">Historical Heritage</option>
                    <option value="ceremony">Ceremonies & Rituals</option>
                    <option value="craft">Traditional Crafts</option>
                    <option value="music">Music & Performance</option>
                    <option value="dance">Dance & Movement</option>
                    <option value="storytelling">Oral Traditions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    value={exhibition.region}
                    onChange={(e) => setExhibition(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Australia, Oceania"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={exhibition.startDate}
                    onChange={(e) => setExhibition(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={exhibition.endDate}
                    onChange={(e) => setExhibition(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={exhibition.location}
                    onChange={(e) => setExhibition(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Virtual Exhibition, Museum Name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    value={exhibition.shortDescription}
                    onChange={(e) => setExhibition(prev => ({ ...prev, shortDescription: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief description for exhibition cards"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description *
                  </label>
                  <textarea
                    value={exhibition.description}
                    onChange={(e) => setExhibition(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Detailed description of the exhibition..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={exhibition.tags?.join(', ') || ''}
                    onChange={(e) => setExhibition(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 'content' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Select Content for Exhibition</h3>
              
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <SearchInput
                    placeholder="Search artifacts by name, description, or tags..."
                    onSearch={(query, filters) => {
                      setSearchQuery(query)
                      // Handle filters if needed
                    }}
                    className="w-full"
                  />
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">All Types</option>
                  <option value="culture">Cultural Content</option>
                  <option value="story">Stories</option>
                  <option value="resource">Resources</option>
                  <option value="exhibition">Exhibitions</option>
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Content */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Available Content</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredContent.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 hover:border-purple-300 transition-colors cursor-pointer"
                        onClick={() => handleAddContent(item)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            {item.type === 'culture' && <ImageIcon className="w-5 h-5 text-purple-600" />}
                            {item.type === 'story' && <FileText className="w-5 h-5 text-purple-600" />}
                            {item.type === 'resource' && <Video className="w-5 h-5 text-purple-600" />}
                            {item.type === 'exhibition' && <ImageIcon className="w-5 h-5 text-purple-600" />}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 mb-1">{item.title}</h5>
                            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {item.type}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Plus className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Content */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">
                    Selected Content ({selectedContent.length})
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedContent.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No content selected</p>
                        <p className="text-sm mt-2">Click on content items to add them</p>
                      </div>
                    ) : (
                      selectedContent.map((item, index) => (
                        <div
                          key={item.id}
                          className="border rounded-lg p-4 bg-purple-50 border-purple-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 mb-1">{item.title}</h5>
                              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleMoveContent(item.id, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleMoveContent(item.id, 'down')}
                                disabled={index === selectedContent.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRemoveContent(item.id)}
                                className="p-1 text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Preview Exhibition</h3>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">{exhibition.title}</h4>
                <p className="text-gray-700 mb-4">{exhibition.shortDescription}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div><strong>Culture:</strong> {exhibition.culture}</div>
                  <div><strong>Category:</strong> {exhibition.category}</div>
                  <div><strong>Region:</strong> {exhibition.region}</div>
                  <div><strong>Location:</strong> {exhibition.location}</div>
                </div>

                <div className="mb-4">
                  <strong>Tags:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exhibition.tags?.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <strong>Content Items ({selectedContent.length}):</strong>
                  <div className="mt-2 space-y-2">
                    {selectedContent.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm">
                        <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <span>{item.title}</span>
                        <span className="text-gray-500">({item.type})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <strong>Description:</strong>
                  <p className="mt-2">{exhibition.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              {step !== 'details' && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              {step !== 'preview' ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={loading || !canProceed()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Publish Exhibition
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
