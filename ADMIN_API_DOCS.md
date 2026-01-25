# Admin API Documentation

## Authentication
All admin endpoints require authentication with a valid JWT token and admin role.

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

---

## Admin Management

### Create Admin
**POST** `/api/admin/create`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "securepassword123",
  "phone": "+61400000000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "admin": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "admin@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+61400000000",
      "role": "admin",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Admin Login
**POST** `/api/admin/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "admin@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin"
    }
  }
}
```

### Get All Admins
**GET** `/api/admin/admins`

**Response:**
```json
{
  "success": true,
  "data": {
    "admins": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "email": "admin@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "admin",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### Update Admin
**PUT** `/api/admin/:id`

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "password": "newpassword123",
  "phone": "+61400000001"
}
```

### Delete Admin
**DELETE** `/api/admin/:id`

---

## User Management

### Get All Users
**GET** `/api/admin/users`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role ('candidate', 'employer', 'admin')

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "candidate",
        "isEmailVerified": true,
        "authProvider": "email",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### Get User by ID
**GET** `/api/admin/users/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "candidate",
      "isEmailVerified": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "profile": {
      // CandidateProfile or Company object based on user role
    }
  }
}
```

### Update User
**PUT** `/api/admin/users/:id`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "newemail@example.com",
  "role": "employer",
  "isEmailVerified": true
}
```

### Delete User
**DELETE** `/api/admin/users/:id`

---

## Job Management

### Get All Jobs
**GET** `/api/admin/jobs`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status ('active', 'inactive', 'closed')

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Software Developer",
        "description": "We are looking for a skilled software developer...",
        "location": "Sydney",
        "state": "NSW",
        "type": "Full Time",
        "industry": "technology",
        "status": "active",
        "postedBy": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "firstName": "John",
          "lastName": "Employer",
          "email": "employer@example.com"
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

### Create Job
**POST** `/api/admin/jobs`

**Request Body:**
```json
{
  "postedBy": "64f8a1b2c3d4e5f6a7b8c9d1",
  "title": "Software Developer",
  "description": "We are looking for a skilled software developer to join our team...",
  "requirements": "- 3+ years of experience\n- JavaScript, React, Node.js",
  "keyResponsibilities": "- Develop web applications\n- Code reviews",
  "location": "Sydney",
  "state": "NSW",
  "type": "Full Time",
  "jobTypeCategory": "Permanent",
  "workType": "Hybrid",
  "industry": "technology",
  "salaryDisplay": "$80,000 - $100,000",
  "salaryMin": 80000,
  "salaryMax": 100000,
  "sponsorshipAvailable": false,
  "tags": ["javascript", "react", "nodejs"],
  "status": "active",
  "company": {
    "name": "Tech Company",
    "description": "Leading tech company",
    "website": "https://techcompany.com",
    "logo": "https://example.com/logo.png",
    "size": "51-200",
    "founded": 2010,
    "industry": ["technology"],
    "location": "Sydney",
    "contact": {
      "email": "hr@techcompany.com",
      "phone": "+61400000000"
    }
  },
  "customFields": [
    {
      "label": "Security Clearance",
      "value": "Required"
    }
  ]
}
```

### Update Job
**PUT** `/api/admin/jobs/:id`

**Request Body:** Same as Create Job (all fields optional)

### Delete Job
**DELETE** `/api/admin/jobs/:id`

---

## Company Management

### Get All Companies
**GET** `/api/admin/companies`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Tech Company",
        "description": "Leading technology company",
        "website": "https://techcompany.com",
        "logo": "https://example.com/logo.png",
        "size": "51-200",
        "founded": 2010,
        "industry": ["technology"],
        "location": "Sydney",
        "state": "NSW",
        "contact": {
          "email": "hr@techcompany.com",
          "phone": "+61400000000"
        },
        "isVerified": true,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2
    }
  }
}
```

### Create Company
**POST** `/api/admin/companies`

**Request Body:**
```json
{
  "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "name": "Tech Company",
  "description": "Leading technology company specializing in web development",
  "website": "https://techcompany.com",
  "logo": "https://example.com/logo.png",
  "size": "51-200",
  "founded": 2010,
  "industry": ["technology"],
  "location": "Sydney",
  "state": "NSW",
  "contact": {
    "email": "hr@techcompany.com",
    "phone": "+61400000000"
  },
  "isVerified": false
}
```

**Field Validations:**
- `userId`: Must be a valid employer user ID
- `size`: One of ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
- `founded`: Year between 1800 and current year
- `industry`: Array of ['health', 'hospitality', 'childcare', 'construction', 'mining', 'technology']
- `state`: One of ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']
- `website`: Must be valid URL starting with http:// or https://

### Update Company
**PUT** `/api/admin/companies/:id`

**Request Body:** Same as Create Company (all fields optional)

### Verify Company
**POST** `/api/admin/companies/:id/verify`

### Delete Company
**DELETE** `/api/admin/companies/:id`

---

## Candidate Management

### Get All Candidates
**GET** `/api/admin/candidates`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "candidates": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
        "fullName": "John Candidate",
        "email": "john@example.com",
        "phone": "+61400000000",
        "location": "Sydney",
        "state": "NSW",
        "preferredRole": "Software Developer",
        "currentRole": "Junior Developer",
        "currentCompany": "StartupCo",
        "yearsExperience": "3-5",
        "skills": "JavaScript, React, Node.js, Python",
        "education": "Bachelor of Computer Science",
        "preferredIndustries": ["technology"],
        "salaryExpectation": 85000,
        "visaStatus": "citizen",
        "isOpenToWork": true,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### Create Candidate
**POST** `/api/admin/candidates`

**Request Body:**
```json
{
  "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "fullName": "John Candidate",
  "email": "john@example.com",
  "phone": "+61400000000",
  "location": "Sydney",
  "state": "NSW",
  "preferredRole": "Software Developer",
  "profilePhoto": "https://example.com/photo.jpg",
  "currentRole": "Junior Developer",
  "currentCompany": "StartupCo",
  "yearsExperience": "3-5",
  "skills": "JavaScript, React, Node.js, Python, AWS",
  "education": "Bachelor of Computer Science - University of Sydney",
  "preferredIndustries": ["technology"],
  "salaryExpectation": 85000,
  "availableFrom": "2024-02-01T00:00:00.000Z",
  "visaStatus": "citizen",
  "resumeUrl": "https://example.com/resume.pdf",
  "portfolioUrl": "https://johncandidate.dev",
  "linkedinUrl": "https://linkedin.com/in/johncandidate",
  "coverLetterUrl": "https://example.com/cover-letter.pdf",
  "certificatesUrls": [
    "https://example.com/cert1.pdf",
    "https://example.com/cert2.pdf"
  ],
  "isOpenToWork": true
}
```

**Field Validations:**
- `userId`: Must be a valid candidate user ID
- `state`: One of ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']
- `yearsExperience`: One of ['0-1', '1-3', '3-5', '5-10', '10+']
- `preferredIndustries`: Array of ['health', 'hospitality', 'childcare', 'construction', 'mining', 'technology']
- `visaStatus`: One of ['citizen', 'pr', 'visa_holder', 'needs_sponsorship']
- `salaryExpectation`: Positive number

### Update Candidate
**PUT** `/api/admin/candidates/:id`

**Request Body:** Same as Create Candidate (all fields optional)

### Delete Candidate
**DELETE** `/api/admin/candidates/:id`

---

## Application Management

### Get All Applications
**GET** `/api/admin/applications`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status ('Pending', 'Reviewed', 'Interview', 'Rejected', 'Hired')

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "candidateId": "64f8a1b2c3d4e5f6a7b8c9d1",
        "jobId": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "title": "Software Developer",
          "company": "Tech Company",
          "location": "Sydney"
        },
        "fullName": "John Candidate",
        "email": "john@example.com",
        "phone": "+61400000000",
        "location": "Sydney",
        "currentRole": "Junior Developer",
        "yearsExperience": "3-5",
        "resumeUrl": "https://example.com/resume.pdf",
        "status": "Pending",
        "appliedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 75,
      "totalPages": 8
    }
  }
}
```

### Update Application Status
**PUT** `/api/admin/applications/:id`

**Request Body:**
```json
{
  "status": "Interview"
}
```

**Valid Status Values:**
- `Pending`
- `Reviewed`
- `Interview`
- `Rejected`
- `Hired`

### Delete Application
**DELETE** `/api/admin/applications/:id`

---

## Analytics

### Get Dashboard Analytics
**GET** `/api/admin/analytics/dashboard`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalJobs": 85,
    "totalApplications": 450,
    "totalCompanies": 35,
    "activeJobs": 62,
    "pendingApplications": 125,
    "verifiedCompanies": 28,
    "monthlyStats": {
      "newUsers": 45,
      "newJobs": 12,
      "newApplications": 89
    }
  }
}
```

---

## Data Enums and Constants

### Australian States
```
NSW, VIC, QLD, WA, SA, TAS, ACT, NT
```

### Job Types
```
Full Time, Part Time, Contract, FIFO 2:1, FIFO 8:6
```

### Job Type Categories
```
Permanent, Contract, Apprenticeship, Trainee
```

### Work Types
```
On-Site, Remote, Hybrid
```

### Industries
```
health, hospitality, childcare, construction, mining, technology
```

### Years of Experience
```
0-1, 1-3, 3-5, 5-10, 10+
```

### Company Sizes
```
1-10, 11-50, 51-200, 201-500, 501-1000, 1000+
```

### Visa Status
```
citizen, pr, visa_holder, needs_sponsorship
```

### Job Status
```
active, inactive, closed
```

### Application Status
```
Pending, Reviewed, Interview, Rejected, Hired
```

### User Roles
```
candidate, employer, admin
```

### Auth Providers
```
email, google
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Pagination

All list endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Pagination response format:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```