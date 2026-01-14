# Database Schema Documentation

## Overview
This document outlines the database schema for the CrossNations job portal backend with simplified User-based job applications.

## Schema Architecture

### Candidate Profile Model
```typescript
interface ICandidateProfile {
  _id: ObjectId;
  userId: string; // References User._id
  
  // Personal Details (Required)
  fullName: string;
  email: string;
  phone: string;
  location: string;
  preferredRole?: string;
  
  // Experience (Required)
  currentRole: string;
  currentCompany?: string;
  yearsExperience: '0-1' | '1-3' | '3-5' | '5-10' | '10+';
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
```

### Job Application Model
```typescript
interface IJobApplication {
  _id: ObjectId;
  userId: string; // References User._id ONLY
  jobId: string; // References Job._id
  
  // Personal Details (Step 1 - Required)
  fullName: string;
  email: string;
  phone: string;
  location: string;
  preferredRole?: string;
  
  // Experience (Step 2)
  currentRole: string;
  currentCompany?: string;
  yearsExperience: '0-1' | '1-3' | '3-5' | '5-10' | '10+';
  skills?: string;
  education?: string;
  
  // Documents (Step 3)
  resumeUrl: string; // Required
  
  // Metadata
  appliedAt: Date;
  status: 'Pending' | 'Reviewed' | 'Interview' | 'Rejected' | 'Hired';
  
  createdAt: Date;
  updatedAt: Date;
}
```

## Relationships

### User → Candidate Profile (1:1)
- One User can have one CandidateProfile
- CandidateProfile.userId references User._id
- Unique constraint on userId in CandidateProfile

### User → Job Applications (1:Many)
- One User can have many JobApplications
- JobApplication.userId references User._id DIRECTLY
- Unique constraint on (userId, jobId) to prevent duplicate applications

### Data Flow
```
User Registration → User Created
     ↓
Job Application → JobApplication Created (userId = User._id)
```

## Key Features

### Authentication & Authorization
- Users authenticate with email/password
- JWT tokens contain User._id
- Applications are directly linked to User._id

### Application Management
- Applications are linked directly to User
- Simple relationship structure
- Prevents duplicate applications per user per job

### Data Integrity
- Unique constraints prevent duplicate applications
- Referential integrity through MongoDB references
- Indexed fields for optimal query performance

## Validation Rules

### Required Fields
**JobApplication:**
- userId, jobId
- fullName, email, phone, location
- currentRole, yearsExperience
- resumeUrl

### Optional Fields
**JobApplication:**
- preferredRole, currentCompany, skills, education

### File Constraints
- Resume: PDF, DOC, DOCX (max 10MB)

## Database Indexes

### JobApplication Indexes
```javascript
{ userId: 1 }
{ jobId: 1 }
{ userId: 1, jobId: 1 } // Unique - prevents duplicate applications
{ status: 1 }
{ appliedAt: -1 }
```

## API Endpoints

### Job Application Management
- `POST /api/jobs/:id/apply` - Create job application (userId from JWT)
- `GET /api/candidates/applications` - Get user's applications (userId from JWT)
- `PUT /api/candidates/applications/:id` - Update application status

## Security Considerations

### Access Control
- Users can only access their own applications
- Employers can view applications for their jobs
- Admins have full access

### Data Protection
- Personal information encrypted in transit
- File uploads validated and sanitized
- Input validation on all endpoints