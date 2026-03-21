/**
 * Migration: Create tasks table
 * Week 1: Core task entity for anti-akrasia system
 */

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tasks', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.text('description');
    table.string('category', 50).defaultTo('other');
    table.integer('emotional_difficulty').defaultTo(3).checkBetween([1, 5]);
    table.string('status', 20).defaultTo('active');
    table
      .uuid('parent_task_id')
      .references('id')
      .inTable('tasks')
      .onDelete('SET NULL');
    table.timestamps(true, true);
    table.timestamp('completed_at');

    // Indexes for performance
    table.index('user_id');
    table.index('status');
    table.index('parent_task_id');
    table.index('created_at');

    // Compound indexes for common queries
    table.index(['user_id', 'status']);
    table.index(['user_id', 'created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tasks');
}
