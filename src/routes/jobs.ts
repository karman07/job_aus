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
  body('state').isIn(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']).withMessage('Valid Australian state is required'),
  body('type').isIn(['Full Time', 'Part Time', 'Contract', 'FIFO 2:1', 'FIFO 8:6']).withMessage('Valid job type is required'),
  body('jobTypeCategory').isIn(['Permanent', 'Contract', 'Apprenticeship', 'Trainee']).withMessage('Valid job type category is required'),
  body('workType').isIn(['On-Site', 'Remote', 'Hybrid']).withMessage('Valid work type is required'),
  body('industry').isIn(['health', 'hospitality', 'childcare', 'construction', 'mining', 'technology']).withMessage('Valid industry is required'),
  body('salaryDisplay').trim().isLength({ min: 1 }).withMessage('Salary display is required')
];

// Public routes
router.get('/', (req, res) => {
  // Check if user is admin to show all jobs including inactive
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
        if (decoded) {
          const User = require('../models/User').default;
          User.findById(decoded.userId).then((user: any) => {
            if (user && user.role === 'admin') {
              getAllJobs(req, res);
            } else {
              getJobs(req, res);
            }
          }).catch(() => getJobs(req, res));
          return;
        }
      } catch {
        // Token invalid, fall through to public route
      }
    }
  }
  getJobs(req, res);
});

// Employer routes - require authentication
router.post('/', authenticateToken, requireEmployer, jobContentUpload.fields([
  { name: 'contentFile', maxCount: 1 }
]), jobValidation, createJob);

router.put('/:id', authenticateToken, jobContentUpload.fields([
  { name: 'contentFile', maxCount: 1 }
]), updateJob);

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