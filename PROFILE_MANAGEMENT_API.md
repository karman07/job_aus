# CrossNations Profile Management APIs

Complete documentation for candidate and employer profile management endpoints with file upload support.

## 🎯 Overview

This API provides comprehensive profile management for both candidates and employers, including:
- Profile CRUD operations
- File uploads (photos, resumes, logos)
- Job management for employers
- Application tracking for candidates
- Analytics and statistics

## 🔐 Authentication

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

## 👤 Candidate Profile APIs

### **1. Get Candidate Profile**
**Endpoint:** `GET /api/candidates/profile`
**Authentication:** Required (Candidate only)

#### **cURL:**
```bash
curl -X GET http://localhost:3001/api/candidates/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "candidate@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "candidate",
      "isEmailVerified": false,
      "phone": "+61400000001"
    },
    "profile": {
      "_id": "profile_id",
      "userId": "user_id",
      "fullName": "John Michael Doe",
      "email": "candidate@example.com",
      "phone": "+61400000001",
      "location": "Sydney",
      "state": "NSW",
      "preferredRole": "Software Developer",
      "profilePhoto": "/uploads/profile-photo-123.jpg",
      "currentRole": "Junior Developer",
      "currentCompany": "Tech Startup",
      "yearsExperience": "1-3",
      "skills": "JavaScript, React, Node.js",
      "education": "Bachelor of Computer Science",
      "preferredIndustries": ["technology"],
      "salaryExpectation": 75000,
      "availableFrom": "2024-02-01T00:00:00.000Z",
      "visaStatus": "citizen",
      "resumeUrl": "/uploads/resume-123.pdf",
      "portfolioUrl": "https://johndoe.dev",
      "linkedinUrl": "https://linkedin.com/in/johndoe",
      "coverLetterUrl": "/uploads/cover-letter-123.pdf",
      "certificatesUrls": ["/uploads/cert-123.pdf"],
      "isOpenToWork": true,
      "profileViews": 15,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### **2. Update Candidate Profile**
**Endpoint:** `PUT /api/candidates/profile`
**Authentication:** Required (Candidate only)
**Content-Type:** `multipart/form-data`

#### **cURL with Files:**
```bash
curl -X PUT http://localhost:3001/api/candidates/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --form 'fullName=John Updated Doe' \
  --form 'location=Melbourne' \
  --form 'state=VIC' \
  --form 'currentRole=Senior Developer' \
  --form 'currentCompany=New Tech Company' \
  --form 'yearsExperience=5-10' \
  --form 'skills=React, Node.js, Python, AWS, Docker' \
  --form 'education=Master of Computer Science' \
  --form 'preferredIndustries=technology' \
  --form 'preferredIndustries=health' \
  --form 'salaryExpectation=120000' \
  --form 'availableFrom=2024-03-01T00:00:00.000Z' \
  --form 'visaStatus=citizen' \
  --form 'portfolioUrl=https://updated-portfolio.com' \
  --form 'linkedinUrl=https://linkedin.com/in/updated-profile' \
  --form 'isOpenToWork=true' \
  --form 'profilePhoto=@/path/to/new-photo.jpg' \
  --form 'resume=@/path/to/updated-resume.pdf' \
  --form 'coverLetter=@/path/to/cover-letter.pdf' \
  --form 'certificates=@/path/to/certificate1.pdf' \
  --form 'certificates=@/path/to/certificate2.pdf'
```

#### **Field Validations:**
- `fullName`: Optional, min 1 character
- `location`: Optional, min 1 character
- `state`: Optional, must be valid Australian state
- `yearsExperience`: Optional, enum: `['0-1', '1-3', '3-5', '5-10', '10+']`
- `visaStatus`: Optional, enum: `['citizen', 'pr', 'visa_holder', 'needs_sponsorship']`
- `preferredIndustries`: Optional array
- `salaryExpectation`: Optional number
- `portfolioUrl`: Optional valid URL
- `linkedinUrl`: Optional valid URL

#### **File Types:**
- `profilePhoto`: JPG, PNG, SVG (max 10MB)
- `resume`: PDF, DOC, DOCX (max 10MB)
- `coverLetter`: PDF, DOC, DOCX (max 10MB)
- `certificates`: PDF, DOC, DOCX (max 5 files, 10MB each)

### **3. Upload Resume Only**
**Endpoint:** `POST /api/candidates/upload-resume`
**Authentication:** Required (Candidate only)

#### **cURL:**
```bash
curl -X POST http://localhost:3001/api/candidates/upload-resume \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

### **4. Get Candidate Applications**
**Endpoint:** `GET /api/candidates/applications`
**Authentication:** Required (Candidate only)

#### **Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### **cURL:**
```bash
curl -X GET "http://localhost:3001/api/candidates/applications?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "_id": "application_id",
        "jobId": {
          "_id": "job_id",
          "title": "Software Developer",
          "company": "Tech Company",
          "location": "Sydney",
          "jobType": "Full Time",
          "workType": "Hybrid",
          "salaryRange": "80000-100000"
        },
        "status": "pending",
        "appliedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### **5. Get Saved Jobs**
**Endpoint:** `GET /api/candidates/saved-jobs`
**Authentication:** Required (Candidate only)

#### **cURL:**
```bash
curl -X GET "http://localhost:3001/api/candidates/saved-jobs?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **6. Save Job**
**Endpoint:** `POST /api/candidates/saved-jobs`
**Authentication:** Required (Candidate only)

#### **cURL:**
```bash
curl -X POST http://localhost:3001/api/candidates/saved-jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jobId": "JOB_ID_HERE"}'
```

### **7. Remove Saved Job**
**Endpoint:** `DELETE /api/candidates/saved-jobs/:jobId`
**Authentication:** Required (Candidate only)

#### **cURL:**
```bash
curl -X DELETE http://localhost:3001/api/candidates/saved-jobs/JOB_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🏢 Employer/Company Profile APIs

### **1. Get Company Profile**
**Endpoint:** `GET /api/companies/profile`
**Authentication:** Required (Employer only)

#### **cURL:**
```bash
curl -X GET http://localhost:3001/api/companies/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "employer@company.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "employer",
      "isEmailVerified": true,
      "phone": "+61400000002"
    },
    "profile": {
      "_id": "company_id",
      "userId": "user_id",
      "name": "Tech Solutions Pty Ltd",
      "description": "Leading technology solutions provider",
      "website": "https://techsolutions.com.au",
      "logo": "/uploads/logo-123.png",
      "size": "51-200",
      "founded": 2015,
      "industry": ["technology", "health"],
      "location": "Sydney CBD",
      "state": "NSW",
      "contact": {
        "email": "hr@techsolutions.com.au",
        "phone": "+61234567890"
      },
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### **2. Update Company Profile**
**Endpoint:** `PUT /api/companies/profile`
**Authentication:** Required (Employer only)
**Content-Type:** `multipart/form-data`

#### **cURL with Logo:**
```bash
curl -X PUT http://localhost:3001/api/companies/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --form 'name=Updated Company Name' \
  --form 'description=We are a leading technology company specializing in innovative solutions' \
  --form 'website=https://updated-company.com' \
  --form 'size=51-200' \
  --form 'founded=2015' \
  --form 'industry=technology' \
  --form 'industry=health' \
  --form 'location=Sydney CBD' \
  --form 'state=NSW' \
  --form 'contact.email=hr@company.com' \
  --form 'contact.phone=+61234567890' \
  --form 'logo=@/path/to/company-logo.png'
```

#### **Field Validations:**
- `name`: Optional, min 1 character
- `location`: Optional, min 1 character
- `state`: Optional, valid Australian state
- `industry`: Optional array, min 1 item, valid industries
- `size`: Optional, enum: `['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']`
- `founded`: Optional, year between 1800 and current year
- `website`: Optional, valid URL
- `contact.email`: Optional, valid email
- `contact.phone`: Optional, valid phone number

#### **File Types:**
- `logo`: JPG, PNG, SVG (max 10MB)

### **3. Upload Logo Only**
**Endpoint:** `POST /api/companies/upload-logo`
**Authentication:** Required (Employer only)

#### **cURL:**
```bash
curl -X POST http://localhost:3001/api/companies/upload-logo \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "logo=@/path/to/logo.png"
```

### **4. Get Company Jobs**
**Endpoint:** `GET /api/companies/jobs`
**Authentication:** Required (Employer only)

#### **Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by job status (optional)

#### **cURL:**
```bash
curl -X GET "http://localhost:3001/api/companies/jobs?page=1&limit=10&status=active" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "job_id",
        "title": "Senior Software Developer",
        "description": "Job description...",
        "location": "Sydney",
        "jobType": "Full Time",
        "workType": "Hybrid",
        "salaryRange": "100000-130000",
        "status": "active",
        "applicationCount": 15,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

### **5. Get Company Analytics**
**Endpoint:** `GET /api/companies/analytics`
**Authentication:** Required (Employer only)

#### **cURL:**
```bash
curl -X GET http://localhost:3001/api/companies/analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalJobs": 12,
      "activeJobs": 8,
      "totalApplications": 156
    },
    "applicationsByStatus": [
      { "_id": "pending", "count": 45 },
      { "_id": "reviewed", "count": 32 },
      { "_id": "shortlisted", "count": 18 },
      { "_id": "rejected", "count": 61 }
    ],
    "recentApplications": [
      {
        "_id": "application_id",
        "jobId": {
          "_id": "job_id",
          "title": "Software Developer"
        },
        "candidateId": {
          "_id": "candidate_id",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

## 📝 Common Response Format

All APIs follow this response structure:

### **Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### **Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

---

## 🔒 Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (wrong role)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📁 File Upload Specifications

### **Supported File Types:**
- **Images**: JPG, JPEG, PNG, SVG
- **Documents**: PDF, DOC, DOCX

### **File Size Limits:**
- **Images**: 10MB maximum
- **Documents**: 10MB maximum

### **File Storage:**
- Files stored in `/uploads` directory
- Unique filenames generated automatically
- File paths returned in API responses
- Files accessible via `/uploads/filename` URL

---

## 🎯 Features

### **Candidate Features:**
- ✅ Complete profile management
- ✅ Resume and document uploads
- ✅ Profile photo management
- ✅ Application tracking
- ✅ Job bookmarking/saving
- ✅ Skills and preferences management

### **Employer Features:**
- ✅ Company profile management
- ✅ Logo upload and branding
- ✅ Job listing management
- ✅ Application analytics
- ✅ Candidate tracking
- ✅ Company statistics

### **Technical Features:**
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ File upload validation
- ✅ Pagination support
- ✅ Form-data and JSON support
- ✅ Comprehensive error handling
- ✅ Input validation and sanitization