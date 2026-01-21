import { Response } from 'express';
import { validationResult } from 'express-validator';
import CandidateProfile from '../models/CandidateProfile';
import JobApplication from '../models/JobApplication';
import Job from '../models/Job';
import { AuthRequest } from '../types';

// Get candidate profile
export const getCandidateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'candidate') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Candidates only.'
      });
      return;
    }

    const profile = await CandidateProfile.findOne({ userId: user._id });
    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Candidate profile not found'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          phone: user.phone
        },
        profile
      }
    });
  } catch (error) {
    console.error('Get candidate profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update candidate profile
export const updateCandidateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array().map(err => err.msg)
      });
      return;
    }

    const user = req.user;
    if (!user || user.role !== 'candidate') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Candidates only.'
      });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const updateData = { ...req.body };

    // Handle file uploads
    if (files?.profilePhoto?.[0]) {
      updateData.profilePhoto = `/uploads/${files.profilePhoto[0].filename}`;
    }
    if (files?.resume?.[0]) {
      updateData.resumeUrl = `/uploads/${files.resume[0].filename}`;
    }
    if (files?.coverLetter?.[0]) {
      updateData.coverLetterUrl = `/uploads/${files.coverLetter[0].filename}`;
    }
    if (files?.certificates) {
      updateData.certificatesUrls = files.certificates.map(file => `/uploads/${file.filename}`);
    }

    // Convert string values to appropriate types
    if (updateData.salaryExpectation) {
      updateData.salaryExpectation = Number(updateData.salaryExpectation);
    }
    if (updateData.availableFrom) {
      updateData.availableFrom = new Date(updateData.availableFrom);
    }
    if (updateData.isOpenToWork !== undefined) {
      updateData.isOpenToWork = updateData.isOpenToWork === 'true' || updateData.isOpenToWork === true;
    }

    const profile = await CandidateProfile.findOneAndUpdate(
      { userId: user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Candidate profile not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { profile }
    });
  } catch (error) {
    console.error('Update candidate profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Upload resume
export const uploadResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'candidate') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Candidates only.'
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No resume file provided'
      });
      return;
    }

    const profile = await CandidateProfile.findOneAndUpdate(
      { userId: user._id },
      { resumeUrl: `/uploads/${req.file.filename}` },
      { new: true }
    );

    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Candidate profile not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resumeUrl: `/uploads/${req.file.filename}`,
        profile
      }
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get candidate applications
export const getCandidateApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'candidate') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Candidates only.'
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const applications = await JobApplication.find({ candidateId: user._id })
      .populate('jobId', 'title company location jobType workType salaryRange')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await JobApplication.countDocuments({ candidateId: user._id });

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get candidate applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get saved jobs
export const getSavedJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'candidate') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Candidates only.'
      });
      return;
    }

    // Temporary response - SavedJob functionality to be implemented
    res.json({
      success: true,
      data: {
        savedJobs: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        }
      }
    });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Save job
export const saveJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'candidate') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Candidates only.'
      });
      return;
    }

    const { jobId } = req.body;
    if (!jobId) {
      res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
      return;
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found'
      });
      return;
    }

    // Temporary response - SavedJob functionality to be implemented
    res.status(201).json({
      success: true,
      message: 'Job saved successfully (placeholder)',
      data: { savedJob: { jobId, candidateId: user._id } }
    });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Remove saved job
export const removeSavedJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'candidate') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Candidates only.'
      });
      return;
    }

    // Temporary response - SavedJob functionality to be implemented
    res.json({
      success: true,
      message: 'Saved job removed successfully (placeholder)'
    });
  } catch (error) {
    console.error('Remove saved job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};