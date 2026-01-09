# CrossNations API - Simplified Working Routes

## Base URL
```
http://localhost:3001/api
```

## Authentication
Use `x-user-id` header with MongoDB ObjectId for protected routes.

---

## 1. Authentication

### POST /api/auth/register
Register new user without password

**Request:**
```json
{
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "candidate",
  "phone": "+61400000000"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "candidate"
    }
  }
}
```

---

## 2. User Profile

### GET /api/users/profile
Get current user profile
**Headers:** `x-user-id: {userId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "candidate"
    },
    "profile": null,
    "company": null
  }
}
```

### PUT /api/users/profile
Update user profile
**Headers:** `x-user-id: {userId}`

**Request:**
```json
{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "phone": "+61400000001"
}
```

---

## 3. Jobs

### GET /api/jobs
Get all jobs with pagination

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "companyId": {
          "_id": "507f1f77bcf86cd799439016",
          "name": "Tech Solutions Pty Ltd",
          "logo": "/uploads/logo-123456789.png",
          "location": "Sydney, NSW",
          "industry": ["technology"]
        },
        "title": "Senior Software Developer",
        "description": "We are looking for an experienced software developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.",
        "requirements": "- 5+ years experience in JavaScript/TypeScript\n- Strong knowledge of React and Node.js\n- Experience with MongoDB and REST APIs\n- Bachelor's degree in Computer Science or equivalent",
        "duties": "- Develop and maintain web applications\n- Collaborate with cross-functional teams\n- Write clean, maintainable code\n- Participate in code reviews",
        "location": "Sydney",
        "state": "NSW",
        "type": "Full Time",
        "jobTypeCategory": "Permanent",
        "workType": "Hybrid",
        "industry": "technology",
        "salaryMin": 90000,
        "salaryMax": 120000,
        "salaryDisplay": "$90k - $120k + super",
        "benefits": [
          "Health insurance",
          "Flexible working hours",
          "Professional development budget",
          "Work from home options"
        ],
        "tags": ["javascript", "react", "node.js", "mongodb", "typescript"],
        "featured": false,
        "urgent": false,
        "status": "active",
        "applicantCount": 12,
        "viewCount": 156,
        "postedAt": "2024-01-15T10:30:00.000Z",
        "expiresAt": "2024-03-15T23:59:59.000Z",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
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

### GET /api/jobs/:id
Get single job by ID

**Parameters:**
- `id`: MongoDB ObjectId of the job

**Response:**
```json
{
  "success": true,
  "data": {
    "job": {
      "_id": "507f1f77bcf86cd799439012",
      "companyId": {
        "_id": "507f1f77bcf86cd799439016",
        "name": "Tech Solutions Pty Ltd",
        "logo": "/uploads/logo-123456789.png",
        "location": "Sydney, NSW",
        "industry": ["technology"],
        "description": "Leading technology company specializing in web development",
        "website": "https://techsolutions.com.au",
        "size": "50-100 employees"
      },
      "title": "Senior Software Developer",
      "description": "We are looking for an experienced software developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.",
      "requirements": "- 5+ years experience in JavaScript/TypeScript\n- Strong knowledge of React and Node.js\n- Experience with MongoDB and REST APIs\n- Bachelor's degree in Computer Science or equivalent",
      "duties": "- Develop and maintain web applications\n- Collaborate with cross-functional teams\n- Write clean, maintainable code\n- Participate in code reviews",
      "location": "Sydney",
      "state": "NSW",
      "type": "Full Time",
      "jobTypeCategory": "Permanent",
      "workType": "Hybrid",
      "industry": "technology",
      "salaryMin": 90000,
      "salaryMax": 120000,
      "salaryDisplay": "$90k - $120k + super",
      "benefits": [
        "Health insurance",
        "Flexible working hours",
        "Professional development budget",
        "Work from home options"
      ],
      "tags": ["javascript", "react", "node.js", "mongodb", "typescript"],
      "featured": false,
      "urgent": false,
      "status": "active",
      "applicantCount": 12,
      "viewCount": 157,
      "postedAt": "2024-01-15T10:30:00.000Z",
      "expiresAt": "2024-03-15T23:59:59.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "relatedJobs": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Frontend Developer",
        "location": "Melbourne",
        "salaryDisplay": "$70k - $90k",
        "companyId": {
          "name": "Digital Agency",
          "logo": "/uploads/logo-987654321.png"
        }
      }
    ]
  }
}
```

### POST /api/jobs
Create new job with company details (Employer only)
**Headers:** `x-user-id: {employerUserId}`

**Request with Company Details:**
```json
{
  "title": "Senior Software Developer",
  "description": "We are looking for an experienced software developer to join our growing team.",
  "requirements": "- 5+ years experience in JavaScript/TypeScript\n- Strong knowledge of React and Node.js",
  "duties": "- Develop and maintain web applications\n- Collaborate with cross-functional teams",
  "location": "Sydney",
  "state": "NSW",
  "type": "Full Time",
  "jobTypeCategory": "Permanent",
  "workType": "Hybrid",
  "industry": "technology",
  "salaryMin": 90000,
  "salaryMax": 120000,
  "salaryDisplay": "$90k - $120k + super",
  "benefits": ["Health insurance", "Flexible hours"],
  "tags": ["javascript", "react", "node.js"],
  "featured": false,
  "urgent": false,
  "expiresAt": "2024-03-15T23:59:59.000Z",
  "company": {
    "name": "Tech Solutions Pty Ltd",
    "description": "Leading technology company in Australia",
    "website": "https://techsolutions.com.au",
    "logo": "https://techsolutions.com.au/logo.png",
    "size": "50-100 employees",
    "founded": "2015",
    "industry": ["technology"],
    "location": "Sydney, NSW",
    "contactEmail": "hr@techsolutions.com.au",
    "contactPhone": "+61299999999"
  }
}
```

**Validation:**
- **Job Fields** (all required as before)
- **Company Fields** (optional - creates/updates company):
  - `company.name`: string, 1-100 chars
  - `company.description`: string, 10-2000 chars
  - `company.website`: valid URL
  - `company.logo`: valid URL
  - `company.size`: string
  - `company.founded`: string (year)
  - `company.industry`: array of strings
  - `company.location`: string
  - `company.contactEmail`: valid email
  - `company.contactPhone`: string

**Response:**
```json
{
  "success": true,
  "data": {
    "job": {
      "_id": "507f1f77bcf86cd799439012",
      "companyId": {
        "_id": "507f1f77bcf86cd799439016",
        "name": "Tech Solutions Pty Ltd",
        "logo": "https://techsolutions.com.au/logo.png",
        "location": "Sydney, NSW"
      },
      "title": "Senior Software Developer",
      "location": "Sydney",
      "salaryDisplay": "$90k - $120k + super",
      "status": "active"
    },
    "company": {
      "_id": "507f1f77bcf86cd799439016",
      "name": "Tech Solutions Pty Ltd",
      "description": "Leading technology company in Australia",
      "website": "https://techsolutions.com.au",
      "logo": "https://techsolutions.com.au/logo.png"
    }
  }
}
```

**Job Schema - All Fields:**
```typescript
interface Job {
  _id: string;                    // MongoDB ObjectId
  companyId: string;              // Reference to Company
  title: string;                  // Job title
  description: string;            // Detailed job description
  requirements: string;           // Job requirements
  duties?: string;                // Job duties (optional)
  location: string;               // City/location
  state: 'NSW'|'VIC'|'QLD'|'WA'|'SA'|'TAS'|'ACT'|'NT'; // Australian state
  type: 'Full Time'|'Part Time'|'Contract'|'FIFO 2:1'|'FIFO 8:6'; // Job type
  jobTypeCategory: 'Permanent'|'Contract'|'Apprenticeship'|'Trainee'; // Category
  workType: 'On-Site'|'Remote'|'Hybrid'; // Work arrangement
  industry: 'health'|'hospitality'|'childcare'|'construction'|'mining'|'technology'; // Industry
  salaryMin?: number;             // Minimum salary (optional)
  salaryMax?: number;             // Maximum salary (optional)
  salaryDisplay: string;          // Salary display text
  benefits?: string[];            // Job benefits (optional)
  tags: string[];                 // Job tags/keywords
  featured: boolean;              // Featured job flag
  urgent: boolean;                // Urgent job flag
  status: 'draft'|'active'|'paused'|'closed'; // Job status
  applicantCount: number;         // Number of applicants
  viewCount: number;              // Number of views
  postedAt: Date;                 // Posted date
  expiresAt?: Date;               // Expiry date (optional)
  createdAt: Date;                // Created timestamp
  updatedAt: Date;                // Updated timestamp
}
```

---

## 4. Candidate Profile

### GET /api/candidates/profile
Get candidate profile (Candidate only)
**Headers:** `x-user-id: {candidateUserId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "currentRole": "Software Developer",
      "yearsExperience": "3-5",
      "skills": "JavaScript, React, Node.js",
      "preferredIndustries": ["technology"],
      "visaStatus": "citizen",
      "isOpenToWork": true
    }
  }
}
```

### PUT /api/candidates/profile
Update candidate profile (Candidate only)
**Headers:** `x-user-id: {candidateUserId}`

**Request:**
```json
{
  "currentRole": "Senior Developer",
  "currentCompany": "Tech Corp",
  "yearsExperience": "5-10",
  "skills": "JavaScript, React, Node.js, AWS",
  "preferredIndustries": ["technology"],
  "visaStatus": "citizen",
  "isOpenToWork": true,
  "salaryExpectation": 120000
}
```

**Validation:**
- `yearsExperience`: Must be 0-1, 1-3, 3-5, 5-10, 10+
- `visaStatus`: Must be citizen, pr, visa_holder, needs_sponsorship
- `preferredIndustries`: Must be array
- `salaryExpectation`: Must be number

---

## 5. Reference Data

### GET /api/data/industries
Get available industries

**Response:**
```json
{
  "success": true,
  "data": {
    "industries": [
      {
        "value": "technology",
        "label": "Technology & IT",
        "description": "Software development and IT roles",
        "jobCount": 150
      },
      {
        "value": "health",
        "label": "Healthcare & Medical",
        "description": "Healthcare professionals",
        "jobCount": 89
      }
    ]
  }
}
```

### GET /api/data/locations
Get Australian locations

**Response:**
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
Get skills by industry

**Query Parameters:**
- `industry`: string (optional)

**Response:**
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

## Health Check

### GET /health
Server status check

**Response:**
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
  "errors": ["Email is required", "Invalid state"]
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
  "message": "Profile not found"
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

## Usage Flow

1. **Register User:** `POST /api/auth/register`
2. **Get User ID:** Save `user.id` from response
3. **Use User ID:** Add `x-user-id` header to all protected requests
4. **Create/Update Profile:** Use candidate or user profile endpoints
5. **Manage Jobs:** Employers can create jobs, candidates can view them

## Working Routes Summary
- ✅ User registration (no password)
- ✅ User profile management
- ✅ Job listing and creation
- ✅ Candidate profile management
- ✅ Reference data (industries, locations, skills)
- ✅ Health check