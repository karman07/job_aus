# Employer Job Posting API

## How Employers Post Jobs

Employers use the regular job API endpoints (not admin endpoints) to create and manage their job postings.

---

## Authentication Required
All employer endpoints require authentication with JWT token:
```
Authorization: Bearer <employer_jwt_token>
```

---

## Employer Job Management Flow

### 1. Employer Registration & Company Setup
Before posting jobs, employers must:
1. **Register as employer** via `/api/auth/register` with `role: "employer"`
2. **Complete company profile** via `/api/companies/profile` 
3. **Company profile must have**: name, location, state, industry

### 2. Job Creation Process

**POST** `/api/jobs`

**Headers:**
```
Authorization: Bearer <employer_jwt_token>
Content-Type: multipart/form-data
```

**Required Fields:**
- `title` (string): Job title
- `location` (string): Job location  
- `state` (enum): Australian state
- `type` (enum): Job type
- `jobTypeCategory` (enum): Job category
- `workType` (enum): Work arrangement
- `industry` (enum): Industry sector
- `salaryDisplay` (string): Salary display text

**Request Body (Form Data):**
```javascript
// Required fields
title: "Senior Software Developer"
location: "Sydney CBD"
state: "NSW"
type: "Full Time"
jobTypeCategory: "Permanent" 
workType: "Hybrid"
industry: "technology"
salaryDisplay: "$120,000 - $150,000 + Super"

// Optional fields
description: "We are seeking an experienced software developer..."
requirements: "- 5+ years experience\n- JavaScript, React, Node.js"
keyResponsibilities: "- Lead development projects\n- Mentor junior developers"
salaryMin: 120000
salaryMax: 150000
sponsorshipAvailable: true
tags: ["javascript", "react", "nodejs", "senior"]

// File upload (optional)
contentFile: <PDF/DOC file>
```

**Field Validations:**

**REQUIRED ENUMS:**
- `state`: "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT"
- `type`: "Full Time" | "Part Time" | "Contract" | "FIFO 2:1" | "FIFO 8:6"
- `jobTypeCategory`: "Permanent" | "Contract" | "Apprenticeship" | "Trainee"
- `workType`: "On-Site" | "Remote" | "Hybrid"
- `industry`: "health" | "hospitality" | "childcare" | "construction" | "mining" | "technology"

**Response:**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "job": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Senior Software Developer",
      "description": "We are seeking an experienced software developer...",
      "requirements": "- 5+ years experience\n- JavaScript, React, Node.js",
      "keyResponsibilities": "- Lead development projects\n- Mentor junior developers",
      "contentFile": "/uploads/job-description-1234567890.pdf",
      "location": "Sydney CBD",
      "state": "NSW",
      "type": "Full Time",
      "jobTypeCategory": "Permanent",
      "workType": "Hybrid",
      "industry": "technology",
      "salaryDisplay": "$120,000 - $150,000 + Super",
      "salaryMin": 120000,
      "salaryMax": 150000,
      "sponsorshipAvailable": true,
      "tags": ["javascript", "react", "nodejs", "senior"],
      "status": "active",
      "applicantCount": 0,
      "postedBy": "64f8a1b2c3d4e5f6a7b8c9d1",
      "postedAt": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "company": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "name": "Tech Innovations Pty Ltd",
      "description": "Leading Australian technology company",
      "industry": ["technology"],
      "location": "Sydney CBD",
      "state": "NSW",
      "website": "https://techinnovations.com.au",
      "logo": "https://cdn.techinnovations.com.au/logo.png",
      "size": "201-500",
      "founded": 2015,
      "contactEmail": "careers@techinnovations.com.au",
      "contactPhone": "+61 2 9876 5432",
      "isVerified": true
    },
    "employer": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "email": "sarah.johnson@techinnovations.com.au",
      "firstName": "Sarah",
      "lastName": "Johnson",
      "role": "employer"
    }
  }
}
```

---

## Key Differences: Employer vs Admin Job Creation

### **Employer Job Creation** (`POST /api/jobs`)
- ✅ **Automatic company embedding**: Company info automatically pulled from employer's company profile
- ✅ **Automatic employer binding**: `postedBy` automatically set to authenticated employer's ID
- ✅ **Company profile required**: Must have complete company profile before posting
- ✅ **File upload support**: Can upload job description files (PDF/DOC)
- ✅ **Email notifications**: Automatic job creation notifications sent
- ✅ **Validation**: Strict validation on all required fields
- ❌ **Cannot specify postedBy**: Always uses authenticated employer's ID

### **Admin Job Creation** (`POST /api/admin/jobs`)
- ✅ **Manual company embedding**: Admin manually provides company info in request
- ✅ **Manual employer binding**: Admin specifies `postedBy` field
- ❌ **No company profile check**: Can create jobs without company profiles
- ❌ **No file upload**: No file upload middleware
- ❌ **No email notifications**: No automatic notifications
- ✅ **Full control**: Admin can create jobs for any employer

---

## Employer Job Management Endpoints

### 1. Create Job
**POST** `/api/jobs`
- Requires: Employer authentication + complete company profile
- Auto-embeds company info from Company model
- Auto-sets `postedBy` to authenticated employer
- Supports file uploads for job descriptions

### 2. Update Job  
**PUT** `/api/jobs/:id`
- Only job owner can update their own jobs
- Supports file uploads
- Partial updates supported

### 3. Get Public Jobs
**GET** `/api/jobs`
- Public endpoint (no auth required)
- Returns only active jobs
- Supports pagination and filtering

### 4. Get Single Job
**GET** `/api/jobs/:id`
- Public endpoint (no auth required)
- Returns job details with embedded company info

---

## Complete Employer Job Creation Example

### Step 1: Employer Registration
```javascript
POST /api/auth/register
{
  "email": "sarah.johnson@techinnovations.com.au",
  "firstName": "Sarah",
  "lastName": "Johnson", 
  "password": "securepassword123",
  "role": "employer"
}
```

### Step 2: Complete Company Profile
```javascript
PUT /api/companies/profile
Authorization: Bearer <employer_token>
{
  "name": "Tech Innovations Pty Ltd",
  "description": "Leading Australian technology company",
  "website": "https://techinnovations.com.au",
  "industry": ["technology"],
  "location": "Sydney CBD",
  "state": "NSW",
  "size": "201-500",
  "founded": 2015,
  "contact": {
    "email": "careers@techinnovations.com.au",
    "phone": "+61 2 9876 5432"
  }
}
```

### Step 3: Create Job
```javascript
POST /api/jobs
Authorization: Bearer <employer_token>
Content-Type: multipart/form-data

// Form data
title: "Senior Software Developer"
location: "Sydney CBD"
state: "NSW"
type: "Full Time"
jobTypeCategory: "Permanent"
workType: "Hybrid"
industry: "technology"
salaryDisplay: "$120,000 - $150,000 + Super"
description: "We are seeking an experienced software developer to join our growing team..."
requirements: "- 5+ years of professional software development experience\n- Strong proficiency in JavaScript, React, and Node.js"
keyResponsibilities: "- Design and develop scalable web applications\n- Lead technical discussions"
salaryMin: 120000
salaryMax: 150000
sponsorshipAvailable: true
tags: ["javascript", "react", "nodejs", "senior", "full-stack"]
contentFile: <job-description.pdf>
```

---

## File Upload Support

Employers can upload job description files:

**Supported File Types:**
- PDF (.pdf)
- Word Documents (.doc, .docx)
- Maximum file size: 10MB

**File Field Name:** `contentFile`

**Usage:**
- If `contentFile` is uploaded, `description`, `requirements`, and `keyResponsibilities` text fields are ignored
- File is stored in `/uploads/` directory
- File URL returned in response as `contentFile` field

---

## Automatic Features for Employers

### 1. Company Data Embedding
When employer creates a job, the system automatically:
- Fetches their company profile from Company model
- Embeds complete company data into the job document
- Validates company profile completeness

### 2. Employer Binding
- `postedBy` field automatically set to authenticated employer's user ID
- Prevents employers from posting jobs for other companies
- Ensures proper job ownership

### 3. Email Notifications
- Automatic job creation confirmation email sent to employer
- Email includes job details and posting confirmation

### 4. Status Management
- New jobs automatically set to `status: "active"`
- Jobs immediately visible in public job listings

---

## Error Handling

### Company Profile Required
```json
{
  "success": false,
  "message": "Company profile not found. Please complete your company profile before posting jobs."
}
```

### Incomplete Company Profile
```json
{
  "success": false,
  "message": "Company profile incomplete. Please ensure company name, location, state, and industry are set."
}
```

### Validation Errors
```json
{
  "success": false,
  "errors": [
    "Job title is required",
    "Valid Australian state is required",
    "Valid job type is required"
  ]
}
```

### Authorization Error
```json
{
  "success": false,
  "message": "Access denied. Only employers can create jobs."
}
```

---

## Summary

**Employers post jobs through the regular `/api/jobs` endpoints, NOT the admin endpoints.**

The system automatically:
1. ✅ Validates employer authentication and company profile
2. ✅ Embeds company information from their Company profile
3. ✅ Binds the job to the authenticated employer
4. ✅ Sets job status to active
5. ✅ Sends confirmation notifications
6. ✅ Supports file uploads for job descriptions

This ensures proper job ownership, data consistency, and security while providing a streamlined experience for employers.