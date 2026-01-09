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
import { authenticateToken } from '../middleware/auth';

import { logoUpload } from '../middleware/upload';

const router = express.Router();

const jobValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Job title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Job description is required'),
  body('requirements').trim().isLength({ min: 1 }).withMessage('Job requirements are required'),
  body('keyResponsibilities').trim().isLength({ min: 1 }).withMessage('Key responsibilities are required'),
  body('location').trim().isLength({ min: 1 }).withMessage('Location is required'),
  body('state').isIn(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']).withMessage('Valid Australian state is required'),
  body('type').isIn(['Full Time', 'Part Time', 'Contract', 'FIFO 2:1', 'FIFO 8:6']).withMessage('Valid job type is required'),
  body('jobTypeCategory').isIn(['Permanent', 'Contract', 'Apprenticeship', 'Trainee']).withMessage('Valid job type category is required'),
  body('workType').isIn(['On-Site', 'Remote', 'Hybrid']).withMessage('Valid work type is required'),
  body('industry').isIn(['health', 'hospitality', 'childcare', 'construction', 'mining', 'technology']).withMessage('Valid industry is required'),
  body('salaryDisplay').trim().isLength({ min: 1 }).withMessage('Salary display is required')
];

// Public routes
router.get('/', getJobs);
router.post('/', logoUpload.single('logo'), jobValidation, createJob);

// Admin routes
router.get('/admin/all', authenticateToken, getAllJobs);
router.put('/admin/:id', authenticateToken, jobValidation, updateJob);
router.delete('/admin/:id', authenticateToken, deleteJob);

// Single job route (must be last)
router.get('/:id', getJobById);

export default router;