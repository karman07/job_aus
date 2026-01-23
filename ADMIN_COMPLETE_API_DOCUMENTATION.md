# CrossNations Admin API Documentation

## Overview
Complete admin panel API documentation for the CrossNations job portal platform. This document covers all administrative actions, user management, employer management, and system operations.

## Base URL
```
http://localhost:3001/api
```

## Authentication
All admin routes require JWT authentication with admin role.

### Headers Required
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json (for JSON requests)
Content-Type: multipart/form-data (for file uploads)
```

---

## 🔐 Admin Authentication

### Admin Login
```http
POST /api/admin/login
```

**Request Body:**
```json
{
  "email": "admin@crossnations.com",
  "password": "admin_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "admin": {
      "_id": "admin_id",
      "email": "admin@crossnations.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"
    }
  }
}
```

### Create New Admin
```http
POST /api/admin/create
```

**Request Body:**
```json
{
  "email": "newadmin@crossnations.com",
  "firstName": "New",
  "lastName": "Admin",
  "password": "secure_password",
  "phone": "+61412345678"
}
```

---

## 👥 User Management

### Get All Users
```http
GET /api/users/admin/all
```

**Query Parameters:**
- `role` (optional): Filter by role (candidate, employer, admin)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search by name or email

### Get User by ID
```http
GET /api/users/admin/:userId
```

### Update User
```http
PUT /api/users/admin/:userId
```

**Request Body:**
```json
{
  "firstName": "Updated Name",
  "lastName": "Updated Last",
  "email": "updated@email.com",
  "phone": "+61412345678",
  "isEmailVerified": true
}
```

### Delete User
```http
DELETE /api/users/admin/:userId
```

**Response:**
```json
{
  "success": true,
  "message": "User and associated profile deleted successfully"
}
```

### Suspend/Unsuspend User
```http
PUT /api/users/admin/:userId/suspend
```

**Request Body:**
```json
{
  "suspended": true,
  "reason": "Violation of terms of service"
}
```

---

## 🏢 Employer Management

### Get All Employers
```http
GET /api/admin/employers
```

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `search`: Search by company name or email
- `verified`: Filter by verification status (true/false)
- `industry`: Filter by industry

### Get Employer Details
```http
GET /api/admin/employers/:employerId
```

**Response includes:**
- User information
- Company profile
- Job postings count
- Applications received
- Account statistics

### Update Employer
```http
PUT /api/admin/employers/:employerId
```

**Request Body (multipart/form-data):**
```
firstName: Updated Name
lastName: Updated Last
email: updated@email.com
phone: +61412345678
company.name: Updated Company Name
company.description: Updated description
company.website: https://updated-website.com
company.location: Updated Location
company.state: NSW
company.industry: ["technology", "health"]
company.size: 51-200
company.founded: 2015
company.contact.email: contact@updated.com
company.contact.phone: +61298765432
logo: [file upload]
```

### Delete Employer
```http
DELETE /api/admin/employers/:employerId
```

**Response:**
```json
{
  "success": true,
  "message": "Employer account and all associated data deleted successfully",
  "data": {
    "deletedUser": true,
    "deletedCompany": true,
    "deletedJobs": 5,
    "deletedApplications": 23
  }
}
```

### Verify/Unverify Employer
```http
PUT /api/admin/employers/:employerId/verify
```

**Request Body:**
```json
{
  "verified": true,
  "verificationNotes": "Company documents verified"
}
```

### Get Employer Jobs
```http
GET /api/admin/employers/:employerId/jobs
```

### Get Employer Applications
```http
GET /api/admin/employers/:employerId/applications
```

---

## 👨‍💼 Candidate Management

### Get All Candidates
```http
GET /api/admin/candidates
```

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `search`: Search by name or email
- `industry`: Filter by preferred industry
- `experience`: Filter by years of experience
- `visaStatus`: Filter by visa status
- `openToWork`: Filter by availability (true/false)

### Get Candidate Details
```http
GET /api/admin/candidates/:candidateId
```

### Update Candidate
```http
PUT /api/admin/candidates/:candidateId
```

**Request Body (multipart/form-data):**
```
firstName: Updated Name
lastName: Updated Last
email: updated@email.com
phone: +61412345678
candidate.fullName: Updated Full Name
candidate.location: Updated Location
candidate.state: VIC
candidate.preferredRole: Senior Developer
candidate.currentRole: Developer
candidate.currentCompany: Tech Corp
candidate.yearsExperience: 3-5
candidate.skills: JavaScript, Python, React
candidate.education: Bachelor of Computer Science
candidate.preferredIndustries: ["technology", "health"]
candidate.salaryExpectation: 85000
candidate.visaStatus: citizen
candidate.portfolioUrl: https://portfolio.com
candidate.linkedinUrl: https://linkedin.com/in/user
candidate.isOpenToWork: true
profilePhoto: [file upload]
resume: [file upload]
coverLetter: [file upload]
certificates: [file uploads]
```

### Delete Candidate
```http
DELETE /api/admin/candidates/:candidateId
```

### Get Candidate Applications
```http
GET /api/admin/candidates/:candidateId/applications
```

---

## 💼 Job Management

### Get All Jobs (Admin View)
```http
GET /api/jobs/admin/all
```

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `search`: Search by title or company
- `industry`: Filter by industry
- `type`: Filter by job type
- `status`: Filter by status (active, inactive, expired)
- `employer`: Filter by employer ID

### Get Job Details
```http
GET /api/jobs/:jobId
```

### Update Job (Admin)
```http
PUT /api/jobs/admin/:jobId
```

**Request Body (multipart/form-data):**
```
title: Updated Job Title
description: Updated job description
location: Updated Location
state: NSW
type: Full Time
jobTypeCategory: Permanent
workType: On-Site
industry: technology
salaryDisplay: $80,000 - $100,000
requirements: Updated requirements
benefits: Updated benefits
contactEmail: hr@company.com
contactPhone: +61298765432
isActive: true
logo: [file upload]
contentFile: [file upload]
```

### Delete Job
```http
DELETE /api/jobs/admin/:jobId
```

### Approve/Reject Job
```http
PUT /api/admin/jobs/:jobId/status
```

**Request Body:**
```json
{
  "status": "approved", // or "rejected"
  "adminNotes": "Job meets all requirements"
}
```

---

## 📊 Analytics & Reports

### Dashboard Analytics
```http
GET /api/admin/analytics/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalEmployers": 85,
    "totalCandidates": 1165,
    "totalJobs": 342,
    "activeJobs": 298,
    "totalApplications": 2847,
    "newUsersThisMonth": 67,
    "newJobsThisMonth": 23,
    "applicationsThisMonth": 156,
    "topIndustries": [
      { "industry": "technology", "count": 89 },
      { "industry": "health", "count": 76 }
    ],
    "topLocations": [
      { "state": "NSW", "count": 145 },
      { "state": "VIC", "count": 98 }
    ]
  }
}
```

### User Analytics
```http
GET /api/admin/analytics/users
```

### Job Analytics
```http
GET /api/admin/analytics/jobs
```

### Application Analytics
```http
GET /api/admin/analytics/applications
```

---

## 📝 Application Management

### Get All Applications
```http
GET /api/admin/applications
```

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status
- `jobId`: Filter by job
- `candidateId`: Filter by candidate
- `employerId`: Filter by employer

### Update Application Status
```http
PUT /api/admin/applications/:applicationId/status
```

**Request Body:**
```json
{
  "status": "reviewed", // pending, reviewed, shortlisted, interviewed, offered, rejected, withdrawn
  "adminNotes": "Application reviewed by admin"
}
```

---

## 🗂️ Content Management

### Upload Files
```http
POST /api/admin/upload
```

**Request Body (multipart/form-data):**
```
file: [file upload]
type: logo|resume|document|image
```

### Delete File
```http
DELETE /api/admin/files/:filename
```

---

## ⚙️ System Management

### Get System Stats
```http
GET /api/admin/system/stats
```

### Database Cleanup
```http
POST /api/admin/system/cleanup
```

**Request Body:**
```json
{
  "cleanupType": "expired_jobs", // expired_jobs, old_applications, unused_files
  "daysOld": 30
}
```

### Export Data
```http
GET /api/admin/export/:dataType
```

**Data Types:**
- `users`: Export all users
- `employers`: Export all employers
- `candidates`: Export all candidates
- `jobs`: Export all jobs
- `applications`: Export all applications

**Query Parameters:**
- `format`: csv|json|xlsx
- `dateFrom`: Start date (YYYY-MM-DD)
- `dateTo`: End date (YYYY-MM-DD)

---

## 🔍 Search & Filtering

### Advanced Search
```http
GET /api/admin/search
```

**Query Parameters:**
- `q`: Search query
- `type`: users|jobs|applications|companies
- `filters`: JSON string of filters
- `sortBy`: Field to sort by
- `sortOrder`: asc|desc

---

## 📧 Communication

### Send Notification
```http
POST /api/admin/notifications
```

**Request Body:**
```json
{
  "recipients": ["user_id_1", "user_id_2"], // or "all"
  "type": "system|announcement|warning",
  "title": "System Maintenance",
  "message": "Scheduled maintenance on Sunday",
  "priority": "high|medium|low"
}
```

### Send Email
```http
POST /api/admin/email
```

**Request Body:**
```json
{
  "recipients": ["email1@example.com", "email2@example.com"],
  "subject": "Important Update",
  "template": "system_update",
  "data": {
    "userName": "User Name",
    "updateDetails": "System will be updated"
  }
}
```

---

## 🛡️ Security & Permissions

### Admin Roles
- **Super Admin**: Full system access
- **Admin**: User and content management
- **Moderator**: Content review and basic user management

### Permission Levels
```json
{
  "super_admin": [
    "user.create", "user.read", "user.update", "user.delete",
    "job.create", "job.read", "job.update", "job.delete",
    "system.manage", "admin.manage"
  ],
  "admin": [
    "user.read", "user.update", "user.suspend",
    "job.read", "job.update", "job.approve",
    "application.read", "application.update"
  ],
  "moderator": [
    "user.read", "job.read", "job.approve",
    "application.read"
  ]
}
```

---

## 📋 Bulk Operations

### Bulk User Actions
```http
POST /api/admin/bulk/users
```

**Request Body:**
```json
{
  "action": "suspend|delete|verify|email",
  "userIds": ["id1", "id2", "id3"],
  "data": {
    "reason": "Bulk operation reason",
    "emailTemplate": "template_name"
  }
}
```

### Bulk Job Actions
```http
POST /api/admin/bulk/jobs
```

**Request Body:**
```json
{
  "action": "approve|reject|delete|expire",
  "jobIds": ["id1", "id2", "id3"],
  "data": {
    "adminNotes": "Bulk operation notes"
  }
}
```

---

## 🚨 Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Field is required", "Invalid format"]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Server error",
  "error": "Detailed error message"
}
```

---

## 📊 Rate Limiting

- **Admin API**: 1000 requests per hour
- **Bulk Operations**: 10 requests per minute
- **File Uploads**: 50 requests per hour

---

## 🔄 API Versioning

Current API Version: `v1`

All endpoints are prefixed with `/api/` for version 1.

---

## 📝 Changelog

### Version 1.0.0
- Initial admin API implementation
- User management endpoints
- Employer management endpoints
- Job management endpoints
- Analytics and reporting
- Bulk operations support

---

## 🆘 Support

For API support and questions:
- Email: dev@crossnations.com
- Documentation: [API Docs](http://localhost:3001/api/docs)
- Status Page: [System Status](http://localhost:3001/status)

---

## 🔗 Quick Reference

### Most Used Admin Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| Admin Login | POST | `/api/admin/login` |
| Get All Users | GET | `/api/users/admin/all` |
| Delete User | DELETE | `/api/users/admin/:id` |
| Get All Employers | GET | `/api/admin/employers` |
| Delete Employer | DELETE | `/api/admin/employers/:id` |
| Verify Employer | PUT | `/api/admin/employers/:id/verify` |
| Get All Jobs | GET | `/api/jobs/admin/all` |
| Delete Job | DELETE | `/api/jobs/admin/:id` |
| Dashboard Analytics | GET | `/api/admin/analytics/dashboard` |
| Send Notification | POST | `/api/admin/notifications` |

### File Upload Limits
- **Images**: 10MB (JPG, PNG, SVG)
- **Documents**: 10MB (PDF, DOC, DOCX)
- **Resumes**: 10MB (PDF, DOC, DOCX)

### Supported File Types
- **Logos**: JPG, PNG, SVG
- **Resumes**: PDF, DOC, DOCX
- **Content Files**: PDF, MD
- **Certificates**: PDF, JPG, PNG