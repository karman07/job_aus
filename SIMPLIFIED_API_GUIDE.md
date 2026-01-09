# CrossNations API - Simplified Version

## Overview
This document outlines the simplified CrossNations API with no authentication, no validation, and direct candidate/application management.

## Key Changes Made

### 1. Removed Authentication System
- ❌ No user registration/login
- ❌ No JWT tokens
- ❌ No password fields
- ❌ No authorization headers required

### 2. Simplified Data Models
- **CandidateProfile**: Standalone entity (no userId reference)
- **JobApplication**: Uses candidateId to reference CandidateProfile
- **No validation**: All fields are optional
- **No required fields**: Everything can be empty

### 3. Removed Admin/Job Management
- ❌ No job creation endpoints
- ❌ No admin routes
- ✅ Jobs are read-only (for application purposes)

## Database Schema

### CandidateProfile Model
```typescript
interface ICandidateProfile {
  _id: ObjectId; // Auto-generated MongoDB ID
  
  // Personal Details (All Optional)
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  preferredRole?: string;
  
  // Experience (All Optional)
  currentRole?: string;
  currentCompany?: string;
  yearsExperience?: string; // '0-1' | '1-3' | '3-5' | '5-10' | '10+'
  skills?: string;
  education?: string;
  
  // Additional Info (All Optional)
  preferredIndustries?: string[];
  salaryExpectation?: number;
  availableFrom?: Date;
  visaStatus?: string; // 'citizen' | 'pr' | 'visa_holder' | 'needs_sponsorship'
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  isOpenToWork?: boolean; // Default: true
  profileViews?: number; // Default: 0
  
  createdAt: Date;
  updatedAt: Date;
}
```

### JobApplication Model
```typescript
interface IJobApplication {
  _id: ObjectId; // Auto-generated MongoDB ID
  candidateId: string; // References CandidateProfile._id
  jobId: string; // References Job._id
  
  // Personal Details (All Optional)
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  preferredRole?: string;
  
  // Experience (All Optional)
  currentRole?: string;
  currentCompany?: string;
  yearsExperience?: string;
  skills?: string;
  education?: string;
  
  // Documents (Optional)
  resumeUrl?: string;
  
  // Metadata
  appliedAt: Date; // Default: Date.now
  status: string; // Default: 'Pending'
  
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints & CURL Commands

### Candidate Profile Management

#### Create Candidate Profile
```bash
curl -X POST http://localhost:3001/api/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+61234567890",
    "location": "Sydney, NSW",
    "preferredRole": "Software Developer",
    "currentRole": "Junior Developer",
    "currentCompany": "Tech Co",
    "yearsExperience": "3-5",
    "skills": "JavaScript, React, Node.js",
    "education": "Bachelor of Computer Science",
    "preferredIndustries": ["technology"],
    "salaryExpectation": 85000,
    "availableFrom": "2024-02-01",
    "visaStatus": "citizen",
    "portfolioUrl": "https://johndoe.dev",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "isOpenToWork": true
  }'
```

#### Get Candidate Profile
```bash
curl -X GET http://localhost:3001/api/candidates/CANDIDATE_ID
```

#### Update Candidate Profile (No Guards)
```bash
curl -X PUT http://localhost:3001/api/candidates/CANDIDATE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Smith",
    "email": "john.smith@example.com",
    "currentRole": "Senior Developer",
    "yearsExperience": "5-10",
    "salaryExpectation": 95000,
    "isOpenToWork": false
  }'
```

#### Delete Candidate Profile
```bash
curl -X DELETE http://localhost:3001/api/candidates/CANDIDATE_ID
```

#### Get All Candidates
```bash
curl -X GET "http://localhost:3001/api/candidates?page=1&limit=10"
```

#### Upload Resume
```bash
curl -X POST http://localhost:3001/api/candidates/CANDIDATE_ID/upload-resume \
  -F "resume=@/path/to/resume.pdf"
```

### Job Application Management

#### Create Job Application
```bash
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: multipart/form-data" \
  -F "candidateId=CANDIDATE_ID" \
  -F "jobId=JOB_ID" \
  -F "fullName=John Doe" \
  -F "email=john.doe@example.com" \
  -F "phone=+61234567890" \
  -F "location=Sydney, NSW" \
  -F "preferredRole=Software Developer" \
  -F "currentRole=Junior Developer" \
  -F "currentCompany=Tech Co" \
  -F "yearsExperience=3-5" \
  -F "skills=JavaScript, React" \
  -F "education=Bachelor CS" \
  -F "resume=@/path/to/resume.pdf"
```

#### Get Application by ID
```bash
curl -X GET http://localhost:3001/api/applications/APPLICATION_ID
```

#### Get Applications by Candidate
```bash
curl -X GET http://localhost:3001/api/applications/candidate/CANDIDATE_ID
```

#### Get Applications by Job
```bash
curl -X GET http://localhost:3001/api/applications/job/JOB_ID
```

#### Update Application
```bash
curl -X PUT http://localhost:3001/api/applications/APPLICATION_ID \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Smith",
    "currentRole": "Senior Developer",
    "yearsExperience": "5-10",
    "status": "Interview"
  }'
```

#### Update Application Status Only
```bash
curl -X PATCH http://localhost:3001/api/applications/APPLICATION_ID/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Hired"
  }'
```

#### Delete Application
```bash
curl -X DELETE http://localhost:3001/api/applications/APPLICATION_ID
```

#### Get All Applications
```bash
curl -X GET "http://localhost:3001/api/applications?page=1&limit=10"
```

### Job Endpoints (Read Only)

#### Get All Jobs
```bash
curl -X GET "http://localhost:3001/api/jobs?page=1&limit=10"
```

#### Get Job by ID
```bash
curl -X GET http://localhost:3001/api/jobs/JOB_ID
```

### Data Reference Endpoints

#### Get Industries
```bash
curl -X GET http://localhost:3001/api/data/industries
```

#### Get Locations
```bash
curl -X GET http://localhost:3001/api/data/locations
```

#### Get Skills by Industry
```bash
curl -X GET "http://localhost:3001/api/data/skills?industry=technology"
```

### Health Check
```bash
curl -X GET http://localhost:3001/health
```

## Response Examples

### Successful Candidate Creation
```json
{
  "success": true,
  "data": {
    "candidate": {
      "_id": "65a1b2c3d4e5f6789012345",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+61234567890",
      "location": "Sydney, NSW",
      "preferredRole": "Software Developer",
      "currentRole": "Junior Developer",
      "currentCompany": "Tech Co",
      "yearsExperience": "3-5",
      "skills": "JavaScript, React, Node.js",
      "education": "Bachelor of Computer Science",
      "preferredIndustries": ["technology"],
      "salaryExpectation": 85000,
      "availableFrom": "2024-02-01T00:00:00.000Z",
      "visaStatus": "citizen",
      "portfolioUrl": "https://johndoe.dev",
      "linkedinUrl": "https://linkedin.com/in/johndoe",
      "isOpenToWork": true,
      "profileViews": 0,
      "createdAt": "2024-01-08T10:00:00.000Z",
      "updatedAt": "2024-01-08T10:00:00.000Z"
    }
  }
}
```

### Successful Application Creation
```json
{
  "success": true,
  "data": {
    "application": {
      "_id": "65a1b2c3d4e5f6789012346",
      "candidateId": "65a1b2c3d4e5f6789012345",
      "jobId": "65a1b2c3d4e5f6789012347",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+61234567890",
      "location": "Sydney, NSW",
      "preferredRole": "Software Developer",
      "currentRole": "Junior Developer",
      "currentCompany": "Tech Co",
      "yearsExperience": "3-5",
      "skills": "JavaScript, React",
      "education": "Bachelor CS",
      "resumeUrl": "/uploads/resume-123456.pdf",
      "appliedAt": "2024-01-08T10:00:00.000Z",
      "status": "Pending",
      "createdAt": "2024-01-08T10:00:00.000Z",
      "updatedAt": "2024-01-08T10:00:00.000Z"
    }
  }
}
```

## Key Features

### ✅ What's Included
- **No Authentication**: All endpoints are public
- **No Validation**: All fields are optional
- **Direct Access**: Edit any candidate profile by ID
- **File Uploads**: Resume uploads without restrictions
- **CRUD Operations**: Full create, read, update, delete
- **Pagination**: List endpoints support page/limit
- **Status Tracking**: Application status management

### ❌ What's Removed
- **User Authentication**: No login/register system
- **Password Protection**: No password fields
- **Field Validation**: No required field checks
- **Authorization Guards**: No permission checks
- **Job Management**: No job creation/editing
- **Admin Routes**: No admin-only endpoints

## Data Relationships

```
CandidateProfile (Independent)
    ↓
JobApplication (candidateId → CandidateProfile._id)
    ↓
Job (Read-only reference)
```

## File Upload Support

### Resume Upload
- **Endpoint**: `POST /api/candidates/:id/upload-resume`
- **Formats**: PDF, DOC, DOCX
- **Max Size**: 10MB
- **Storage**: `/uploads` directory

### Application Resume
- **Endpoint**: `POST /api/applications` (with form-data)
- **Field**: `resume` (file)
- **Auto-saved**: To `/uploads` with unique filename

## Status Values

### Application Status
- `Pending` (default)
- `Reviewed`
- `Interview`
- `Rejected`
- `Hired`

### Years Experience
- `0-1`
- `1-3`
- `3-5`
- `5-10`
- `10+`

### Visa Status
- `citizen`
- `pr`
- `visa_holder`
- `needs_sponsorship`

### Industries
- `health`
- `hospitality`
- `childcare`
- `construction`
- `mining`
- `technology`

## Testing Examples

### Create and Update Flow
```bash
# 1. Create candidate
CANDIDATE_ID=$(curl -s -X POST http://localhost:3001/api/candidates \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Test User", "email": "test@example.com"}' \
  | jq -r '.data.candidate._id')

# 2. Update candidate
curl -X PUT http://localhost:3001/api/candidates/$CANDIDATE_ID \
  -H "Content-Type: application/json" \
  -d '{"currentRole": "Developer", "yearsExperience": "3-5"}'

# 3. Create application
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -d "{\"candidateId\": \"$CANDIDATE_ID\", \"jobId\": \"JOB_ID\", \"fullName\": \"Test User\"}"
```

This simplified API provides maximum flexibility with no restrictions, allowing direct manipulation of candidate profiles and applications using only their MongoDB IDs.