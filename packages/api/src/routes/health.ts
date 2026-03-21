/**
 * Health check routes
 */

import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    // Test database connection
    await getDb().raw('SELECT 1');
    
    res.json({
      success: true,
      message: 'Kaizen Flow API is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '0.1.0',
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service unhealthy',
      error: 'Database connection failed',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;