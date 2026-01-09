# CrossNations Backend API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected routes require `x-user-id` header with MongoDB ObjectId.

---

## Schemas

### User Schema
```json
{
  "_id": "ObjectId",
  "email": "string (required, unique)",
  "firstName": "string (required)",
  "lastName": "string (required)",
  "role": "candidate | employer | admin (required)",
  "phone": "string (optional)",
  "isActive": "boolean (default: true)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Job Schema
```json
{
  "_id": "ObjectId",
  "title": "string (required)",
  "description": "string (required)",
  "requirements": "string (required)",
  "location": "string (required)",
  "state": "NSW | VIC | QLD | WA | SA | TAS | ACT | NT (required)",
  "type": "Full Time | Part Time | Contract | FIFO 2:1 | FIFO 8:6 (required)",
  "jobTypeCategory": "Permanent | Contract | Apprenticeship | Trainee (required)",
  "workType": "On-Site | Remote | Hybrid (required)",
  "industry": "health | hospitality | childcare | construction | mining | technology (required)",
  "salaryDisplay": "string (required)",
  "tags": "string[] (optional)",
  "status": "active | inactive | closed (default: active)",
  "company": {
    "name": "string (optional)",
    "description": "string (optional)",
    "website": "string (optional)",
    "logo": "string (optional)",
    "size": "1-10 | 11-50 | 51-200 | 201-500 | 500+ (optional)",
    "founded": "number (optional)",
    "industry": "string[] (optional)",
    "location": "string (optional)",
    "contact": {
      "email": "string (optional)",
      "phone": "string (optional)"
    }
  },
  "postedBy": "ObjectId (ref: User, required)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```



### CandidateProfile Schema
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User, required)",
  "currentRole": "string (optional)",
  "currentCompany": "string (optional)",
  "yearsExperience": "0-1 | 1-3 | 3-5 | 5-10 | 10+ (optional)",
  "skills": "string (optional)",
  "preferredIndustries": "string[] (optional)",
  "visaStatus": "citizen | pr | visa_holder | needs_sponsorship (optional)",
  "isOpenToWork": "boolean (default: true)",
  "salaryExpectation": "number (optional)",
  "resumeUrl": "string (optional)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Routes

### Authentication Routes

#### POST /api/auth/register
Register new user without password

**Request Body:**
```json
{
  "email": "string (required)",
  "firstName": "string (required)",
  "lastName": "string (required)",
  "role": "candidate | employer | admin (required)",
  "phone": "string (optional)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "ObjectId",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "string"
    }
  }
}
```

---

### User Profile Routes

#### GET /api/users/profile
Get current user profile
**Headers:** `x-user-id: ObjectId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": "User object",
    "profile": "CandidateProfile object | null",
    "company": "Company object | null"
  }
}
```

#### PUT /api/users/profile
Update user profile
**Headers:** `x-user-id: ObjectId`

**Request Body:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": "Updated User object"
  }
}
```

---

### Job Routes

#### GET /api/jobs
Get all jobs with pagination

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "jobs": "Job[] with embedded company data",
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  }
}
```

#### POST /api/jobs
Create new job (Employer only)
**Headers:** `x-user-id: ObjectId`

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "requirements": "string (required)",
  "location": "string (required)",
  "state": "NSW | VIC | QLD | WA | SA | TAS | ACT | NT (required)",
  "type": "Full Time | Part Time | Contract | FIFO 2:1 | FIFO 8:6 (required)",
  "jobTypeCategory": "Permanent | Contract | Apprenticeship | Trainee (required)",
  "workType": "On-Site | Remote | Hybrid (required)",
  "industry": "health | hospitality | childcare | construction | mining | technology (required)",
  "salaryDisplay": "string (required)",
  "tags": "string[] (optional)",
  "company": {
    "name": "string (optional)",
    "description": "string (optional)",
    "website": "string (optional)",
    "logo": "string (optional)",
    "size": "1-10 | 11-50 | 51-200 | 201-500 | 500+ (optional)",
    "founded": "number (optional)",
    "industry": "string[] (optional)",
    "location": "string (optional)",
    "contact": {
      "email": "string (optional)",
      "phone": "string (optional)"
    }
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "job": "Job object with embedded company data"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: application/json" \
  -H "x-user-id: 507f1f77bcf86cd799439011" \
  -d '{
    "title": "Senior Software Developer",
    "description": "We are looking for an experienced software developer to join our growing team.",
    "requirements": "5+ years JavaScript experience, React, Node.js",
    "location": "Sydney",
    "state": "NSW",
    "type": "Full Time",
    "jobTypeCategory": "Permanent",
    "workType": "Hybrid",
    "industry": "technology",
    "salaryDisplay": "$90k - $120k",
    "tags": ["javascript", "react", "node.js", "aws"],
    "company": {
      "name": "Tech Innovations Pty Ltd",
      "description": "Leading technology company specializing in web applications",
      "website": "https://techinnovations.com.au",
      "size": "51-200",
      "founded": 2015,
      "industry": ["technology", "software"],
      "location": "Sydney, NSW",
      "contact": {
        "email": "jobs@techinnovations.com.au",
        "phone": "+61 2 9876 5432"
      }
    }
  }'

---

### Candidate Profile Routes

#### GET /api/candidates/profile
Get candidate profile (Candidate only)
**Headers:** `x-user-id: ObjectId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": "CandidateProfile object | null"
  }
}
```

#### PUT /api/candidates/profile
Update candidate profile (Candidate only)
**Headers:** `x-user-id: ObjectId`

**Request Body:**
```json
{
  "currentRole": "string (optional)",
  "currentCompany": "string (optional)",
  "yearsExperience": "0-1 | 1-3 | 3-5 | 5-10 | 10+ (optional)",
  "skills": "string (optional)",
  "preferredIndustries": "string[] (optional)",
  "visaStatus": "citizen | pr | visa_holder | needs_sponsorship (optional)",
  "isOpenToWork": "boolean (optional)",
  "salaryExpectation": "number (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": "Updated CandidateProfile object"
  }
}
```

#### POST /api/candidates/upload-resume
Upload resume file (Candidate only)
**Headers:** `x-user-id: ObjectId`
**Content-Type:** `multipart/form-data`

**Request Body:**
- `resume`: File (PDF, DOC, DOCX - max 10MB)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": "Updated CandidateProfile object with resumeUrl",
    "resumeUrl": "/uploads/resume-1234567890-123456789.pdf",
    "fileName": "original-filename.pdf"
  }
}
```

**File Validation:**
- Allowed types: PDF, DOC, DOCX
- Maximum size: 10MB
- Old resume files are automatically deleted when new ones are uploaded

---

### Reference Data Routes

#### GET /api/data/industries
Get available industries

**Response (200):**
```json
{
  "success": true,
  "data": {
    "industries": [
      {
        "value": "string",
        "label": "string",
        "description": "string",
        "jobCount": "number"
      }
    ]
  }
}
```

#### GET /api/data/locations
Get Australian locations

**Response (200):**
```json
{
  "success": true,
  "data": {
    "locations": [
      {
        "state": "string",
        "cities": [
          {
            "name": "string",
            "jobCount": "number"
          }
        ]
      }
    ]
  }
}
```

#### GET /api/data/skills
Get skills by industry

**Query Parameters:**
- `industry`: string (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "skills": [
      {
        "name": "string",
        "category": "string",
        "popularity": "number"
      }
    ]
  }
}
```

---

### Health Check Route

#### GET /health
Server status check

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "ISO Date string"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "errors": ["Validation error messages"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "User ID required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Permission denied message"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## Enums Reference

### Australian States
- NSW (New South Wales)
- VIC (Victoria)
- QLD (Queensland)
- WA (Western Australia)
- SA (South Australia)
- TAS (Tasmania)
- ACT (Australian Capital Territory)
- NT (Northern Territory)

### Job Types
- Full Time
- Part Time
- Contract
- FIFO 2:1 (Fly-In-Fly-Out 2 weeks on, 1 week off)
- FIFO 8:6 (Fly-In-Fly-Out 8 days on, 6 days off)

### Job Type Categories
- Permanent
- Contract
- Apprenticeship
- Trainee

### Work Types
- On-Site
- Remote
- Hybrid

### Industries
- health (Healthcare & Medical)
- hospitality (Hospitality & Tourism)
- childcare (Childcare & Education)
- construction (Construction & Trades)
- mining (Mining & Resources)
- technology (Technology & IT)

### Years of Experience
- 0-1
- 1-3
- 3-5
- 5-10
- 10+

### Visa Status
- citizen (Australian Citizen)
- pr (Permanent Resident)
- visa_holder (Visa Holder)
- needs_sponsorship (Needs Sponsorship)

### Company Sizes
- 1-10
- 11-50
- 51-200
- 201-500
- 500+

---

## Usage Flow

1. **Register User**: POST /api/auth/register
2. **Save User ID**: Use returned user.id for authentication
3. **Set Header**: Add x-user-id header to protected requests
4. **Manage Profile**: Update user/candidate profiles as needed
5. **Upload Resume**: Candidates can upload resume files (PDF, DOC, DOCX)
6. **Create Jobs**: Employers can create jobs with optional company details
7. **Browse Jobs**: View available jobs with pagination and filters

## File Upload Support

### Resume Upload
- **Endpoint**: POST /api/candidates/upload-resume
- **File Types**: PDF, DOC, DOCX
- **Max Size**: 10MB
- **Storage**: Files stored in /uploads directory
- **Access**: Resume files accessible via /uploads/{filename}
- **Cleanup**: Old resumes automatically deleted when new ones uploadedquests
4. **Manage Profile**: Update user/candidate profiles as needed
5. **Create Jobs**: Employers can create jobs with optional company details
6. **Browse Jobs**: View available jobs with pagination and filters