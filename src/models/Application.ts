import mongoose, { Schema } from 'mongoose';
import { IApplication } from '../types';

const applicationSchema = new Schema<IApplication>({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required']
  },
  applicantName: {
    type: String,
    required: [true, 'Applicant name is required'],
    trim: true,
    maxlength: [100, 'Applicant name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  resume: {
    type: String,
    required: [true, 'Resume is required']
  },
  coverLetter: {
    type: String,
    maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  skills: [{
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Each skill cannot exceed 50 characters']
  }],
  status: {
    type: String,
    enum: {
      values: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      message: 'Status must be pending, reviewed, shortlisted, rejected, or hired'
    },
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin'
  },
  reviewedAt: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

applicationSchema.index({ jobId: 1, email: 1 }, { unique: true });
applicationSchema.index({ status: 1, appliedAt: -1 });

export default mongoose.model<IApplication>('Application', applicationSchema);