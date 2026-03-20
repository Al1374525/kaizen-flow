/**
 * Authentication routes
 */

import { Router } from 'express';

const router = Router();

// Placeholder routes - we'll implement these in Day 3-4
router.post('/register', (req, res) => {
  res.json({ 
    success: false, 
    message: 'Auth routes not implemented yet' 
  });
});

router.post('/login', (req, res) => {
  res.json({ 
    success: false, 
    message: 'Auth routes not implemented yet' 
  });
});

router.post('/refresh', (req, res) => {
  res.json({ 
    success: false, 
    message: 'Auth routes not implemented yet' 
  });
});

export default router;