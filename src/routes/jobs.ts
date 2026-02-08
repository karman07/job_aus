import express from 'express';
import { body } from 'express-validator';
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById
} from '../controllers/jobController';
import { authenticateToken, requireEmployer, requireAdmin } from '../middleware/auth';

import { jobContentUpload } from '../middleware/upload';

const router = express.Router();

const jobValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Job title is required'),
  body('location').trim().isLength({ min: 1 }).withMessage('Location is required'),
  body('state').optional().isIn(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']).withMessage('Valid Australian state required if provided'),
  body('type').isIn(['Full Time', 'Part Time', 'Contract', 'FIFO 2:1', 'FIFO 8:6']).withMessage('Valid job type is required'),
  body('jobTypeCategory').isIn(['Permanent', 'Contract', 'Apprenticeship', 'Trainee']).withMessage('Valid job type category is required'),
  body('workType').isIn(['On-Site', 'Remote', 'Hybrid']).withMessage('Valid work type is required'),
  body('industry').isIn(['health', 'hospitality', 'childcare', 'construction', 'mining', 'technology']).withMessage('Valid industry is required'),
  body('salaryDisplay').trim().isLength({ min: 1 }).withMessage('Salary display is required')
];

// Public routes - admins see all jobs, others see only active
router.get('/', async (req, res) => {
  console.log('🔍 Jobs route accessed with auth:', !!req.headers.authorization);
  
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
      try {
        const { verifyAccessToken } = require('../utils/jwt');
        const decoded = verifyAccessToken(token) as any;
        console.log('🔓 Token decoded, userId:', decoded.userId, 'role:', decoded.role);
        
        const User = require('../models/User').default;
        const user = await User.findById(decoded.userId);
        console.log('👤 User found:', !!user, 'role:', user?.role);
        
        if (user?.role === 'admin') {
          console.log('✅ Admin access - returning all jobs');
          return getAllJobs(req, res);
        }
      } catch (error: any) {
        console.log('❌ Token verification failed:', error?.message || 'Unknown error');
      }
    }
  }
  console.log('📋 Regular access - returning active jobs only');
  getJobs(req, res);
});

// Employer routes - require authentication
router.post('/', authenticateToken, requireEmployer, jobContentUpload.fields([
  { name: 'contentFile', maxCount: 1 }
]), jobValidation, createJob);

router.put('/:id', authenticateToken, jobContentUpload.fields([
  { name: 'contentFile', maxCount: 1 }
]), updateJob);

router.delete('/:id', authenticateToken, deleteJob);

// Admin routes
router.get('/admin/all', authenticateToken, requireAdmin, getAllJobs);
router.put('/admin/:id', authenticateToken, requireAdmin, jobContentUpload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'contentFile', maxCount: 1 }
]), jobValidation, updateJob);
router.delete('/admin/:id', authenticateToken, requireAdmin, deleteJob);

// Single job route (must be last)
router.get('/:id', getJobById);

export default router;