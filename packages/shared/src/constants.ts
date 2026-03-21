// Anti-akrasia core constants

// XP System
export const XP_CONSTANTS = {
  BASE_XP: 10,
  MAX_AVOIDANCE_MULTIPLIER: 3.0,
  AVOIDANCE_MULTIPLIER_PER_DAY: 0.1,
  DIFFICULTY_MULTIPLIER_BASE: 0.8,
  DIFFICULTY_MULTIPLIER_PER_LEVEL: 0.2,

  // Action type multipliers
  ACTION_MULTIPLIERS: {
    start: 1.5, // Biggest reward for starting
    micro_commit: 1.3, // Good reward for micro-commitments
    progress: 1.1, // Small bonus for continued progress
    complete: 2.0, // Completion bonus
    resume: 1.2, // Returning after pause
    pause: 0.5, // Small XP for honest pausing
  } as const,

  // Phoenix Points (returning after absence)
  PHOENIX_POINT_THRESHOLDS: {
    '3d': 5, // 3+ days away = 5 Phoenix Points
    '7d': 15, // 7+ days away = 15 Phoenix Points
    '14d': 30, // 14+ days away = 30 Phoenix Points
    '30d': 50, // 30+ days away = 50 Phoenix Points
  } as const,
};

// Level system - XP thresholds for each level
export const LEVEL_THRESHOLDS = [
  0, // Level 1
  100, // Level 2
  300, // Level 3
  600, // Level 4
  1000, // Level 5
  1500, // Level 6
  2100, // Level 7
  2800, // Level 8
  3600, // Level 9
  4500, // Level 10
  5500, // Level 11
  6600, // Level 12
  7800, // Level 13
  9100, // Level 14
  10500, // Level 15
] as const;

// Calculate level threshold dynamically for levels > 15
export const calculateLevelThreshold = (level: number): number => {
  if (level <= 15) {
    return LEVEL_THRESHOLDS[level - 1] || 0;
  }
  // Formula: level_n_xp = (n * (n + 1) * 50) for n > 15
  return level * (level + 1) * 50;
};

// Micro-commitment timer durations (seconds)
export const TIMER_DURATIONS = [30, 120, 300, 900] as const; // 30s, 2m, 5m, 15m

// Task categories with display info
export const TASK_CATEGORIES = {
  'personal-development': {
    label: 'Personal Development',
    emoji: '📚',
    color: '#4F46E5',
  },
  'health-wellness': {
    label: 'Health & Wellness',
    emoji: '💪',
    color: '#059669',
  },
  'career-growth': {
    label: 'Career Growth',
    emoji: '💼',
    color: '#DC2626',
  },
  'life-admin': {
    label: 'Life Admin',
    emoji: '📋',
    color: '#7C3AED',
  },
  creative: {
    label: 'Creative Projects',
    emoji: '🎨',
    color: '#EA580C',
  },
  social: {
    label: 'Social & Relationships',
    emoji: '👥',
    color: '#0891B2',
  },
  other: {
    label: 'Other',
    emoji: '📝',
    color: '#6B7280',
  },
} as const;

// Emotional difficulty levels
export const EMOTIONAL_DIFFICULTY = {
  1: { emoji: '😊', label: 'Easy', color: '#10B981' },
  2: { emoji: '🙂', label: 'Mild', color: '#84CC16' },
  3: { emoji: '😐', label: 'Medium', color: '#F59E0B' },
  4: { emoji: '😰', label: 'Hard', color: '#EF4444' },
  5: { emoji: '😱', label: 'Scary', color: '#7C2D12' },
} as const;

// Achievement categories
export const ACHIEVEMENT_CATEGORIES = {
  'first-steps': {
    label: 'First Steps',
    emoji: '👶',
    description: 'Getting started achievements',
  },
  courage: {
    label: 'Courage',
    emoji: '🦁',
    description: 'Facing fear and taking action',
  },
  consistency: {
    label: 'Consistency',
    emoji: '📈',
    description: 'Building steady habits',
  },
  recovery: {
    label: 'Recovery',
    emoji: '🔄',
    description: 'Bouncing back from setbacks',
  },
  milestones: {
    label: 'Milestones',
    emoji: '🏆',
    description: 'Major accomplishments',
  },
  special: {
    label: 'Special',
    emoji: '⭐',
    description: 'Unique achievements',
  },
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',

  // Users
  USER_PROFILE: '/users/profile',
  USER_XP: '/users/xp',
  USER_ACHIEVEMENTS: '/users/achievements',

  // Tasks
  TASKS: '/tasks',
  TASK_ACTIONS: '/tasks/:taskId/actions',
  TASK_BREAKDOWN: '/tasks/:taskId/breakdown',

  // XP & Achievements
  XP_HISTORY: '/xp/history',
  ACHIEVEMENTS: '/achievements',

  // Dashboard
  DASHBOARD: '/dashboard',
  DAILY_FOCUS: '/dashboard/focus',
} as const;

// Validation constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  TASK_TITLE_MAX_LENGTH: 255,
  TASK_DESCRIPTION_MAX_LENGTH: 2000,
  ACTION_DESCRIPTION_MAX_LENGTH: 500,
  FIRST_NAME_MAX_LENGTH: 100,

  // Email regex (basic validation)
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Theme colors (for consistent styling)
export const THEME_COLORS = {
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    500: '#6366F1',
    600: '#4F46E5',
    900: '#312E81',
  },
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    500: '#6B7280',
    600: '#4B5563',
    900: '#111827',
  },
} as const;

// Anti-akrasia messaging (encouraging, not pressuring)
export const MESSAGES = {
  WELCOME_BACK: [
    'Welcome back, brave soul! 🌟',
    "You're here. That's what matters. ✨",
    'Ready for another small victory? 🏆',
    'Every return is an act of courage. 💪',
  ],

  FIRST_STEP: [
    "The hardest part is starting. You've got this! 🚀",
    'Small steps lead to big changes. 👣',
    "You're already braver than you think. 🦁",
    'Progress over perfection, always. 📈',
  ],

  MICRO_COMMITMENT: [
    'Just 30 seconds. You can do anything for 30 seconds. ⏱️',
    'Tiny actions, massive courage. 🌟',
    'One micro-step closer to your goal. 👣',
    'Resistance is normal. Action is heroic. 🦸',
  ],

  COMPLETION: [
    'Look at you go! 🎉',
    "That's the courage we're talking about! 🔥",
    'You turned resistance into action. Amazing! ⚡',
    'Small step, giant leap for your confidence! 🌙',
  ],
} as const;
