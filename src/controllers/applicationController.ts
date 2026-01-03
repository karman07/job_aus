import { Response } from 'express';
import { validationResult } from 'express-validator';
import Application from '../models/Application';
import Job from '../models/Job';
import { AuthRequest, CreateApplicationDto, UpdateApplicationDto } from '../types';

export const createApplication = async (req: AuthRequest<{}, {}, CreateApplicationDto>, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'Resume file is required' });
      return;
    }

    const job = await Job.findById(req.body.jobId);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    if (job.status !== 'active') {
      res.status(400).json({ message: 'Job is not accepting applications' });
      return;
    }

    if (new Date() > job.applicationDeadline) {
      res.status(400).json({ message: 'Application deadline has passed' });
      return;
    }

    const existingApplication = await Application.findOne({
      jobId: req.body.jobId,
      email: req.body.email
    });

    if (existingApplication) {
      res.status(409).json({ message: 'You have already applied for this job' });
      return;
    }

    const applicationData = {
      ...req.body,
      resume: req.file.path
    };

    const application = new Application(applicationData);
    await application.save();
    await application.populate('jobId', 'title company');

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getAllApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.jobId) {
      filter.jobId = req.query.jobId;
    }

    const applications = await Application.find(filter)
      .populate('jobId', 'title company location')
      .populate('reviewedBy', 'username email')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments(filter);

    res.json({
      applications,
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

export const getApplicationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const application = await Application.findById(req.params.id)
      .populate('jobId', 'title company location')
      .populate('reviewedBy', 'username email');
    
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.json({ application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const updateApplication = async (req: AuthRequest<{ id: string }, {}, UpdateApplicationDto>, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const application = await Application.findById(req.params.id);
    
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    const updateData: any = { ...req.body };
    if (req.body.status && req.body.status !== application.status) {
      updateData.reviewedBy = req.admin!._id;
      updateData.reviewedAt = new Date();
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('jobId', 'title company location')
     .populate('reviewedBy', 'username email');

    res.json({
      message: 'Application updated successfully',
      application: updatedApplication
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const deleteApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const application = await Application.findById(req.params.id);
    
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getApplicationsByJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    const filter: any = { jobId: req.params.jobId };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const applications = await Application.find(filter)
      .populate('reviewedBy', 'username email')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments(filter);

    res.json({
      applications,
      job: {
        id: job._id,
        title: job.title,
        company: job.company
      },
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