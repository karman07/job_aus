import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedJob extends Document {
  candidateId: string;
  jobId: string;
  createdAt: Date;
}

const savedJobSchema = new Schema<ISavedJob>({
  candidateId: {
    type: String,
    ref: 'User',
    required: true
  },
  jobId: {
    type: String,
    ref: 'Job',
    required: true
  }
}, {
  timestamps: true
});

// Ensure a candidate can't save the same job twice
savedJobSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

export default mongoose.model<ISavedJob>('SavedJob', savedJobSchema);