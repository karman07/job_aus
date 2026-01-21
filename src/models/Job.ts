import mongoose, { Document, Schema } from 'mongoose';

interface ICompany {
  name?: string;
  description?: string;
  website?: string;
  logo?: string;
  size?: string;
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
  description?: string;
  requirements?: string;
  keyResponsibilities?: string;
  contentFile?: string;
  location: string;
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  type: 'Full Time' | 'Part Time' | 'Contract' | 'FIFO 2:1' | 'FIFO 8:6';
  jobTypeCategory: 'Permanent' | 'Contract' | 'Apprenticeship' | 'Trainee';
  workType: 'On-Site' | 'Remote' | 'Hybrid';
  industry: 'health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology';
  salaryDisplay?: string;
  salaryMin?: number;
  salaryMax?: number;
  sponsorshipAvailable?: boolean;
  tags: string[];
  status: 'active' | 'inactive' | 'closed';
  company?: ICompany;
  postedBy?: string;
  applicantCount: number;
  customFields?: Array<{
    label: string;
    value: string;
  }>;
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
  size: { type: String },
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
    type: String
  },
  requirements: {
    type: String
  },
  keyResponsibilities: {
    type: String
  },
  contentFile: {
    type: String
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
    type: String
  },
  salaryMin: {
    type: Number,
    min: 0
  },
  salaryMax: {
    type: Number,
    min: 0
  },
  sponsorshipAvailable: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'closed'],
    default: 'inactive'
  },
  company: companySchema,
  postedBy: {
    type: String,
    ref: 'User',
    required: true,
    validate: {
      validator: async function(userId: string) {
        const User = mongoose.model('User');
        const user = await User.findById(userId);
        return user && user.role === 'employer';
      },
      message: 'Job can only be posted by employers'
    }
  },
  applicantCount: {
    type: Number,
    default: 0
  },
  customFields: [{
    label: {
      type: String,
      trim: true
    },
    value: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true
});

jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ location: 1, state: 1 });
jobSchema.index({ industry: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ salaryMin: 1, salaryMax: 1 });
jobSchema.index({ createdAt: -1 });

export default mongoose.model<IJob>('Job', jobSchema);