import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  refreshTokenHandler,
  logout,
  getProfile
} from '../controllers/authController';
import { googleAuth } from '../controllers/googleAuthController';
import { authenticateToken } from '../middleware/auth';
import { registrationUpload, parseNestedFormData } from '../middleware/upload';

const router = express.Router();

// Registration validation for form-data
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name cannot be empty if provided'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['candidate', 'employer'])
    .withMessage('Role must be either candidate or employer'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  // Company validation for employers
  body('company.name')
    .if(body('role').equals('employer'))
    .notEmpty()
    .trim()
    .withMessage('Company name is required for employers'),
  body('company.location')
    .if(body('role').equals('employer'))
    .notEmpty()
    .trim()
    .withMessage('Company location is required for employers'),
  body('company.state')
    .if(body('role').equals('employer'))
    .optional()
    .isIn(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'])
    .withMessage('Valid Australian state required if provided for employers'),
  body('company.industry')
    .if(body('role').equals('employer'))
    .isArray({ min: 1 })
    .withMessage('At least one industry is required for employers'),
  body('company.industry.*')
    .if(body('role').equals('employer'))
    .isIn(['health', 'hospitality', 'childcare', 'construction', 'mining', 'technology'])
    .withMessage('Invalid industry selected'),
  body('company.contact.email')
    .if(body('role').equals('employer'))
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid company contact email is required for employers'),
  body('company.website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  body('company.size')
    .optional()
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])
    .withMessage('Invalid company size'),
  body('company.founded')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Founded year must be between 1800 and current year'),
  body('company.contact.phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid company phone number')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
];

// Routes
router.post('/register', 
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('🚀 Registration route hit');
    console.log('📋 Content-Type:', req.headers['content-type']);
    next();
  },
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    registrationUpload.fields([
      { name: 'profilePhoto', maxCount: 1 },
      { name: 'resume', maxCount: 1 },
      { name: 'coverLetter', maxCount: 1 },
      { name: 'certificates', maxCount: 5 },
      { name: 'logo', maxCount: 1 }
    ])(req, res, (err: any) => {
      if (err) {
        console.error('💥 Multer error:', err);
        res.status(400).json({
          success: false,
          message: 'File upload error',
          error: err.message
        });
        return;
      }
      console.log('✅ Multer processed successfully');
      next();
    });
  },
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('🚀 After multer - Request processed');
    console.log('📋 Body keys:', Object.keys(req.body));
    console.log('📁 Files:', req.files ? Object.keys(req.files) : 'none');
    console.log('📝 Body content:', req.body);
    parseNestedFormData(req, res, next);
  },
  register
);
router.post('/login', loginValidation, login);
router.post('/google', googleAuth);
router.post('/google-login', googleAuth);
router.post('/refresh', refreshTokenValidation, refreshTokenHandler);
router.post('/logout', authenticateToken, logout);
router.get('/profile', authenticateToken, getProfile);

export default router;