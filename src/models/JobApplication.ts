import mongoose, { Document, Schema } from 'mongoose';

export interface IJobApplication extends Document {
  candidateId: string;
  jobId: string;
  
  // Personal Details (Step 1 - Required)
  fullName: string;
  email: string;
  phone: string;
  location: string;
  preferredRole?: string;
  
  // Experience (Step 2)
  currentRole: string;
  currentCompany?: string;
  yearsExperience: string;
  skills?: string;
  education?: string;
  
  // Documents (Step 3)
  resumeUrl: string;
  
  // Metadata
  appliedAt: Date;
  status: 'Pending' | 'Reviewed' | 'Interview' | 'Rejected' | 'Hired';
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>({
  candidateId: {
    type: String,
    required: true,
    ref: 'CandidateProfile'
  },
  jobId: {
    type: String,
    required: true,
    ref: 'Job'
  },
  
  // Personal Details
  fullName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  preferredRole: {
    type: String,
    trim: true
  },
  
  // Experience
  currentRole: {
    type: String,
    trim: true
  },
  currentCompany: {
    type: String,
    trim: true
  },
  yearsExperience: {
    type: String,
    enum: ['0-1', '1-3', '3-5', '5-10', '10+']
  },
  skills: {
    type: String
  },
  education: {
    type: String
  },
  
  // Documents
  resumeUrl: {
    type: String
  },
  
  // Metadata
  appliedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Interview', 'Rejected', 'Hired'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Indexes
jobApplicationSchema.index({ candidateId: 1 });
jobApplicationSchema.index({ jobId: 1 });
jobApplicationSchema.index({ status: 1 });
jobApplicationSchema.index({ appliedAt: -1 });

export default mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);