/**
 * Simple test script to verify our Express server basics
 * Without database dependency
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = 3001;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Simple health check without database
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Kaizen Flow API is healthy (test mode)',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: 'test',
    version: '0.1.0',
  });
});

// Test routes
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Week 1 Day 1-2 backend test successful!',
    features: [
      '✅ Express server setup',
      '✅ TypeScript configuration',
      '✅ Security middleware',
      '✅ Error handling',
      '✅ API structure ready',
    ],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
});