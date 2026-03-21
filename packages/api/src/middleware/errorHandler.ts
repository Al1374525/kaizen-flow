/**
 * Global error handling middleware
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  error: ApiError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = 'Internal server error';
  let details: any = null;

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
  }
  // Handle application errors
  else if (error instanceof AppError || error.isOperational) {
    statusCode = error.statusCode || 500;
    message = error.message;
  }
  // Handle database errors
  else if (error.message?.includes('duplicate key')) {
    statusCode = 409;
    message = 'Resource already exists';
  } else if (error.message?.includes('foreign key')) {
    statusCode = 400;
    message = 'Invalid reference';
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error:', {
      message: error.message,
      stack: error.stack,
      statusCode,
      url: _req.url,
      method: _req.method,
    });
  }

  // Send error response
  const response: any = {
    success: false,
    error: message,
  };

  if (details) {
    response.details = details;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && error.stack) {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
}
