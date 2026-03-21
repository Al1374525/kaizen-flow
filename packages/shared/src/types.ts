// Core domain types for Kaizen Flow anti-akrasia system

export interface User {
  id: string;
  email: string;
  firstName?: string;
  timezone: string;
  notificationToken?: string;
  notificationPreferences: NotificationPreferences;
  lastActiveAt: Date;
  theme: 'light' | 'dark';
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreferences {
  dailyReminder: boolean;
  reminderTime: string; // HH:MM format
  avoidanceAlerts: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: TaskCategory;
  emotionalDifficulty: EmotionalDifficulty;
  status: TaskStatus;
  parentTaskId?: string; // For subtasks created by Jackrabbit Technique
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type TaskCategory =
  | 'personal-development'
  | 'health-wellness'
  | 'career-growth'
  | 'life-admin'
  | 'creative'
  | 'social'
  | 'other';

export type EmotionalDifficulty = 1 | 2 | 3 | 4 | 5;

export type TaskStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export interface TaskAction {
  id: string;
  userId: string;
  taskId: string;
  actionType: ActionType;
  durationSeconds?: number;
  description?: string;
  isMicroCommitment: boolean;
  microCommitmentCompleted?: boolean;
  resistanceLevel?: number; // 1-5, self-reported difficulty
  createdAt: Date;
}

export type ActionType =
  | 'start' // Started working on task
  | 'progress' // Made progress
  | 'complete' // Completed task
  | 'micro_commit' // Started micro-commitment
  | 'pause' // Paused work
  | 'resume'; // Resumed after pause

export interface UserXP {
  id: string;
  userId: string;
  totalXP: number;
  couragePoints: number; // XP from starting avoided tasks
  phoenixPoints: number; // XP from returning after absence
  currentLevel: number;
  updatedAt: Date;
}

export interface XPTransaction {
  id: string;
  userId: string;
  taskId?: string;
  actionId?: string;
  xpAmount: number;
  xpType: XPType;
  multiplier: number;
  reason?: string;
  createdAt: Date;
}

export type XPType =
  | 'courage' // Starting avoided tasks
  | 'consistency' // Regular engagement
  | 'phoenix' // Returning after absence
  | 'bonus' // Achievement unlocks
  | 'completion'; // Task completion

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  requirements: AchievementRequirements;
  xpReward: number;
  iconName: string;
  createdAt: Date;
}

export type AchievementCategory =
  | 'first-steps'
  | 'courage'
  | 'consistency'
  | 'recovery'
  | 'milestones'
  | 'special';

export interface AchievementRequirements {
  // Flexible JSON structure for different achievement types
  type: 'task_count' | 'xp_threshold' | 'streak' | 'comeback' | 'resistance';
  threshold?: number;
  timeframe?: string; // '1d', '7d', '30d'
  conditions?: Record<string, any>;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Authentication types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  timezone?: string;
}

// XP Calculation types
export interface XPCalculationInput {
  task: Task;
  action: TaskAction;
  userXP: UserXP;
  avoidanceDays: number;
}

export interface XPCalculationResult {
  xpAwarded: number;
  xpType: XPType;
  multiplier: number;
  breakdown: {
    baseXP: number;
    avoidanceMultiplier: number;
    difficultyMultiplier: number;
    actionBonus: number;
    resistanceBonus: number;
  };
  levelUp?: {
    previousLevel: number;
    newLevel: number;
    nextLevelThreshold: number;
  };
}
