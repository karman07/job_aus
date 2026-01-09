# CrossNations API Schema Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected routes require `x-user-id` header with the user's MongoDB ObjectId.

## Response Format
All responses follow this format:
```json
{
  "success": boolean,
  "message": "string (optional)",
  "data": object,
  "errors": ["string"] // Only on validation errors
}
```

---

## 1. Authentication Routes

### POST /api/auth/register
**Description**: Register a new user without password
**Headers**: 
- `Content-Type: application/json`

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe", 
  "role": "candidate", // "candidate" | "employer"
  "phone": "+61400000000" // optional
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "candidate"
    }
  }
}
```

**Validation Rules**:
- `email`: Required, valid email format
- `firstName`: Required, min 1 character
- `lastName`: Required, min 1 character
- `role`: Optional, must be "candidate" or "employer"

---

## 2. User Profile Routes

### GET /api/users/profile
**Description**: Get current user profile
**Headers**: 
- `x-user-id: {userId}`

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+61400000000",
      "role": "candidate",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "profile": {
      // CandidateProfile if role is "candidate"
      // null if role is "employer"
    },
    "company": {
      // Company if role is "employer"  
      // null if role is "candidate"
    }
  }
}
```

### PUT /api/users/profile
**Description**: Update user profile
**Headers**: 
- `Content-Type: application/json`
- `x-user-id: {userId}`

**Request Body**:
```json
{
  "firstName": "John Updated",
  "lastName": "Doe Updated", 
  "phone": "+61400000001"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "firstName": "John Updated",
      "lastName": "Doe Updated",
      "phone": "+61400000001",
      "role": "candidate"
    }
  }
}
```

### DELETE /api/users/account
**Description**: Delete user account
**Headers**: 
- `x-user-id: {userId}`

**Response (200)**:
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 3. Job Routes

### GET /api/jobs
**Description**: Get all active jobs with pagination
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Example**: `GET /api/jobs?page=1&limit=5`

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Software Developer",
        "description": "We are looking for a skilled software developer",
        "requirements": "3+ years experience in JavaScript",
        "location": "Sydney",
        "state": "NSW",
        "type": "Full Time",
        "jobTypeCategory": "Permanent",
        "workType": "Hybrid",
        "industry": "technology",
        "salaryDisplay": "$80k - $100k",
        "tags": ["javascript", "react", "node.js"],
        "featured": false,
        "urgent": false,
        "status": "active",
        "applicantCount": 0,
        "viewCount": 0,
        "companyId": {
          "name": "Tech Solutions Pty Ltd",
          "logo": "/uploads/logo-123456789.png",
          "location": "Sydney, NSW",
          "industry": ["technology"]
        },
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### POST /api/jobs
**Description**: Create a new job (Employer only)
**Headers**: 
- `Content-Type: application/json`
- `x-user-id: {employerUserId}`

**Request Body**:
```json
{
  "title": "Software Developer",
  "description": "We are looking for a skilled software developer to join our team...",
  "requirements": "3+ years experience in JavaScript, React, Node.js",
  "duties": "Develop and maintain web applications", // optional
  "location": "Sydney",
  "state": "NSW",
  "type": "Full Time",
  "jobTypeCategory": "Permanent", 
  "workType": "Hybrid",
  "industry": "technology",
  "salaryMin": 80000, // optional
  "salaryMax": 100000, // optional
  "salaryDisplay": "$80k - $100k",
  "benefits": ["Health insurance", "Flexible hours"], // optional
  "tags": ["javascript", "react", "node.js"],
  "featured": false, // optional
  "urgent": false, // optional
  "expiresAt": "2024-03-15T00:00:00.000Z" // optional
}
```

**Validation Rules**:
- `title`: Required, min 1 character
- `description`: Required, min 1 character  
- `requirements`: Required, min 1 character
- `location`: Required, min 1 character
- `state`: Required, must be one of: NSW, VIC, QLD, WA, SA, TAS, ACT, NT
- `type`: Required, must be one of: Full Time, Part Time, Contract, FIFO 2:1, FIFO 8:6
- `jobTypeCategory`: Required, must be one of: Permanent, Contract, Apprenticeship, Trainee
- `workType`: Required, must be one of: On-Site, Remote, Hybrid
- `industry`: Required, must be one of: health, hospitality, childcare, construction, mining, technology
- `salaryDisplay`: Required, min 1 character

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "job": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Software Developer",
      "description": "We are looking for a skilled software developer",
      "requirements": "3+ years experience in JavaScript",
      "location": "Sydney",
      "state": "NSW",
      "type": "Full Time",
      "jobTypeCategory": "Permanent",
      "workType": "Hybrid", 
      "industry": "technology",
      "salaryMin": 80000,
      "salaryMax": 100000,
      "salaryDisplay": "$80k - $100k",
      "tags": ["javascript", "react", "node.js"],
      "featured": false,
      "urgent": false,
      "status": "active",
      "applicantCount": 0,
      "viewCount": 0,
      "companyId": {
        "name": "Tech Solutions Pty Ltd",
        "logo": "/uploads/logo-123456789.png",
        "location": "Sydney, NSW"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## 4. Candidate Routes

### GET /api/candidates/profile
**Description**: Get candidate profile (Candidate only)
**Headers**: 
- `x-user-id: {candidateUserId}`

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "profile": {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "currentRole": "Software Developer",
      "currentCompany": "Tech Corp",
      "yearsExperience": "3-5",
      "skills": "JavaScript, React, Node.js, MongoDB",
      "education": "Bachelor of Computer Science",
      "preferredRole": "Senior Software Developer",
      "preferredLocation": "Sydney",
      "preferredIndustries": ["technology"],
      "salaryExpectation": 95000,
      "availableFrom": "2024-02-01T00:00:00.000Z",
      "visaStatus": "citizen",
      "resumeUrl": "/uploads/resume-123456789.pdf",
      "portfolioUrl": "https://johndoe.dev",
      "linkedinUrl": "https://linkedin.com/in/johndoe",
      "isOpenToWork": true,
      "profileViews": 15,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### PUT /api/candidates/profile
**Description**: Update candidate profile (Candidate only)
**Headers**: 
- `Content-Type: application/json`
- `x-user-id: {candidateUserId}`

**Request Body**:
```json
{
  "currentRole": "Senior Software Developer",
  "currentCompany": "Tech Corp Pty Ltd",
  "yearsExperience": "5-10",
  "skills": "JavaScript, React, Node.js, MongoDB, AWS",
  "education": "Bachelor of Computer Science, University of Sydney",
  "preferredRole": "Lead Software Developer", 
  "preferredLocation": "Sydney",
  "preferredIndustries": ["technology"],
  "salaryExpectation": 120000,
  "availableFrom": "2024-03-01T00:00:00.000Z",
  "visaStatus": "citizen",
  "portfolioUrl": "https://johndoe.dev",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "isOpenToWork": true
}
```

**Validation Rules**:
- `yearsExperience`: Must be one of: 0-1, 1-3, 3-5, 5-10, 10+
- `visaStatus`: Must be one of: citizen, pr, visa_holder, needs_sponsorship
- `preferredIndustries`: Must be array of valid industries
- `salaryExpectation`: Must be positive number

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "profile": {
      // Updated profile object
    }
  }
}
```

### POST /api/candidates/upload-resume
**Description**: Upload candidate resume (Candidate only)
**Headers**: 
- `Content-Type: multipart/form-data`
- `x-user-id: {candidateUserId}`

**Request Body**: 
- Form data with file field named `resume`
- Supported formats: PDF, DOC, DOCX
- Max size: 10MB

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "profile": {
      // Updated profile with resumeUrl
    },
    "fileUpload": {
      "filename": "resume-1234567890.pdf",
      "originalName": "john_doe_resume.pdf",
      "url": "/uploads/resume-1234567890.pdf"
    }
  }
}
```

### GET /api/candidates/applications
**Description**: Get candidate's job applications (Candidate only)
**Headers**: 
- `x-user-id: {candidateUserId}`

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `status`: string (optional filter)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "jobId": {
          "_id": "507f1f77bcf86cd799439012",
          "title": "Software Developer",
          "companyId": {
            "name": "Tech Solutions Pty Ltd",
            "logo": "/uploads/logo-123456789.png",
            "location": "Sydney, NSW"
          }
        },
        "status": "pending",
        "coverLetter": "I am very interested in this position...",
        "appliedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### GET /api/candidates/saved-jobs
**Description**: Get candidate's saved jobs (Candidate only)
**Headers**: 
- `x-user-id: {candidateUserId}`

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "savedJobs": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "jobId": {
          "_id": "507f1f77bcf86cd799439012",
          "title": "Software Developer",
          "location": "Sydney",
          "salaryDisplay": "$80k - $100k",
          "companyId": {
            "name": "Tech Solutions Pty Ltd",
            "logo": "/uploads/logo-123456789.png"
          }
        },
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

### POST /api/candidates/saved-jobs
**Description**: Save a job (Candidate only)
**Headers**: 
- `Content-Type: application/json`
- `x-user-id: {candidateUserId}`

**Request Body**:
```json
{
  "jobId": "507f1f77bcf86cd799439012"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "savedJob": {
      "_id": "507f1f77bcf86cd799439015",
      "candidateId": "507f1f77bcf86cd799439011",
      "jobId": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### DELETE /api/candidates/saved-jobs/{jobId}
**Description**: Remove saved job (Candidate only)
**Headers**: 
- `x-user-id: {candidateUserId}`

**Response (200)**:
```json
{
  "success": true,
  "message": "Job removed from saved list"
}
```

---

## 5. Company Routes

### GET /api/companies/{id}
**Description**: Get company details (Public route)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "company": {
      "_id": "507f1f77bcf86cd799439016",
      "name": "Tech Solutions Pty Ltd",
      "description": "Leading technology company in Australia",
      "website": "https://techsolutions.com.au",
      "logo": "/uploads/logo-123456789.png",
      "size": "50-100 employees",
      "founded": "2015",
      "industry": ["technology"],
      "location": "Sydney, NSW",
      "contactEmail": "hr@techsolutions.com.au",
      "contactPhone": "+61299999999",
      "isVerified": true
    },
    "jobs": [
      // Array of active jobs from this company
    ],
    "stats": {
      "totalJobs": 15,
      "activeJobs": 8,
      "totalApplications": 127
    }
  }
}
```

### PUT /api/companies/profile
**Description**: Update company profile (Employer only)
**Headers**: 
- `Content-Type: application/json`
- `x-user-id: {employerUserId}`

**Request Body**:
```json
{
  "name": "Tech Solutions Pty Ltd",
  "description": "Leading technology company specializing in web development",
  "website": "https://techsolutions.com.au",
  "size": "50-100 employees",
  "founded": "2015",
  "industry": ["technology"],
  "location": "Sydney, NSW",
  "contactEmail": "hr@techsolutions.com.au",
  "contactPhone": "+61299999999"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "company": {
      // Updated company object
    }
  }
}
```

### POST /api/companies/upload-logo
**Description**: Upload company logo (Employer only)
**Headers**: 
- `Content-Type: multipart/form-data`
- `x-user-id: {employerUserId}`

**Request Body**: 
- Form data with file field named `logo`
- Supported formats: JPG, PNG, SVG
- Max size: 10MB

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "company": {
      // Updated company with logo URL
    },
    "fileUpload": {
      "filename": "logo-1234567890.png",
      "originalName": "company_logo.png", 
      "url": "/uploads/logo-1234567890.png"
    }
  }
}
```

---

## 6. Search Routes

### GET /api/search/jobs
**Description**: Advanced job search (Public route)

**Query Parameters**:
- `q`: string (search query)
- `industry`: string[] (filter by industry)
- `location`: string[] (filter by location)
- `salaryMin`: number (minimum salary)
- `salaryMax`: number (maximum salary)
- `workType`: string[] (filter by work type)
- `jobType`: string[] (filter by job type)
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Example**: `GET /api/search/jobs?q=developer&industry=technology&location=Sydney&salaryMin=80000`

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "jobs": [
      // Array of matching jobs with company info
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    },
    "suggestions": {
      "keywords": ["developer", "engineer", "programmer"],
      "locations": ["Sydney", "Melbourne", "Brisbane"],
      "industries": ["technology", "finance", "healthcare"]
    }
  }
}
```

### GET /api/search/recommendations/jobs
**Description**: Get job recommendations for candidate (Candidate only)
**Headers**: 
- `x-user-id: {candidateUserId}`

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        // Job object with additional fields:
        "matchScore": 85,
        "matchReasons": [
          "Industry preference match",
          "Location preference match", 
          "Experience level suitable"
        ]
      }
    ]
  }
}
```

---

## 7. Data Routes (Public)

### GET /api/data/industries
**Description**: Get available industries

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "industries": [
      {
        "value": "technology",
        "label": "Technology & IT",
        "description": "Software development, IT support, and technology roles",
        "jobCount": 150
      },
      {
        "value": "health",
        "label": "Healthcare & Medical", 
        "description": "Healthcare professionals, medical practitioners, and support staff",
        "jobCount": 89
      }
    ]
  }
}
```

### GET /api/data/locations
**Description**: Get available locations

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "locations": [
      {
        "state": "NSW",
        "cities": [
          {
            "name": "Sydney",
            "jobCount": 245
          },
          {
            "name": "Newcastle", 
            "jobCount": 32
          }
        ]
      }
    ]
  }
}
```

### GET /api/data/skills
**Description**: Get popular skills by industry

**Query Parameters**:
- `industry`: string (optional filter)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "skills": [
      {
        "name": "JavaScript",
        "category": "Programming",
        "popularity": 90
      },
      {
        "name": "React",
        "category": "Framework", 
        "popularity": 85
      }
    ]
  }
}
```

---

## 8. Analytics Routes

### GET /api/analytics/dashboard
**Description**: Get dashboard analytics
**Headers**: 
- `x-user-id: {userId}`

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalJobs": 1250,
      "totalApplications": 5670,
      "totalCandidates": 2340,
      "totalCompanies": 180,
      "recentActivity": {
        "newJobs": 25,
        "newApplications": 89,
        "newCandidates": 15
      }
    },
    "charts": {
      "jobsByIndustry": [
        {
          "industry": "technology",
          "count": 450
        }
      ],
      "applicationsByMonth": [
        {
          "month": "2024-1",
          "count": 234
        }
      ],
      "topLocations": [
        {
          "location": "Sydney",
          "count": 345
        }
      ]
    }
  }
}
```

---

## 9. Contact Routes

### POST /api/contact
**Description**: Submit contact inquiry (Public route)
**Headers**: 
- `Content-Type: application/json`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+61400000000",
  "company": "Tech Corp",
  "subject": "General Inquiry",
  "message": "I have a question about your platform...",
  "type": "general"
}
```

**Validation Rules**:
- `name`: Required, min 1 character
- `email`: Required, valid email format
- `subject`: Required, min 1 character
- `message`: Required, min 10 characters
- `type`: Required, must be one of: general, employer, candidate, support

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "inquiry": {
      "_id": "507f1f77bcf86cd799439017",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "subject": "General Inquiry",
      "message": "I have a question about your platform...",
      "type": "general",
      "status": "new",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## 10. Health Check

### GET /health
**Description**: Server health check (Public route)

**Response (200)**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "errors": [
    "Email is required",
    "First name must be at least 1 character"
  ]
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
  "message": "Only employers can create jobs"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Job not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```