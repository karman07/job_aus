# CrossNations API - CURL Commands

## Authentication Endpoints

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@example.com",
    "password": "password123",
    "role": "candidate"
  }'
```

### Login User
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@example.com",
    "password": "password123"
  }'
```

### Refresh Token
```bash
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN"
```

### Logout
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Job Endpoints

### Get All Jobs (Public)
```bash
curl -X GET "http://localhost:3001/api/jobs?page=1&limit=10"
```

### Get Job by ID
```bash
curl -X GET http://localhost:3001/api/jobs/JOB_ID
```

### Create Job
```bash
curl -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: multipart/form-data" \
  -F "title=Software Developer" \
  -F "description=We are looking for a skilled developer" \
  -F "requirements=3+ years experience in JavaScript" \
  -F "keyResponsibilities=Develop and maintain web applications" \
  -F "location=Sydney" \
  -F "state=NSW" \
  -F "type=Full Time" \
  -F "jobTypeCategory=Permanent" \
  -F "workType=On-Site" \
  -F "industry=technology" \
  -F "salaryDisplay=$80,000 - $100,000" \
  -F "tags=[\"JavaScript\", \"React\", \"Node.js\"]" \
  -F "company.name=Tech Company" \
  -F "company.description=Leading tech company" \
  -F "company.website=https://techcompany.com" \
  -F "company.size=50-100" \
  -F "company.founded=2015" \
  -F "company.industry=[\"technology\"]" \
  -F "company.location=Sydney, NSW" \
  -F "company.contact.email=hr@techcompany.com" \
  -F "company.contact.phone=+61234567890" \
  -F "logo=@/path/to/company-logo.png"
```

### Update Job (Admin)
```bash
curl -X PUT http://localhost:3001/api/jobs/admin/JOB_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Senior Software Developer",
    "description": "Updated job description",
    "requirements": "5+ years experience",
    "keyResponsibilities": "Lead development team",
    "location": "Melbourne",
    "state": "VIC",
    "type": "Full Time",
    "jobTypeCategory": "Permanent",
    "workType": "Hybrid",
    "industry": "technology",
    "salaryDisplay": "$100,000 - $120,000"
  }'
```

### Delete Job (Admin)
```bash
curl -X DELETE http://localhost:3001/api/jobs/admin/JOB_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get All Jobs (Admin)
```bash
curl -X GET "http://localhost:3001/api/jobs/admin/all?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Candidate Profile Endpoints

### Get Candidate Profile
```bash
curl -X GET http://localhost:3001/api/candidates/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Candidate Profile
```bash
curl -X PUT http://localhost:3001/api/candidates/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
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

### Upload Resume
```bash
curl -X POST http://localhost:3001/api/candidates/upload-resume \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

## Job Application Endpoints

### Apply for Job
```bash
curl -X POST http://localhost:3001/api/jobs/JOB_ID/apply \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
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

### Get User Applications
```bash
curl -X GET http://localhost:3001/api/candidates/applications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Application Status
```bash
curl -X PUT http://localhost:3001/api/candidates/applications/APPLICATION_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "status": "Interview"
  }'
```

## User Profile Endpoints

### Get User Profile
```bash
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update User Profile
```bash
curl -X PUT http://localhost:3001/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "email": "newemail@example.com"
  }'
```

### Delete User Account
```bash
curl -X DELETE http://localhost:3001/api/users/account \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
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

## File Upload Endpoints

### Upload File
```bash
curl -X POST http://localhost:3001/api/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/file.pdf" \
  -F "type=resume"
```

## Health Check

### Server Health
```bash
curl -X GET http://localhost:3001/health
```

## Notes

### Authentication
- Replace `YOUR_ACCESS_TOKEN` with actual JWT token from login response
- Replace `YOUR_REFRESH_TOKEN` with actual refresh token from login response

### File Uploads
- Supported resume formats: PDF, DOC, DOCX (max 10MB)
- Supported image formats: JPG, PNG, SVG (max 10MB)

### Job Application Status Values
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

### Australian States
- `NSW`, `VIC`, `QLD`, `WA`, `SA`, `TAS`, `ACT`, `NT`

### Job Types
- `Full Time`, `Part Time`, `Contract`, `FIFO 2:1`, `FIFO 8:6`

### Work Types
- `On-Site`, `Remote`, `Hybrid`

### Industries
- `health`, `hospitality`, `childcare`, `construction`, `mining`, `technology`