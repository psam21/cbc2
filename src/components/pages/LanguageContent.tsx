'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Volume2, 
  BookOpen, 
  Users, 
  Star,
  Clock,
  Globe,
  Headphones,
  Award,
  TrendingUp,
  MessageCircle
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface LanguageCourse {
  id: string
  name: string
  culture: string
  level: 'beginner' | 'intermediate' | 'advanced'
  description: string
  imageUrl: string
  lessonsCount: number
  studentsCount: number
  duration: string
  featured: boolean
  progress?: number
}

interface LearningModule {
  id: string
  title: string
  type: 'vocabulary' | 'pronunciation' | 'culture' | 'conversation'
  duration: number
  completed: boolean
  locked: boolean
}

// Mock language courses data for E9 implementation
const mockCourses: LanguageCourse[] = [
  {
    id: '1',
    name: 'Te Reo Māori Basics',
    culture: 'Māori',
    level: 'beginner',
    description: 'Learn the fundamentals of Te Reo Māori, the indigenous language of New Zealand. Discover basic vocabulary, pronunciation, and cultural context.',
    imageUrl: '/api/placeholder/300/200',
    lessonsCount: 24,
    studentsCount: 1247,
    duration: '6 weeks',
    featured: true,
    progress: 65
  },
  {
    id: '2',
    name: 'Warlpiri Language & Culture',
    culture: 'Aboriginal Australian',
    level: 'beginner',
    description: 'Explore Warlpiri, one of the largest Aboriginal languages in Australia, alongside traditional stories and cultural practices.',
    imageUrl: '/api/placeholder/300/200',
    lessonsCount: 18,
    studentsCount: 523,
    duration: '4 weeks',
    featured: false,
    progress: 20
  },
  {
    id: '3',
    name: 'Inuktitut Conversations',
    culture: 'Inuit',
    level: 'intermediate',
    description: 'Advance your Inuktitut skills with real conversations and cultural immersion in Arctic traditions and way of life.',
    imageUrl: '/api/placeholder/300/200',
    lessonsCount: 32,
    studentsCount: 289,
    duration: '8 weeks',
    featured: true
  }
]

const mockModules: LearningModule[] = [
  { id: '1', title: 'Basic Greetings', type: 'vocabulary', duration: 15, completed: true, locked: false },
  { id: '2', title: 'Family Terms', type: 'vocabulary', duration: 20, completed: true, locked: false },
  { id: '3', title: 'Pronunciation Practice', type: 'pronunciation', duration: 25, completed: false, locked: false },
  { id: '4', title: 'Cultural Context', type: 'culture', duration: 30, completed: false, locked: false },
  { id: '5', title: 'Simple Conversations', type: 'conversation', duration: 40, completed: false, locked: true }
]

const CourseCard = ({ course, onEnroll }: { course: LanguageCourse; onEnroll: (id: string) => void }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white rounded-lg border overflow-hidden hover:shadow-xl transition-all duration-300"
  >
    <div className="relative">
      <img 
        src={course.imageUrl} 
        alt={course.name}
        className="w-full h-48 object-cover"
      />
      {course.featured && (
        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            Featured
          </span>
        </div>
      )}
      <div className="absolute top-4 right-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          course.level === 'beginner' ? 'bg-green-500 text-white' :
          course.level === 'intermediate' ? 'bg-yellow-500 text-white' :
          'bg-red-500 text-white'
        }`}>
          {course.level}
        </span>
      </div>
    </div>
    
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {course.name}
      </h3>
      <p className="text-sm text-gray-600 mb-3 capitalize">
        {course.culture} Language
      </p>
      
      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
        {course.description}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          <span>{course.lessonsCount} lessons</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{course.studentsCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{course.duration}</span>
        </div>
      </div>

      {course.progress !== undefined ? (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-700">Progress</span>
            <span className="font-medium text-purple-600">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      ) : null}
      
      <button
        onClick={() => onEnroll(course.id)}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
      >
        {course.progress !== undefined ? 'Continue Learning' : 'Start Learning'}
      </button>
    </div>
  </motion.div>
)

const ModuleCard = ({ module, onClick }: { module: LearningModule; onClick: (id: string) => void }) => {
  const getTypeIcon = () => {
    switch (module.type) {
      case 'vocabulary': return BookOpen
      case 'pronunciation': return Volume2
      case 'culture': return Globe
      case 'conversation': return MessageCircle
      default: return BookOpen
    }
  }

  const Icon = getTypeIcon()

  return (
    <motion.div
      whileHover={!module.locked ? { scale: 1.02 } : {}}
      className={`p-4 rounded-lg border transition-all duration-200 ${
        module.locked 
          ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
          : module.completed
            ? 'bg-green-50 border-green-200 cursor-pointer hover:shadow-md'
            : 'bg-white border-gray-200 cursor-pointer hover:shadow-md'
      }`}
      onClick={() => !module.locked && onClick(module.id)}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${
          module.locked 
            ? 'bg-gray-200'
            : module.completed
              ? 'bg-green-100'
              : 'bg-purple-100'
        }`}>
          <Icon className={`w-5 h-5 ${
            module.locked 
              ? 'text-gray-400'
              : module.completed
                ? 'text-green-600'
                : 'text-purple-600'
          }`} />
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{module.title}</h4>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="capitalize">{module.type}</span>
            <span>•</span>
            <span>{module.duration} min</span>
            {module.completed && (
              <>
                <span>•</span>
                <span className="text-green-600 font-medium">Completed</span>
              </>
            )}
          </div>
        </div>
        
        {module.completed && (
          <div className="text-green-600">
            <Award className="w-5 h-5" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function LanguageContent() {
  const { isAuthenticated } = useAuth()
  const [courses, setCourses] = useState<LanguageCourse[]>([])
  const [modules, setModules] = useState<LearningModule[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('courses')

  useEffect(() => {
    const loadLanguageData = async () => {
      setLoading(true)
      
      try {
        // In production, this would query Nostr NIP-51 curation lists for language content
        setCourses(mockCourses)
        setModules(mockModules)
      } catch (error) {
        console.error('Failed to load language data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLanguageData()
  }, [])

  const handleEnrollCourse = (courseId: string) => {
    console.log('Enrolling in course:', courseId)
    // In production, this would track enrollment and progress
  }

  const handleModuleClick = (moduleId: string) => {
    console.log('Opening module:', moduleId)
    // In production, this would open the learning module
  }

  const tabs = [
    { id: 'courses', label: 'Language Courses', icon: BookOpen },
    { id: 'modules', label: 'Learning Modules', icon: Headphones },
    { id: 'progress', label: 'My Progress', icon: TrendingUp }
  ]

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Language Learning
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Learn indigenous and traditional languages through immersive cultural experiences. 
          Connect with native speakers and discover the rich heritage behind each language.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border mb-8">
        <div className="border-b">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'courses' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    onEnroll={handleEnrollCourse}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Te Reo Māori Basics - Module Progress
                </h3>
                <p className="text-gray-600">
                  Complete modules in order to unlock advanced content and cultural immersion experiences.
                </p>
              </div>
              
              <div className="space-y-4">
                {modules.map((module) => (
                  <ModuleCard 
                    key={module.id} 
                    module={module} 
                    onClick={handleModuleClick}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div>
              {isAuthenticated ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-purple-50 rounded-lg p-6">
                      <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
                      <div className="text-sm text-purple-800">Courses Enrolled</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="text-2xl font-bold text-green-600 mb-2">27</div>
                      <div className="text-sm text-green-800">Lessons Completed</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="text-2xl font-bold text-blue-600 mb-2">45h</div>
                      <div className="text-sm text-blue-800">Time Spent Learning</div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Award className="w-6 h-6 text-yellow-500" />
                        <div>
                          <p className="font-medium text-gray-900">First Words Completed</p>
                          <p className="text-sm text-gray-600">Completed basic vocabulary in Te Reo Māori</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-6 h-6 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900">Cultural Explorer</p>
                          <p className="text-sm text-gray-600">Learned about Māori cultural traditions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Sign in to track your progress
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create an account to save your learning progress and earn achievements.
                  </p>
                  <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Sign In
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Learning Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white rounded-lg border p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Headphones className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Audio Immersion
          </h3>
          <p className="text-gray-600 text-sm">
            Learn pronunciation from native speakers with high-quality audio recordings and interactive exercises.
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cultural Context
          </h3>
          <p className="text-gray-600 text-sm">
            Understand the cultural significance and traditional usage of words and phrases in their proper context.
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Community Practice
          </h3>
          <p className="text-gray-600 text-sm">
            Practice with other learners and connect with native speakers in our language exchange community.
          </p>
        </div>
      </div>
    </div>
  )
}
