/**
 * Migration: Create XP events and user XP totals tables
 * Week 2: Gamification system for anti-akrasia engagement
 */

import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('xp_events', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .uuid('task_id')
      .references('id')
      .inTable('tasks')
      .onDelete('SET NULL');
    table
      .enum('event_type', [
        'task_started',
        'task_completed',
        'micro_commitment_started',
        'micro_commitment_completed',
        'streak_bonus',
      ])
      .notNullable();
    table.integer('xp_earned').notNullable();
    table.jsonb('metadata').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index('user_id');
    table.index('created_at');
    table.index('event_type');
  });

  await knex.schema.createTable('user_xp_totals', table => {
    table
      .uuid('user_id')
      .primary()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.integer('total_xp').notNullable().defaultTo(0);
    table.integer('level').notNullable().defaultTo(1);
    table.integer('streak_days').notNullable().defaultTo(0);
    table.date('last_activity_date');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_xp_totals');
  await knex.schema.dropTableIfExists('xp_events');
}
