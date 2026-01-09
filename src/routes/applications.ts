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
    
    res.status(201).json({ success: true, data: { application: savedApplication } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
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