/**
 * XP Routes
 * Gamification endpoints: XP summary and manual award
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { awardXP, getUserXP, XpEventType } from '../services/xpService';

const router = Router();

const awardSchema = z.object({
  eventType: z.enum([
    'task_started',
    'task_completed',
    'micro_commitment_started',
    'micro_commitment_completed',
    'streak_bonus',
  ]),
  taskId: z.string().uuid().optional(),
});

router.get(
  '/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await getUserXP(req.user!.userId);
      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/award',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = awardSchema.parse(req.body);
      const result = await awardXP(
        req.user!.userId,
        validatedData.eventType as XpEventType,
        validatedData.taskId
      );
      res.status(201).json({
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

export default router;
