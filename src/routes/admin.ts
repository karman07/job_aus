import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

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

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: admin._id, 
        email: admin.email, 
        role: admin.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );
    
    return res.json({ 
      success: true, 
      message: 'Login successful',
      data: { 
        token,
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
router.get('/', async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    return res.json({ success: true, data: { admins } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete Admin
router.delete('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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