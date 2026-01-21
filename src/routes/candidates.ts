import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { resumeUpload, registrationUpload, parseNestedFormData } from '../middleware/upload';
import {
  getCandidateProfile,
  updateCandidateProfile,
  uploadResume,
  getCandidateApplications,
  getSavedJobs,
  saveJob,
  removeSavedJob
} from '../controllers/candidateController';

const router = express.Router();

// Profile validation
const profileValidation = [
  body('fullName').optional().trim().isLength({ min: 1 }).withMessage('Full name cannot be empty'),
  body('location').optional().trim().isLength({ min: 1 }).withMessage('Location cannot be empty'),
  body('state').optional().isIn(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']).withMessage('Invalid state'),
  body('yearsExperience').optional().isIn(['0-1', '1-3', '3-5', '5-10', '10+']).withMessage('Invalid experience level'),
  body('visaStatus').optional().isIn(['citizen', 'pr', 'visa_holder', 'needs_sponsorship']).withMessage('Invalid visa status'),
  body('preferredIndustries').optional().isArray().withMessage('Preferred industries must be an array'),
  body('salaryExpectation').optional().isNumeric().withMessage('Salary expectation must be a number'),
  body('portfolioUrl').optional().isURL().withMessage('Portfolio URL must be valid'),
  body('linkedinUrl').optional().isURL().withMessage('LinkedIn URL must be valid')
];

// Routes
router.get('/profile', authenticateToken, getCandidateProfile);
router.put('/profile', 
  authenticateToken,
  registrationUpload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 },
    { name: 'certificates', maxCount: 5 }
  ]),
  parseNestedFormData,
  profileValidation,
  updateCandidateProfile
);
router.post('/upload-resume', authenticateToken, resumeUpload.single('resume'), uploadResume);
router.get('/applications', authenticateToken, getCandidateApplications);
router.get('/saved-jobs', authenticateToken, getSavedJobs);
router.post('/saved-jobs', authenticateToken, saveJob);
router.delete('/saved-jobs/:jobId', authenticateToken, removeSavedJob);

export default router;