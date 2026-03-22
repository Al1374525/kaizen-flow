/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../services/authService';
import { AppError } from './errorHandler';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Extract token from Authorization header
 */
function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
}

/**
 * Authentication middleware - protects routes
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      throw new AppError('No token provided. Please log in.', 401);
    }

    const payload = verifyToken(token);
    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication - doesn't require token but parses it if present
 */
export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const token = extractToken(req.headers.authorization);

    if (token) {
      const payload = verifyToken(token);
      req.user = payload;
    }
  } catch {
    // Silently ignore invalid tokens for optional auth
  }

  next();
}
