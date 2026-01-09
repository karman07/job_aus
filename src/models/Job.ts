import mongoose, { Document, Schema } from 'mongoose';

interface ICompany {
  name?: string;
  description?: string;
  website?: string;
  logo?: string;
  size?: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  founded?: number;
  industry?: ('health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology')[];
  location?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
}

export interface IJob extends Document {
  title: string;
  description: string;
  requirements: string;
  keyResponsibilities: string;
  location: string;
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  type: 'Full Time' | 'Part Time' | 'Contract' | 'FIFO 2:1' | 'FIFO 8:6';
  jobTypeCategory: 'Permanent' | 'Contract' | 'Apprenticeship' | 'Trainee';
  workType: 'On-Site' | 'Remote' | 'Hybrid';
  industry: 'health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology';
  salaryDisplay: string;
  tags: string[];
  status: 'active' | 'inactive' | 'closed';
  company?: ICompany;
  postedBy?: string;
  applicantCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema({
  name: { type: String },
  description: { type: String },
  website: { 
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL starting with http:// or https://'
    }
  },
  logo: { type: String },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+']
  },
  founded: { type: Number },
  industry: [{
    type: String,
    enum: ['health', 'hospitality', 'childcare', 'construction', 'mining', 'technology']
  }],
  location: { type: String },
  contact: {
    email: { type: String },
    phone: { type: String }
  }
}, { _id: false });

const jobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  keyResponsibilities: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  state: {
    type: String,
    enum: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
    required: true
  },
  type: {
    type: String,
    enum: ['Full Time', 'Part Time', 'Contract', 'FIFO 2:1', 'FIFO 8:6'],
    required: true
  },
  jobTypeCategory: {
    type: String,
    enum: ['Permanent', 'Contract', 'Apprenticeship', 'Trainee'],
    required: true
  },
  workType: {
    type: String,
    enum: ['On-Site', 'Remote', 'Hybrid'],
    required: true
  },
  industry: {
    type: String,
    enum: ['health', 'hospitality', 'childcare', 'construction', 'mining', 'technology'],
    required: true
  },
  salaryDisplay: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'closed'],
    default: 'active'
  },
  company: companySchema,
  postedBy: {
    type: String,
    ref: 'User'
  },
  applicantCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ location: 1, state: 1 });
jobSchema.index({ industry: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });

export default mongoose.model<IJob>('Job', jobSchema);