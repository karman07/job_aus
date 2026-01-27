import { Response } from 'express';
import { validationResult } from 'express-validator';
import Company from '../models/Company';
import Job from '../models/Job';
import JobApplication from '../models/JobApplication';
import { AuthRequest } from '../types';

// Get company profile
export const getCompanyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('🏢 Get company profile request:', {
      user: req.user ? {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
      } : 'No user',
      headers: req.headers.authorization ? 'Token present' : 'No token'
    });

    const user = req.user;
    if (!user) {
      console.log('❌ No user in request');
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (user.role !== 'employer') {
      console.log('❌ User is not an employer:', user.role);
      res.status(403).json({
        success: false,
        message: 'Access denied. Employers only.'
      });
      return;
    }

    console.log('🔍 Looking for company profile for user:', user._id);
    const profile = await Company.findOne({ userId: user._id.toString() });
    
    if (!profile) {
      console.log('❌ No company profile found for user:', user._id);
      
      // Create a new company profile with default values
      const newCompany = new Company({
        userId: user._id,
        name: '',
        description: '',
        website: '',
        logo: '',
        size: '',
        founded: null,
        industry: [],
        location: '',
        state: 'NSW',
        contact: {
          email: user.email,
          phone: user.phone || ''
        },
        isVerified: false
      });
      
      await newCompany.save();
      console.log('✅ New company profile created:', newCompany._id);
      
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
          profile: {
            id: newCompany._id,
            userId: newCompany.userId,
            name: newCompany.name,
            description: newCompany.description,
            website: newCompany.website,
            logo: newCompany.logo,
            size: newCompany.size,
            founded: newCompany.founded,
            industry: newCompany.industry,
            location: newCompany.location,
            state: newCompany.state,
            contact: newCompany.contact,
            isVerified: newCompany.isVerified,
            createdAt: newCompany.createdAt,
            updatedAt: newCompany.updatedAt,
            isNew: true
          }
        }
      });
      return;
    }

    console.log('✅ Company profile found:', profile._id);
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
        profile: {
          id: profile._id,
          userId: profile.userId,
          name: profile.name,
          description: profile.description,
          website: profile.website,
          logo: profile.logo,
          size: profile.size,
          founded: profile.founded,
          industry: profile.industry,
          location: profile.location,
          state: profile.state,
          contact: profile.contact,
          isVerified: profile.isVerified,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
          isNew: false
        }
      }
    });
  } catch (error) {
    console.error('❌ Get company profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update company profile
export const updateCompanyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
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
    if (!user || user.role !== 'employer') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Employers only.'
      });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const updateData = { ...req.body };

    // Handle logo upload
    if (files?.logo?.[0]) {
      updateData.logo = `/uploads/${files.logo[0].filename}`;
    }

    // Convert string values to appropriate types
    if (updateData.founded) {
      updateData.founded = Number(updateData.founded);
    }

    const profile = await Company.findOneAndUpdate(
      { userId: user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Company profile updated successfully',
      data: { profile }
    });
  } catch (error) {
    console.error('Update company profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Upload logo
export const uploadLogo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'employer') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Employers only.'
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No logo file provided'
      });
      return;
    }

    const profile = await Company.findOneAndUpdate(
      { userId: user._id },
      { logo: `/uploads/${req.file.filename}` },
      { new: true }
    );

    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        logoUrl: `/uploads/${req.file.filename}`,
        profile
      }
    });
  } catch (error) {
    console.error('Upload logo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get company jobs
export const getCompanyJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'employer') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Employers only.'
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    const filter: any = { postedBy: user._id };
    if (status) {
      filter.status = status;
    }

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(filter);

    // Get application counts for each job
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await JobApplication.countDocuments({ jobId: job._id });
        return {
          ...job.toObject(),
          applicationCount
        };
      })
    );

    res.json({
      success: true,
      data: {
        jobs: jobsWithStats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get company jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Edit company job
export const editCompanyJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'employer') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Employers only.'
      });
      return;
    }

    const jobId = req.params.id;
    const job = await Job.findOne({ _id: jobId, postedBy: user._id });

    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found or access denied'
      });
      return;
    }

    // Handle file uploads
    let contentFileUrl = job.contentFile;
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.contentFile?.[0]) {
        contentFileUrl = `/uploads/${files.contentFile[0].filename}`;
      }
    }

    const updateData = { ...req.body };
    if (contentFileUrl !== job.contentFile) {
      updateData.contentFile = contentFileUrl;
    }

    // Convert string values to appropriate types
    if (updateData.salaryMin) updateData.salaryMin = Number(updateData.salaryMin);
    if (updateData.salaryMax) updateData.salaryMax = Number(updateData.salaryMax);
    if (updateData.sponsorshipAvailable) updateData.sponsorshipAvailable = updateData.sponsorshipAvailable === 'true';
    if (updateData.tags && typeof updateData.tags === 'string') {
      try {
        updateData.tags = JSON.parse(updateData.tags);
      } catch {
        updateData.tags = [];
      }
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job: updatedJob }
    });
  } catch (error) {
    console.error('Edit company job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get company analytics
export const getCompanyAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'employer') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Employers only.'
      });
      return;
    }

    // Get basic stats
    const totalJobs = await Job.countDocuments({ employerId: user._id });
    const activeJobs = await Job.countDocuments({ employerId: user._id, status: 'active' });
    const totalApplications = await JobApplication.countDocuments({
      jobId: { $in: await Job.find({ employerId: user._id }).distinct('_id') }
    });

    // Get applications by status
    const applicationsByStatus = await JobApplication.aggregate([
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'job'
        }
      },
      {
        $match: {
          'job.employerId': user._id
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent applications
    const recentApplications = await JobApplication.find({
      jobId: { $in: await Job.find({ employerId: user._id }).distinct('_id') }
    })
      .populate('jobId', 'title')
      .populate('candidateId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        stats: {
          totalJobs,
          activeJobs,
          totalApplications
        },
        applicationsByStatus,
        recentApplications
      }
    });
  } catch (error) {
    console.error('Get company analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};