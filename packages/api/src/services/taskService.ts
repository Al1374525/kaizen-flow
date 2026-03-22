/**
 * Task Service
 * Handles all task CRUD operations for the anti-akrasia system
 */

import { getDb } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface TaskInput {
  title: string;
  description?: string;
  category?: string;
  emotionalDifficulty?: number;
  parentTaskId?: string | null;
}

export interface TaskFilters {
  status?: 'active' | 'completed' | 'paused';
  category?: string;
  page?: number;
  limit?: number;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: string;
  emotionalDifficulty: number;
  status: string;
  parentTaskId: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

/**
 * Create a new task
 */
export async function createTask(
  userId: string,
  data: TaskInput
): Promise<Task> {
  const db = getDb();

  const [task] = await db('tasks')
    .insert({
      user_id: userId,
      title: data.title,
      description: data.description || null,
      category: data.category || 'other',
      emotional_difficulty: data.emotionalDifficulty || 3,
      status: 'active',
      parent_task_id: data.parentTaskId || null,
    })
    .returning('*');

  return mapTask(task);
}

/**
 * Get tasks with filters and pagination
 */
export async function getTasks(
  userId: string,
  filters: TaskFilters = {}
): Promise<{ tasks: Task[]; total: number; page: number; limit: number }> {
  const db = getDb();

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;

  // Build query
  let query = db('tasks').where({ user_id: userId });
  let countQuery = db('tasks').where({ user_id: userId });

  // Apply filters
  if (filters.status) {
    query = query.where({ status: filters.status });
    countQuery = countQuery.where({ status: filters.status });
  }

  if (filters.category) {
    query = query.where({ category: filters.category });
    countQuery = countQuery.where({ category: filters.category });
  }

  // Get total count
  const [{ count }] = await countQuery.count('id as count');
  const total = Number(count);

  // Get paginated tasks
  const tasks = await query
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');

  return {
    tasks: tasks.map(mapTask),
    total,
    page,
    limit,
  };
}

/**
 * Get a single task by ID
 */
export async function getTaskById(
  taskId: string,
  userId: string
): Promise<Task> {
  const db = getDb();

  const task = await db('tasks').where({ id: taskId, user_id: userId }).first();

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return mapTask(task);
}

/**
 * Update a task
 */
export async function updateTask(
  taskId: string,
  userId: string,
  data: Partial<TaskInput & { status: string }>
): Promise<Task> {
  const db = getDb();

  // Check task exists and belongs to user
  const existing = await db('tasks')
    .where({ id: taskId, user_id: userId })
    .first();

  if (!existing) {
    throw new AppError('Task not found', 404);
  }

  // Build update data
  const updateData: any = {
    updated_at: new Date(),
  };

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.emotionalDifficulty !== undefined) {
    updateData.emotional_difficulty = data.emotionalDifficulty;
  }
  if (data.status !== undefined) {
    updateData.status = data.status;
    if (data.status === 'completed') {
      updateData.completed_at = new Date();
    } else {
      // Clear completed_at when status changes away from completed
      updateData.completed_at = null;
    }
  }

  const [task] = await db('tasks')
    .where({ id: taskId, user_id: userId })
    .update(updateData)
    .returning('*');

  return mapTask(task);
}

/**
 * Delete a task
 */
export async function deleteTask(
  taskId: string,
  userId: string
): Promise<void> {
  const db = getDb();

  const deleted = await db('tasks')
    .where({ id: taskId, user_id: userId })
    .delete();

  if (!deleted) {
    throw new AppError('Task not found', 404);
  }
}

/**
 * Get task statistics for a user
 */
export async function getTaskStats(userId: string): Promise<{
  total: number;
  active: number;
  completed: number;
  paused: number;
}> {
  const db = getDb();

  const stats = await db('tasks')
    .where({ user_id: userId })
    .select(
      db.raw('COUNT(*) as total'),
      db.raw("COUNT(*) FILTER (WHERE status = 'active') as active"),
      db.raw("COUNT(*) FILTER (WHERE status = 'completed') as completed"),
      db.raw("COUNT(*) FILTER (WHERE status = 'paused') as paused")
    )
    .first();

  return {
    total: Number(stats.total),
    active: Number(stats.active),
    completed: Number(stats.completed),
    paused: Number(stats.paused),
  };
}

/**
 * Map database row to Task interface
 */
function mapTask(row: any): Task {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    category: row.category,
    emotionalDifficulty: row.emotional_difficulty,
    status: row.status,
    parentTaskId: row.parent_task_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
  };
}
