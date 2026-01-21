import { Response } from 'express';
import Job from '../models/Job';
import { AuthRequest } from '../types';

// Get jobs posted by the authenticated employer
export const getEmployerJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'employer') {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. Only employers can access this endpoint.' 
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Strict employer ID filtering
    const jobs = await Job.find({ 
      postedBy: user._id.toString() // Ensure exact match with employer ID
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments({ 
      postedBy: user._id.toString() 
    });

    // Verify all jobs belong to this employer
    const invalidJobs = jobs.filter(job => job.postedBy !== user._id.toString());
    if (invalidJobs.length > 0) {
      console.error('SECURITY ALERT: Jobs found that do not belong to employer:', invalidJobs.map(j => j._id));
      res.status(500).json({ 
        success: false, 
        message: 'Data integrity error' 
      });
      return;
    }

    console.log(`📋 Employer ${user._id} retrieved ${jobs.length} jobs`);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        employer: {
          id: user._id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`
        }
      }
    });
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update job posted by the authenticated employer
export const updateEmployerJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'employer') {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. Only employers can update jobs.' 
      });
      return;
    }

    // Strict ownership verification
    const job = await Job.findOne({ 
      _id: req.params.id, 
      postedBy: user._id.toString() // Exact employer ID match
    });
    
    if (!job) {
      res.status(404).json({ 
        success: false, 
        message: 'Job not found or you do not have permission to update this job' 
      });
      return;
    }

    // Double-check ownership
    if (job.postedBy !== user._id.toString()) {
      console.error(`SECURITY ALERT: User ${user._id} attempted to update job ${job._id} owned by ${job.postedBy}`);
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. You can only update your own jobs.' 
      });
      return;
    }

    // Handle file uploads
    let contentFileUrl = '';
    
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files.contentFile && files.contentFile[0]) {
        contentFileUrl = `/uploads/${files.contentFile[0].filename}`;
      }
    }

    // Build update data
    const updateData: any = {};
    
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== '' && req.body[key] !== null && req.body[key] !== undefined) {
        if (key === 'tags') {
          try {
            updateData[key] = JSON.parse(req.body[key]);
          } catch {
            updateData[key] = req.body[key];
          }
        } else if (key === 'salaryMin' || key === 'salaryMax') {
          updateData[key] = Number(req.body[key]);
        } else if (key === 'sponsorshipAvailable') {
          updateData[key] = req.body[key] === 'true';
        } else {
          updateData[key] = req.body[key];
        }
      }
    });
    
    // Update contentFile if uploaded
    if (contentFileUrl) {
      updateData.contentFile = contentFileUrl;
      updateData.description = undefined;
      updateData.requirements = undefined;
      updateData.keyResponsibilities = undefined;
    }

    // CRITICAL: Ensure postedBy cannot be changed
    delete updateData.postedBy;
    delete updateData.company; // Company data should not be updated via job update

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true, omitUndefined: true }
    );

    // Final ownership verification
    if (!updatedJob || updatedJob.postedBy !== user._id.toString()) {
      console.error('CRITICAL: Job ownership changed during update!');
      res.status(500).json({ 
        success: false, 
        message: 'Job update failed due to security error' 
      });
      return;
    }

    console.log(`✅ Job ${updatedJob._id} updated by employer ${user._id}`);

    res.json({ 
      success: true, 
      message: 'Job updated successfully',
      data: { 
        job: updatedJob,
        employer: {
          id: user._id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`
        }
      } 
    });
  } catch (error) {
    console.error('Error updating employer job:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete job posted by the authenticated employer
export const deleteEmployerJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'employer') {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. Only employers can delete jobs.' 
      });
      return;
    }

    // Strict ownership verification before deletion
    const job = await Job.findOne({ 
      _id: req.params.id, 
      postedBy: user._id.toString() 
    });
    
    if (!job) {
      res.status(404).json({ 
        success: false, 
        message: 'Job not found or you do not have permission to delete this job' 
      });
      return;
    }

    // Double-check ownership
    if (job.postedBy !== user._id.toString()) {
      console.error(`SECURITY ALERT: User ${user._id} attempted to delete job ${job._id} owned by ${job.postedBy}`);
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. You can only delete your own jobs.' 
      });
      return;
    }

    // Store job info for logging before deletion
    const jobInfo = {
      id: job._id,
      title: job.title,
      employerId: job.postedBy,
      companyName: job.company?.name
    };

    // Delete the job
    const deletedJob = await Job.findOneAndDelete({ 
      _id: req.params.id, 
      postedBy: user._id.toString() 
    });

    if (!deletedJob) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete job' 
      });
      return;
    }

    console.log(`✅ Job deleted successfully:`, jobInfo);
    console.log(`👤 Deleted by employer: ${user._id} (${user.email})`);

    res.json({ 
      success: true, 
      message: 'Job deleted successfully',
      data: {
        deletedJob: {
          id: jobInfo.id,
          title: jobInfo.title
        },
        employer: {
          id: user._id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`
        }
      }
    });
  } catch (error) {
    console.error('Error deleting employer job:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};