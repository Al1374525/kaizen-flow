/**
 * Task Routes
 * CRUD operations for task management
 * All routes require authentication
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../services/taskService';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  category: z.string().max(50).optional(),
  emotionalDifficulty: z.number().min(1).max(5).optional(),
  parentTaskId: z.string().uuid().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional(),
  category: z.string().max(50).optional(),
  emotionalDifficulty: z.number().min(1).max(5).optional(),
  status: z.enum(['active', 'completed', 'paused']).optional(),
  parentTaskId: z.string().uuid().optional().nullable(),
});

const querySchema = z.object({
  status: z.enum(['active', 'completed', 'paused']).optional(),
  category: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

/**
 * POST /tasks
 * Create a new task
 */
router.post(
  '/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createTaskSchema.parse(req.body);
      const task = await createTask(req.user!.userId, validatedData);

      res.status(201).json({
        success: true,
        data: { task },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(
          new AppError(
            error.errors
              .map(e => `${e.path.join('.')}: ${e.message}`)
              .join(', '),
            400
          )
        );
        return;
      }
      next(error);
    }
  }
);

/**
 * GET /tasks
 * List tasks with filters and pagination
 */
router.get(
  '/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = querySchema.parse(req.query);
      const result = await getTasks(req.user!.userId, validatedQuery);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(
          new AppError(
            error.errors
              .map(e => `${e.path.join('.')}: ${e.message}`)
              .join(', '),
            400
          )
        );
        return;
      }
      next(error);
    }
  }
);

/**
 * GET /tasks/stats
 * Get task statistics for authenticated user
 */
router.get(
  '/stats',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await getTaskStats(req.user!.userId);

      res.json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /tasks/:id
 * Get a single task by ID
 */
router.get(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await getTaskById(req.params.id, req.user!.userId);

      res.json({
        success: true,
        data: { task },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /tasks/:id
 * Update a task
 */
router.put(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = updateTaskSchema.parse(req.body);
      const task = await updateTask(
        req.params.id,
        req.user!.userId,
        validatedData
      );

      res.json({
        success: true,
        data: { task },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(
          new AppError(
            error.errors
              .map(e => `${e.path.join('.')}: ${e.message}`)
              .join(', '),
            400
          )
        );
        return;
      }
      next(error);
    }
  }
);

/**
 * DELETE /tasks/:id
 * Delete a task
 */
router.delete(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteTask(req.params.id, req.user!.userId);

      res.json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
