# Kaizen Flow - Figma Design Specification

## 📱 Mobile App Wireframes & Design System

*Generated: March 23, 2026*

---

## 1. Design System

### Color Palette

#### Primary Colors (Warm & Encouraging)
| Name | Hex | Usage |
|------|-----|-------|
| Primary Orange | `#FF8C42` | Primary buttons, accents |
| Primary Hover | `#E67330` | Button hover states |
| Primary Light | `#FFB366` | Highlights, focus states |
| Primary Pale | `#FFF0E6` | Light backgrounds |

#### Backgrounds
| Name | Hex | Usage |
|------|-----|-------|
| Background Cream | `#FFF8F0` | Main app background |
| Background White | `#FFFFFF` | Cards, inputs |
| Background Warm | `#FFF5EC` | Alternate sections |

#### Text Colors
| Name | Hex | Usage |
|------|-----|-------|
| Text Primary | `#3D2914` | Headlines, body text |
| Text Secondary | `#8B7355` | Captions, placeholders |
| Text Muted | `#B8A089` | Disabled states |

#### Accent Colors
| Name | Hex | Usage |
|------|-----|-------|
| Success Green | `#4CAF50` | Success states, completed |
| Warning Amber | `#FFB74D` | Warnings, in-progress |
| Error Coral | `#E57373` | Errors (soft, not harsh) |
| Info Teal | `#4DB6AC` | Information, tips |

#### Category Colors (Task Tags)
| Category | Color | Hex |
|----------|-------|-----|
| Work | Blue | `#64B5F6` |
| Health | Green | `#81C784` |
| Learning | Purple | `#BA68C8` |
| Creative | Pink | `#F48FB1` |
| Social | Orange | `#FFB74D` |
| Other | Gray | `#90A4AE` |

---

### Typography

#### Font Family
- **Primary**: System default (San Francisco on iOS, Roboto on Android)
- **Alternative**: Inter, Open Sans

#### Font Sizes
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Logo | 28px | Bold (700) | 1.2 |
| H1 (Screen Title) | 24px | Bold (700) | 1.3 |
| H2 (Section Title) | 20px | SemiBold (600) | 1.3 |
| H3 (Card Title) | 18px | SemiBold (600) | 1.4 |
| Body | 16px | Regular (400) | 1.5 |
| Body Small | 14px | Regular (400) | 1.5 |
| Caption | 12px | Regular (400) | 1.4 |
| Button | 16px | SemiBold (600) | 1 |
| Input | 16px | Regular (400) | 1.5 |

---

### Spacing System (8pt Grid)

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Icon padding |
| sm | 8px | Tight spacing |
| md | 16px | Standard spacing |
| lg | 24px | Section spacing |
| xl | 32px | Large gaps |
| xxl | 48px | Screen padding top/bottom |

---

### Border Radius
| Element | Radius |
|---------|--------|
| Buttons | 12px |
| Input Fields | 10px |
| Cards | 16px |
| Chips/Tags | 20px (pill) |
| Avatar | 50% (circle) |

---

### Shadows
| Level | CSS | Usage |
|-------|-----|-------|
| Subtle | `0 1px 2px rgba(61, 41, 20, 0.05)` | Inputs, small elements |
| Card | `0 2px 8px rgba(61, 41, 20, 0.08)` | Cards, list items |
| Elevated | `0 4px 16px rgba(61, 41, 20, 0.12)` | Modals, FAB |
| Popup | `0 8px 24px rgba(61, 41, 20, 0.16)` | Dropdowns |

---

## 2. Screen Specifications

---

### Screen 1: Login

**Dimensions**: 375 x 812 (iPhone SE/Standard)  
**Safe Area**: Top 44px, Bottom 34px

#### Layout Structure:
```
┌─────────────────────────────────────┐
│         [Safe Area Top]            │
├─────────────────────────────────────┤
│                                     │
│          KAIZEN FLOW               │  ← Logo: 28px Bold, centered
│                                     │
│   "Transform Procrastination       │  ← Tagline: 16px, centered
│      into Progress"                │     Text Secondary color
│                                     │
│         [48px spacing]             │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  📧  email@example.com      │  │  ← Email Input
│   └─────────────────────────────┘  │     Height: 52px
│                                     │     Border: 1px #E8D5C4
│         [16px spacing]             │     Focus: 2px #FFB366
│                                     │
│   ┌─────────────────────────────┐  │
│   │  🔒 • • • • • • • • • •    │  │  ← Password Input  
│   └─────────────────────────────┘  │     Height: 52px
│                                     │     Right: Eye toggle icon
│         [8px spacing]              │
│                                     │
│   👁️ [Show Password Toggle]       │  ← Caption, Text Muted
│                                     │
│         [24px spacing]             │
│                                     │
│   ┌─────────────────────────────┐  │
│   │        Sign In              │  │  ← Primary Button
│   └─────────────────────────────┘  │     Height: 52px
│                                     │     Background: #FF8C42
│         [16px spacing]             │     Text: White, 16px SemiBold
│                                     │     Border Radius: 12px
│   Forgot password?                │  ← 14px, Terracotta #C75B39
│                                     │
│   ──────── OR ────────            │  ← Divider with Text Muted
│                                     │
│         [16px spacing]             │
│                                     │
│   Don't have an account?           │
│   [Create Account]                │  ← Text Button, Terracotta
│                                     │
│                                     │
│   "Small steps lead to             │  ← Footer motivation
│    big changes" 🌟                 │  ← 12px, centered, italic
│                                     │
├─────────────────────────────────────┤
│         [Safe Area Bottom]         │
└─────────────────────────────────────┘
```

#### Component States:

**Input Fields**
- Default: Border #E8D5C4, Background White
- Focus: Border #FFB366 (2px), Background White
- Error: Border #E57373 (2px), Background #FFF5F5
- Disabled: Background #F5F5F5, Text Muted

**Primary Button**
- Default: Background #FF8C42
- Pressed: Background #E67330, Scale 0.98
- Loading: Background #FFB366, shows ActivityIndicator
- Disabled: Background #E8D5C4, Text Muted

---

### Screen 2: Register

**Dimensions**: Same as Login

#### Layout:
```
┌─────────────────────────────────────┐
│         [Safe Area Top]            │
├─────────────────────────────────────┤
│                                     │
│          CREATE                    │  ← H1, centered
│         ACCOUNT                    │
│                                     │
│   "Join thousands building         │  ← Tagline
│    better habits"                  │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  📧  email@example.com      │  │
│   └─────────────────────────────┘  │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  👤  Your name              │  │  ← NEW: Name field
│   └─────────────────────────────┘  │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  🔒 • • • • • • • • • •    │  │
│   └─────────────────────────────┘  │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  🔒 • • • • • • • • • •    │  │  ← Confirm Password
│   └─────────────────────────────┘  │
│                                     │
│   👁️ [Show Password Toggle]       │
│                                     │
│   Password must be 8+ characters   │  ← Helper text
│                                     │
│   ┌─────────────────────────────┐  │
│   │      Create Account         │  │
│   └─────────────────────────────┘  │
│                                     │
│   Already have an account?         │
│   [Sign In]                        │
│                                     │
│   "Every journey begins            │
│    with a single step" 👣          │
│                                     │
├─────────────────────────────────────┤
└─────────────────────────────────────┘
```

---

### Screen 3: Home Dashboard

**Dimensions**: 375 x 812

#### Layout:
```
┌─────────────────────────────────────┐  ← Status Bar (light)
├─────────────────────────────────────┤
│  Good morning, [Name]! 👋     ⚙️   │  ← Header: 16px greeting + settings icon
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🌟 Today's Focus           │   │  ← Card: elevated shadow
│  │                             │   │
│  │  "Review security logs"    │   │  ← Task title: 18px SemiBold
│  │                             │   │
│  │  💪 Effort: 3/5            │   │  ← Difficulty badge
│  │  📁 Category: Work         │   │
│  │                             │   │
│  │  [ ✓ Mark Complete ]       │   │  ← Primary button small
│  └─────────────────────────────┘   │
│                                     │
│  Your Progress                    │  ← Section title
│  ┌─────────────────────────────┐   │
│  │ ████████████░░░░░░░░  45%  │   │  ← Progress bar
│  │  9 of 20 tasks today       │   │  ← Progress text
│  └─────────────────────────────┘   │
│                                     │
│  Today's Tasks (9)                │  ← Section with count
│  ┌─────────────────────────────┐   │
│  │ 🟡 Review security logs    │   │  ← Task item
│  │    💪 3/5  📁 Work         │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🟢 Call mom                │   │
│  │    💪 1/5  📁 Social       │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🔴 Study for Security+    │   │
│  │    💪 5/5  📁 Learning    │   │
│  └─────────────────────────────┘   │
│                                     │
│  [View All Tasks →]               │  ← Link to task list
│                                     │
│                                 ⨁  │  ← FAB: Create task (Primary Orange)
├─────────────────────────────────────┤
│  🏠    📋    📊    ⚙️             │  ← Bottom nav (if needed)
└─────────────────────────────────────┘
```

---

### Screen 4: Create Task

**Dimensions**: 375 x 812

#### Layout:
```
┌─────────────────────────────────────┐
│  ← Create New Task          ✕     │  ← Header with back/close
├─────────────────────────────────────┤
│                                     │
│  Task Title *                      │  ← Label: 14px SemiBold
│  ┌─────────────────────────────┐   │
│  │  What do you want to do?   │   │  ← Input with placeholder
│  └─────────────────────────────┘   │
│                                     │
│  Description                       │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │  Add more details...       │   │  ← Multiline (4 lines)
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Category                          │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐   │
│  │ [Work] [Health] [Learning] │   │  ← Horizontal scroll chips
│  │ [Creative] [Social] [Other]│   │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘   │
│                                     │
│  Emotional Difficulty              │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │  1 ────●────────── 5       │   │  ← Slider
│  │  Easy              Stretch  │   │  ← Labels under slider
│  │                             │   │
│  │  Current: 3 - "Some effort"│   │  ← Current value display
│  └─────────────────────────────┘   │
│                                     │
│  ☐ Make this a subtask            │  ← Checkbox
│  Parent task: [Select ▼]          │  ← Dropdown (if checked)
│                                     │
│  ┌─────────────────────────────┐   │
│  │       Create Task           │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

### Screen 5: Task Detail

**Dimensions**: 375 x 812

#### Layout:
```
┌─────────────────────────────────────┐
│  ←                         ⋮      │  ← Back button + menu
├─────────────────────────────────────┤
│                                     │
│  Review security logs              │  ← H1 Title
│                                     │
│  📁 Work • Completed ✅           │  ← Category + Status badge
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │  Description text goes     │   │  ← Card with details
│  │  here. Multiple lines      │   │
│  │  supported.               │   │
│  │                             │   │
│  │  Created: Mar 22, 2026    │   │
│  │  Completed: Mar 23, 2026  │   │
│  └─────────────────────────────┘   │
│                                     │
│  💪 Difficulty: 3/5 "Some effort" │  ← Difficulty badge
│                                     │
│  ┌─────────────────────────────┐   │
│  │      ✓ Mark Complete        │   │  ← Primary (or Undo if complete)
│  └─────────────────────────────┘   │
│                                     │
│  ┌────────────┐ ┌────────────┐    │
│  │   Edit     │ │   Delete   │    │  ← Secondary buttons
│  └────────────┘ └────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

---

### Screen 6: Progress/Stats

**Dimensions**: 375 x 812

#### Layout:
```
┌─────────────────────────────────────┐
│  Your Progress              ⚙️    │
├─────────────────────────────────────┤
│                                     │
│       🏆 LEVEL 7                   │  ← Large level badge
│      "Habit Builder"               │  ← Level title
│                                     │
│  ┌─────────────────────────────┐   │
│  │    2,450 / 3,000 XP         │   │
│  │  ████████████░░░░░░░░  82% │   │  ← XP Progress
│  │  550 XP to next level      │   │
│  └─────────────────────────────┘   │
│                                     │
│  🔥 Current Streak                 │
│     7 days                    🌟   │
│                                     │
│  📊 This Week                      │
│  ┌─────────────────────────────┐   │
│  │  Tasks Completed    12     │   │
│  │  Tasks Created       8     │   │
│  │  Completion Rate     67%  │   │
│  │  Best Day          Wed    │   │
│  └─────────────────────────────┘   │
│                                     │
│  🏅 Achievements                   │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐   │
│  │🥉│ │🥈│ │🥇│ │🔥│ │🌟│   │  ← Achievement badges
│  └───┘ └───┘ └───┘ └───┘ └───┘   │
│  First  Streak  Week   7-Day  MVP  │  ← Labels
│                                     │
└─────────────────────────────────────┘
```

---

## 3. Component Library

### Buttons

| Name | Background | Text | Border | Use Case |
|------|------------|------|--------|----------|
| Primary | #FF8C42 | White | None | Main actions |
| Primary Small | #FF8C42 | White | None | Inline actions |
| Secondary | Transparent | #FF8C42 | 1px #FF8C42 | Secondary actions |
| Text | Transparent | #C75B39 | None | Links, tertiary |
| Disabled | #E8D5C4 | #B8A089 | None | Disabled state |

### Input Fields

| Name | Height | Border | Background |
|------|--------|--------|------------|
| Standard | 52px | 1px #E8D5C4 | White |
| Error | 52px | 2px #E57373 | #FFF5F5 |
| Success | 52px | 2px #4CAF50 | White |

### Cards

| Name | Padding | Border Radius | Shadow |
|------|---------|---------------|--------|
| Standard | 16px | 16px | Card shadow |
| Elevated | 20px | 16px | Elevated shadow |
| Flat | 16px | 12px | None |

### Chips/Tags

| Name | Padding | Border Radius | Background |
|------|---------|---------------|------------|
| Category | 6px 12px | 20px | Category color (20% opacity) |
| Status | 6px 12px | 20px | Status color (20% opacity) |
| Difficulty | 4px 8px | 8px | Difficulty color |

---

## 4. Animations & Interactions

### Transitions
- Screen transitions: 300ms slide
- Modal: 250ms slide up
- Card press: 100ms scale to 0.98

### Micro-interactions
- Button press: Scale 0.98, 100ms
- Input focus: Border color 150ms
- Task complete: Checkmark animation 400ms
- XP gain: Number counter animation 600ms
- Level up: Confetti/burst animation 1000ms

### Loading States
- Button: Replace text with ActivityIndicator
- Screen: Skeleton placeholders
- Pull-to-refresh: Standard native behavior

---

## 5. Export Instructions for Figma

### To use this spec in Figma:

1. **Create new file** → Mobile App Design (375x812)
2. **Set up color styles** using the hex codes above
3. **Create text styles** for each typography level
4. **Build components** using the button/input specs
5. **Create frames** for each screen using layout specs
6. **Add to team library** for consistency

### Naming Convention:
- `Button/Primary`
- `Button/Secondary`
- `Input/Standard`
- `Card/Standard`
- `Chip/Category-Work`
- `Screen/Login`

---

## 6. API Integration Notes

### Login Flow:
```
1. User enters email/password
2. POST /auth/login
3. Receive: { accessToken, refreshToken, user }
4. Store tokens securely (Keychain/Keystore)
5. Redirect to Home
```

### Endpoints Used:
- `POST /auth/login` - Authenticate
- `POST /auth/register` - Create account
- `POST /auth/refresh` - Refresh token
- `GET /tasks` - Fetch tasks
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `GET /tasks/stats` - Get statistics

---

*End of Figma Design Specification*
*Kaizen Flow - Transform Procrastination into Progress*