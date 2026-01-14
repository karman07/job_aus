import express from 'express';
import { resumeUpload } from '../middleware/upload';
import {
  getAllApplications,
  getApplicationById,
  getApplicationsByCandidate,
  getApplicationsByJob
} from '../controllers/candidateController';

const router = express.Router();

// Create job application
router.post('/', resumeUpload.single('resume'), async (req, res) => {
  try {
    const JobApplication = require('../models/JobApplication').default;
    const Job = require('../models/Job').default;
    const { sendJobApplicationNotification, sendApplicationConfirmation } = require('../services/emailService');
    
    console.log('Creating application:', req.body);
    
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
    console.log('Application saved:', savedApplication._id);
    
    // Get job details for email notifications
    const job = await Job.findById(req.body.jobId);
    if (job) {
      const companyEmail = job.company?.contact?.email;
      
      try {
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
        console.log('Email notifications sent');
      } catch (emailError) {
        console.error('Failed to send emails:', emailError);
      }
    }
    
    res.status(201).json({ success: true, data: { application: savedApplication } });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get all applications
router.get('/', getAllApplications);

// Get application by ID
router.get('/:id', getApplicationById);

// Get applications by candidate
router.get('/candidate/:candidateId', getApplicationsByCandidate);

// Get applications by job
router.get('/job/:jobId', getApplicationsByJob);

export default router;