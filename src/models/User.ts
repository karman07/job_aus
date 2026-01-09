import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password?: string; // Only for admin users
  phone?: string;
  role: 'candidate' | 'employer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return this.role === 'admin';
    }
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['candidate', 'employer', 'admin'],
    required: true,
    default: 'candidate'
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', userSchema);