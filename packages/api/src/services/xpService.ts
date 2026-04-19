/**
 * XP Service
 * Handles gamification: XP awards, levels, streaks
 */

import { getDb } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export type XpEventType =
  | 'task_started'
  | 'task_completed'
  | 'micro_commitment_started'
  | 'micro_commitment_completed'
  | 'streak_bonus';

export const XP_RULES: Record<XpEventType, number> = {
  task_started: 10,
  micro_commitment_started: 5,
  micro_commitment_completed: 15,
  task_completed: 25,
  streak_bonus: 20,
};

export interface XpAwardResult {
  xpEarned: number;
  newTotal: number;
  newLevel: number;
  leveledUp: boolean;
}

export interface XpEvent {
  id: string;
  userId: string;
  taskId: string | null;
  eventType: XpEventType;
  xpEarned: number;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface UserXpSummary {
  totalXp: number;
  level: number;
  streakDays: number;
  lastActivityDate: string | null;
  recentEvents: XpEvent[];
}

export function calculateLevel(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

export async function awardXP(
  userId: string,
  eventType: XpEventType,
  taskId?: string | null,
  metadata?: Record<string, unknown>
): Promise<XpAwardResult> {
  const db = getDb();
  const xpEarned = XP_RULES[eventType];

  if (xpEarned === undefined) {
    throw new AppError(`Unknown XP event type: ${eventType}`, 400);
  }

  return db.transaction(async trx => {
    await trx('xp_events').insert({
      user_id: userId,
      task_id: taskId || null,
      event_type: eventType,
      xp_earned: xpEarned,
      metadata: metadata ? JSON.stringify(metadata) : '{}',
    });

    const existing = await trx('user_xp_totals')
      .where({ user_id: userId })
      .first();

    const previousLevel = existing ? Number(existing.level) : 1;
    const previousTotal = existing ? Number(existing.total_xp) : 0;
    const newTotal = previousTotal + xpEarned;
    const newLevel = calculateLevel(newTotal);
    const today = new Date().toISOString().slice(0, 10);

    if (existing) {
      await trx('user_xp_totals').where({ user_id: userId }).update({
        total_xp: newTotal,
        level: newLevel,
        last_activity_date: today,
        updated_at: new Date(),
      });
    } else {
      await trx('user_xp_totals').insert({
        user_id: userId,
        total_xp: newTotal,
        level: newLevel,
        streak_days: 1,
        last_activity_date: today,
      });
    }

    return {
      xpEarned,
      newTotal,
      newLevel,
      leveledUp: newLevel > previousLevel,
    };
  });
}

export async function getUserXP(userId: string): Promise<UserXpSummary> {
  const db = getDb();

  const totals = await db('user_xp_totals').where({ user_id: userId }).first();

  const events = await db('xp_events')
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(10)
    .select('*');

  const recentEvents: XpEvent[] = events.map(mapXpEvent);

  if (!totals) {
    return {
      totalXp: 0,
      level: 1,
      streakDays: 0,
      lastActivityDate: null,
      recentEvents,
    };
  }

  return {
    totalXp: Number(totals.total_xp),
    level: Number(totals.level),
    streakDays: Number(totals.streak_days),
    lastActivityDate: totals.last_activity_date
      ? new Date(totals.last_activity_date).toISOString().slice(0, 10)
      : null,
    recentEvents,
  };
}

export async function updateStreak(userId: string): Promise<{
  streakDays: number;
  bonusAwarded: boolean;
}> {
  const db = getDb();

  return db.transaction(async trx => {
    const existing = await trx('user_xp_totals')
      .where({ user_id: userId })
      .first();

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    if (!existing) {
      await trx('user_xp_totals').insert({
        user_id: userId,
        total_xp: 0,
        level: 1,
        streak_days: 1,
        last_activity_date: todayStr,
      });
      return { streakDays: 1, bonusAwarded: false };
    }

    const lastActivity = existing.last_activity_date
      ? new Date(existing.last_activity_date)
      : null;

    let newStreak = Number(existing.streak_days);

    if (!lastActivity) {
      newStreak = 1;
    } else {
      const lastStr = lastActivity.toISOString().slice(0, 10);
      if (lastStr === todayStr) {
        return { streakDays: newStreak, bonusAwarded: false };
      }

      const yesterday = new Date(today);
      yesterday.setUTCDate(today.getUTCDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (lastStr === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    await trx('user_xp_totals').where({ user_id: userId }).update({
      streak_days: newStreak,
      last_activity_date: todayStr,
      updated_at: new Date(),
    });

    return { streakDays: newStreak, bonusAwarded: false };
  });
}

function mapXpEvent(row: any): XpEvent {
  return {
    id: row.id,
    userId: row.user_id,
    taskId: row.task_id,
    eventType: row.event_type,
    xpEarned: Number(row.xp_earned),
    metadata:
      typeof row.metadata === 'string'
        ? JSON.parse(row.metadata)
        : row.metadata,
    createdAt: row.created_at,
  };
}
