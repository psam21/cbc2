'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Award, BookOpen, Globe, Heart, CheckCircle } from 'lucide-react'

const impactMetrics = [
  { icon: Users, value: '2,137', label: 'Stories Preserved', detail: 'across 64 communities' },
  { icon: Globe, value: '89', label: 'Languages Documented', detail: 'from endangered to thriving' },
  { icon: Heart, value: '1,024', label: 'Active Contributors', detail: 'elders, scholars, community members' },
  { icon: BookOpen, value: '156', label: 'Cultural Exhibitions', detail: 'curated and shared' }
]

const advisoryBoard = [
  { name: 'Dr. Maria Santos', role: 'Cultural Anthropologist', institution: 'UNESCO', avatar: '/api/placeholder/60/60' },
  { name: 'Elder James Williams', role: 'Indigenous Knowledge Keeper', institution: 'Aboriginal Council', avatar: '/api/placeholder/60/60' },
  { name: 'Prof. Aisha Patel', role: 'Digital Heritage Specialist', institution: 'MIT Media Lab', avatar: '/api/placeholder/60/60' }
]

const partners = [
  { name: 'UNESCO', logo: '/api/placeholder/80/40', type: 'International Organization' },
  { name: 'Smithsonian', logo: '/api/placeholder/80/40', type: 'Cultural Institution' },
  { name: 'Indigenous Rights Foundation', logo: '/api/placeholder/80/40', type: 'Community Organization' }
]

export function TrustSection() {
  return (
    <section className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] text-white py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
            Trusted by Communities Worldwide
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our commitment to cultural preservation is backed by experts, institutions, and the communities we serve
          </p>
        </motion.div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {impactMetrics.map((metric, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20">
                <metric.icon className="w-10 h-10 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-2">{metric.value}</div>
              <div className="text-lg font-semibold mb-1">{metric.label}</div>
              <div className="text-sm text-gray-300">{metric.detail}</div>
            </div>
          ))}
        </motion.div>

        {/* Advisory Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <Award className="w-6 h-6 text-orange-400" />
            Advisory Board
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advisoryBoard.map((member, index) => (
              <div key={index} className="bg-white bg-opacity-5 rounded-2xl p-6 border border-white border-opacity-20 text-center group hover:bg-opacity-10 transition-all duration-300">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-400" />
                </div>
                <h4 className="text-lg font-bold mb-2">{member.name}</h4>
                <p className="text-orange-400 text-sm mb-1">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.institution}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Partners & Methodology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Partners */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Shield className="w-6 h-6 text-orange-400" />
              Our Partners
            </h3>
            <div className="space-y-4">
              {partners.map((partner, index) => (
                <div key={index} className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-20 flex items-center gap-4">
                  <div className="w-16 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{partner.name}</h4>
                    <p className="text-sm text-gray-300">{partner.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-orange-400" />
              Our Methodology
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Community-Led Documentation</h4>
                  <p className="text-sm text-gray-300">Stories are shared with full consent and community oversight</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Decentralized Preservation</h4>
                  <p className="text-sm text-gray-300">Using Nostr protocol for censorship-resistant cultural storage</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Respectful Access Tiers</h4>
                  <p className="text-sm text-gray-300">Sensitive materials protected with community-defined permissions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Continuous Verification</h4>
                  <p className="text-sm text-gray-300">Regular community review and validation of cultural content</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-white bg-opacity-10 rounded-2xl p-8 border border-white border-opacity-20">
            <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Help preserve the world's cultural heritage by contributing stories, supporting communities, or partnering with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-semibold">
                Become a Partner
              </button>
              <button className="px-8 py-3 border border-white text-white rounded-xl hover:bg-white hover:text-[#1A1A2E] transition-colors font-semibold">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
