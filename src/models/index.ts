import mongoose, { Document, Schema } from 'mongoose';

// SavedJob Model
export interface ISavedJob extends Document {
  candidateId: string;
  jobId: string;
  createdAt: Date;
}

const savedJobSchema = new Schema<ISavedJob>({
  candidateId: {
    type: String,
    required: true,
    ref: 'User'
  },
  jobId: {
    type: String,
    required: true,
    ref: 'Job'
  }
}, {
  timestamps: true
});

savedJobSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

export const SavedJob = mongoose.model<ISavedJob>('SavedJob', savedJobSchema);

// Export JobApplication model
export { default as JobApplication } from './JobApplication';
export { default as CandidateProfile } from './CandidateProfile';
export { default as User } from './User';
export { default as Job } from './Job';
export { default as Company } from './Company';