import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Admin from '../models/Admin';
import { generateToken } from '../middleware/auth';
import { LoginDto, SignupDto } from '../types';

export const signup = async (req: Request<{}, {}, SignupDto>, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const { username, email, password } = req.body;

    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }]
    });

    if (existingAdmin) {
      res.status(409).json({ message: 'Admin with this email or username already exists' });
      return;
    }

    const admin = new Admin({ username, email, password });
    await admin.save();

    const token = generateToken(admin._id.toString());

    res.status(201).json({
      message: 'Admin created successfully',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const login = async (req: Request<{}, {}, LoginDto>, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(admin._id.toString());

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};