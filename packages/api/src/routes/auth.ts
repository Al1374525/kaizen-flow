/**
 * Authentication Routes
 * POST /auth/register - Register a new user
 * POST /auth/login - Login user
 * POST /auth/refresh - Refresh access token
 * GET /auth/me - Get current user (protected)
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  getUserById,
} from '../services/authService';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // Register the user
    const result = await registerUser(
      validatedData.email,
      validatedData.password,
      validatedData.firstName
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(
          error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
          400
        )
      );
      return;
    }
    next(error);
  }
});

/**
 * POST /auth/login
 * Login user
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Login the user
    const result = await loginUser(validatedData.email, validatedData.password);

    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(
          error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
          400
        )
      );
      return;
    }
    next(error);
  }
});

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validatedData = refreshSchema.parse(req.body);

    // Refresh the token
    const { accessToken } = refreshAccessToken(validatedData.refreshToken);

    res.json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(
          error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
          400
        )
      );
      return;
    }
    next(error);
  }
});

/**
 * GET /auth/me
 * Get current user (protected route)
 */
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const user = await getUserById(req.user.userId);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
