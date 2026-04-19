/**
 * Seed: Demo data for Kaizen Flow
 * Creates a demo user, sample tasks, and initial XP totals
 */

import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';

const DEMO_EMAIL = 'demo@kaizen.dev';
const DEMO_PASSWORD = 'Demo1234!';

export async function seed(knex: Knex): Promise<void> {
  await knex('xp_events').del();
  await knex('user_xp_totals').del();
  await knex('tasks').del();
  await knex('users').where({ email: DEMO_EMAIL }).del();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const [user] = await knex('users')
    .insert({
      email: DEMO_EMAIL,
      password_hash: passwordHash,
      first_name: 'Demo',
      timezone: 'UTC',
    })
    .returning(['id']);

  const userId = user.id;

  await knex('tasks').insert([
    {
      user_id: userId,
      title: 'Write quarterly review document',
      description:
        'Draft the Q1 self-review covering wins, gaps, and next-quarter goals.',
      category: 'work',
      emotional_difficulty: 5,
      status: 'active',
    },
    {
      user_id: userId,
      title: 'Go for a 20-minute walk',
      description: 'A gentle outdoor walk to reset and move the body.',
      category: 'health',
      emotional_difficulty: 2,
      status: 'active',
    },
    {
      user_id: userId,
      title: 'Reply to overdue personal emails',
      description: 'Respond to the 3 emails sitting unread for 2+ weeks.',
      category: 'personal',
      emotional_difficulty: 4,
      status: 'active',
    },
  ]);

  await knex('user_xp_totals').insert({
    user_id: userId,
    total_xp: 0,
    level: 1,
    streak_days: 0,
    last_activity_date: null,
  });
}
