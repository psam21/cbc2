import React from 'react'
import Link from 'next/link'
import { ArrowRight, Globe, Users, BookOpen, Heart, TrendingUp, Play, Star } from 'lucide-react'
import { HomeHero } from '@/components/home/HomeHero'
import { FeaturedCultures } from '@/components/home/FeaturedCultures'
import { PlatformStats } from '@/components/home/PlatformStats'
import { FeaturedExhibitions } from '@/components/home/FeaturedExhibitions'
import { CallToAction } from '@/components/home/CallToAction'

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
      
      {/* Call to Action */}
      <CallToAction />
    </div>
  )
}
