import express from 'express';
import { body } from 'express-validator';
import {
  getUserProfile,
  updateUserProfile,
  uploadCompanyLogo
} from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { logoUpload } from '../middleware/upload';
import { getAllUsers } from '../controllers/adminController';

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

// Admin route - must be first
router.get('/', authenticateToken, requireAdmin, getAllUsers);

// Individual user routes
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', profileValidation, updateUserProfile);
router.post('/upload-logo', logoUpload.single('logo'), uploadCompanyLogo);

export default router;