import { body, param, query } from 'express-validator';

export const signupValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const createJobValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Job title must be between 1 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Job description must be between 10 and 2000 characters'),
  
  body('company')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Company name must be between 1 and 100 characters'),
  
  body('location')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Location must be between 1 and 100 characters'),
  
  body('salary.min')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),
  
  body('salary.max')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Maximum salary must be a positive number')
    .custom((value, { req }) => {
      if (value < req.body.salary.min) {
        throw new Error('Maximum salary must be greater than minimum salary');
      }
      return true;
    }),
  
  body('salary.currency')
    .isIn(['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'INR'])
    .withMessage('Currency must be one of: USD, EUR, GBP, AUD, CAD, INR'),
  
  body('type')
    .isIn(['full-time', 'part-time', 'contract', 'internship'])
    .withMessage('Job type must be one of: full-time, part-time, contract, internship'),
  
  body('requirements')
    .isArray({ min: 1 })
    .withMessage('At least one requirement is needed'),
  
  body('requirements.*')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Each requirement must be between 1 and 200 characters'),
  
  body('benefits')
    .optional()
    .isArray(),
  
  body('benefits.*')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Each benefit cannot exceed 200 characters'),
  
  body('applicationDeadline')
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (value <= new Date()) {
        throw new Error('Application deadline must be in the future');
      }
      return true;
    })
];

export const updateJobValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid job ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Job title must be between 1 and 100 characters'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'closed'])
    .withMessage('Status must be one of: active, inactive, closed')
];

export const createApplicationValidation = [
  body('jobId')
    .isMongoId()
    .withMessage('Invalid job ID'),
  
  body('applicantName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Applicant name must be between 1 and 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Cover letter cannot exceed 1000 characters'),
  
  body('experience')
    .isNumeric()
    .isFloat({ min: 0, max: 50 })
    .withMessage('Experience must be between 0 and 50 years'),
  
  body('skills')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required'),
  
  body('skills.*')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each skill must be between 1 and 50 characters')
];

export const updateApplicationValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid application ID'),
  
  body('status')
    .optional()
    .isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'])
    .withMessage('Status must be one of: pending, reviewed, shortlisted, rejected, hired'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

export const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
];

export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

export const createUserValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .isIn(['user', 'moderator', 'admin'])
    .withMessage('Role must be user, moderator, or admin')
];

export const updateUserValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
  
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .optional()
    .isIn(['user', 'moderator', 'admin'])
    .withMessage('Role must be user, moderator, or admin'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];