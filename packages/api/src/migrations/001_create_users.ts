/**
 * Migration: Create users table
 * Week 1: Basic user authentication foundation
 */

import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('first_name', 100);
    table.string('timezone', 50).defaultTo('UTC');
    table.string('notification_token');
    table.jsonb('notification_preferences').defaultTo(
      JSON.stringify({
        daily_reminder: true,
        reminder_time: '09:00',
        avoidance_alerts: true,
      })
    );
    table.timestamp('last_active_at').defaultTo(knex.fn.now());
    table.string('theme', 10).defaultTo('light');
    table.timestamps(true, true);

    // Indexes
    table.index('email');
    table.index('last_active_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
