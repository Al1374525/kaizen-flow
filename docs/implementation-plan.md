# Kaizen Flow - Implementation Plan

*Created: March 20, 2026*  
*Developer: Sensei Berto (Solo → Team)*  
*Goal: Working anti-akrasia prototype ASAP, scalable for team growth*

---

## Table of Contents
1. [User Story Prioritization Matrix](#1-user-story-prioritization-matrix)
2. [MVP Scope Definition](#2-mvp-scope-definition)
3. [4-Phase Development Plan](#3-4-phase-development-plan)
4. [Technical Implementation Order](#4-technical-implementation-order)
5. [Version Control & Git Strategy](#5-version-control--git-strategy)
6. [Risk Mitigation for MVP](#6-risk-mitigation-for-mvp)
7. [Quick Reference: First 2 Weeks](#7-quick-reference-first-2-weeks)

---

## 1. User Story Prioritization Matrix

### Priority Assessment Criteria

Each story scored on three axes:
- **Anti-Akrasia Impact** (1-5): How directly does this reduce task avoidance?
- **MVP Essentiality** (1-5): Can the app function without this?
- **Implementation Complexity** (1-5): How hard is this for a solo dev? (lower = easier)

### 🔴 HIGH Priority — MVP Must-Haves

| Story | Title | Impact | Essential | Complexity | Rationale |
|-------|-------|--------|-----------|------------|-----------|
| **1.1** | Micro-Commitments (Create) | 5 | 5 | 2 | **THE core mechanic.** Without 30-second commitments, there's no anti-akrasia engine. Simple timer + task = achievable fast. |
| **1.5** | Jackrabbit Technique (Breakdown) | 5 | 5 | 3 | Breaking overwhelming → manageable is the #1 value prop. Start with manual breakdown, add AI later. |
| **2.1** | Avoidance XP System | 4 | 5 | 2 | Gamification is what makes the app sticky. Courage-based XP is the differentiator. Pure math logic, no external deps. |
| **3.1** | Morning Setup & Focus | 4 | 4 | 2 | Users need a daily entry point. Simple "pick your battles" screen. No AI needed for v1 — just show avoided tasks sorted by avoidance days. |
| **3.3** | Real-Time Progress Tracking | 5 | 5 | 2 | Instant feedback is critical for dopamine loops that fight akrasia. One-tap logging + celebration animation. |
| **4.1** | Compassionate Re-engagement | 5 | 4 | 1 | This is LOW complexity but HIGH impact. Just messaging + Phoenix Points. Prevents the #1 churn reason: shame after absence. |
| **6.1** | Push Notifications (Basic) | 3 | 4 | 3 | Without notifications, the app is passive. Users who avoid tasks won't open the app voluntarily. Use Expo's push notification system. |

### 🟡 MEDIUM Priority — Post-MVP / Beta

| Story | Title | Impact | Essential | Complexity | Rationale |
|-------|-------|--------|-----------|------------|-----------|
| **1.2** | AI-Suggested Micro-Commitments | 4 | 3 | 4 | Adds significant value but requires AI integration. Use rule-based suggestions in MVP, upgrade to AI in Beta. |
| **1.3** | AI Procrastination Nudges | 4 | 3 | 4 | Smart nudges need pattern data first. Build data collection in MVP, activate AI nudges in Beta when you have user data. |
| **2.2** | Resistance Tracking & Badges | 3 | 3 | 2 | Achievement system enhances engagement but isn't core. Add after XP system is validated. |
| **2.3** | Digital Allowance (Basic) | 3 | 3 | 3 | Reward redemption is motivating but complex (timers, categories). Defer to Beta — XP alone is sufficient for MVP motivation. |
| **3.2** | Smart Task Filtering | 3 | 2 | 3 | "Just Pick One" is valuable but morning setup works fine with manual selection in MVP. |
| **4.2** | Avoidance Pattern Insights | 3 | 2 | 3 | Needs accumulated data. Build data collection in MVP, surface insights in Beta. |
| **6.2** | Notification Quick Actions | 3 | 2 | 3 | Great UX enhancement but standard notifications work for MVP. |
| **6.3** | Offline Functionality | 3 | 3 | 4 | Important for reliability but adds significant complexity (sync, conflict resolution). Use optimistic updates + basic caching for MVP. |

### 🟢 LOW Priority — Growth / Scale Phase

| Story | Title | Impact | Essential | Complexity | Rationale |
|-------|-------|--------|-----------|------------|-----------|
| **1.4** | Real-Time Procrastination Detection | 4 | 2 | 5 | Requires sophisticated behavioral modeling. Needs months of user data. |
| **1.6** | Auto-Shrink Abandoned Tasks | 3 | 2 | 3 | Nice automation but manual task editing works fine initially. |
| **2.4** | Advanced Digital Allowance | 2 | 1 | 4 | Banking, rollover, sharing — premium features for later. |
| **2.5** | Personalized Rewards (Premium) | 2 | 1 | 4 | Custom reward catalogs are premium features. Need user base first. |
| **3.4** | Frictionless Logging (Voice, Auto-detect) | 3 | 1 | 4 | Voice input and auto-detection are polish features. |
| **4.3** | Anti-Perfectionism Features | 3 | 2 | 2 | Low complexity but low urgency. Can be messaging-only initially. |
| **5.1** | Behavioral Pattern Learning | 4 | 1 | 5 | Major AI/ML undertaking. Requires significant user data and infrastructure. |
| **5.2** | Premium Pattern Insights | 2 | 1 | 4 | Premium analytics dashboard. Revenue-dependent feature. |
| **5.3** | AI Task Assistance (Advanced) | 3 | 1 | 5 | Calendar integration, productivity tool APIs. Way too much scope for early phases. |

---

## 2. MVP Scope Definition

### MVP Mission Statement
> **Build the minimum viable app that lets a user create a task they've been avoiding, break it into a 30-second micro-commitment, do it, earn courage XP, and feel good about it.**

That's the entire MVP loop. Everything else is enhancement.

### MVP Feature Set (Exactly What Ships)

#### ✅ Core Loop (Week 1-4)
1. **Task Creation** — Title, optional description, emotional difficulty (1-5 emoji scale)
2. **Task List** — Sorted by avoidance days (auto-calculated from creation date vs. last action)
3. **Manual Task Breakdown** — User creates subtasks with guided prompts ("What's the tiniest first step?")
4. **Micro-Commitment Timer** — 30s / 2min / 5min / 15min countdown with one-tap start
5. **Progress Logging** — One-tap "I did something" with optional text note
6. **Avoidance XP Engine** — XP = base × avoidance_multiplier × difficulty_multiplier

#### ✅ Engagement Layer (Week 4-6)
7. **Daily Dashboard** — Today's suggested focus (top 3 most-avoided tasks), XP summary, current level
8. **XP & Level System** — Visual level progression, XP history
9. **Basic Achievements** — 10-15 starter badges (First Step, Phoenix Rising, Courage Streak, etc.)
10. **Celebration Animations** — Confetti/sparkle on task start, XP earn, level up

#### ✅ Retention Layer (Week 6-8)
11. **Welcome Back Flow** — Compassionate messaging after absence, Phoenix Points bonus
12. **Basic Push Notifications** — Daily reminder (configurable time), "You haven't started X in 3 days"
13. **User Preferences** — Notification time, celebration intensity, dark/light mode
14. **Basic Auth** — Email/password registration, JWT tokens

### MVP Anti-Scope (What Does NOT Ship)

| Excluded | Reason |
|----------|--------|
| AI-generated micro-commitments | Rule-based prompts are sufficient for MVP |
| Digital allowance / reward redemption | XP alone provides motivation loop |
| Social features | Solo experience first |
| Offline-first with sync | Basic caching only, require internet |
| Premium tier / payments | No revenue features until product-market fit |
| Analytics dashboard | Internal metrics only (Mixpanel/PostHog) |
| iPad / tablet optimization | Phone-first |
| Android | iOS first, Android in Beta phase |
| Calendar/tool integrations | Zero external integrations |

### MVP Success Criteria

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Demo-ready app | Functional on iPhone | TestFlight build |
| Task creation → completion flow | < 30 seconds to create + start micro-commitment | Manual testing |
| Core loop works | User can create task, break down, micro-commit, earn XP | End-to-end test |
| No shame language | Zero guilt/blame messaging anywhere | Content audit |
| Portfolio presentable | Clean UI, smooth animations, professional feel | Peer review |
| Code quality | 70%+ test coverage on business logic | Jest coverage report |

---

## 3. 4-Phase Development Plan

### Phase 1: MVP — "The Engine" 🔧
**Duration:** 8 weeks  
**Goal:** Working iOS prototype on TestFlight demonstrating the anti-akrasia core loop

#### Week 1-2: Foundation
- [ ] Initialize React Native project (Expo managed workflow)
- [ ] Set up Node.js + Express backend
- [ ] PostgreSQL database: users, tasks, task_actions, user_xp tables
- [ ] JWT authentication (register, login, token refresh)
- [ ] Basic API: CRUD tasks, log actions
- [ ] Git repo setup with branching strategy (see Section 5)

#### Week 3-4: Core Anti-Akrasia
- [ ] Task creation screen (title, emotional difficulty emoji picker)
- [ ] Task list screen (sorted by avoidance days)
- [ ] Task breakdown wizard ("What's the tiniest step?")
- [ ] Micro-commitment timer (30s/2m/5m/15m countdown)
- [ ] One-tap progress logging
- [ ] XP calculation engine (avoidance × difficulty multipliers)
- [ ] XP earned animation + haptic feedback

#### Week 5-6: Engagement
- [ ] Daily dashboard (focus tasks, XP summary, level)
- [ ] Level progression system (XP thresholds, visual progress bar)
- [ ] Achievement system (10-15 starter badges with unlock logic)
- [ ] Celebration animations (confetti, sparkle, level-up sequence)
- [ ] Basic navigation (Today, Tasks, Progress, Profile tabs)

#### Week 7-8: Retention & Polish
- [ ] Welcome back flow (compassionate messaging, Phoenix Points)
- [ ] Push notifications setup (Expo notifications)
- [ ] Daily reminder notification (configurable time)
- [ ] Avoidance detection notification ("Haven't started X in 3 days")
- [ ] User settings screen (notification time, themes)
- [ ] UI polish, animation refinement, bug fixing
- [ ] TestFlight deployment
- [ ] Portfolio documentation and demo video

**Deliverables:**
- ✅ TestFlight build for iOS
- ✅ Working backend deployed (Railway/Render)
- ✅ Demo video for portfolio
- ✅ 70%+ test coverage on XP/achievement logic
- ✅ README with architecture documentation

---

### Phase 2: Beta — "The Intelligence" 🧠
**Duration:** 8 weeks (Weeks 9-16)  
**Goal:** AI integration, reward system, Android launch, beta testing with 50-100 users

#### Week 9-10: AI Integration
- [ ] OpenAI API integration with fallback system
- [ ] AI-powered micro-commitment suggestions (Story 1.2)
- [ ] AI-guided task breakdown (enhance Jackrabbit Technique)
- [ ] Rule-based fallback for when AI is unavailable
- [ ] AI cost monitoring and budget caps ($10/day limit)

#### Week 11-12: Reward System
- [ ] Digital allowance system — point-to-time conversion (Story 2.3)
- [ ] Entertainment timer with categories (streaming, gaming, social media)
- [ ] Reward redemption flow with balance tracking
- [ ] Extended achievement system (25+ badges)
- [ ] Resistance tracking and badges (Story 2.2)

#### Week 13-14: Android & Platform
- [ ] Android build testing and optimization
- [ ] Platform-specific polish (Android Material, iOS HIG)
- [ ] Google Play Console setup
- [ ] Basic offline caching (optimistic updates)
- [ ] Notification quick actions (Story 6.2)

#### Week 15-16: Beta Program
- [ ] Beta invitation system (TestFlight + Google Play Beta)
- [ ] In-app feedback mechanism
- [ ] Analytics integration (PostHog/Mixpanel)
- [ ] Avoidance pattern data collection (Story 4.2 groundwork)
- [ ] Performance optimization and bug triage
- [ ] A/B testing framework setup

**Deliverables:**
- ✅ iOS + Android beta builds
- ✅ AI-powered suggestions working
- ✅ Digital allowance reward system
- ✅ 50-100 beta users providing feedback
- ✅ Analytics dashboard with key metrics

---

### Phase 3: Growth — "The Product" 🚀
**Duration:** 12 weeks (Weeks 17-28)  
**Goal:** Public launch, premium tier, advanced features, first revenue

#### Weeks 17-20: Public Launch Preparation
- [ ] App Store submission (iOS)
- [ ] Google Play submission (Android)
- [ ] Onboarding flow (3-screen value prop + first task creation)
- [ ] Smart task filtering and "Just Pick One" (Story 3.2)
- [ ] Anti-perfectionism features (Story 4.3)
- [ ] Avoidance pattern insights (Story 4.2)

#### Weeks 21-24: Premium Tier
- [ ] Stripe integration for subscriptions
- [ ] Premium feature gating (personalized rewards, detailed analytics)
- [ ] Custom reward catalog (Story 2.5)
- [ ] Advanced analytics dashboard for premium users (Story 5.2)
- [ ] AI-powered procrastination nudges (Story 1.3)

#### Weeks 25-28: Intelligence Layer
- [ ] Behavioral pattern learning system (Story 5.1)
- [ ] Smart notification timing based on user patterns
- [ ] Contextual awareness (time of day, day of week patterns)
- [ ] Full offline support with sync (Story 6.3)
- [ ] Frictionless logging — voice input (Story 3.4)

**Deliverables:**
- ✅ Public App Store + Google Play listings
- ✅ Premium subscription tier ($7.99/month)
- ✅ First paying customers
- ✅ Behavioral learning engine active
- ✅ Full offline support

---

### Phase 4: Scale — "The Platform" 📈
**Duration:** Ongoing (Week 29+)  
**Goal:** Team expansion, advanced AI, community features, enterprise

#### Month 8-10: Advanced Intelligence
- [ ] Real-time procrastination detection (Story 1.4)
- [ ] Auto-shrink abandoned tasks (Story 1.6)
- [ ] Advanced AI task assistance with calendar integration (Story 5.3)
- [ ] Machine learning model for personalized interventions

#### Month 11-14: Community & Social
- [ ] Accountability partners feature
- [ ] Shared challenges and group goals
- [ ] Community forums and support groups
- [ ] Coach/therapist integration (referral system)

#### Month 15-18: Platform Expansion
- [ ] Web/PWA version
- [ ] Apple Watch companion (basic notifications + quick actions)
- [ ] API for third-party integrations
- [ ] Enterprise/team plans

#### Team Scaling Triggers
| Revenue Milestone | Hire | Role |
|-------------------|------|------|
| $50K ARR | Hire #1 | React Native Developer |
| $150K ARR | Hire #2 | UX/UI Designer (anti-akrasia research) |
| $300K ARR | Hire #3 | Backend Engineer |
| $500K ARR | Hire #4 | Customer Success / Behavioral Health |

---

## 4. Technical Implementation Order

### The Build Sequence (What Gets Built When)

This is the actual order you write code, designed to always have something testable.

```
Week 1:  Backend Foundation
         ├── Express server + project structure
         ├── PostgreSQL connection + schema migration (users, tasks)
         ├── Auth endpoints (register, login, refresh)
         └── Task CRUD API endpoints

Week 2:  Mobile Foundation
         ├── Expo/React Native project init
         ├── Navigation setup (React Navigation — 4 tabs)
         ├── Auth screens (Login, Register)
         ├── API client setup (Axios + JWT interceptors)
         └── Zustand store setup (auth, tasks)

Week 3:  Core Task Flow (Frontend + Backend together)
         ├── Task creation screen + API integration
         ├── Task list screen (pull-to-refresh, avoidance sort)
         ├── Task detail screen
         ├── Emotional difficulty picker (emoji scale)
         └── Backend: avoidance day calculation (daily cron or on-read)

Week 4:  Anti-Akrasia Engine
         ├── Task breakdown wizard (multi-step form)
         ├── Micro-commitment timer component
         ├── Action logging API + one-tap UI
         ├── XP calculation service (backend)
         ├── XP earned response → frontend celebration
         └── Backend: task_actions table + XP transactions table

Week 5:  Gamification
         ├── User XP summary API endpoint
         ├── Level system (XP thresholds: 100, 300, 600, 1000...)
         ├── Dashboard screen (daily focus, XP, level)
         ├── XP progress bar component
         └── Achievement definitions (seeded data)

Week 6:  Achievements & Celebrations
         ├── Achievement unlock logic (backend triggers)
         ├── Achievement list screen
         ├── Celebration animation components (Lottie or Reanimated)
         ├── Haptic feedback integration
         └── Achievement unlock modal

Week 7:  Notifications & Return Flow
         ├── Expo push notification setup
         ├── Notification registration + backend token storage
         ├── Daily reminder notification (backend scheduler)
         ├── Avoidance alert notification (3-day trigger)
         ├── Welcome back screen + Phoenix Points logic
         └── Settings screen (notification time, theme)

Week 8:  Polish & Deploy
         ├── UI consistency pass (colors, typography, spacing)
         ├── Error handling (graceful failures, offline indicators)
         ├── Loading states and skeleton screens
         ├── TestFlight build + deployment
         ├── Backend deployment (Railway/Render/Fly.io)
         ├── Environment variables and secrets management
         └── Demo video recording
```

### Database Schema — Build Order

**Migration 001 (Week 1):**
```sql
-- Users table (minimal for auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Migration 002 (Week 1):**
```sql
-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'other',
    emotional_difficulty INTEGER DEFAULT 3 CHECK (emotional_difficulty BETWEEN 1 AND 5),
    status VARCHAR(20) DEFAULT 'active',
    parent_task_id UUID REFERENCES tasks(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
```

**Migration 003 (Week 4):**
```sql
-- Task actions + XP tracking
CREATE TABLE task_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- start, progress, complete, micro_commit
    duration_seconds INTEGER,
    description TEXT,
    is_micro_commitment BOOLEAN DEFAULT FALSE,
    micro_commitment_completed BOOLEAN,
    resistance_level INTEGER CHECK (resistance_level BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_xp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    total_xp INTEGER DEFAULT 0,
    courage_points INTEGER DEFAULT 0,
    phoenix_points INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id),
    action_id UUID REFERENCES task_actions(id),
    xp_amount INTEGER NOT NULL,
    xp_type VARCHAR(30) NOT NULL, -- courage, consistency, phoenix, bonus
    multiplier DECIMAL(3,2) DEFAULT 1.0,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Migration 004 (Week 5):**
```sql
-- Achievements
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50),
    requirements JSONB NOT NULL,
    xp_reward INTEGER DEFAULT 0,
    icon_name VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);
```

**Migration 005 (Week 7):**
```sql
-- Notifications + User Preferences
ALTER TABLE users ADD COLUMN notification_token TEXT;
ALTER TABLE users ADD COLUMN notification_preferences JSONB DEFAULT '{"daily_reminder": true, "reminder_time": "09:00", "avoidance_alerts": true}';
ALTER TABLE users ADD COLUMN last_active_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE users ADD COLUMN theme VARCHAR(10) DEFAULT 'light';
```

### Technology Decisions for MVP

| Decision | Choice | Why |
|----------|--------|-----|
| **React Native framework** | Expo (managed) | Fastest setup. Push notifications, OTA updates built-in. Eject later if needed. |
| **State management** | Zustand | Simpler than Redux, works great with TypeScript, tiny bundle. |
| **Navigation** | React Navigation v6 | Industry standard, tab + stack navigation. |
| **Backend framework** | Express.js | You know JS. Fastest path to working API. |
| **ORM** | Knex.js | Lightweight query builder. Not a full ORM — gives you SQL control. |
| **Database** | PostgreSQL (Neon or Supabase free tier) | Free hosted Postgres. Neon has generous free tier. |
| **Auth** | Custom JWT | Simple, no third-party dependency for MVP. Upgrade to Clerk/Auth0 later. |
| **Hosting (API)** | Railway or Render | Free/cheap, easy deploy from Git, managed Postgres option. |
| **Animations** | React Native Reanimated + Lottie | 60fps animations, Lottie for pre-built celebration effects. |
| **Notifications** | Expo Notifications | Zero config push notifications. Works on both platforms. |
| **Testing** | Jest + React Native Testing Library | Standard, well-documented, fast. |
| **TypeScript** | Yes, everywhere | Catches bugs early, better DX, portfolio-worthy code quality. |

---

## 5. Version Control & Git Strategy

### Repository Structure

**Monorepo approach** (recommended for solo dev):
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
├── turbo.json           # Turborepo config (if using)
└── README.md
```

**Why monorepo:** Solo developer = one repo. Shared types between frontend and backend prevent bugs. Easy refactoring. Single PR for full-stack changes.

### Branching Strategy: GitHub Flow (Simplified)

For a solo developer, **GitHub Flow** is ideal — simple, not overengineered:

```
main (always deployable)
  │
  ├── feature/task-creation
  ├── feature/xp-engine
  ├── feature/micro-commitment-timer
  ├── fix/xp-calculation-bug
  └── chore/update-dependencies
```

**Rules:**
1. `main` is always deployable. Never push broken code directly.
2. Create a feature branch for every piece of work.
3. Branch naming: `feature/short-description`, `fix/short-description`, `chore/short-description`
4. When done, open a PR (even to yourself — builds good habits).
5. Squash merge to main. Clean history.
6. Delete merged branches.

**When to upgrade to Git Flow (with a team):**
```
main (production releases)
  │
  develop (integration branch)
    │
    ├── feature/task-creation
    ├── feature/xp-engine
    └── fix/xp-bug
  │
  release/v1.0.0 (release candidate)
  │
  hotfix/critical-auth-fix (emergency patches)
```

Switch to Git Flow when you have **2+ developers** or when you need **release branches** for App Store review cycles.

### Commit Convention

Use **Conventional Commits** from day 1:

```
feat: add micro-commitment timer component
fix: correct XP calculation for high-avoidance tasks
chore: update Expo SDK to 50
docs: add API endpoint documentation
test: add unit tests for achievement unlock logic
refactor: extract XP calculation into service module
style: apply consistent color tokens across screens
```

This enables:
- Auto-generated changelogs
- Semantic versioning automation
- Clean git history for portfolio review

### CI/CD Pipeline

**Phase 1 (MVP) — Minimal but effective:**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: kaizen_test
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --coverage
      - run: npm run test:api
        env:
          DATABASE_URL: postgres://postgres:test@localhost:5432/kaizen_test
          JWT_SECRET: test-secret
```

**Phase 2 (Beta) — Add deployment:**

```yaml
  deploy-api:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  build-mobile:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform ios --profile preview --non-interactive
```

### Code Quality Tooling (Set Up Day 1)

| Tool | Purpose | Config |
|------|---------|--------|
| **ESLint** | Linting | Airbnb + TypeScript config |
| **Prettier** | Formatting | 2 spaces, single quotes, trailing commas |
| **Husky** | Git hooks | Pre-commit lint + pre-push test |
| **lint-staged** | Staged file linting | Only lint changed files |
| **TypeScript** | Type safety | Strict mode enabled |

```json
// .husky/pre-commit
npx lint-staged

// .lintstagedrc
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

---

## 6. Risk Mitigation for MVP

### 🔴 Critical Risks

#### Risk 1: Scope Creep Kills MVP
**Probability:** HIGH | **Impact:** FATAL

The SRS describes a massive product. The biggest risk is trying to build too much.

**Mitigation:**
- MVP feature list is LOCKED (Section 2). Print it. Tape it to your monitor.
- Every new idea goes into `docs/IDEAS.md`, not into the codebase.
- Ask one question before adding anything: "Can the core loop work without this?"
- Set a hard ship date (8 weeks from start). Ship whatever is done.
- "Perfect is the enemy of shipped" — especially for an anti-akrasia app.

#### Risk 2: AI Integration Becomes a Rabbit Hole
**Probability:** HIGH | **Impact:** HIGH

AI features (micro-commitment generation, pattern detection) are exciting but complex. Prompt engineering, API costs, error handling, and fallbacks can consume weeks.

**Mitigation:**
- **NO AI IN MVP.** Period. Use hardcoded prompts and rule-based suggestions.
- MVP task breakdown uses guided questions, not AI generation.
- Build the AI integration layer in Beta (Phase 2) when core loop is proven.
- When you do add AI: start with GPT-3.5-Turbo (cheap), use `gpt-4` only for premium.
- Set daily API budget ($10/day) and circuit breakers from day 1.

#### Risk 3: Solo Developer Burnout
**Probability:** HIGH | **Impact:** HIGH

Building a full-stack mobile app alone while job hunting is intense. Burnout would be ironic for an anti-akrasia app.

**Mitigation:**
- Use Kaizen Flow on yourself. Track your own development tasks. Eat your own dog food.
- 4-hour focused dev blocks, not 12-hour grinds.
- Weekly review: What's working? What's blocked? What can be cut?
- Schedule "zero days" — at least 1 day/week with no coding.
- If something takes 3x longer than expected, simplify it, don't push through.

### 🟡 Moderate Risks

#### Risk 4: React Native Performance Issues
**Probability:** MEDIUM | **Impact:** MEDIUM

Animations, timers, and real-time XP updates can cause jank on lower-end devices.

**Mitigation:**
- Use React Native Reanimated (runs on UI thread) for all animations.
- Memoize expensive components (React.memo, useMemo, useCallback).
- Test on older devices early (iPhone 8 equivalent).
- Profile with Flipper/React DevTools weekly.
- Celebration animations: use Lottie (pre-rendered) not custom RN animations.

#### Risk 5: Database Scaling Before It's Needed
**Probability:** MEDIUM | **Impact:** LOW

The SRS describes enterprise-grade database architecture (sharding, read replicas, ClickHouse). Over-engineering the database kills velocity.

**Mitigation:**
- MVP database: **One PostgreSQL instance.** That's it.
- Use Neon free tier (generous limits, auto-scaling) or Supabase.
- No caching layer (Redis) until you have 1,000+ active users.
- No read replicas until query latency becomes a measured problem.
- Indexing strategy: add indexes when you see slow queries, not proactively.

#### Risk 6: App Store Rejection
**Probability:** LOW | **Impact:** HIGH

Health-related apps face extra scrutiny. Apple may question behavioral health claims.

**Mitigation:**
- Position as "productivity" not "health" in App Store listing.
- Avoid medical/therapeutic claims in marketing copy.
- Include clear disclaimer: "Not a substitute for professional help."
- Add mental health resource links in Settings.
- Review Apple's Health & Wellness guidelines before submission.

### 🟢 Low Risks (Monitor Only)

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| API hosting costs spike | Low | Low | Free tiers are generous. Monitor usage weekly. |
| Expo limitations force eject | Low | Medium | Expo bare workflow migration is documented. Don't use native modules in MVP. |
| User data privacy incident | Low | Critical | Use bcrypt for passwords, JWT best practices, HTTPS everywhere. No PII in logs. |
| Competing app launches | Medium | Low | First-mover advantage is less important than product quality. Focus on your unique angle. |

---

## 7. Quick Reference: First 2 Weeks

### Day 1 Checklist
- [ ] Create GitHub repo: `kaizen-flow` (private, switch to public when ready)
- [ ] Initialize monorepo structure (`apps/mobile`, `packages/api`, `packages/db`)
- [ ] Set up TypeScript, ESLint, Prettier, Husky
- [ ] Create initial README with project description
- [ ] Set up PostgreSQL (Neon free tier)
- [ ] Run first database migration (users table)

### Day 2-3: Backend API
- [ ] Express server with health check endpoint
- [ ] Auth routes: POST /register, POST /login, POST /refresh
- [ ] Password hashing with bcrypt
- [ ] JWT token generation and validation middleware
- [ ] Task CRUD routes: GET /tasks, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id
- [ ] Deploy to Railway/Render (get a live URL working ASAP)

### Day 4-5: Mobile App Foundation
- [ ] Initialize Expo project with TypeScript template
- [ ] Install dependencies: React Navigation, Zustand, Axios
- [ ] Tab navigation: Today, Tasks, Progress, Profile
- [ ] Auth screens: Login + Register (functional, not pretty)
- [ ] API client with JWT interceptor
- [ ] Auth store in Zustand (token persistence with SecureStore)

### Day 6-7: First Integration
- [ ] Connect mobile auth to backend API
- [ ] Task creation screen → POST /tasks → Task list screen
- [ ] Verify end-to-end: Register → Login → Create Task → See Task
- [ ] Commit, push, celebrate 🎉

### Week 2: Core Anti-Akrasia Mechanics
- [ ] Emotional difficulty picker (5 emoji buttons)
- [ ] Task detail screen with subtask creation
- [ ] Micro-commitment timer component (30s/2m/5m/15m)
- [ ] Action logging: POST /tasks/:id/actions
- [ ] XP calculation service (backend)
- [ ] XP earned response displayed on mobile
- [ ] First celebration animation (XP earned popup)

**By end of Week 2, you should be able to:**
1. Open the app
2. Create a task you've been avoiding
3. Rate how scary it feels
4. Break it into a tiny step
5. Start a 30-second timer
6. Complete it
7. See XP earned with a celebration animation

**That's the anti-akrasia loop. Everything else builds on this.**

---

## Appendix A: Recommended NPM Packages

### Mobile (apps/mobile)
```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "@react-navigation/native": "^6.x",
    "@react-navigation/bottom-tabs": "^6.x",
    "@react-navigation/native-stack": "^6.x",
    "zustand": "^4.x",
    "axios": "^1.x",
    "expo-secure-store": "~12.x",
    "expo-notifications": "~0.27.x",
    "expo-haptics": "~12.x",
    "lottie-react-native": "^6.x",
    "react-native-reanimated": "~3.x",
    "date-fns": "^3.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@testing-library/react-native": "^12.x",
    "jest": "^29.x"
  }
}
```

### Backend (packages/api)
```json
{
  "dependencies": {
    "express": "^4.x",
    "knex": "^3.x",
    "pg": "^8.x",
    "bcryptjs": "^2.x",
    "jsonwebtoken": "^9.x",
    "cors": "^2.x",
    "helmet": "^7.x",
    "express-rate-limit": "^7.x",
    "zod": "^3.x",
    "node-cron": "^3.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "jest": "^29.x",
    "supertest": "^6.x",
    "nodemon": "^3.x"
  }
}
```

## Appendix B: XP Formula Quick Reference

```typescript
function calculateXP(action: TaskAction, task: Task): XPResult {
  // Base XP by action type
  const BASE_XP: Record<string, number> = {
    start: 10,
    progress: 5,
    complete: 20,
    micro_commit: 15,
    abandon: 2, // Honesty points
  };

  let baseXP = BASE_XP[action.type] || 0;

  // Avoidance multiplier (days since task created or last action)
  const avoidanceDays = daysSince(task.lastInteraction || task.createdAt);
  let multiplier = 1.0;
  if (avoidanceDays >= 1) multiplier = 1.5;
  if (avoidanceDays >= 3) multiplier = 2.0;
  if (avoidanceDays >= 7) multiplier = 2.5;
  if (avoidanceDays >= 14) multiplier = 3.0;

  // Emotional difficulty bonus (0.2 per level)
  multiplier += task.emotionalDifficulty * 0.2;

  // Micro-commitment completion bonus
  if (action.type === 'micro_commit' && action.completed) {
    multiplier += 0.5;
  }

  const finalXP = Math.round(baseXP * multiplier);

  return {
    amount: finalXP,
    type: avoidanceDays >= 3 ? 'courage' : 'consistency',
    multiplier: Math.round(multiplier * 100) / 100,
    baseAmount: baseXP,
  };
}
```

## Appendix C: Starter Achievement Definitions

| Achievement | Category | Criteria | XP Reward |
|-------------|----------|----------|-----------|
| **First Step** | Courage | Start your first task | 50 |
| **Tiny But Mighty** | Courage | Complete a 30-second micro-commitment | 25 |
| **Dragon Slayer** | Courage | Start a task avoided for 7+ days | 100 |
| **Phoenix Rising** | Recovery | Return after 3+ days away | 75 |
| **Momentum Builder** | Consistency | Start tasks 3 days in a row | 50 |
| **Task Breaker** | Technique | Break down a task into 3+ subtasks | 30 |
| **XP Century** | Milestone | Earn 100 total XP | 25 |
| **Level Up!** | Milestone | Reach Level 2 | 50 |
| **Courage Collector** | Courage | Earn 10 courage points | 40 |
| **Five Alive** | Consistency | Complete 5 micro-commitments | 30 |
| **Brave Start** | Courage | Start a difficulty-5 task | 75 |
| **Weekly Warrior** | Consistency | Log actions 5 days in one week | 60 |
| **Breakdown Master** | Technique | Break down 5 different tasks | 50 |
| **Clean Sweep** | Milestone | Complete all subtasks of a broken-down task | 100 |
| **The Returner** | Recovery | Use Phoenix Points 3 times | 100 |

---

*This implementation plan is a living document. Update it as you learn what works and what doesn't. The anti-akrasia mission comes first — if a feature doesn't help users overcome task resistance, it doesn't ship.*

**Now stop reading plans and go write code.** 🚀
