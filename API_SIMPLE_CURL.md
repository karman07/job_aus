# CrossNations API - CURL Commands (Simplified)

## Candidate Profile Endpoints

### Get Candidate Profile by ID
```bash
curl -X GET http://localhost:3001/api/candidates/CANDIDATE_ID
```

### Create Candidate Profile
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
    "currentCompany": "Current Tech Co",
    "yearsExperience": "3-5",
    "skills": "JavaScript, React, Node.js, MongoDB",
    "education": "Bachelor of Computer Science",
    "preferredIndustries": ["technology", "health"],
    "salaryExpectation": 85000,
    "availableFrom": "2024-02-01",
    "visaStatus": "citizen",
    "portfolioUrl": "https://johndoe.dev",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "isOpenToWork": true
  }'
```

### Update Candidate Profile
```bash
curl -X PUT http://localhost:3001/api/candidates/CANDIDATE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+61987654321",
    "location": "Melbourne, VIC",
    "preferredRole": "Senior Developer",
    "currentRole": "Developer",
    "currentCompany": "New Tech Co",
    "yearsExperience": "5-10",
    "skills": "JavaScript, React, Node.js, Python",
    "education": "Master of Computer Science",
    "preferredIndustries": ["technology"],
    "salaryExpectation": 95000,
    "availableFrom": "2024-03-01",
    "visaStatus": "pr",
    "portfolioUrl": "https://johnsmith.dev",
    "linkedinUrl": "https://linkedin.com/in/johnsmith",
    "isOpenToWork": false
  }'
```

### Delete Candidate Profile
```bash
curl -X DELETE http://localhost:3001/api/candidates/CANDIDATE_ID
```

### Get All Candidates
```bash
curl -X GET "http://localhost:3001/api/candidates?page=1&limit=10"
```

### Upload Resume for Candidate
```bash
curl -X POST http://localhost:3001/api/candidates/CANDIDATE_ID/upload-resume \
  -F "resume=@/path/to/resume.pdf"
```

## Job Application Endpoints

### Create Job Application
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
  -F "currentCompany=Current Tech Co" \
  -F "yearsExperience=3-5" \
  -F "skills=JavaScript, React, Node.js" \
  -F "education=Bachelor of Computer Science" \
  -F "resume=@/path/to/resume.pdf"
```

### Get Application by ID
```bash
curl -X GET http://localhost:3001/api/applications/APPLICATION_ID
```

### Get Applications by Candidate ID
```bash
curl -X GET http://localhost:3001/api/applications/candidate/CANDIDATE_ID
```

### Get Applications by Job ID
```bash
curl -X GET http://localhost:3001/api/applications/job/JOB_ID
```

### Update Application
```bash
curl -X PUT http://localhost:3001/api/applications/APPLICATION_ID \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+61987654321",
    "location": "Melbourne, VIC",
    "preferredRole": "Senior Developer",
    "currentRole": "Developer",
    "currentCompany": "New Tech Co",
    "yearsExperience": "5-10",
    "skills": "JavaScript, React, Node.js, Python",
    "education": "Master of Computer Science",
    "status": "Interview"
  }'
```

### Update Application Status
```bash
curl -X PATCH http://localhost:3001/api/applications/APPLICATION_ID/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Hired"
  }'
```

### Delete Application
```bash
curl -X DELETE http://localhost:3001/api/applications/APPLICATION_ID
```

### Get All Applications
```bash
curl -X GET "http://localhost:3001/api/applications?page=1&limit=10"
```

## Job Endpoints (Read Only)

### Get All Jobs
```bash
curl -X GET "http://localhost:3001/api/jobs?page=1&limit=10"
```

### Get Job by ID
```bash
curl -X GET http://localhost:3001/api/jobs/JOB_ID
```

## Data Endpoints

### Get Industries
```bash
curl -X GET http://localhost:3001/api/data/industries
```

### Get Locations
```bash
curl -X GET http://localhost:3001/api/data/locations
```

### Get Skills by Industry
```bash
curl -X GET "http://localhost:3001/api/data/skills?industry=technology"
```

## Health Check

### Server Health
```bash
curl -X GET http://localhost:3001/health
```

## Response Examples

### Candidate Profile Response
```json
{
  "success": true,
  "data": {
    "candidate": {
      "_id": "CANDIDATE_ID",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+61234567890",
      "location": "Sydney, NSW",
      "preferredRole": "Software Developer",
      "currentRole": "Junior Developer",
      "currentCompany": "Current Tech Co",
      "yearsExperience": "3-5",
      "skills": "JavaScript, React, Node.js, MongoDB",
      "education": "Bachelor of Computer Science",
      "preferredIndustries": ["technology", "health"],
      "salaryExpectation": 85000,
      "availableFrom": "2024-02-01T00:00:00.000Z",
      "visaStatus": "citizen",
      "resumeUrl": "/uploads/resume-123.pdf",
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

### Job Application Response
```json
{
  "success": true,
  "data": {
    "application": {
      "_id": "APPLICATION_ID",
      "candidateId": "CANDIDATE_ID",
      "jobId": "JOB_ID",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+61234567890",
      "location": "Sydney, NSW",
      "preferredRole": "Software Developer",
      "currentRole": "Junior Developer",
      "currentCompany": "Current Tech Co",
      "yearsExperience": "3-5",
      "skills": "JavaScript, React, Node.js",
      "education": "Bachelor of Computer Science",
      "resumeUrl": "/uploads/resume-456.pdf",
      "appliedAt": "2024-01-08T10:00:00.000Z",
      "status": "Pending",
      "createdAt": "2024-01-08T10:00:00.000Z",
      "updatedAt": "2024-01-08T10:00:00.000Z"
    }
  }
}
```

## Notes

### No Authentication Required
- All endpoints are public and require no authentication
- No JWT tokens or authorization headers needed

### No Validation
- All fields are optional except where noted
- No password requirements
- No email validation
- No field format validation

### File Uploads
- Supported resume formats: PDF, DOC, DOCX (max 10MB)
- Files uploaded to `/uploads` directory

### Application Status Values
- `Pending` (default)
- `Reviewed`
- `Interview`
- `Rejected`
- `Hired`

### Years Experience Options
- `0-1`
- `1-3`
- `3-5`
- `5-10`
- `10+`

### Visa Status Options
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