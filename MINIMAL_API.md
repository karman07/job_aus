# CrossNations API - Minimal Candidate Operations

## Overview
Simplified API with only 3 operations for candidates: create profile, update profile, and apply for jobs.

## API Endpoints

### 1. Create Candidate Profile
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

### 2. Update Candidate Profile
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

### 3. Apply for Job
```bash
curl -X POST http://localhost:3001/api/applications \
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

## Response Examples

### Create Candidate Response
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

### Apply for Job Response
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

## Field Options

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

## Notes
- All fields are optional (no validation)
- No authentication required
- Resume files uploaded to `/uploads` directory
- Application status is set to "Pending" by default
- Candidates identified by MongoDB `_id` only