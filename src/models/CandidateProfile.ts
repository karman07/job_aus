import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidateProfile extends Document {
  // Personal Details
  fullName: string;
  email: string;
  phone: string;
  location: string;
  preferredRole?: string;
  
  // Experience
  currentRole: string;
  currentCompany?: string;
  yearsExperience: string;
  skills?: string;
  education?: string;
  
  // Additional Profile Info
  preferredIndustries: string[];
  salaryExpectation?: number;
  availableFrom?: Date;
  visaStatus: 'citizen' | 'pr' | 'visa_holder' | 'needs_sponsorship';
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  isOpenToWork: boolean;
  profileViews: number;
  createdAt: Date;
  updatedAt: Date;
}

const candidateProfileSchema = new Schema<ICandidateProfile>({
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
  
  // Additional Profile Info
  preferredIndustries: [{
    type: String,
    enum: ['health', 'hospitality', 'childcare', 'construction', 'mining', 'technology']
  }],
  salaryExpectation: {
    type: Number,
    min: 0
  },
  availableFrom: {
    type: Date
  },
  visaStatus: {
    type: String,
    enum: ['citizen', 'pr', 'visa_holder', 'needs_sponsorship']
  },
  resumeUrl: {
    type: String
  },
  portfolioUrl: {
    type: String
  },
  linkedinUrl: {
    type: String
  },
  isOpenToWork: {
    type: Boolean,
    default: true
  },
  profileViews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

candidateProfileSchema.index({ email: 1 });
candidateProfileSchema.index({ preferredIndustries: 1 });
candidateProfileSchema.index({ yearsExperience: 1 });
candidateProfileSchema.index({ isOpenToWork: 1 });

export default mongoose.model<ICandidateProfile>('CandidateProfile', candidateProfileSchema);