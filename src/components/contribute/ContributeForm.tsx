'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  Headphones, 
  Video,
  AlertCircle,
  Check,
  Globe,
  BookOpen,
  Heart,
  Star,
  Info
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { publishingService, ContentSubmission } from '@/lib/nostr/publishing'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const contentTypes = [
  {
    id: 'culture',
    name: 'Culture',
    description: 'Share information about a cultural community or tradition',
    icon: Globe,
    color: 'blue'
  },
  {
    id: 'exhibition',
    name: 'Exhibition',
    description: 'Curate a collection of cultural artifacts and stories',
    icon: BookOpen,
    color: 'purple'
  },
  {
    id: 'resource',
    name: 'Resource',
    description: 'Upload educational materials, documents, or media',
    icon: FileText,
    color: 'green'
  },
  {
    id: 'story',
    name: 'Elder Story',
    description: 'Share traditional stories and oral histories',
    icon: Heart,
    color: 'red'
  }
]

const categories = {
  culture: ['indigenous', 'traditional', 'contemporary', 'diaspora', 'regional'],
  exhibition: ['art', 'history', 'ceremony', 'craft', 'music', 'dance', 'storytelling'],
  resource: ['education', 'research', 'preservation', 'community', 'art'],
  story: ['personal', 'historical', 'mythological', 'cultural', 'spiritual']
}

interface ContributeFormProps {
  initialType?: string
  initialCulture?: string
  onSuccess?: (eventId: string) => void
  onCancel?: () => void
}

export function ContributeForm({ 
  initialType = 'culture', 
  initialCulture = '',
  onSuccess,
  onCancel 
}: ContributeFormProps) {
  const { isAuthenticated } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [selectedType, setSelectedType] = useState(initialType)
  const [formData, setFormData] = useState<Partial<ContentSubmission>>({
    type: initialType as any,
    title: '',
    description: '',
    content: '',
    culture: initialCulture ? [initialCulture] : [],
    category: '',
    tags: [],
    metadata: {}
  })
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  const [showGuidelines, setShowGuidelines] = useState(true)

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setFormData(prev => ({
      ...prev,
      type: type as any,
      category: '',
      tags: []
    }))
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean)
    handleInputChange('tags', tags)
  }

  const handleCultureChange = (value: string) => {
    const cultures = value.split(',').map(culture => culture.trim()).filter(Boolean)
    handleInputChange('culture', cultures)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    const validFiles = selectedFiles.filter(file => file.size <= 50 * 1024 * 1024) // 50MB limit
    
    if (validFiles.length !== selectedFiles.length) {
      setErrors(['Some files were too large (max 50MB) and were not added'])
    }
    
    setFiles(prev => [...prev, ...validFiles].slice(0, 10)) // Max 10 files
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image
    if (file.type.startsWith('audio/')) return Headphones
    if (file.type.startsWith('video/')) return Video
    return FileText
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!isAuthenticated) {
      setErrors(['You must be signed in to contribute content'])
      return
    }

    setIsSubmitting(true)
    setErrors([])

    try {
      const submission: ContentSubmission = {
        ...formData as ContentSubmission,
        media: files
      }

      // Validate submission
      const validation = publishingService.validateSubmission(submission)
      if (!validation.valid) {
        setErrors(validation.errors)
        return
      }

      // Publish content
      const result = await publishingService.publishContent(submission)
      
      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess?.(result.eventId || '')
        }, 2000)
      } else {
        setErrors([result.error || 'Failed to publish content'])
      }

    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'An unexpected error occurred'])
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Authentication Required</h3>
            <p className="text-sm text-yellow-700 mt-1">
              You must be signed in with your Nostr identity to contribute content.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-lg p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Content Published Successfully!
        </h3>
        <p className="text-green-700">
          Your contribution has been published to the Nostr network and will appear shortly.
        </p>
      </motion.div>
    )
  }

  const guidelines = publishingService.getContentGuidelines(selectedType)

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Content Type Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What would you like to contribute?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contentTypes.map((type) => (
              <motion.button
                key={type.id}
                type="button"
                onClick={() => handleTypeChange(type.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedType === type.id
                    ? `border-${type.color}-500 bg-${type.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-${type.color}-100`}>
                    <type.icon className={`w-5 h-5 text-${type.color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{type.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Guidelines */}
        {showGuidelines && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-blue-900">{guidelines.title}</h4>
                  <button
                    type="button"
                    onClick={() => setShowGuidelines(false)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  {guidelines.guidelines.map((guideline, index) => (
                    <li key={index}>• {guideline}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter a descriptive title"
                maxLength={200}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Provide a detailed description"
                maxLength={2000}
                required
              />
            </div>

            {selectedType === 'story' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Content *
                </label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Write the full story here..."
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories[selectedType as keyof typeof categories]?.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Culture(s)
                </label>
                <input
                  type="text"
                  value={formData.culture?.join(', ') || ''}
                  onChange={(e) => handleCultureChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Māori, Inuit"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., traditional, ceremony, music (comma-separated)"
              />
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Files</h3>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Click to upload or drag and drop files
              </p>
              <p className="text-sm text-gray-500">
                Images, audio, video, documents (max 50MB each, 10 files total)
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Choose Files
              </button>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => {
                  const Icon = getFileIcon(file)
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Please fix the following errors:</h4>
                <ul className="text-sm text-red-700 mt-1 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between pt-6 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-auto"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                Publishing...
              </>
            ) : (
              'Publish Content'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
