import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { AuthRequest } from '../types';

export const authGuard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { adminId: string };
    const admin = await Admin.findById(decoded.adminId).select('-password');

    if (!admin) {
      res.status(401).json({ message: 'Invalid token. Admin not found.' });
      return;
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const generateToken = (adminId: string): string => {
  return jwt.sign({ adminId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};