/**
 * AI Routes
 * Endpoints for resistance interventions
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { getTaskById } from '../services/taskService';
import { getUserXP } from '../services/xpService';
import { getResistanceIntervention } from '../services/aiService';

const router = Router();

const interventionSchema = z.object({
  taskId: z.string().uuid('taskId must be a valid uuid'),
});

router.post(
  '/intervention',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId } = interventionSchema.parse(req.body);
      const task = await getTaskById(taskId, req.user!.userId);
      const xp = await getUserXP(req.user!.userId);

      const message = await getResistanceIntervention(
        {
          title: task.title,
          description: task.description,
          difficulty: task.emotionalDifficulty,
        },
        {
          streakDays: xp.streakDays,
          totalXp: xp.totalXp,
          level: xp.level,
        }
      );

      res.json({
        success: true,
        data: { message },
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

export default router;
