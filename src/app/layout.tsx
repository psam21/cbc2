import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { NostrProvider } from '@/components/providers/NostrProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Culture Bridge - Preserving Cultural Heritage Through Technology',
  description: 'Explore, discover, and contribute to the preservation of cultural heritage from around the world. Connect with communities, access resources, and learn about diverse cultures through our decentralized platform.',
  keywords: 'cultural heritage, preservation, nostr, decentralized, communities, resources, exhibitions',
  authors: [{ name: 'Culture Bridge Team' }],
  openGraph: {
    title: 'Culture Bridge - Preserving Cultural Heritage',
    description: 'Explore and preserve cultural heritage through decentralized technology',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NostrProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </NostrProvider>
      </body>
    </html>
  )
}
