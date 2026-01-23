import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, requireEmployer, requireAdmin } from '../middleware/auth';
import { logoUpload, registrationUpload, parseNestedFormData } from '../middleware/upload';
import {
  getCompanyProfile,
  updateCompanyProfile,
  uploadLogo,
  getCompanyJobs,
  getCompanyAnalytics,
  editCompanyJob
} from '../controllers/companyController';
import { getAllCompanies } from '../controllers/adminController';

const router = express.Router();

// Company profile validation
const companyValidation = [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Company name cannot be empty'),
  body('location').optional().trim().isLength({ min: 1 }).withMessage('Location cannot be empty'),
  body('state').optional().isIn(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']).withMessage('Invalid state'),
  body('industry').optional().isArray({ min: 1 }).withMessage('At least one industry is required'),
  body('industry.*').optional().isIn(['health', 'hospitality', 'childcare', 'construction', 'mining', 'technology']).withMessage('Invalid industry'),
  body('size').optional().isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).withMessage('Invalid company size'),
  body('founded').optional().isInt({ min: 1800, max: new Date().getFullYear() }).withMessage('Invalid founded year'),
  body('website').optional().isURL().withMessage('Website must be a valid URL'),
  body('contact.email').optional().isEmail().withMessage('Invalid contact email'),
  body('contact.phone').optional().isMobilePhone('any').withMessage('Invalid contact phone')
];

// Admin route - must be first
router.get('/', authenticateToken, requireAdmin, getAllCompanies);

// Individual company routes
router.get('/profile', authenticateToken, getCompanyProfile);
router.put('/profile', 
  authenticateToken,
  registrationUpload.fields([
    { name: 'logo', maxCount: 1 }
  ]),
  parseNestedFormData,
  companyValidation,
  updateCompanyProfile
);
router.post('/upload-logo', authenticateToken, logoUpload.single('logo'), uploadLogo);
router.get('/jobs', authenticateToken, getCompanyJobs);
router.put('/jobs/:id', 
  authenticateToken,
  registrationUpload.fields([
    { name: 'contentFile', maxCount: 1 }
  ]),
  parseNestedFormData,
  editCompanyJob
);
router.get('/analytics', authenticateToken, getCompanyAnalytics);

export default router;