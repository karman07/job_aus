import express from 'express';
import { body } from 'express-validator';
import {
  getUserProfile,
  updateUserProfile,
  uploadCompanyLogo
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { logoUpload } from '../middleware/upload';

const router = express.Router();

// Profile validation
const profileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name cannot be empty'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name cannot be empty'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number')
];

// All routes require authentication
router.use(authenticateToken);

// Profile routes
router.get('/profile', getUserProfile);
router.put('/profile', profileValidation, updateUserProfile);
router.post('/upload-logo', logoUpload.single('logo'), uploadCompanyLogo);

export default router;