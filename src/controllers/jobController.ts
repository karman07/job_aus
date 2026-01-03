import { Response } from 'express';
import { validationResult } from 'express-validator';
import Job from '../models/Job';
import { AuthRequest, CreateJobDto, UpdateJobDto } from '../types';

export const createJob = async (req: AuthRequest<{}, {}, CreateJobDto>, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const jobData = {
      ...req.body,
      postedBy: req.admin!._id
    };

    const job = new Job(jobData);
    await job.save();
    await job.populate('postedBy', 'username email');

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getAllJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    const jobs = await Job.find(filter)
      .populate('postedBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
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

export const getJobById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const job = await Job.findById(req.params.id).populate('postedBy', 'username email');
    
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    res.json({ job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const updateJob = async (req: AuthRequest<{ id: string }, {}, UpdateJobDto>, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const job = await Job.findById(req.params.id);
    
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    if (job.postedBy.toString() !== req.admin!._id.toString()) {
      res.status(403).json({ message: 'Access denied. You can only update jobs you posted.' });
      return;
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'username email');

    res.json({
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      return;
    }

    const job = await Job.findById(req.params.id);
    
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    if (job.postedBy.toString() !== req.admin!._id.toString()) {
      res.status(403).json({ message: 'Access denied. You can only delete jobs you posted.' });
      return;
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};