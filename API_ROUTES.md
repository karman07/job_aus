# CrossNations Backend API Routes

## Authentication Routes (`/api/auth`)

### POST /api/auth/register
**Description**: Register new user (candidate or employer)
**Body**:
```json
{
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "candidate | employer",
  "phone": "string (optional)"
}
```
**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "string", "email": "string", "firstName": "string", "lastName": "string", "role": "string" }
  }
}
```

## User Profile Routes (`/api/users`)

### GET /api/users/profile
**Description**: Get current user profile
**Auth**: Required

### PUT /api/users/profile
**Description**: Update user profile
**Auth**: Required
**Body**:
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional)"
}
```

### DELETE /api/users/account
**Description**: Delete user account
**Auth**: Required

## Job Routes (`/api/jobs`)

### GET /api/jobs
**Description**: Get all jobs with filtering and pagination
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `keyword`: string
- `industry`: string
- `location`: string
- `state`: string
- `workType`: string
- `jobType`: string
- `salaryMin`: number
- `salaryMax`: number
- `featured`: boolean
- `urgent`: boolean
- `sortBy`: "newest | salary | relevance"

### GET /api/jobs/:id
**Description**: Get job details by ID

### POST /api/jobs
**Description**: Create new job (Employer only)
**Auth**: Required (Employer)
**Body**:
```json
{
  "title": "string",
  "description": "string",
  "requirements": "string",
  "duties": "string (optional)",
  "location": "string",
  "state": "NSW | VIC | QLD | WA | SA | TAS | ACT | NT",
  "type": "Full Time | Part Time | Contract | FIFO 2:1 | FIFO 8:6",
  "jobTypeCategory": "Permanent | Contract | Apprenticeship | Trainee",
  "workType": "On-Site | Remote | Hybrid",
  "industry": "health | hospitality | childcare | construction | mining | technology",
  "salaryMin": "number (optional)",
  "salaryMax": "number (optional)",
  "salaryDisplay": "string",
  "benefits": "string[] (optional)",
  "tags": "string[]",
  "featured": "boolean (optional)",
  "urgent": "boolean (optional)",
  "expiresAt": "Date (optional)"
}
```

### PUT /api/jobs/:id
**Description**: Update job (Employer only)
**Auth**: Required (Employer)

### DELETE /api/jobs/:id
**Description**: Delete job (Employer only)
**Auth**: Required (Employer)

### POST /api/jobs/:id/apply
**Description**: Apply for job (Candidate only)
**Auth**: Required (Candidate)
**Body**:
```json
{
  "coverLetter": "string (optional)",
  "resumeUrl": "string (optional)",
  "additionalDocuments": "string[] (optional)"
}
```

### GET /api/jobs/:id/applications
**Description**: Get job applications (Employer only)
**Auth**: Required (Employer)
**Query Parameters**:
- `page`: number
- `limit`: number
- `status`: string

### PUT /api/jobs/:jobId/applications/:applicationId
**Description**: Update application status (Employer only)
**Auth**: Required (Employer)
**Body**:
```json
{
  "status": "pending | reviewed | shortlisted | interviewed | offered | rejected | withdrawn",
  "notes": "string (optional)",
  "interviewScheduledAt": "Date (optional)"
}
```

## Candidate Routes (`/api/candidates`)

### GET /api/candidates/profile
**Description**: Get candidate profile
**Auth**: Required (Candidate)

### PUT /api/candidates/profile
**Description**: Update candidate profile
**Auth**: Required (Candidate)
**Body**:
```json
{
  "currentRole": "string (optional)",
  "currentCompany": "string (optional)",
  "yearsExperience": "0-1 | 1-3 | 3-5 | 5-10 | 10+",
  "skills": "string (optional)",
  "education": "string (optional)",
  "preferredRole": "string (optional)",
  "preferredLocation": "string (optional)",
  "preferredIndustries": "string[]",
  "salaryExpectation": "number (optional)",
  "availableFrom": "Date (optional)",
  "visaStatus": "citizen | pr | visa_holder | needs_sponsorship",
  "portfolioUrl": "string (optional)",
  "linkedinUrl": "string (optional)",
  "isOpenToWork": "boolean"
}
```

### POST /api/candidates/upload-resume
**Description**: Upload candidate resume
**Auth**: Required (Candidate)
**Content-Type**: multipart/form-data
**Body**: File upload (resume)

### GET /api/candidates/applications
**Description**: Get candidate applications
**Auth**: Required (Candidate)
**Query Parameters**:
- `page`: number
- `limit`: number
- `status`: string

### PUT /api/candidates/applications/:id
**Description**: Update application (Candidate only)
**Auth**: Required (Candidate)
**Body**:
```json
{
  "status": "withdrawn (optional)",
  "coverLetter": "string (optional)"
}
```

### GET /api/candidates/saved-jobs
**Description**: Get saved jobs
**Auth**: Required (Candidate)
**Query Parameters**:
- `page`: number
- `limit`: number

### POST /api/candidates/saved-jobs
**Description**: Save job
**Auth**: Required (Candidate)
**Body**:
```json
{
  "jobId": "string"
}
```

### DELETE /api/candidates/saved-jobs/:jobId
**Description**: Remove saved job
**Auth**: Required (Candidate)

## Company Routes (`/api/companies`)

### GET /api/companies/:id
**Description**: Get company details (Public)

### PUT /api/companies/profile
**Description**: Update company profile (Employer only)
**Auth**: Required (Employer)
**Body**:
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "website": "string (optional)",
  "size": "string (optional)",
  "founded": "string (optional)",
  "industry": "string[] (optional)",
  "location": "string (optional)",
  "contactEmail": "string (optional)",
  "contactPhone": "string (optional)"
}
```

### POST /api/companies/upload-logo
**Description**: Upload company logo
**Auth**: Required (Employer)
**Content-Type**: multipart/form-data
**Body**: File upload (logo)

### GET /api/companies/profile/jobs
**Description**: Get company jobs (Employer only)
**Auth**: Required (Employer)
**Query Parameters**:
- `page`: number
- `limit`: number
- `status`: string

## Search Routes (`/api/search`)

### GET /api/search/jobs
**Description**: Advanced job search with AI matching
**Query Parameters**:
- `q`: string (search query)
- `candidateId`: string (for personalized results)
- `industry`: string[]
- `location`: string[]
- `salaryMin`: number
- `salaryMax`: number
- `workType`: string[]
- `jobType`: string[]
- `experience`: string
- `skills`: string[]
- `page`: number
- `limit`: number

### GET /api/search/recommendations/jobs
**Description**: Get job recommendations for candidate
**Auth**: Required (Candidate)

### GET /api/search/recommendations/candidates
**Description**: Get candidate recommendations for job (Employer only)
**Auth**: Required (Employer)
**Query Parameters**:
- `jobId`: string
- `limit`: number

## Analytics Routes (`/api/analytics`)

### GET /api/analytics/dashboard
**Description**: Get dashboard analytics
**Auth**: Required

### GET /api/analytics/jobs/:id
**Description**: Get job analytics (Employer only)
**Auth**: Required (Employer)

## Data Routes (`/api/data`)

### GET /api/data/industries
**Description**: Get available industries

### GET /api/data/locations
**Description**: Get available locations (Australian states/cities)

### GET /api/data/skills
**Description**: Get popular skills by industry
**Query Parameters**:
- `industry`: string (optional)

## Notification & Contact Routes (`/api`)

### GET /api/notifications
**Description**: Get user notifications
**Auth**: Required
**Query Parameters**:
- `page`: number
- `limit`: number
- `unreadOnly`: boolean

### PUT /api/notifications/:id/read
**Description**: Mark notification as read
**Auth**: Required

### PUT /api/notifications/read-all
**Description**: Mark all notifications as read
**Auth**: Required

### POST /api/contact
**Description**: Submit contact inquiry
**Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "company": "string (optional)",
  "subject": "string",
  "message": "string",
  "type": "general | employer | candidate | support"
}
```

### GET /api/contact/inquiries
**Description**: Get contact inquiries (Admin only)
**Auth**: Required (Admin)
**Query Parameters**:
- `page`: number
- `limit`: number
- `status`: string
- `type`: string

## Health Check

### GET /health
**Description**: Health check endpoint
**Response**:
```json
{
  "status": "OK",
  "timestamp": "ISO string"
}
```