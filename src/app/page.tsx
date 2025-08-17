import React from 'react'
import Link from 'next/link'
import { ArrowRight, Globe, Users, BookOpen, Heart, TrendingUp, Play, Star } from 'lucide-react'
import { HomeHero } from '@/components/home/HomeHero'
import { FeaturedCultures } from '@/components/home/FeaturedCultures'
import { PlatformStats } from '@/components/home/PlatformStats'
import { FeaturedExhibitions } from '@/components/home/FeaturedExhibitions'
import { CallToAction } from '@/components/home/CallToAction'
import { TrustSection } from '@/components/home/TrustSection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HomeHero />
      
      {/* Platform Statistics */}
      <PlatformStats />
      
      {/* Featured Cultures */}
      <FeaturedCultures />
      
      {/* Featured Exhibitions */}
      <FeaturedExhibitions />
      
      {/* Trust & Social Proof */}
      <TrustSection />
      
      {/* Call to Action */}
      <CallToAction />
      
      {/* Enhanced Scroll Animations */}
      <div className="fixed bottom-8 right-8 z-40">
        <div className="w-16 h-16 bg-orange-600 rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 animate-float">
          <ArrowRight className="w-6 h-6 text-white transform rotate-90" />
        </div>
      </div>
    </div>
  )
}
