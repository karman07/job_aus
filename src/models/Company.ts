import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  userId: string;
  name?: string;
  description?: string;
  website?: string;
  logo?: string;
  size?: string;
  founded?: number;
  industry?: ('health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology')[];
  location?: string;
  state?: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  contact?: {
    email?: string;
    phone?: string;
  };
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>({
  userId: {
    type: String,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL starting with http:// or https://'
    }
  },
  logo: String,
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  founded: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear()
  },
  industry: [{
    type: String,
    enum: ['health', 'hospitality', 'childcare', 'construction', 'mining', 'technology']
  }],
  location: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    enum: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']
  },
  contact: {
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

companySchema.index({ userId: 1 });
companySchema.index({ industry: 1 });
companySchema.index({ location: 1, state: 1 });

export default mongoose.model<ICompany>('Company', companySchema);