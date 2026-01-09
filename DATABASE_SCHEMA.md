# Database Schema Documentation

## Overview
This document outlines the database schema for the CrossNations job portal backend, focusing on the relationship between Users, Candidate Profiles, and Job Applications.

## Schema Architecture

### User Model
```typescript
interface IUser {
  _id: ObjectId;
  email: string;
  password: string;
  role: 'candidate' | 'employer' | 'admin';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

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
  candidateId: string; // References CandidateProfile._id
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

### Candidate Profile → Job Applications (1:Many)
- One CandidateProfile can have many JobApplications
- JobApplication.candidateId references CandidateProfile._id
- Unique constraint on (candidateId, jobId) to prevent duplicate applications

### Data Flow
```
User Registration → User Created
     ↓
Candidate Profile Creation → CandidateProfile Created (userId = User._id)
     ↓
Job Application → JobApplication Created (candidateId = CandidateProfile._id)
```

## Key Features

### Authentication & Authorization
- Users authenticate with email/password
- JWT tokens contain User._id
- Candidate operations require valid CandidateProfile

### Application Management
- Applications are linked to CandidateProfile, not User directly
- Allows for richer candidate data in applications
- Prevents duplicate applications per candidate per job

### Data Integrity
- Unique constraints prevent duplicate profiles and applications
- Referential integrity through MongoDB references
- Indexed fields for optimal query performance

## Validation Rules

### Required Fields
**CandidateProfile:**
- fullName, email, phone, location
- currentRole, yearsExperience, visaStatus

**JobApplication:**
- fullName, email, phone, location
- currentRole, yearsExperience
- resumeUrl

### Optional Fields
**CandidateProfile:**
- preferredRole, currentCompany, skills, education
- salaryExpectation, availableFrom, resumeUrl, portfolioUrl, linkedinUrl

**JobApplication:**
- preferredRole, currentCompany, skills, education

### File Constraints
- Resume: PDF, DOC, DOCX (max 10MB)
- Portfolio: PDF, JPG, PNG (max 10MB)

## Database Indexes

### CandidateProfile Indexes
```javascript
{ userId: 1 } // Unique
{ preferredIndustries: 1 }
{ yearsExperience: 1 }
{ isOpenToWork: 1 }
```

### JobApplication Indexes
```javascript
{ candidateId: 1 }
{ jobId: 1 }
{ candidateId: 1, jobId: 1 } // Unique
{ status: 1 }
{ appliedAt: -1 }
```

## API Endpoints

### Candidate Profile Management
- `GET /api/candidates/profile` - Get candidate profile by userId
- `PUT /api/candidates/profile` - Update candidate profile
- `POST /api/candidates/upload-resume` - Upload resume

### Job Application Management
- `POST /api/jobs/:id/apply` - Create job application
- `GET /api/candidates/applications` - Get candidate's applications
- `PUT /api/candidates/applications/:id` - Update application status

## Security Considerations

### Access Control
- Candidates can only access their own profile and applications
- Employers can view applications for their jobs
- Admins have full access

### Data Protection
- Personal information encrypted in transit
- File uploads validated and sanitized
- Input validation on all endpoints

## Migration Notes

### From userId to candidateId
If migrating existing applications:
1. Create CandidateProfile for each User with role='candidate'
2. Update JobApplication.userId to JobApplication.candidateId
3. Update references to point to CandidateProfile._id

### Backward Compatibility
- Maintain User model for authentication
- CandidateProfile extends User data for candidates
- JobApplication uses candidateId for richer associations