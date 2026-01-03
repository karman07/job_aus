import { Document } from 'mongoose';
import { Request } from 'express';

export interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'moderator' | 'admin';
  isActive: boolean;
  createdBy: IAdmin['_id'];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

export interface IJob extends Document {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  requirements: string[];
  benefits: string[];
  status: 'active' | 'inactive' | 'closed';
  postedBy: IAdmin['_id'];
  applicationDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplication extends Document {
  jobId: IJob['_id'];
  applicantName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  experience: number;
  skills: string[];
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: Date;
  reviewedBy?: IAdmin['_id'];
  reviewedAt?: Date;
  notes?: string;
}

export interface AuthRequest extends Request {
  admin?: IAdmin;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  username: string;
  email: string;
  password: string;
}

export interface CreateJobDto {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  requirements: string[];
  benefits: string[];
  applicationDeadline: Date;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {
  status?: 'active' | 'inactive' | 'closed';
}

export interface CreateApplicationDto {
  jobId: string;
  applicantName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  experience: number;
  skills: string[];
}

export interface UpdateApplicationDto {
  status?: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  notes?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'moderator' | 'admin';
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: 'user' | 'moderator' | 'admin';
  isActive?: boolean;
}