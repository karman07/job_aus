import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt';

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    console.log('🔐 Auth middleware - Token received:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.log('❌ No token provided');
      res.status(401).json({ success: false, message: 'Access token required' });
      return;
    }

    // Verify JWT token
    console.log('🔍 Verifying token...');
    const decoded = verifyAccessToken(token) as any;
    console.log('✅ Token decoded:', { userId: decoded.userId, email: decoded.email, role: decoded.role });
    
    // Find user by ID from token
    console.log('👤 Finding user by ID:', decoded.userId);
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('❌ User not found in database');
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    console.log('✅ User found:', { id: user._id, email: user.email, role: user.role });
    req.user = user;
    next();
  } catch (error) {
    console.log('❌ Auth middleware error:', error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ success: false, message: 'Invalid token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: 'Token expired' });
    } else {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};

// Role-based middleware
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    console.log('🛡️  Role check - Required:', roles, 'User role:', req.user?.role);
    
    if (!req.user) {
      console.log('❌ No user in request');
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      console.log('❌ Insufficient permissions');
      res.status(403).json({ 
        success: false, 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      });
      return;
    }

    console.log('✅ Role check passed');
    next();
  };
};

// Specific role middlewares
export const requireCandidate = requireRole(['candidate']);
export const requireEmployer = requireRole(['employer']);
export const requireAdmin = requireRole(['admin']);
export const requireCandidateOrEmployer = requireRole(['candidate', 'employer']);