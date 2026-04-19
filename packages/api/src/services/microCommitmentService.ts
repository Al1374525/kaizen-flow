/**
 * Micro-Commitment Service
 * Generates and manages tiny subtasks to break paralysis
 */

import { getDb } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { createTask, getTaskById, updateTask, Task } from './taskService';
import { awardXP, XpAwardResult } from './xpService';

export interface MicroCommitment extends Task {
  durationSeconds: number;
}

interface BreakdownTemplate {
  title: (taskTitle: string) => string;
  durationSeconds: number;
}

const BREAKDOWN_TEMPLATES: BreakdownTemplate[] = [
  {
    title: t => `Open or set up "${t}"`,
    durationSeconds: 30,
  },
  {
    title: t => `Spend 60 seconds on "${t}"`,
    durationSeconds: 60,
  },
  {
    title: t => `Complete the first small part of "${t}"`,
    durationSeconds: 90,
  },
  {
    title: t => `Push through the middle of "${t}"`,
    durationSeconds: 120,
  },
  {
    title: t => `Wrap up and review "${t}"`,
    durationSeconds: 90,
  },
];

export async function breakdownTask(
  userId: string,
  parentTaskId: string
): Promise<MicroCommitment[]> {
  const parent = await getTaskById(parentTaskId, userId);

  if (parent.parentTaskId) {
    throw new AppError('Cannot break down a micro-commitment', 400);
  }

  const db = getDb();
  const existing = await db('tasks')
    .where({ parent_task_id: parentTaskId, user_id: userId })
    .count('id as count')
    .first();

  if (existing && Number(existing.count) > 0) {
    throw new AppError(
      'Task already has micro-commitments. Use GET to retrieve them.',
      409
    );
  }

  const created: MicroCommitment[] = [];
  for (const template of BREAKDOWN_TEMPLATES) {
    const subtask = await createTask(userId, {
      title: template.title(parent.title),
      description: parent.description || undefined,
      category: parent.category,
      emotionalDifficulty: Math.max(1, parent.emotionalDifficulty - 1),
      parentTaskId,
    });
    created.push({ ...subtask, durationSeconds: template.durationSeconds });
  }

  return created;
}

export async function startMicroCommitment(
  userId: string,
  taskId: string
): Promise<{ task: Task; xpResult: XpAwardResult }> {
  const task = await getTaskById(taskId, userId);

  if (!task.parentTaskId) {
    throw new AppError('Task is not a micro-commitment', 400);
  }

  const updated = await updateTask(taskId, userId, { status: 'active' });
  const xpResult = await awardXP(userId, 'micro_commitment_started', taskId);

  return { task: updated, xpResult };
}

export async function completeMicroCommitment(
  userId: string,
  taskId: string
): Promise<{
  task: Task;
  xpResult: XpAwardResult;
  parentCompleted: boolean;
  parentXpResult?: XpAwardResult;
}> {
  const task = await getTaskById(taskId, userId);

  if (!task.parentTaskId) {
    throw new AppError('Task is not a micro-commitment', 400);
  }

  const updated = await updateTask(taskId, userId, { status: 'completed' });
  const xpResult = await awardXP(userId, 'micro_commitment_completed', taskId);

  const db = getDb();
  const siblings = await db('tasks')
    .where({ parent_task_id: task.parentTaskId, user_id: userId })
    .select('status');

  const allCompleted =
    siblings.length > 0 && siblings.every(s => s.status === 'completed');

  let parentXpResult: XpAwardResult | undefined;
  let parentCompleted = false;

  if (allCompleted) {
    const parent = await getTaskById(task.parentTaskId, userId);
    if (parent.status !== 'completed') {
      await updateTask(task.parentTaskId, userId, { status: 'completed' });
      parentXpResult = await awardXP(
        userId,
        'task_completed',
        task.parentTaskId
      );
      parentCompleted = true;
    }
  }

  return { task: updated, xpResult, parentCompleted, parentXpResult };
}

export async function getMicroCommitments(
  userId: string,
  parentTaskId: string
): Promise<Task[]> {
  await getTaskById(parentTaskId, userId);

  const db = getDb();
  const rows = await db('tasks')
    .where({ parent_task_id: parentTaskId, user_id: userId })
    .orderBy('created_at', 'asc')
    .select('*');

  return rows.map(row => ({
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
  }));
}
