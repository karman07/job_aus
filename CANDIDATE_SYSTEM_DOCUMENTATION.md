# Candidate System - Complete API Documentation

## 🚀 Overview
Complete documentation for the Candidate system including schema details, registration, profile management, applications, and all API endpoints.

---

## 📋 Table of Contents
1. [Candidate Schema](#candidate-schema)
2. [Registration API](#registration-api)
3. [Profile Management APIs](#profile-management-apis)
4. [Application Management APIs](#application-management-apis)
5. [File Upload APIs](#file-upload-apis)
6. [Search & Filter APIs](#search--filter-apis)
7. [Complete API Reference](#complete-api-reference)

---

## 📊 Candidate Schema

### **Complete CandidateProfile Model**

```typescript
interface ICandidateProfile {
  userId: string;                    // Reference to User model (required, unique)
  
  // Personal Details
  fullName: string;                  // Complete full name
  email: string;                     // Email address (lowercase, trimmed)
  phone: string;                     // Phone number (trimmed)
  location: string;                  // Current location/city (trimmed)
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'; // Australian state
  preferredRole?: string;            // Desired job title (optional, trimmed)
  profilePhoto?: string;             // Profile photo URL/path (optional)
  
  // Experience & Skills
  currentRole: string;               // Current job title (trimmed)
  currentCompany?: string;           // Current employer (optional, trimmed)
  yearsExperience: '0-1' | '1-3' | '3-5' | '5-10' | '10+'; // Experience level
  skills?: string;                   // Skills description (optional)
  education?: string;                // Education background (optional)
  
  // Job Preferences
  preferredIndustries: string[];     // Array of preferred industries
  salaryExpectation?: number;        // Expected salary (optional, min: 0)
  availableFrom?: Date;              // Available start date (optional)
  visaStatus: 'citizen' | 'pr' | 'visa_holder' | 'needs_sponsorship'; // Visa status
  
  // Documents & Links
  resumeUrl?: string;                // Resume file URL/path (optional)
  portfolioUrl?: string;             // Portfolio website URL (optional)
  linkedinUrl?: string;              // LinkedIn profile URL (optional)
  coverLetterUrl?: string;           // Cover letter file URL/path (optional)
  certificatesUrls?: string[];       // Array of certificate file URLs/paths (optional)
  
  // Status & Analytics
  isOpenToWork: boolean;             // Open to work status (default: true)
  profileViews: number;              // Profile view count (default: 0)
  
  // Timestamps
  createdAt: Date;                   // Creation timestamp
  updatedAt: Date;                   // Last update timestamp
}
```

### **Field Validations & Constraints**

#### **Required Fields:**
- ✅ `userId` - Must reference existing User with role 'candidate'
- ✅ `fullName` - Cannot be empty
- ✅ `email` - Must be valid email format
- ✅ `phone` - Cannot be empty
- ✅ `location` - Cannot be empty
- ✅ `currentRole` - Cannot be empty
- ✅ `yearsExperience` - Must be one of enum values
- ✅ `visaStatus` - Must be one of enum values

#### **Optional Fields:**
- 🔸 `state` - Must be valid Australian state if provided
- 🔸 `preferredRole` - String, trimmed
- 🔸 `profilePhoto` - File path/URL
- 🔸 `currentCompany` - String, trimmed
- 🔸 `skills` - Text description
- 🔸 `education` - Text description
- 🔸 `preferredIndustries` - Array of valid industry values
- 🔸 `salaryExpectation` - Positive number
- 🔸 `availableFrom` - Valid date
- 🔸 `resumeUrl` - File path/URL
- 🔸 `portfolioUrl` - Valid URL
- 🔸 `linkedinUrl` - Valid URL
- 🔸 `coverLetterUrl` - File path/URL
- 🔸 `certificatesUrls` - Array of file paths/URLs

#### **Enum Values:**

**Australian States:**
```typescript
'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'
```

**Years of Experience:**
```typescript
'0-1' | '1-3' | '3-5' | '5-10' | '10+'
```

**Industries:**
```typescript
'health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology'
```

**Visa Status:**
```typescript
'citizen' | 'pr' | 'visa_holder' | 'needs_sponsorship'
```

### **Database Indexes:**
- `email` - Single field index for email lookups
- `preferredIndustries` - Array index for industry filtering
- `yearsExperience` - Single field index for experience filtering
- `isOpenToWork` - Single field index for availability filtering

---

## 🔐 Registration API

### **Candidate Registration**
**Endpoint:** `POST /api/auth/register`
**Content-Type:** `application/json` or `multipart/form-data`

#### **cURL - Minimal Registration:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123",
    "role": "candidate",
    "phone": "+61400000001"
  }'
```

#### **cURL - Complete Registration:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "complete@example.com",
    "firstName": "Complete",
    "lastName": "Candidate",
    "password": "password123",
    "role": "candidate",
    "phone": "+61400000001",
    "candidate": {
      "fullName": "Complete Professional Candidate",
      "location": "Sydney",
      "state": "NSW",
      "preferredRole": "Senior Software Developer",
      "currentRole": "Software Developer",
      "currentCompany": "Tech Solutions Pty Ltd",
      "yearsExperience": "3-5",
      "skills": "JavaScript, React, Node.js, Python, AWS, Docker, MongoDB",
      "education": "Bachelor of Computer Science - University of Sydney (2018-2021)",
      "preferredIndustries": ["technology", "health"],
      "salaryExpectation": 95000,
      "availableFrom": "2024-02-01T00:00:00.000Z",
      "visaStatus": "citizen",
      "portfolioUrl": "https://portfolio.example.com",
      "linkedinUrl": "https://linkedin.com/in/candidate",
      "isOpenToWork": true
    }
  }'
```

#### **cURL - Registration with File Uploads:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -F "email=fileupload@example.com" \
  -F "firstName=File" \
  -F "lastName=Upload" \
  -F "password=password123" \
  -F "role=candidate" \
  -F "phone=+61400000001" \
  -F "candidate[fullName]=File Upload Candidate" \
  -F "candidate[location]=Melbourne" \
  -F "candidate[state]=VIC" \
  -F "candidate[preferredRole]=Full Stack Developer" \
  -F "candidate[currentRole]=Junior Developer" \
  -F "candidate[yearsExperience]=1-3" \
  -F "candidate[skills]=React, Node.js, TypeScript" \
  -F "candidate[visaStatus]=pr" \
  -F "candidate[isOpenToWork]=true" \
  -F "profilePhoto=@/path/to/profile-photo.jpg" \
  -F "resume=@/path/to/resume.pdf" \
  -F "coverLetter=@/path/to/cover-letter.pdf" \
  -F "certificates=@/path/to/certificate1.pdf" \
  -F "certificates=@/path/to/certificate2.pdf"
```

#### **Registration Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "676c8f1a2b3c4d5e6f789012",
      "email": "complete@example.com",
      "firstName": "Complete",
      "lastName": "Candidate",
      "role": "candidate",
      "isEmailVerified": false,
      "phone": "+61400000001",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "profile": {
      "_id": "676c8f1a2b3c4d5e6f789013",
      "userId": "676c8f1a2b3c4d5e6f789012",
      "fullName": "Complete Professional Candidate",
      "email": "complete@example.com",
      "phone": "+61400000001",
      "location": "Sydney",
      "state": "NSW",
      "preferredRole": "Senior Software Developer",
      "profilePhoto": "/uploads/profile-photo-123.jpg",
      "currentRole": "Software Developer",
      "currentCompany": "Tech Solutions Pty Ltd",
      "yearsExperience": "3-5",
      "skills": "JavaScript, React, Node.js, Python, AWS, Docker, MongoDB",
      "education": "Bachelor of Computer Science - University of Sydney (2018-2021)",
      "preferredIndustries": ["technology", "health"],
      "salaryExpectation": 95000,
      "availableFrom": "2024-02-01T00:00:00.000Z",
      "visaStatus": "citizen",
      "resumeUrl": "/uploads/resume-123.pdf",
      "portfolioUrl": "https://portfolio.example.com",
      "linkedinUrl": "https://linkedin.com/in/candidate",
      "coverLetterUrl": "/uploads/cover-letter-123.pdf",
      "certificatesUrls": [
        "/uploads/cert1-123.pdf",
        "/uploads/cert2-123.pdf"
      ],
      "isOpenToWork": true,
      "profileViews": 0,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

## 👤 Profile Management APIs

### **1. Get Current User Profile**
**Endpoint:** `GET /api/auth/profile`
**Authentication:** Required (JWT Token)

#### **cURL:**
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "676c8f1a2b3c4d5e6f789012",
      "email": "candidate@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "candidate",
      "isEmailVerified": false,
      "phone": "+61400000001"
    },
    "profile": {
      "_id": "676c8f1a2b3c4d5e6f789013",
      "userId": "676c8f1a2b3c4d5e6f789012",
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
      "updatedAt": "2024-01-15T12:45:00.000Z"
    }
  }
}
```

### **2. Get All Candidates (Admin/Employer)**
**Endpoint:** `GET /api/candidates`
**Authentication:** Required (Admin/Employer JWT Token)
**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

#### **cURL:**
```bash
curl -X GET "http://localhost:3001/api/candidates?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "candidates": [
      {
        "_id": "676c8f1a2b3c4d5e6f789013",
        "userId": "676c8f1a2b3c4d5e6f789012",
        "fullName": "John Doe",
        "email": "john@example.com",
        "location": "Sydney",
        "state": "NSW",
        "preferredRole": "Software Developer",
        "currentRole": "Junior Developer",
        "yearsExperience": "1-3",
        "preferredIndustries": ["technology"],
        "isOpenToWork": true,
        "profileViews": 15,
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

### **3. Get Candidate by ID**
**Endpoint:** `GET /api/candidates/:id`
**Authentication:** Required (JWT Token)

#### **cURL:**
```bash
curl -X GET http://localhost:3001/api/candidates/676c8f1a2b3c4d5e6f789013 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "candidate": {
      "_id": "676c8f1a2b3c4d5e6f789013",
      "userId": "676c8f1a2b3c4d5e6f789012",
      "fullName": "John Doe",
      "email": "john@example.com",
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
      "isOpenToWork": true,
      "profileViews": 16,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T14:20:00.000Z"
    }
  }
}
```

### **4. Update Candidate Profile**
**Endpoint:** `PUT /api/candidates/:id`
**Authentication:** Required (Candidate JWT Token - Own Profile)
**Content-Type:** `application/json`

#### **cURL:**
```bash
curl -X PUT http://localhost:3001/api/candidates/676c8f1a2b3c4d5e6f789013 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Michael Doe",
    "location": "Melbourne",
    "state": "VIC",
    "preferredRole": "Senior Software Developer",
    "currentRole": "Software Developer",
    "currentCompany": "New Tech Company",
    "yearsExperience": "3-5",
    "skills": "JavaScript, React, Node.js, Python, AWS, Docker",
    "education": "Bachelor of Computer Science, AWS Certified",
    "preferredIndustries": ["technology", "health"],
    "salaryExpectation": 95000,
    "availableFrom": "2024-03-01T00:00:00.000Z",
    "portfolioUrl": "https://johnmichaeldoe.dev",
    "linkedinUrl": "https://linkedin.com/in/johnmichaeldoe",
    "isOpenToWork": true
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "candidate": {
      "_id": "676c8f1a2b3c4d5e6f789013",
      "userId": "676c8f1a2b3c4d5e6f789012",
      "fullName": "John Michael Doe",
      "email": "john@example.com",
      "phone": "+61400000001",
      "location": "Melbourne",
      "state": "VIC",
      "preferredRole": "Senior Software Developer",
      "currentRole": "Software Developer",
      "currentCompany": "New Tech Company",
      "yearsExperience": "3-5",
      "skills": "JavaScript, React, Node.js, Python, AWS, Docker",
      "education": "Bachelor of Computer Science, AWS Certified",
      "preferredIndustries": ["technology", "health"],
      "salaryExpectation": 95000,
      "availableFrom": "2024-03-01T00:00:00.000Z",
      "visaStatus": "citizen",
      "portfolioUrl": "https://johnmichaeldoe.dev",
      "linkedinUrl": "https://linkedin.com/in/johnmichaeldoe",
      "isOpenToWork": true,
      "profileViews": 16,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-16T09:15:00.000Z"
    }
  }
}
```

### **5. Delete Candidate Profile**
**Endpoint:** `DELETE /api/candidates/:id`
**Authentication:** Required (Admin JWT Token)

#### **cURL:**
```bash
curl -X DELETE http://localhost:3001/api/candidates/676c8f1a2b3c4d5e6f789013 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Candidate deleted successfully"
}
```ferredIndustries": ["technology"],
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
      "updatedAt": "2024-01-15T12:45:00.000Z"
    }
  }
}
```

### **2. Get All Candidates (Admin/Employer)**
**Endpoint:** `GET /api/candidates`
**Authentication:** Required (Admin/Employer JWT Token)
**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "candidates": [
      {
        "_id": "676c8f1a2b3c4d5e6f789013",
        "userId": "676c8f1a2b3c4d5e6f789012",
        "fullName": "John Doe",
        "email": "john@example.com",
        "location": "Sydney",
        "state": "NSW",
        "preferredRole": "Software Developer",
        "currentRole": "Junior Developer",
        "yearsExperience": "1-3",
        "preferredIndustries": ["technology"],
        "isOpenToWork": true,
        "profileViews": 15,
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

### **3. Get Candidate by ID**
**Endpoint:** `GET /api/candidates/:id`
**Authentication:** Required (JWT Token)

**Response:**
```json
{
  "success": true,
  "data": {
    "candidate": {
      "_id": "676c8f1a2b3c4d5e6f789013",
      "userId": "676c8f1a2b3c4d5e6f789012",
      "fullName": "John Doe",
      "email": "john@example.com",
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
      "isOpenToWork": true,
      "profileViews": 16,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T14:20:00.000Z"
    }
  }
}
```

### **4. Update Candidate Profile**
**Endpoint:** `PUT /api/candidates/:id`
**Authentication:** Required (Candidate JWT Token - Own Profile)
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "fullName": "John Michael Doe",
  "location": "Melbourne",
  "state": "VIC",
  "preferredRole": "Senior Software Developer",
  "currentRole": "Software Developer",
  "currentCompany": "New Tech Company",
  "yearsExperience": "3-5",
  "skills": "JavaScript, React, Node.js, Python, AWS, Docker",
  "education": "Bachelor of Computer Science, AWS Certified",
  "preferredIndustries": ["technology", "health"],
  "salaryExpectation": 95000,
  "availableFrom": "2024-03-01T00:00:00.000Z",
  "portfolioUrl": "https://johnmichaeldoe.dev",
  "linkedinUrl": "https://linkedin.com/in/johnmichaeldoe",
  "isOpenToWork": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "candidate": {
      "_id": "676c8f1a2b3c4d5e6f789013",
      "userId": "676c8f1a2b3c4d5e6f789012",
      "fullName": "John Michael Doe",
      "email": "john@example.com",
      "phone": "+61400000001",
      "location": "Melbourne",
      "state": "VIC",
      "preferredRole": "Senior Software Developer",
      "currentRole": "Software Developer",
      "currentCompany": "New Tech Company",
      "yearsExperience": "3-5",
      "skills": "JavaScript, React, Node.js, Python, AWS, Docker",
      "education": "Bachelor of Computer Science, AWS Certified",
      "preferredIndustries": ["technology", "health"],
      "salaryExpectation": 95000,
      "availableFrom": "2024-03-01T00:00:00.000Z",
      "visaStatus": "citizen",
      "portfolioUrl": "https://johnmichaeldoe.dev",
      "linkedinUrl": "https://linkedin.com/in/johnmichaeldoe",
      "isOpenToWork": true,
      "profileViews": 16,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-16T09:15:00.000Z"
    }
  }
}
```

### **5. Delete Candidate Profile**
**Endpoint:** `DELETE /api/candidates/:id`
**Authentication:** Required (Admin JWT Token)

**Response:**
```json
{
  "success": true,
  "message": "Candidate deleted successfully"
}
```

---

## 📄 Application Management APIs

### **1. Create Job Application**
**Endpoint:** `POST /api/candidates/applications`
**Authentication:** Required (Candidate JWT Token)
**Content-Type:** `multipart/form-data`

#### **cURL:**
```bash
curl -X POST http://localhost:3001/api/candidates/applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "jobId=676c8f1a2b3c4d5e6f789020" \
  -F "candidateId=676c8f1a2b3c4d5e6f789013" \
  -F "fullName=John Doe" \
  -F "email=john@example.com" \
  -F "phone=+61400000001" \
  -F "coverLetter=I am very interested in this position..." \
  -F "resume=@/path/to/resume.pdf"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "application": {
      "_id": "676c8f1a2b3c4d5e6f789025",
      "jobId": "676c8f1a2b3c4d5e6f789020",
      "candidateId": "676c8f1a2b3c4d5e6f789013",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+61400000001",
      "coverLetter": "I am very interested in this position...",
      "resumeUrl": "/uploads/resume-1234567890.pdf",
      "status": "pending",
      "createdAt": "2024-01-16T10:30:00.000Z",
      "updatedAt": "2024-01-16T10:30:00.000Z"
    }
  }
}
```

### **2. Get All Applications (Admin)**
**Endpoint:** `GET /api/applications`
**Authentication:** Required (Admin JWT Token)
**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

#### **cURL:**
```bash
curl -X GET "http://localhost:3001/api/applications?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### **3. Get Application by ID**
**Endpoint:** `GET /api/applications/:id`
**Authentication:** Required (JWT Token)

#### **cURL:**
```bash
curl -X GET http://localhost:3001/api/applications/676c8f1a2b3c4d5e6f789025 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **4. Get Applications by Candidate**
**Endpoint:** `GET /api/applications/candidate/:candidateId`
**Authentication:** Required (Candidate JWT Token - Own Applications)

#### **cURL:**
```bash
curl -X GET http://localhost:3001/api/applications/candidate/676c8f1a2b3c4d5e6f789013 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **5. Get Applications by Job**
**Endpoint:** `GET /api/applications/job/:jobId`
**Authentication:** Required (Employer JWT Token - Own Job Applications)

#### **cURL:**
```bash
curl -X GET http://localhost:3001/api/applications/job/676c8f1a2b3c4d5e6f789020 \
  -H "Authorization: Bearer YOUR_EMPLOYER_JWT_TOKEN"
```

---

## 📁 File Upload APIs

### **Supported File Types & Limits**

#### **Profile Photo:**
- **Types**: JPG, JPEG, PNG, GIF
- **Max Size**: 5MB
- **Endpoint**: `POST /api/upload/profile-photo`

#### **Resume:**
- **Types**: PDF, DOC, DOCX
- **Max Size**: 10MB
- **Endpoint**: `POST /api/upload/resume`

#### **Cover Letter:**
- **Types**: PDF, DOC, DOCX
- **Max Size**: 10MB
- **Endpoint**: `POST /api/upload/cover-letter`

#### **Certificates:**
- **Types**: PDF, JPG, JPEG, PNG
- **Max Size**: 10MB each
- **Endpoint**: `POST /api/upload/certificates`

### **File Upload Examples:**

#### **1. Upload Profile Photo:**
```bash
curl -X POST http://localhost:3001/api/upload/profile-photo \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "profilePhoto=@/path/to/photo.jpg"
```

#### **2. Upload Resume:**
```bash
curl -X POST http://localhost:3001/api/upload/resume \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

#### **3. Upload Cover Letter:**
```bash
curl -X POST http://localhost:3001/api/upload/cover-letter \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "coverLetter=@/path/to/cover-letter.pdf"
```

#### **4. Upload Multiple Certificates:**
```bash
curl -X POST http://localhost:3001/api/upload/certificates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "certificates=@/path/to/cert1.pdf" \
  -F "certificates=@/path/to/cert2.pdf"
```

#### **5. Get Uploaded Files:**
```bash
# Get profile photo
curl -X GET http://localhost:3001/uploads/profile-photo-123.jpg

# Get resume
curl -X GET http://localhost:3001/uploads/resume-123.pdf

# Get certificate
curl -X GET http://localhost:3001/uploads/certificate-123.pdf
```

---

## 🔍 Search & Filter APIs

### **Search Candidates**
**Endpoint:** `GET /api/candidates/search`
**Authentication:** Required (Employer/Admin JWT Token)

**Query Parameters:**
- `q` - Search query (name, skills, location)
- `industry` - Filter by preferred industry
- `experience` - Filter by years of experience
- `location` - Filter by location
- `state` - Filter by Australian state
- `visaStatus` - Filter by visa status
- `isOpenToWork` - Filter by availability (true/false)
- `salaryMin` - Minimum salary expectation
- `salaryMax` - Maximum salary expectation
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

#### **cURL Examples:**

##### **1. Basic Search:**
```bash
curl -X GET "http://localhost:3001/api/candidates/search?q=javascript" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

##### **2. Advanced Search with Multiple Filters:**
```bash
curl -X GET "http://localhost:3001/api/candidates/search?q=javascript&industry=technology&experience=3-5&state=NSW&isOpenToWork=true&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

##### **3. Search by Location and Salary:**
```bash
curl -X GET "http://localhost:3001/api/candidates/search?location=Sydney&salaryMin=80000&salaryMax=120000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

##### **4. Search by Visa Status:**
```bash
curl -X GET "http://localhost:3001/api/candidates/search?visaStatus=citizen&industry=health" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

##### **5. Search Available Candidates Only:**
```bash
curl -X GET "http://localhost:3001/api/candidates/search?isOpenToWork=true&experience=5-10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "candidates": [
      {
        "_id": "676c8f1a2b3c4d5e6f789013",
        "fullName": "John Doe",
        "email": "john@example.com",
        "location": "Sydney",
        "state": "NSW",
        "preferredRole": "Software Developer",
        "currentRole": "Junior Developer",
        "yearsExperience": "3-5",
        "skills": "JavaScript, React, Node.js",
        "preferredIndustries": ["technology"],
        "salaryExpectation": 85000,
        "visaStatus": "citizen",
        "isOpenToWork": true,
        "profileViews": 25
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    },
    "filters": {
      "q": "javascript",
      "industry": "technology",
      "experience": "3-5",
      "state": "NSW",
      "isOpenToWork": true
    }
  }
}
```

---

## 📚 Complete API Reference

### **Authentication Endpoints:**

#### **1. Candidate Registration:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","firstName":"John","lastName":"Doe","password":"password123","role":"candidate","phone":"+61400000001"}'
```

#### **2. User Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

#### **3. Get Current Profile:**
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **4. Refresh Access Token:**
```bash
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

#### **5. User Logout:**
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Candidate Profile Endpoints:**

#### **1. Get All Candidates:**
```bash
curl -X GET "http://localhost:3001/api/candidates?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **2. Get Candidate by ID:**
```bash
curl -X GET http://localhost:3001/api/candidates/CANDIDATE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **3. Update Candidate Profile:**
```bash
curl -X PUT http://localhost:3001/api/candidates/CANDIDATE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Updated Name","location":"Melbourne","state":"VIC"}'
```

#### **4. Delete Candidate Profile:**
```bash
curl -X DELETE http://localhost:3001/api/candidates/CANDIDATE_ID \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

#### **5. Search Candidates:**
```bash
curl -X GET "http://localhost:3001/api/candidates/search?q=javascript&industry=technology" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Application Endpoints:**

#### **1. Create Job Application:**
```bash
curl -X POST http://localhost:3001/api/candidates/applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "jobId=JOB_ID" \
  -F "candidateId=CANDIDATE_ID" \
  -F "fullName=John Doe" \
  -F "email=john@example.com" \
  -F "resume=@/path/to/resume.pdf"
```

#### **2. Get All Applications:**
```bash
curl -X GET "http://localhost:3001/api/applications?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

#### **3. Get Application by ID:**
```bash
curl -X GET http://localhost:3001/api/applications/APPLICATION_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **4. Get Candidate Applications:**
```bash
curl -X GET http://localhost:3001/api/applications/candidate/CANDIDATE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **5. Get Job Applications:**
```bash
curl -X GET http://localhost:3001/api/applications/job/JOB_ID \
  -H "Authorization: Bearer YOUR_EMPLOYER_JWT_TOKEN"
```

### **File Upload Endpoints:**

#### **1. Upload Profile Photo:**
```bash
curl -X POST http://localhost:3001/api/upload/profile-photo \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "profilePhoto=@/path/to/photo.jpg"
```

#### **2. Upload Resume:**
```bash
curl -X POST http://localhost:3001/api/upload/resume \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

#### **3. Upload Cover Letter:**
```bash
curl -X POST http://localhost:3001/api/upload/cover-letter \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "coverLetter=@/path/to/cover-letter.pdf"
```

#### **4. Upload Certificates:**
```bash
curl -X POST http://localhost:3001/api/upload/certificates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "certificates=@/path/to/cert1.pdf" \
  -F "certificates=@/path/to/cert2.pdf"
```

### **User Management Endpoints:**

#### **1. Update User Profile:**
```bash
curl -X PUT http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Updated","lastName":"Name","phone":"+61400000002"}'
```

#### **2. Delete User Account:**
```bash
curl -X DELETE http://localhost:3001/api/users/account \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔒 Security & Validation

### **Authentication:**
- JWT token-based authentication
- Role-based access control (candidate, employer, admin)
- Token expiration and refresh mechanism

### **File Upload Security:**
- File type validation (whitelist approach)
- File size limits enforced
- Unique filename generation
- Secure file storage location

### **Data Validation:**
- Email format validation
- Phone number format validation
- URL format validation for portfolios/LinkedIn
- Enum validation for states, industries, experience levels
- Required field validation

### **Privacy & Access Control:**
- Candidates can only update their own profiles
- Employers can view candidate profiles for recruitment
- Admins have full access to all candidate data
- Profile view tracking for analytics

---

## 📊 Sample Data Examples

### **Technology Professional:**
```json
{
  "fullName": "Sarah Chen",
  "location": "Sydney",
  "state": "NSW",
  "preferredRole": "Full Stack Developer",
  "currentRole": "Software Engineer",
  "currentCompany": "Tech Innovations Pty Ltd",
  "yearsExperience": "5-10",
  "skills": "React, Node.js, Python, AWS, Docker, Kubernetes, PostgreSQL",
  "education": "Master of Computer Science - UNSW (2015-2017)",
  "preferredIndustries": ["technology", "health"],
  "salaryExpectation": 120000,
  "visaStatus": "citizen",
  "isOpenToWork": true
}
```

### **Healthcare Professional:**
```json
{
  "fullName": "Michael Johnson",
  "location": "Melbourne",
  "state": "VIC",
  "preferredRole": "Registered Nurse",
  "currentRole": "Staff Nurse",
  "currentCompany": "Royal Melbourne Hospital",
  "yearsExperience": "3-5",
  "skills": "Patient Care, Emergency Medicine, ICU, Medication Administration",
  "education": "Bachelor of Nursing - Monash University (2018-2021)",
  "preferredIndustries": ["health"],
  "salaryExpectation": 80000,
  "visaStatus": "pr",
  "isOpenToWork": false
}
```

### **Construction Professional:**
```json
{
  "fullName": "David Wilson",
  "location": "Brisbane",
  "state": "QLD",
  "preferredRole": "Site Supervisor",
  "currentRole": "Construction Worker",
  "currentCompany": "Brisbane Construction Co",
  "yearsExperience": "10+",
  "skills": "Site Management, Safety Compliance, Team Leadership, Heavy Machinery",
  "education": "Certificate IV in Building and Construction, White Card",
  "preferredIndustries": ["construction", "mining"],
  "salaryExpectation": 95000,
  "visaStatus": "citizen",
  "isOpenToWork": true
}
```

This comprehensive documentation covers all aspects of the Candidate system including complete schema details, all API endpoints, file upload capabilities, search functionality, and security features.