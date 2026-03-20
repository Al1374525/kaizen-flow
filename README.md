# Kaizen Flow - Anti-Akrasia Mobile App

**Transform procrastination into progress through science-backed micro-actions**

[![CI](https://github.com/Al1374525/kaizen-flow/actions/workflows/ci.yml/badge.svg)](https://github.com/Al1374525/kaizen-flow/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Kaizen Flow is a mobile-first behavioral health application designed to combat **akrasia** (the struggle to do things you know you should do) through gamified micro-commitments and AI-powered intervention. Unlike productivity apps that optimize functioning executive systems, Kaizen Flow scaffolds struggling ones.

### Core Innovation
- **Ultra-small micro-commitments** (30 seconds to 2 minutes)
- **Courage-based gamification** (rewards starting over completing)
- **AI-powered resistance intervention** (contextual support when avoiding tasks)
- **Recovery-focused design** (no shame, guilt, or pressure mechanics)

## Repository Structure

```
kaizen-flow/
├── apps/
│   └── mobile/          # React Native app (Expo)
├── packages/
│   ├── api/             # Express.js backend
│   ├── shared/          # Shared types, constants, validation
│   └── db/              # Database migrations and seeds
├── docs/                # SRS, user stories, design docs
├── .github/
│   └── workflows/       # CI/CD pipelines
├── package.json         # Root workspace config
└── README.md
```

## Tech Stack

- **Mobile:** React Native (Expo) + TypeScript
- **Backend:** Node.js (Express) + PostgreSQL
- **State Management:** Zustand
- **Database:** PostgreSQL (Neon/Supabase)
- **Authentication:** Custom JWT
- **Hosting:** Railway/Render
- **CI/CD:** GitHub Actions

## Development Phases

### Phase 1: MVP - "The Engine" (8 weeks) 🔧
Working iOS prototype demonstrating core anti-akrasia loop:
- Task creation → breakdown → micro-commitments → XP rewards

### Phase 2: Beta - "The Intelligence" (8 weeks) 🧠  
AI integration, reward system, Android launch

### Phase 3: Growth - "The Product" (12 weeks) 🚀
Public launch, premium tier, advanced features

### Phase 4: Scale - "The Platform" 📈
Team expansion, community features, enterprise

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Al1374525/kaizen-flow.git
cd kaizen-flow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development servers
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Environment Variables

```bash
# Backend (packages/api/.env)
DATABASE_URL=postgresql://username:password@localhost:5432/kaizen_flow
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
PORT=3000

# Mobile (apps/mobile/.env)
API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Database Setup

```bash
# Create database
createdb kaizen_flow

# Run migrations
npm run migrate

# Seed development data
npm run seed
```

## Contributing

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add micro-commitment timer component
fix: correct XP calculation for high-avoidance tasks
docs: update API documentation
```

### Branching Strategy (GitHub Flow)

1. Create feature branch: `feature/task-creation`
2. Make changes and commit
3. Open Pull Request to `main`
4. Squash merge after review
5. Delete feature branch

## Anti-Akrasia Mission

Every feature must support our core mission: **reduce task resistance, increase courage to start**. 

- ✅ Features that lower the barrier to taking action
- ✅ Gamification that rewards courage over consistency  
- ✅ Messaging that encourages without pressure
- ❌ Features that add complexity or friction
- ❌ Shame/guilt-based mechanics
- ❌ Perfectionism reinforcement

## Portfolio Project

This project serves as **Portfolio Project #1** for demonstrating:
- Full-stack mobile development
- Behavioral psychology implementation
- Enterprise-grade documentation
- Clean architecture and testing
- CI/CD and deployment automation

## Documentation

- [Software Requirements Specification](docs/SRS.md)
- [Implementation Plan](docs/implementation-plan.md)
- [User Stories](docs/user-stories.md)
- [API Documentation](docs/api.md)
- [Architecture Decisions](docs/architecture.md)

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**"Reduce Resistance, Increase Courage"** - The Kaizen Flow Mission