# CrossNations Admin Management System

## Overview
Complete admin management system for the CrossNations job portal with full CRUD operations on all platform entities.

---

## Admin Authentication

### Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@crossnations.com",
  "password": "your_password"
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
      "_id": "admin_id",
      "email": "admin@crossnations.com",
      "firstName": "System",
      "lastName": "Administrator",
      "role": "admin"
    }
  }
}
```

---

## User Management

### 1. Get All Users
```http
GET /api/users?page=1&limit=10&role=candidate
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (candidate, employer, admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "user_id",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "candidate",
        "isEmailVerified": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    }
  }
}
```

### 2. Get User by ID
```http
GET /api/admin/users/{user_id}
Authorization: Bearer {admin_token}
```

### 3. Update User
```http
PUT /api/admin/users/{user_id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "firstName": "Updated",
  "lastName": "Name",
  "email": "updated@example.com",
  "role": "employer",
  "isEmailVerified": true
}
```

### 4. Delete User
```http
DELETE /api/admin/users/{user_id}
Authorization: Bearer {admin_token}
```

---

## Candidate Management

### 1. Get All Candidates
```http
GET /api/candidates?page=1&limit=10
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "candidates": [
      {
        "_id": "candidate_id",
        "userId": "user_id",
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+61400000000",
        "location": "Sydney",
        "state": "NSW",
        "currentRole": "Software Developer",
        "yearsExperience": "3-5",
        "skills": "JavaScript, React, Node.js",
        "preferredIndustries": ["technology"],
        "visaStatus": "citizen",
        "isOpenToWork": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 85,
      "totalPages": 9
    }
  }
}
```

### 2. Update Candidate
```http
PUT /api/admin/candidates/{candidate_id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "fullName": "Updated Name",
  "location": "Melbourne",
  "state": "VIC",
  "currentRole": "Senior Developer",
  "isOpenToWork": false
}
```

### 3. Delete Candidate
```http
DELETE /api/admin/candidates/{candidate_id}
Authorization: Bearer {admin_token}
```

---

## Company Management

### 1. Get All Companies
```http
GET /api/companies?page=1&limit=10
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "_id": "company_id",
        "userId": "employer_user_id",
        "name": "Tech Solutions Pty Ltd",
        "description": "Leading technology company",
        "website": "https://techsolutions.com.au",
        "logo": "/uploads/logo_123.png",
        "size": "51-200",
        "founded": 2015,
        "industry": ["technology", "health"],
        "location": "Sydney",
        "state": "NSW",
        "contact": {
          "email": "hr@techsolutions.com.au",
          "phone": "+61299000000"
        },
        "isVerified": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

### 2. Update Company
```http
PUT /api/admin/companies/{company_id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Updated Company Name",
  "description": "Updated description",
  "website": "https://newwebsite.com",
  "isVerified": true,
  "industry": ["technology", "mining"]
}
```

### 3. Verify Company
```http
POST /api/admin/companies/{company_id}/verify
Authorization: Bearer {admin_token}
```

### 4. Delete Company
```http
DELETE /api/admin/companies/{company_id}
Authorization: Bearer {admin_token}
```

---

## Job Management

### 1. Get All Jobs (Admin)
```http
GET /api/jobs/admin/all?page=1&limit=10
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "job_id",
        "title": "Senior Software Developer",
        "description": "We are looking for...",
        "location": "Sydney",
        "state": "NSW",
        "type": "Full Time",
        "jobTypeCategory": "Permanent",
        "workType": "Hybrid",
        "industry": "technology",
        "salaryDisplay": "$90,000 - $120,000",
        "salaryMin": 90000,
        "salaryMax": 120000,
        "status": "active",
        "company": {
          "name": "Tech Solutions Pty Ltd",
          "location": "Sydney",
          "logo": "/uploads/logo_123.png"
        },
        "postedBy": "employer_user_id",
        "applicantCount": 15,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 320,
      "totalPages": 32
    }
  }
}
```

### 2. Update Job (Admin)
```http
PUT /api/jobs/admin/{job_id}
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

{
  "title": "Updated Job Title",
  "description": "Updated description",
  "status": "inactive",
  "salaryMin": 95000,
  "salaryMax": 125000
}
```

### 3. Delete Job (Admin)
```http
DELETE /api/jobs/admin/{job_id}
Authorization: Bearer {admin_token}
```

---

## Application Management

### 1. Get All Applications
```http
GET /api/applications?page=1&limit=10&status=Pending
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status (Pending, Reviewed, Interview, Rejected, Hired)

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "_id": "application_id",
        "candidateId": "candidate_id",
        "jobId": {
          "_id": "job_id",
          "title": "Software Developer",
          "company": {
            "name": "Tech Solutions"
          },
          "location": "Sydney"
        },
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+61400000000",
        "currentRole": "Junior Developer",
        "yearsExperience": "1-3",
        "resumeUrl": "/uploads/resume_123.pdf",
        "status": "Pending",
        "appliedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 180,
      "totalPages": 18
    }
  }
}
```

### 2. Update Application Status
```http
PUT /api/admin/applications/{application_id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "Interview"
}
```

### 3. Delete Application
```http
DELETE /api/admin/applications/{application_id}
Authorization: Bearer {admin_token}
```

---

## Analytics & Dashboard

### 1. Dashboard Analytics
```http
GET /api/admin/analytics/dashboard
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalJobs": 450,
    "totalApplications": 3200,
    "totalCompanies": 180,
    "activeJobs": 320,
    "pendingApplications": 150,
    "verifiedCompanies": 120,
    "monthlyStats": {
      "newUsers": 85,
      "newJobs": 25,
      "newApplications": 180
    }
  }
}
```

---

## Admin Management

### 1. Get All Admins
```http
GET /api/admin/
Authorization: Bearer {admin_token}
```

### 2. Create Admin
```http
POST /api/admin/create
Content-Type: application/json

{
  "email": "newadmin@crossnations.com",
  "firstName": "New",
  "lastName": "Admin",
  "password": "securepassword123",
  "phone": "+61400000000"
}
```

### 3. Update Admin
```http
PUT /api/admin/{admin_id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "firstName": "Updated",
  "lastName": "Admin",
  "email": "updated@crossnations.com"
}
```

### 4. Delete Admin
```http
DELETE /api/admin/{admin_id}
Authorization: Bearer {admin_token}
```

---

## Complete API Routes Summary

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (with pagination & filters) |
| GET | `/api/admin/users/{id}` | Get user by ID |
| PUT | `/api/admin/users/{id}` | Update user |
| DELETE | `/api/admin/users/{id}` | Delete user |

### Candidate Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/candidates` | Get all candidates (with pagination) |
| PUT | `/api/admin/candidates/{id}` | Update candidate |
| DELETE | `/api/admin/candidates/{id}` | Delete candidate |

### Company Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | Get all companies (with pagination) |
| PUT | `/api/admin/companies/{id}` | Update company |
| POST | `/api/admin/companies/{id}/verify` | Verify company |
| DELETE | `/api/admin/companies/{id}` | Delete company |

### Job Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/admin/all` | Get all jobs (with pagination) |
| PUT | `/api/jobs/admin/{id}` | Update job |
| DELETE | `/api/jobs/admin/{id}` | Delete job |

### Application Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get all applications (with pagination & filters) |
| PUT | `/api/admin/applications/{id}` | Update application status |
| DELETE | `/api/admin/applications/{id}` | Delete application |

### Admin Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/` | Get all admins |
| POST | `/api/admin/create` | Create new admin |
| PUT | `/api/admin/{id}` | Update admin |
| DELETE | `/api/admin/{id}` | Delete admin |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/analytics/dashboard` | Get dashboard analytics |

---

## Authentication & Authorization

### Required Headers
All admin routes require authentication:
```http
Authorization: Bearer {jwt_token}
```

### Admin Token
Obtain admin token via login:
```http
POST /api/admin/login
{
  "email": "admin@crossnations.com",
  "password": "your_password"
}
```

### Permissions
- **Full CRUD Access**: Admins can create, read, update, and delete all entities
- **User Management**: Change user roles, verify emails, manage accounts
- **Content Moderation**: Approve/reject jobs, verify companies
- **Analytics Access**: View all platform statistics and reports
- **System Administration**: Manage other admin accounts

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Data Relationships

### Cascade Deletions
When deleting entities, related data is automatically cleaned up:

- **Delete User**: Removes associated candidate/company profiles, applications, saved jobs
- **Delete Company**: Removes all jobs posted by the company
- **Delete Candidate**: Removes applications and saved jobs
- **Delete Job**: Removes all applications for that job

### Data Integrity
- Users cannot be deleted if they have active job postings
- Companies cannot be deleted if they have pending applications
- Referential integrity maintained across all collections

---

## Usage Examples

### Complete User Management Flow
```bash
# 1. Login as admin
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crossnations.com","password":"password"}'

# 2. Get all users
curl -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/users?page=1&limit=10"

# 3. Update user role
curl -X PUT http://localhost:3001/api/admin/users/{user_id} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"role":"employer"}'

# 4. Delete user
curl -X DELETE http://localhost:3001/api/admin/users/{user_id} \
  -H "Authorization: Bearer {token}"
```

### Company Verification Flow
```bash
# 1. Get all unverified companies
curl -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/companies?page=1&limit=10"

# 2. Verify a company
curl -X POST http://localhost:3001/api/admin/companies/{company_id}/verify \
  -H "Authorization: Bearer {token}"
```

### Application Management Flow
```bash
# 1. Get pending applications
curl -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/applications?status=Pending"

# 2. Update application status
curl -X PUT http://localhost:3001/api/admin/applications/{app_id} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"status":"Interview"}'
```

---

This admin management system provides complete control over the CrossNations platform with comprehensive CRUD operations, analytics, and user management capabilities.