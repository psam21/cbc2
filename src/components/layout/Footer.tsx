import React from 'react'
import Link from 'next/link'
import { Globe, Heart, Mail, Twitter, Github, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Mission */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-cultural-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Culture Bridge</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Preserving cultural heritage through decentralized technology. Connect with communities, 
              discover traditions, and contribute to the preservation of our world's diverse cultures.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/culturebridge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/culturebridge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/culturebridge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Cultures
                </Link>
              </li>
              <li>
                <Link href="/exhibitions" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Exhibitions
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/elder-voices" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Elder Voices
                </Link>
              </li>
              <li>
                <Link href="/language" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Language Learning
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/community" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Members
                </Link>
              </li>
              <li>
                <Link href="/community/events" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/contribute" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Contribute
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
            <p className="text-gray-300 mb-4">
              Get updates about new cultures, events, and preservation efforts.
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-gray-400">
            <Heart className="w-4 h-4" />
            <span>Made with love for cultural preservation</span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
            <a
              href="mailto:hello@culturebridge.org"
              className="hover:text-white transition-colors duration-200 flex items-center space-x-1"
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
