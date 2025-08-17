import React from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="xl" text="Loading Culture Bridge..." />
        <p className="text-gray-600 mt-4 max-w-md">
          Connecting to the decentralized network and loading cultural content...
        </p>
      </div>
    </div>
  )
}
