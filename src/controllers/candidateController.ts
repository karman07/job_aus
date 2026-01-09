import { Request, Response } from 'express';
import CandidateProfile from '../models/CandidateProfile';
import path from 'path';
import fs from 'fs';

export const createCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Creating candidate with data:', req.body);
    const candidate = new CandidateProfile(req.body);
    const savedCandidate = await candidate.save();
    console.log('Candidate saved successfully:', savedCandidate._id);
    res.status(201).json({ success: true, data: { candidate: savedCandidate } });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ success: false, message: 'Server error', error: (error as Error).message });
  }
};

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

export const getCandidateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const candidate = await CandidateProfile.findById(req.params.id);
    if (!candidate) {
      res.status(404).json({ success: false, message: 'Candidate not found' });
      return;
    }
    res.json({ success: true, data: { candidate } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const candidate = await CandidateProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!candidate) {
      res.status(404).json({ success: false, message: 'Candidate not found' });
      return;
    }

    res.json({ success: true, data: { candidate } });
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
    res.json({ success: true, message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const JobApplication = require('../models/JobApplication').default;
    const Job = require('../models/Job').default;
    const { sendJobApplicationNotification, sendApplicationConfirmation } = require('../services/emailService');
    
    console.log('Creating application with data:', req.body);
    
    let resumeUrl = '';
    if (req.file) {
      resumeUrl = `/uploads/${req.file.filename}`;
    }

    const applicationData = {
      ...req.body,
      resumeUrl
    };

    const application = new JobApplication(applicationData);
    const savedApplication = await application.save();
    console.log('Application saved successfully:', savedApplication._id);
    
    // Get job details for email notifications
    const job = await Job.findById(req.body.jobId);
    if (job) {
      console.log('Job found for email notifications:', job.title);
      const companyEmail = job.company?.contact?.email;
      
      try {
        // Send notifications
        await sendJobApplicationNotification(
          req.body.fullName,
          req.body.email,
          job.title,
          job.company?.name || 'Unknown Company',
          resumeUrl,
          companyEmail
        );
        
        await sendApplicationConfirmation(
          req.body.email,
          req.body.fullName,
          job.title,
          job.company?.name || 'Unknown Company'
        );
        console.log('Email notifications queued successfully');
      } catch (emailError) {
        console.error('Failed to queue email notifications:', emailError);
      }
    } else {
      console.log('Job not found for email notifications');
    }
    
    res.status(201).json({ success: true, data: { application: savedApplication } });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const JobApplication = require('../models/JobApplication').default;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const applications = await JobApplication.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await JobApplication.countDocuments({});

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

export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const JobApplication = require('../models/JobApplication').default;
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }
    res.json({ success: true, data: { application } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getApplicationsByCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const JobApplication = require('../models/JobApplication').default;
    const applications = await JobApplication.find({ candidateId: req.params.candidateId })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { applications } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getApplicationsByJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const JobApplication = require('../models/JobApplication').default;
    const applications = await JobApplication.find({ jobId: req.params.jobId })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { applications } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

