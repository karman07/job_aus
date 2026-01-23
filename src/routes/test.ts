import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Simple test route for debugging auth
router.get('/test-auth', authenticateToken, (req: any, res) => {
  res.json({
    success: true,
    message: 'Authentication successful',
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Test admin route
router.get('/test-admin', authenticateToken, requireAdmin, (req: any, res) => {
  res.json({
    success: true,
    message: 'Admin authentication successful',
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

export default router;