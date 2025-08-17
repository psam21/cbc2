# Culture Bridge 🌍

A decentralized platform for preserving and sharing cultural heritage through Nostr technology.

## Overview

Culture Bridge is a comprehensive web application that enables users to discover, explore, and contribute to the preservation of diverse cultures from around the world. Built with Next.js, Tailwind CSS, and integrated with the Nostr protocol, it provides a modern, accessible platform for cultural preservation.

## Features

### 🏠 **Home & Discovery**
- **Landing Page**: Compelling hero section with clear value proposition
- **Platform Statistics**: Dynamic metrics showing cultural impact
- **Featured Content**: Curated cultures and exhibitions from NIP-51 lists
- **Call to Action**: Clear paths for exploration and contribution

### 🔍 **Culture Exploration**
- **Search & Filter**: Advanced search with region, category, and language filters
- **Culture Cards**: Rich information including languages, population, and content counts
- **Deep Linking**: URL-driven state management for filters and search
- **Responsive Design**: Mobile-first approach with smooth animations

### 🎨 **Content Management**
- **Exhibitions**: Cultural exhibitions with artifacts and descriptions
- **Resources**: Downloadable materials and educational content
- **Elder Voices**: Audio stories and narratives with ratings
- **Community Events**: Cultural gatherings and workshops

### 🌐 **Nostr Integration**
- **Decentralized Data**: Content stored on Nostr relays
- **Feature Flag Control**: Toggle between Nostr and mock data
- **Protocol Support**: NIP-01, NIP-23, NIP-33, NIP-51, NIP-68, NIP-94
- **Relay Management**: Automatic failover and connection handling

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Protocol**: Nostr integration with nostr-tools
- **Deployment**: Vercel-ready with optimized build

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/culture-bridge.git
   cd culture-bridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Configure Nostr integration (optional)
   NEXT_PUBLIC_NOSTR_ENABLE=true
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development

### Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── explore/           # Culture exploration
│   ├── exhibitions/       # Cultural exhibitions
│   ├── downloads/         # Resources and downloads
│   ├── elder-voices/      # Elder stories
│   ├── community/         # Community features
│   ├── language/          # Language learning
│   └── about/             # Static pages
├── components/            # Reusable UI components
│   ├── layout/           # Header, Footer, Navigation
│   ├── home/             # Home page components
│   ├── pages/            # Page-specific components
│   └── providers/        # Context providers
├── types/                 # TypeScript type definitions
├── lib/                   # Utility functions and Nostr integration
└── data/                  # Mock data and content
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Nostr Integration

The platform integrates with Nostr through:

1. **Relay Connection**: Automatic connection to reliable relays
2. **Event Parsing**: Support for various NIP event types
3. **Content Resolution**: Media and metadata handling
4. **Feature Flags**: Graceful fallback to mock data

## Deployment

### Vercel Deployment

1. **Connect Repository**
   - Push your code to GitHub
   - Connect repository in Vercel dashboard

2. **Environment Variables**
   ```bash
   NEXT_PUBLIC_NOSTR_ENABLE=false  # Set to true for production Nostr
   ```

3. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Deploy**
   - Vercel will automatically build and deploy
   - Custom domain configuration available

### Alternative Deployment

The application can also be deployed to:
- **Netlify**: Similar process to Vercel
- **Railway**: Container-based deployment
- **Self-hosted**: Docker or traditional hosting

## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes**: Follow TypeScript and Tailwind best practices
4. **Test locally**: Ensure all functionality works
5. **Commit changes**: Use conventional commit messages
6. **Push branch**: `git push origin feature/amazing-feature`
7. **Create Pull Request**: Detailed description of changes

### Code Standards

- **TypeScript**: Strict mode enabled, proper typing
- **Tailwind**: Utility-first approach, custom components
- **React**: Functional components with hooks
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Image optimization, code splitting

## Roadmap

### Phase 1: Foundation ✅
- [x] UI flow foundation
- [x] Data backbone and Nostr integration
- [x] Media resolution (NIP-94)
- [x] Label taxonomy (NIP-68)
- [x] Content sensitivity handling

### Phase 2: Core Features 🚧
- [x] Home page and navigation
- [x] Culture exploration (Epic E5)
- [ ] Resources and downloads
- [ ] Elder voices and reactions
- [ ] User authentication system

### Phase 3: Advanced Features 📋
- [ ] Content creation flows
- [ ] Community features
- [ ] Language learning tools
- [ ] Exhibition curation
- [ ] Analytics and reporting

## Support

### Documentation
- [Project Backlog](./project-backlog.md) - Detailed feature specifications
- [Nostr NIPs](https://github.com/nostr-protocol/nips) - Protocol documentation
- [Next.js Docs](https://nextjs.org/docs) - Framework documentation

### Community
- **Discussions**: GitHub Discussions for questions
- **Issues**: Bug reports and feature requests
- **Contributions**: Pull requests welcome

### Contact
- **Email**: hello@culturebridge.org
- **Twitter**: [@culturebridge](https://twitter.com/culturebridge)
- **GitHub**: [culturebridge](https://github.com/culturebridge)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Nostr Community**: For the decentralized protocol foundation
- **Cultural Practitioners**: For sharing their heritage and knowledge
- **Open Source Contributors**: For building the tools that make this possible

---

**Built with ❤️ for cultural preservation**
# cbc2
