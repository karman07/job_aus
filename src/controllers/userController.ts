import { Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import Admin from '../models/Admin';
import { AuthRequest, CreateUserDto, UpdateUserDto } from '../types';

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      res.status(409).json({ message: 'User with this email or username already exists' });
      return;
    }

    const userData = {
      username,
      email,
      password,
      role,
      createdBy: req.admin!._id
    };

    const user = new User(userData);
    await user.save();

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    // Get users from User collection
    const users = await User.find(filter)
      .select('-password')
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get admins from Admin collection and format them as users
    const admins = await Admin.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    // Format admins to match user structure
    const formattedAdmins = admins.map((admin: any) => ({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: 'admin',
      isActive: true,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      createdBy: null
    }));

    // Combine users and admins
    const allUsers = [...formattedAdmins, ...users];
    const total = await User.countDocuments(filter) + admins.length;

    res.json({
      users: allUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'username email');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password').populate('createdBy', 'username email');

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};