import { Request, Response } from 'express';
import User from '../models/User';
import CandidateProfile from '../models/CandidateProfile';
import Company from '../models/Company';
import Job from '../models/Job';
import JobApplication from '../models/JobApplication';
import SavedJob from '../models/SavedJob';
import { AuthRequest } from '../types';

// User Management
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const role = req.query.role as string;

    const filter = role ? { role } : {};
    
    const users = await User.find(filter)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken');
    
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    let profile = null;
    if (user.role === 'candidate') {
      profile = await CandidateProfile.findOne({ userId: user._id });
    } else if (user.role === 'employer') {
      profile = await Company.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      data: { user, profile }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, role, isEmailVerified } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, role, isEmailVerified },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Clean up related data
    if (user.role === 'candidate') {
      await CandidateProfile.deleteOne({ userId: user._id });
      await SavedJob.deleteMany({ candidateId: user._id });
      await JobApplication.deleteMany({ candidateId: user._id });
    } else if (user.role === 'employer') {
      await Company.deleteOne({ userId: user._id });
      await Job.deleteMany({ postedBy: user._id });
    }

    res.json({
      success: true,
      message: 'User and related data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Company Management
export const getAllCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const companies = await Company.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Company.countDocuments({});

    res.json({
      success: true,
      data: {
        companies,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!company) {
      res.status(404).json({ success: false, message: 'Company not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Company verified successfully',
      data: { company }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!company) {
      res.status(404).json({ success: false, message: 'Company not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: { company }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    
    if (!company) {
      res.status(404).json({ success: false, message: 'Company not found' });
      return;
    }

    // Delete related jobs
    await Job.deleteMany({ postedBy: company.userId });

    res.json({
      success: true,
      message: 'Company and related jobs deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Job Management
export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    const filter = status ? { status } : {};

    const jobs = await Job.find(filter)
      .populate('postedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    // Delete related applications and saved jobs
    await JobApplication.deleteMany({ jobId: job._id });
    await SavedJob.deleteMany({ jobId: job._id });

    res.json({
      success: true,
      message: 'Job and related data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Candidate Management
export const getAllCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const candidates = await CandidateProfile.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CandidateProfile.countDocuments({});

    res.json({
      success: true,
      data: {
        candidates,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const candidate = await CandidateProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!candidate) {
      res.status(404).json({ success: false, message: 'Candidate not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Candidate updated successfully',
      data: { candidate }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const candidate = await CandidateProfile.findByIdAndDelete(req.params.id);
    
    if (!candidate) {
      res.status(404).json({ success: false, message: 'Candidate not found' });
      return;
    }

    // Delete related data
    await SavedJob.deleteMany({ candidateId: candidate.userId });
    await JobApplication.deleteMany({ candidateId: candidate._id });

    res.json({
      success: true,
      message: 'Candidate and related data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Application Management
export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    const filter = status ? { status } : {};

    const applications = await JobApplication.find(filter)
      .populate('jobId', 'title company location')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await JobApplication.countDocuments(filter);

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: { application }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);
    
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Analytics
export const getDashboardAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalJobs,
      totalApplications,
      totalCompanies,
      activeJobs,
      pendingApplications,
      verifiedCompanies
    ] = await Promise.all([
      User.countDocuments({}),
      Job.countDocuments({}),
      JobApplication.countDocuments({}),
      Company.countDocuments({}),
      Job.countDocuments({ status: 'active' }),
      JobApplication.countDocuments({ status: 'Pending' }),
      Company.countDocuments({ isVerified: true })
    ]);

    // Get monthly stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [newUsers, newJobs, newApplications] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Job.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      JobApplication.countDocuments({ appliedAt: { $gte: thirtyDaysAgo } })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalJobs,
        totalApplications,
        totalCompanies,
        activeJobs,
        pendingApplications,
        verifiedCompanies,
        monthlyStats: {
          newUsers,
          newJobs,
          newApplications
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};