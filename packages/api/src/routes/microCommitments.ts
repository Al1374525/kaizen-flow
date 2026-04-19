/**
 * Micro-Commitment Routes
 * Endpoints to break down tasks and progress through micro-commitments
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import {
  breakdownTask,
  startMicroCommitment,
  completeMicroCommitment,
  getMicroCommitments,
} from '../services/microCommitmentService';

const router = Router();

const idParamSchema = z.object({
  id: z.string().uuid('Invalid task id'),
});

router.post(
  '/tasks/:id/breakdown',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const microCommitments = await breakdownTask(req.user!.userId, id);
      res.status(201).json({
        success: true,
        data: { microCommitments },
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

router.get(
  '/tasks/:id/micro-commitments',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const microCommitments = await getMicroCommitments(req.user!.userId, id);
      res.json({
        success: true,
        data: { microCommitments },
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

router.post(
  '/micro-commitments/:id/start',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const result = await startMicroCommitment(req.user!.userId, id);
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

router.post(
  '/micro-commitments/:id/complete',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const result = await completeMicroCommitment(req.user!.userId, id);
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

export default router;
