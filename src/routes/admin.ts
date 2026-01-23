import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { generateTokens } from '../utils/jwt';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllCompanies,
  verifyCompany,
  updateCompany,
  deleteCompany,
  getAllCandidates,
  updateCandidate,
  deleteCandidate,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
  getDashboardAnalytics
} from '../controllers/adminController';

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin user
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password!);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token using the same utility as other parts of the app
    const { accessToken } = generateTokens(admin._id.toString(), admin.email, admin.role);
    
    return res.json({ 
      success: true, 
      message: 'Login successful',
      data: { 
        token: accessToken,
        admin: {
          _id: admin._id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create Admin
router.post('/create', async (req, res) => {
  try {
    const { email, firstName, lastName, password, phone } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      phone,
      role: 'admin'
    });

    const savedAdmin = await admin.save();
    
    return res.status(201).json({ 
      success: true, 
      message: 'Admin created successfully',
      data: { 
        admin: {
          _id: savedAdmin._id,
          email: savedAdmin.email,
          firstName: savedAdmin.firstName,
          lastName: savedAdmin.lastName,
          phone: savedAdmin.phone,
          role: savedAdmin.role,
          createdAt: savedAdmin.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get All Admins
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    return res.json({ success: true, data: { admins } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// User Management Routes
router.get('/users', authenticateToken, requireAdmin, getAllUsers);
router.get('/users/:id', authenticateToken, requireAdmin, getUserById);
router.put('/users/:id', authenticateToken, requireAdmin, updateUser);
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);

// Company Management Routes
router.get('/companies', authenticateToken, requireAdmin, getAllCompanies);
router.put('/companies/:id', authenticateToken, requireAdmin, updateCompany);
router.post('/companies/:id/verify', authenticateToken, requireAdmin, verifyCompany);
router.delete('/companies/:id', authenticateToken, requireAdmin, deleteCompany);

// Candidate Management Routes
router.get('/candidates', authenticateToken, requireAdmin, getAllCandidates);
router.put('/candidates/:id', authenticateToken, requireAdmin, updateCandidate);
router.delete('/candidates/:id', authenticateToken, requireAdmin, deleteCandidate);

// Application Management Routes
router.get('/applications', authenticateToken, requireAdmin, getAllApplications);
router.put('/applications/:id', authenticateToken, requireAdmin, updateApplicationStatus);
router.delete('/applications/:id', authenticateToken, requireAdmin, deleteApplication);

// Analytics Routes
router.get('/analytics/dashboard', authenticateToken, requireAdmin, getDashboardAnalytics);

// Delete Admin
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const admin = await User.findOneAndDelete({ 
      _id: req.params.id, 
      role: 'admin' 
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    return res.json({ 
      success: true, 
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update Admin
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { email, firstName, lastName, password, phone } = req.body;
    const updateData: any = { email, firstName, lastName, phone };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const admin = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'admin' },
      updateData,
      { new: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    return res.json({ success: true, data: { admin } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;