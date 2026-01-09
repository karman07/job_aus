# Admin API - Complete Management System

## Overview
Admin has full access to all system operations including job management, candidate management, and application oversight.

## Job Management

### Create Job
```bash
curl -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: multipart/form-data" \
  -F "title=Software Developer" \
  -F "description=We are looking for a skilled developer to join our team" \
  -F "requirements=3+ years experience in JavaScript, React, Node.js" \
  -F "keyResponsibilities=Develop and maintain web applications, collaborate with team" \
  -F "location=Sydney" \
  -F "state=NSW" \
  -F "type=Full Time" \
  -F "jobTypeCategory=Permanent" \
  -F "workType=On-Site" \
  -F "industry=technology" \
  -F "salaryDisplay=$80,000 - $100,000" \
  -F "tags=[\"JavaScript\", \"React\", \"Node.js\"]" \
  -F "company.name=Tech Company" \
  -F "company.description=Leading technology company" \
  -F "company.website=https://techcompany.com" \
  -F "company.size=50-100" \
  -F "company.founded=2015" \
  -F "company.industry=[\"technology\"]" \
  -F "company.location=Sydney, NSW" \
  -F "company.contact.email=hr@techcompany.com" \
  -F "company.contact.phone=+61234567890" \
  -F "logo=@/path/to/company-logo.png"
```

### Get All Jobs
```bash
curl -X GET "http://localhost:3001/api/jobs?page=1&limit=10"
```

### Get Job by ID
```bash
curl -X GET http://localhost:3001/api/jobs/JOB_ID
```

### Update Job
```bash
curl -X PUT http://localhost:3001/api/jobs/admin/JOB_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Developer",
    "description": "Updated job description for senior role",
    "requirements": "5+ years experience in JavaScript, React, Node.js",
    "keyResponsibilities": "Lead development team, mentor junior developers",
    "location": "Melbourne",
    "state": "VIC",
    "type": "Full Time",
    "jobTypeCategory": "Permanent",
    "workType": "Hybrid",
    "industry": "technology",
    "salaryDisplay": "$100,000 - $120,000",
    "status": "active"
  }'
```

### Delete Job
```bash
curl -X DELETE http://localhost:3001/api/jobs/admin/JOB_ID
```

### Get All Jobs (Admin View)
```bash
curl -X GET "http://localhost:3001/api/jobs/admin/all?page=1&limit=10"
```

## Candidate Management

### Get All Candidates
```bash
curl -X GET "http://localhost:3001/api/candidates?page=1&limit=10"
```

### Get Candidate by ID
```bash
curl -X GET http://localhost:3001/api/candidates/CANDIDATE_ID
```

### Create Candidate (Admin)
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

### Update Candidate
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

### Delete Candidate
```bash
curl -X DELETE http://localhost:3001/api/candidates/CANDIDATE_ID
```

## Application Management

### Get All Applications
```bash
curl -X GET "http://localhost:3001/api/applications?page=1&limit=10"
```

### Get Application by ID
```bash
curl -X GET http://localhost:3001/api/applications/APPLICATION_ID
```

### Get Applications by Job
```bash
curl -X GET http://localhost:3001/api/applications/job/JOB_ID
```

### Get Applications by Candidate
```bash
curl -X GET http://localhost:3001/api/applications/candidate/CANDIDATE_ID
```

### Update Application Status
```bash
curl -X PATCH http://localhost:3001/api/applications/APPLICATION_ID/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Interview"
  }'
```

### Update Application Details
```bash
curl -X PUT http://localhost:3001/api/applications/APPLICATION_ID \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Name",
    "currentRole": "Updated Role",
    "yearsExperience": "5-10",
    "status": "Reviewed"
  }'
```

### Delete Application
```bash
curl -X DELETE http://localhost:3001/api/applications/APPLICATION_ID
```

## Analytics & Reports

### Job Analytics
```bash
curl -X GET http://localhost:3001/api/analytics/jobs/JOB_ID
```

### Dashboard Analytics
```bash
curl -X GET http://localhost:3001/api/analytics/dashboard
```

### Application Statistics
```bash
curl -X GET "http://localhost:3001/api/analytics/applications?startDate=2024-01-01&endDate=2024-12-31"
```

## Bulk Operations

### Bulk Update Job Status
```bash
curl -X PATCH http://localhost:3001/api/jobs/bulk/status \
  -H "Content-Type: application/json" \
  -d '{
    "jobIds": ["JOB_ID_1", "JOB_ID_2", "JOB_ID_3"],
    "status": "inactive"
  }'
```

### Bulk Delete Applications
```bash
curl -X DELETE http://localhost:3001/api/applications/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "applicationIds": ["APP_ID_1", "APP_ID_2", "APP_ID_3"]
  }'
```

### Export Candidates
```bash
curl -X GET "http://localhost:3001/api/candidates/export?format=csv" \
  -o candidates.csv
```

### Export Applications
```bash
curl -X GET "http://localhost:3001/api/applications/export?format=csv&jobId=JOB_ID" \
  -o applications.csv
```

## Search & Filter

### Advanced Job Search
```bash
curl -X GET "http://localhost:3001/api/jobs/search?title=developer&industry=technology&location=Sydney&status=active"
```

### Advanced Candidate Search
```bash
curl -X GET "http://localhost:3001/api/candidates/search?skills=javascript&yearsExperience=3-5&location=NSW&isOpenToWork=true"
```

### Advanced Application Search
```bash
curl -X GET "http://localhost:3001/api/applications/search?status=Pending&jobId=JOB_ID&dateFrom=2024-01-01"
```

## System Management

### Get System Stats
```bash
curl -X GET http://localhost:3001/api/admin/stats
```

### Database Cleanup
```bash
curl -X POST http://localhost:3001/api/admin/cleanup \
  -H "Content-Type: application/json" \
  -d '{
    "removeOldApplications": true,
    "daysOld": 90
  }'
```

### Backup Data
```bash
curl -X POST http://localhost:3001/api/admin/backup \
  -H "Content-Type: application/json" \
  -d '{
    "collections": ["jobs", "candidates", "applications"]
  }'
```

## Response Examples

### Job Creation Response
```json
{
  "success": true,
  "data": {
    "job": {
      "_id": "65a1b2c3d4e5f6789012345",
      "title": "Software Developer",
      "description": "We are looking for a skilled developer",
      "requirements": "3+ years experience in JavaScript",
      "keyResponsibilities": "Develop and maintain web applications",
      "location": "Sydney",
      "state": "NSW",
      "type": "Full Time",
      "jobTypeCategory": "Permanent",
      "workType": "On-Site",
      "industry": "technology",
      "salaryDisplay": "$80,000 - $100,000",
      "tags": ["JavaScript", "React", "Node.js"],
      "status": "active",
      "company": {
        "name": "Tech Company",
        "description": "Leading technology company",
        "website": "https://techcompany.com",
        "logo": "/uploads/logo-123.png",
        "size": "50-100",
        "founded": 2015,
        "industry": ["technology"],
        "location": "Sydney, NSW",
        "contact": {
          "email": "hr@techcompany.com",
          "phone": "+61234567890"
        }
      },
      "applicantCount": 0,
      "viewCount": 0,
      "createdAt": "2024-01-08T10:00:00.000Z",
      "updatedAt": "2024-01-08T10:00:00.000Z"
    }
  }
}
```

### Analytics Response
```json
{
  "success": true,
  "data": {
    "dashboard": {
      "totalJobs": 150,
      "activeJobs": 120,
      "totalCandidates": 500,
      "totalApplications": 1200,
      "pendingApplications": 300,
      "interviewApplications": 150,
      "hiredApplications": 75,
      "rejectedApplications": 675,
      "jobsByIndustry": {
        "technology": 60,
        "health": 30,
        "construction": 20,
        "hospitality": 10
      },
      "applicationsByMonth": [
        { "month": "Jan", "count": 100 },
        { "month": "Feb", "count": 120 },
        { "month": "Mar", "count": 150 }
      ]
    }
  }
}
```

## Admin Permissions

### Full Access Rights
- ✅ **Create Jobs**: Post new job listings
- ✅ **Edit Jobs**: Modify any job details
- ✅ **Delete Jobs**: Remove job postings
- ✅ **View All Candidates**: Access complete candidate database
- ✅ **Edit Candidates**: Modify candidate profiles
- ✅ **Delete Candidates**: Remove candidate accounts
- ✅ **View All Applications**: See all job applications
- ✅ **Update Application Status**: Change application workflow
- ✅ **Delete Applications**: Remove applications
- ✅ **Analytics Access**: View system analytics and reports
- ✅ **Bulk Operations**: Perform mass updates and deletions
- ✅ **Export Data**: Download system data in various formats
- ✅ **System Management**: Database cleanup and maintenance

## Status Values

### Job Status
- `active` - Job is live and accepting applications
- `inactive` - Job is paused or closed
- `draft` - Job is being prepared
- `expired` - Job posting has expired

### Application Status
- `Pending` - Application submitted, awaiting review
- `Reviewed` - Application has been reviewed
- `Interview` - Candidate selected for interview
- `Rejected` - Application declined
- `Hired` - Candidate successfully hired

### Candidate Status
- `isOpenToWork: true` - Available for opportunities
- `isOpenToWork: false` - Not currently seeking

## Field Options

### Job Types
- `Full Time`, `Part Time`, `Contract`, `FIFO 2:1`, `FIFO 8:6`

### Job Categories
- `Permanent`, `Contract`, `Apprenticeship`, `Trainee`

### Work Types
- `On-Site`, `Remote`, `Hybrid`

### Australian States
- `NSW`, `VIC`, `QLD`, `WA`, `SA`, `TAS`, `ACT`, `NT`

### Industries
- `health`, `hospitality`, `childcare`, `construction`, `mining`, `technology`

### Years Experience
- `0-1`, `1-3`, `3-5`, `5-10`, `10+`

### Visa Status
- `citizen`, `pr`, `visa_holder`, `needs_sponsorship`

## Notes
- All admin operations require proper authentication
- Bulk operations should be used carefully
- Regular backups recommended before major changes
- Analytics data updates in real-time
- Export functions support CSV and JSON formats