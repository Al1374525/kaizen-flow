// XP calculation utilities - Core anti-akrasia engine

import { 
  Task, 
  TaskAction, 
  UserXP, 
  XPCalculationInput, 
  XPCalculationResult, 
  XPType 
} from '../types';
import { XP_CONSTANTS, LEVEL_THRESHOLDS, calculateLevelThreshold } from '../constants';

/**
 * Calculate XP reward for a task action
 * Core algorithm that rewards courage over consistency
 */
export function calculateXP(input: XPCalculationInput): XPCalculationResult {
  const { task, action, avoidanceDays } = input;
  
  // Base XP for any action
  const baseXP = XP_CONSTANTS.BASE_XP;
  
  // Avoidance multiplier - more XP for avoided tasks
  const avoidanceMultiplier = Math.min(
    1 + (avoidanceDays * XP_CONSTANTS.AVOIDANCE_MULTIPLIER_PER_DAY),
    XP_CONSTANTS.MAX_AVOIDANCE_MULTIPLIER
  );
  
  // Emotional difficulty multiplier
  const difficultyMultiplier = 
    XP_CONSTANTS.DIFFICULTY_MULTIPLIER_BASE + 
    (task.emotionalDifficulty * XP_CONSTANTS.DIFFICULTY_MULTIPLIER_PER_LEVEL);
  
  // Action type bonus
  const actionMultiplier = XP_CONSTANTS.ACTION_MULTIPLIERS[action.actionType] || 1.0;
  
  // Resistance level bonus (self-reported difficulty)
  const resistanceBonus = action.resistanceLevel 
    ? action.resistanceLevel * 2  // 2 XP per resistance level
    : 0;
  
  // Calculate final XP
  const totalMultiplier = avoidanceMultiplier * difficultyMultiplier * actionMultiplier;
  const xpAwarded = Math.round(baseXP * totalMultiplier + resistanceBonus);
  
  // Determine XP type based on action and context
  const xpType = determineXPType(action, avoidanceDays);
  
  return {
    xpAwarded: Math.max(xpAwarded, 1), // Minimum 1 XP
    xpType,
    multiplier: totalMultiplier,
    breakdown: {
      baseXP,
      avoidanceMultiplier,
      difficultyMultiplier,
      actionBonus: actionMultiplier,
      resistanceBonus,
    },
  };
}

/**
 * Determine XP type based on action context
 */
function determineXPType(action: TaskAction, avoidanceDays: number): XPType {
  // Phoenix points for returning after absence
  if (avoidanceDays >= 3) {
    return 'phoenix';
  }
  
  // Courage points for starting or micro-commitments
  if (action.actionType === 'start' || action.actionType === 'micro_commit') {
    return 'courage';
  }
  
  // Completion points
  if (action.actionType === 'complete') {
    return 'completion';
  }
  
  // Default to consistency
  return 'consistency';
}

/**
 * Calculate user level from total XP
 */
export function calculateLevel(totalXP: number): number {
  if (totalXP < 100) return 1;
  
  // Check pre-defined thresholds first (levels 1-15)
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  
  // Calculate dynamically for higher levels
  let level = 16;
  while (totalXP >= calculateLevelThreshold(level)) {
    level++;
  }
  
  return level - 1;
}

/**
 * Get XP required for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  const nextLevel = currentLevel + 1;
  return calculateLevelThreshold(nextLevel);
}

/**
 * Get XP progress towards next level
 */
export function getLevelProgress(totalXP: number, currentLevel: number): {
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
  remainingXP: number;
} {
  const currentLevelXP = calculateLevelThreshold(currentLevel);
  const nextLevelXP = calculateLevelThreshold(currentLevel + 1);
  
  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const progress = xpNeededForLevel > 0 ? xpInCurrentLevel / xpNeededForLevel : 1;
  const remainingXP = nextLevelXP - totalXP;
  
  return {
    currentLevelXP,
    nextLevelXP,
    progress: Math.min(progress, 1),
    remainingXP: Math.max(remainingXP, 0),
  };
}

/**
 * Calculate avoidance days for a task
 */
export function calculateAvoidanceDays(task: Task): number {
  const now = new Date();
  const created = new Date(task.createdAt);
  const daysSinceCreation = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // TODO: In the future, calculate based on last action, not creation
  // For MVP, we use creation date as proxy for avoidance
  return Math.max(daysSinceCreation, 0);
}

/**
 * Calculate Phoenix Points for returning after absence
 */
export function calculatePhoenixPoints(daysSinceLastAction: number): number {
  if (daysSinceLastAction >= 30) return XP_CONSTANTS.PHOENIX_POINT_THRESHOLDS['30d'];
  if (daysSinceLastAction >= 14) return XP_CONSTANTS.PHOENIX_POINT_THRESHOLDS['14d'];
  if (daysSinceLastAction >= 7) return XP_CONSTANTS.PHOENIX_POINT_THRESHOLDS['7d'];
  if (daysSinceLastAction >= 3) return XP_CONSTANTS.PHOENIX_POINT_THRESHOLDS['3d'];
  return 0;
}

/**
 * Check if action results in level up
 */
export function checkLevelUp(
  currentXP: number, 
  xpAwarded: number, 
  currentLevel: number
): XPCalculationResult['levelUp'] {
  const newTotalXP = currentXP + xpAwarded;
  const newLevel = calculateLevel(newTotalXP);
  
  if (newLevel > currentLevel) {
    return {
      previousLevel: currentLevel,
      newLevel,
      nextLevelThreshold: calculateLevelThreshold(newLevel + 1),
    };
  }
  
  return undefined;
}