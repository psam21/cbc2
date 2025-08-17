/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'cdn.nostr.build', 'nostr.build'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_NOSTR_ENABLE: process.env.NEXT_PUBLIC_NOSTR_ENABLE || 'false',
  },
}

module.exports = nextConfig
