import mongoose, { Schema } from 'mongoose';
import { IJob } from '../types';

const jobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [2000, 'Job description cannot exceed 2000 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  salary: {
    min: {
      type: Number,
      required: [true, 'Minimum salary is required'],
      min: [0, 'Salary cannot be negative']
    },
    max: {
      type: Number,
      required: [true, 'Maximum salary is required'],
      min: [0, 'Salary cannot be negative']
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      enum: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'INR'],
      default: 'USD'
    }
  },
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: {
      values: ['full-time', 'part-time', 'contract', 'internship'],
      message: 'Job type must be full-time, part-time, contract, or internship'
    }
  },
  requirements: [{
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Each requirement cannot exceed 200 characters']
  }],
  benefits: [{
    type: String,
    trim: true,
    maxlength: [200, 'Each benefit cannot exceed 200 characters']
  }],
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'closed'],
      message: 'Status must be active, inactive, or closed'
    },
    default: 'active'
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Posted by admin is required']
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required'],
    validate: {
      validator: function(date: Date) {
        return date > new Date();
      },
      message: 'Application deadline must be in the future'
    }
  }
}, {
  timestamps: true
});

jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IJob>('Job', jobSchema);