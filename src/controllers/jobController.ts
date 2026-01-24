import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Job from '../models/Job';
import Company from '../models/Company';
import { AuthRequest } from '../types';

export const getJobs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Debug: Check all jobs first
    const allJobs = await Job.find({});
    console.log('🔍 All jobs in database:', allJobs.length);
    console.log('📊 Job statuses:', allJobs.map(job => ({ id: job._id, status: job.status })));

    const jobs = await Job.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments({ status: 'active' });

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

export const createJob = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log('🚀 =================================');
  console.log('🚀 JOB CREATION API CALLED');
  console.log('🚀 =================================');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌐 Request URL:', req.url);
  console.log('📝 Request Method:', req.method);
  
  try {
    console.log('📝 Job creation request received:', {
      body: req.body,
      files: req.files,
      userId: req.user?._id,
      userRole: req.user?.role
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      res.status(400).json({
        success: false,
        errors: errors.array().map(err => err.msg)
      });
      return;
    }

    // Strict employer validation
    if (!req.user || req.user.role !== 'employer') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Only employers can create jobs.'
      });
      return;
    }

    // Get and validate company profile
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      res.status(400).json({
        success: false,
        message: 'Company profile not found. Please complete your company profile before posting jobs.'
      });
      return;
    }

    // Validate required company fields
    if (!company.name || !company.location || !company.state || !company.industry?.length) {
      res.status(400).json({
        success: false,
        message: 'Company profile incomplete. Please ensure company name, location, state, and industry are set.'
      });
      return;
    }

    // Handle file uploads
    let contentFileUrl = '';
    
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files.contentFile && files.contentFile[0]) {
        contentFileUrl = `/uploads/${files.contentFile[0].filename}`;
        console.log('📁 Content file uploaded:', contentFileUrl);
      }
    }

    // Create job data with strict employer binding
    const jobData = {
      title: req.body.title,
      description: contentFileUrl ? undefined : req.body.description,
      requirements: contentFileUrl ? undefined : req.body.requirements,
      keyResponsibilities: contentFileUrl ? undefined : req.body.keyResponsibilities,
      contentFile: contentFileUrl || undefined,
      location: req.body.location,
      state: req.body.state,
      type: req.body.type,
      jobTypeCategory: req.body.jobTypeCategory,
      workType: req.body.workType,
      industry: req.body.industry,
      salaryDisplay: req.body.salaryDisplay,
      salaryMin: req.body.salaryMin ? Number(req.body.salaryMin) : undefined,
      salaryMax: req.body.salaryMax ? Number(req.body.salaryMax) : undefined,
      sponsorshipAvailable: req.body.sponsorshipAvailable === 'true',
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      // CRITICAL: Bind job to employer ID
      postedBy: req.user._id,
      // Embed complete company data from Company model
      company: {
        name: company.name,
        description: company.description,
        website: company.website,
        logo: company.logo,
        size: company.size,
        founded: company.founded,
        industry: company.industry,
        location: company.location,
        contact: {
          email: company.contact?.email || 'Unknown Company',
          phone: company.contact?.phone || ''
        }
      },
      status: 'active'
    };

    console.log('💾 About to save job data to MongoDB:', {
      ...jobData,
      employerId: req.user._id,
      companyId: company._id
    });
    console.log('🔗 MongoDB connection status:', require('mongoose').connection.readyState);

    const job = new Job(jobData);
    console.log('📦 Job model created, about to save...');
    
    const savedJob = await job.save();
    console.log('✅ JOB SUCCESSFULLY SAVED TO DATABASE!');
    console.log('🆔 Saved Job ID:', savedJob._id);
    console.log('👤 Posted By Employer ID:', savedJob.postedBy);
    console.log('🏢 Company Name in DB:', savedJob.company?.name);
    console.log('📊 Job Status in DB:', savedJob.status);

    // Verify employer-job binding
    if (savedJob.postedBy !== req.user._id.toString()) {
      console.error('❌ CRITICAL: Job not properly bound to employer!');
      throw new Error('Job creation failed: Employer binding error');
    }

    // Send job creation notification email
    try {
      const { sendJobCreationNotification } = require('../services/emailService');
      await sendJobCreationNotification(
        savedJob.title,
        savedJob.company?.name || 'Unknown Company',
        savedJob.company?.contact?.email
      );
      console.log('📧 Job creation notification email sent');
    } catch (emailError) {
      console.error('❌ Failed to send job creation email:', emailError);
    }

    // Verify the job was actually saved by querying it back
    const verifyJob = await Job.findById(savedJob._id);
    if (verifyJob && verifyJob.postedBy === req.user._id.toString()) {
      console.log('✅ VERIFICATION: Job found and properly bound to employer');
      console.log('📋 Verified Job Title:', verifyJob.title);
      console.log('👤 Verified Employer ID:', verifyJob.postedBy);
    } else {
      console.log('❌ VERIFICATION FAILED: Job not found or not bound to employer!');
      throw new Error('Job verification failed');
    }

    // Format response to match expected structure
    const response = {
      success: true,
      message: 'Job created successfully',
      data: {
        job: {
          id: savedJob._id.toString(),
          companyId: company._id.toString(),
          title: savedJob.title,
          description: savedJob.description,
          requirements: savedJob.requirements,
          keyResponsibilities: savedJob.keyResponsibilities,
          contentFile: savedJob.contentFile,
          location: savedJob.location,
          state: savedJob.state,
          type: savedJob.type,
          jobTypeCategory: savedJob.jobTypeCategory,
          workType: savedJob.workType,
          industry: savedJob.industry,
          salaryDisplay: savedJob.salaryDisplay,
          salaryMin: savedJob.salaryMin,
          salaryMax: savedJob.salaryMax,
          sponsorshipAvailable: savedJob.sponsorshipAvailable,
          tags: savedJob.tags,
          status: savedJob.status,
          applicantCount: savedJob.applicantCount,
          customFields: savedJob.customFields,
          postedBy: savedJob.postedBy,
          postedAt: savedJob.createdAt,
          createdAt: savedJob.createdAt,
          updatedAt: savedJob.updatedAt
        },
        company: {
          id: company._id.toString(),
          userId: company.userId,
          name: company.name,
          description: company.description,
          industry: company.industry,
          location: company.location,
          state: company.state,
          website: company.website,
          logo: company.logo,
          size: company.size,
          founded: company.founded,
          contactEmail: company.contact?.email || '',
          contactPhone: company.contact?.phone || '',
          isVerified: company.isVerified,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt
        },
        employer: {
          id: req.user._id.toString(),
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          role: req.user.role
        }
      }
    };

    console.log('📤 Sending response with status 201');
    console.log('🚀 =================================');
    console.log('🚀 JOB CREATION COMPLETED');
    console.log('🚀 =================================');
    
    res.status(201).json(response);
  } catch (error) {
    console.error('❌ =================================');
    console.error('❌ ERROR CREATING JOB:');
    console.error('❌ =================================');
    console.error('❌ Error details:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ 
      success: false, 
      message: 'Server error during job creation',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export const updateJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('📝 Job update request received:', {
      body: req.body,
      files: req.files,
      jobId: req.params.id,
      userId: req.user?._id,
      userRole: req.user?.role
    });

    const jobId = req.params.id;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid job ID format' 
      });
      return;
    }

    // Check if job exists and user has permission
    const existingJob = await Job.findById(jobId);
    if (!existingJob) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    // Debug logging for authorization
    console.log('🔍 Authorization check:');
    console.log('👤 User ID:', req.user?._id);
    console.log('👤 User ID (string):', req.user?._id?.toString());
    console.log('👤 User Role:', req.user?.role);
    console.log('📝 Job Posted By:', existingJob.postedBy);
    console.log('📝 Job Posted By (type):', typeof existingJob.postedBy);
    console.log('🔄 Comparison result:', existingJob.postedBy === req.user?._id?.toString());

    // Authorization: Only job owner or admin can update
    if (req.user?.role !== 'admin' && existingJob.postedBy !== req.user?._id?.toString()) {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. You can only edit your own jobs.',
        debug: {
          userRole: req.user?.role,
          userId: req.user?._id?.toString(),
          jobPostedBy: existingJob.postedBy,
          isOwner: existingJob.postedBy === req.user?._id?.toString()
        }
      });
      return;
    }

    // Handle file uploads
    let contentFileUrl = existingJob.contentFile;
    
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files.contentFile && files.contentFile[0]) {
        contentFileUrl = `/uploads/${files.contentFile[0].filename}`;
        console.log('📁 New content file uploaded:', contentFileUrl);
      }
    }

    // Build update data - only include non-empty fields
    const updateData: any = {};
    
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== '' && req.body[key] !== null && req.body[key] !== undefined) {
        // Parse JSON strings for arrays
        if (key === 'tags') {
          try {
            updateData[key] = JSON.parse(req.body[key]);
          } catch {
            updateData[key] = req.body[key];
          }
        } else {
          updateData[key] = req.body[key];
        }
      }
    });
    
    // Update contentFile if uploaded
    if (contentFileUrl !== existingJob.contentFile) {
      updateData.contentFile = contentFileUrl;
    }

    // Convert string values to appropriate types
    if (updateData.salaryMin) updateData.salaryMin = Number(updateData.salaryMin);
    if (updateData.salaryMax) updateData.salaryMax = Number(updateData.salaryMax);
    if (updateData.sponsorshipAvailable) updateData.sponsorshipAvailable = updateData.sponsorshipAvailable === 'true';

    const job = await Job.findByIdAndUpdate(
      jobId,
      updateData,
      { new: true, runValidators: true, omitUndefined: true }
    );

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    console.log('✅ Job updated successfully:', job._id);
    res.json({ 
      success: true, 
      message: 'Job updated successfully',
      data: { job } 
    });
  } catch (error) {
    console.error('❌ Error updating job:', error);
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

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = req.params.id;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid job ID format' 
      });
      return;
    }

    const job = await Job.findById(jobId);

    if (!job) {
      res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
      return;
    }

    res.json({
      success: true,
      data: { job }
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments({});

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

