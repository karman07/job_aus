import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Job from '../models/Job';
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

export const createJob = async (req: Request, res: Response): Promise<void> => {
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
      companyIndustry: req.body['company.industry']
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

    // Handle file uploads
    let logoUrl = '';
    let contentFileUrl = '';
    
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files.logo && files.logo[0]) {
        logoUrl = `/uploads/${files.logo[0].filename}`;
        console.log('📁 Logo uploaded:', logoUrl);
      }
      
      if (files.contentFile && files.contentFile[0]) {
        contentFileUrl = `/uploads/${files.contentFile[0].filename}`;
        console.log('📁 Content file uploaded:', contentFileUrl);
      }
    }

    // Parse company data from form fields
    const companyData = {
      name: req.body['company.name'] || '',
      description: req.body['company.description'] || '',
      website: req.body['company.website'] || '',
      logo: logoUrl,
      size: req.body['company.size'] || '',
      founded: req.body['company.founded'] ? parseInt(req.body['company.founded']) : undefined,
      industry: (() => {
        const industryStr = req.body['company.industry'];
        if (!industryStr || industryStr === '[]' || industryStr === '') {
          return ['technology'];
        }
        try {
          const parsed = JSON.parse(industryStr);
          return parsed.length > 0 ? parsed : ['technology'];
        } catch {
          return ['technology'];
        }
      })(),
      location: req.body['company.location'] || '',
      contact: {
        email: req.body['company.contact.email'] || '',
        phone: req.body['company.contact.phone'] || ''
      }
    };

    // Parse job data - use either text fields or content file
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
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      company: companyData,
      status: 'active'
    };

    console.log('💾 About to save job data to MongoDB:', jobData);
    console.log('🔗 MongoDB connection status:', require('mongoose').connection.readyState);

    const job = new Job(jobData);
    console.log('📦 Job model created, about to save...');
    
    const savedJob = await job.save();
    console.log('✅ JOB SUCCESSFULLY SAVED TO DATABASE!');
    console.log('🆔 Saved Job ID:', savedJob._id);
    console.log('📊 Job Status in DB:', savedJob.status);
    console.log('🏢 Company Name in DB:', savedJob.company?.name);

    // Send job creation notification email
    try {
      const { sendJobCreationNotification } = require('../services/emailService');
      await sendJobCreationNotification(
        savedJob.title,
        savedJob.company?.name || 'Unknown Company',
        savedJob.company?.contact?.email
      );
      console.log('Job creation notification email sent');
    } catch (emailError) {
      console.error('Failed to send job creation email:', emailError);
    }

    // Verify the job was actually saved by querying it back
    const verifyJob = await Job.findById(savedJob._id);
    if (verifyJob) {
      console.log('✅ VERIFICATION: Job found in database after save');
      console.log('📋 Verified Job Title:', verifyJob.title);
    } else {
      console.log('❌ VERIFICATION FAILED: Job not found in database!');
    }

    // Format response to match your expected structure
    const response = {
      success: true,
      data: {
        job: {
          id: savedJob._id.toString(),
          companyId: savedJob._id.toString(),
          title: savedJob.title,
          description: savedJob.description,
          requirements: savedJob.requirements,
          keyResponsibilities: savedJob.keyResponsibilities,
          location: savedJob.location,
          state: savedJob.state,
          type: savedJob.type,
          jobTypeCategory: savedJob.jobTypeCategory,
          workType: savedJob.workType,
          industry: savedJob.industry,
          salaryDisplay: savedJob.salaryDisplay,
          tags: savedJob.tags,
          featured: false,
          urgent: false,
          status: 'active', // Return active in response but save as inactive
          applicantCount: savedJob.applicantCount,
          viewCount: 0,
          postedAt: savedJob.createdAt,
          createdAt: savedJob.createdAt,
          updatedAt: savedJob.updatedAt
        },
        company: {
          id: savedJob._id.toString(),
          name: savedJob.company?.name || '',
          description: savedJob.company?.description || '',
          industry: savedJob.company?.industry || [],
          location: savedJob.company?.location || '',
          website: savedJob.company?.website || '',
          logo: savedJob.company?.logo || '',
          size: savedJob.company?.size || '',
          founded: savedJob.company?.founded || null,
          contactEmail: savedJob.company?.contact?.email || '',
          contactPhone: savedJob.company?.contact?.phone || '',
          isVerified: false,
          createdAt: savedJob.createdAt,
          updatedAt: savedJob.updatedAt
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
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📝 Job update request received:', {
      body: req.body,
      files: req.files,
      jobId: req.params.id
    });

    // Handle file uploads
    let logoUrl = '';
    let contentFileUrl = '';
    
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files.logo && files.logo[0]) {
        logoUrl = `/uploads/${files.logo[0].filename}`;
        console.log('📁 New logo uploaded:', logoUrl);
      }
      
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
        if (key === 'tags' || key === 'company.industry') {
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
    
    // Update logo if uploaded
    if (logoUrl) {
      updateData['company.logo'] = logoUrl;
    }
    
    // Update contentFile if uploaded
    if (contentFileUrl) {
      updateData.contentFile = contentFileUrl;
      updateData.description = undefined;
      updateData.requirements = undefined;
      updateData.keyResponsibilities = undefined;
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true, omitUndefined: true }
    );

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    console.log('✅ Job updated successfully:', job._id);
    res.json({ success: true, data: { job } });
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
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    res.json({
      success: true,
      data: { job }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
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

