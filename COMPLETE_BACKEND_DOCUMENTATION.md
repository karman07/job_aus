# CrossNations Backend - Complete API Documentation & Changes

## 🚀 Overview
This document covers all changes made to the CrossNations backend, including JWT authentication, role-based access control, company management, and multi-job posting system.

---

## 📋 Table of Contents
1. [Major System Changes](#major-system-changes)
2. [Authentication System](#authentication-system)
3. [User Management](#user-management)
4. [Company Management](#company-management)
5. [Job Management](#job-management)
6. [Database Schema Changes](#database-schema-changes)
7. [API Endpoints Summary](#api-endpoints-summary)
8. [Security Features](#security-features)
9. [File Structure Changes](#file-structure-changes)
10. [Testing & Validation](#testing--validation)

---

## 🔄 Major System Changes

### **Before vs After Architecture**

#### **BEFORE:**
- No authentication system
- Jobs created without user association
- Company data embedded in each job
- No role-based access control
- Admin-only registration

#### **AFTER:**
- Complete JWT authentication system
- Role-based access (candidate, employer, admin)
- User-linked job creation
- Separate Company profiles for employers
- Multi-job posting per company
- Automatic profile creation on registration

### **Key Improvements:**
1. **Security**: JWT tokens with refresh mechanism
2. **Scalability**: Normalized database with proper relationships
3. **User Experience**: Role-specific functionality
4. **Data Integrity**: Proper user-job-company associations
5. **Multi-tenancy**: Single company can post multiple jobs

---

## 🔐 Authentication System

### **New JWT Implementation**

#### **Token Structure:**
- **Access Token**: 15-minute expiry, used for API access
- **Refresh Token**: 7-day expiry, used to generate new access tokens

#### **Password Security:**
- bcrypt hashing with salt rounds
- Minimum 6-character requirement
- Secure password comparison

### **Authentication Endpoints**

#### **1. User Registration**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123",
  "role": "candidate", // or "employer"
  "phone": "+61400000000" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "676c8f1a2b3c4d5e6f789012",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "candidate",
      "isEmailVerified": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### **2. User Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as registration

#### **3. Refresh Token**
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "new_access_token",
      "refreshToken": "new_refresh_token"
    }
  }
}
```

#### **4. Logout**
```http
POST /api/auth/logout
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### **5. Get Profile**
```http
GET /api/auth/profile
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "676c8f1a2b3c4d5e6f789012",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "candidate",
      "isEmailVerified": false,
      "phone": "+61400000000"
    },
    "profile": {
      // CandidateProfile or Company based on role
    }
  }
}
```

---

## 👥 User Management

### **Role-Based System**

#### **Roles:**
1. **candidate**: Job seekers with candidate profiles
2. **employer**: Company representatives with company profiles  
3. **admin**: Platform administrators

#### **Automatic Profile Creation:**
- **Candidates**: CandidateProfile created on registration
- **Employers**: Company profile created on registration
- **Admins**: No additional profile

### **Profile Management**

#### **Candidate Profile Structure:**
```typescript
{
  userId: string; // Reference to User
  fullName: string;
  email: string;
  phone: string;
  location: string;
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  preferredRole?: string;
  currentRole: string;
  currentCompany?: string;
  yearsExperience: '0-1' | '1-3' | '3-5' | '5-10' | '10+';
  skills?: string;
  education?: string;
  preferredIndustries: string[];
  salaryExpectation?: number;
  availableFrom?: Date;
  visaStatus: 'citizen' | 'pr' | 'visa_holder' | 'needs_sponsorship';
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  isOpenToWork: boolean;
  profileViews: number;
}
```

---

## 🏢 Company Management

### **New Company Model**
Separate Company profiles for employers enable multiple job postings per company.

#### **Company Profile Structure:**
```typescript
{
  userId: string; // Reference to User (employer)
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  founded?: number;
  industry: ('health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology')[];
  location: string;
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  contact: {
    email: string;
    phone?: string;
  };
  isVerified: boolean;
}
```

### **Company Management Endpoints**

#### **1. Get Company Profile**
```http
GET /api/companies/profile
Authorization: Bearer {employer_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "company": {
      "userId": "676c8f1a2b3c4d5e6f789012",
      "name": "Tech Solutions Pty Ltd",
      "description": "Leading technology solutions provider",
      "website": "https://techsolutions.com.au",
      "industry": ["technology", "health"],
      "location": "Sydney",
      "state": "NSW",
      "size": "51-200",
      "contact": {
        "email": "contact@techsolutions.com.au",
        "phone": "+61299123456"
      },
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### **2. Update Company Profile**
```http
PUT /api/companies/profile
Authorization: Bearer {employer_token}
Content-Type: application/json

{
  "name": "Updated Tech Solutions Pty Ltd",
  "description": "Updated description",
  "website": "https://newtechsolutions.com.au",
  "industry": ["technology"],
  "location": "Melbourne",
  "state": "VIC",
  "size": "201-500",
  "contact": {
    "email": "info@newtechsolutions.com.au",
    "phone": "+61399123456"
  }
}
```

**Response:** Same as GET company profile with updated data

---

## 💼 Job Management

### **Major Changes in Job System**

#### **BEFORE:**
- Jobs created without authentication
- Company data embedded in each job
- No ownership tracking
- Manual company information entry

#### **AFTER:**
- Employer authentication required
- Company data pulled from Company profile
- Jobs linked to employers via `postedBy` field
- Multiple jobs per company supported
- Ownership-based job management

### **Job Management Endpoints**

#### **1. Create Job (NEW AUTHENTICATION REQUIRED)**
```http
POST /api/jobs
Authorization: Bearer {employer_token}
Content-Type: application/json

{
  "title": "Senior Software Developer",
  "description": "We are seeking an experienced software developer...",
  "requirements": "5+ years experience in TypeScript and React",
  "keyResponsibilities": "Develop and maintain web applications",
  "location": "Sydney",
  "state": "NSW",
  "type": "Full Time",
  "jobTypeCategory": "Permanent",
  "workType": "Hybrid",
  "industry": "technology",
  "salaryDisplay": "$120,000 - $150,000",
  "tags": "[\"TypeScript\", \"React\", \"Node.js\"]"
}
```

**Response:** Same format as before (unchanged for compatibility)
```json
{
  "success": true,
  "data": {
    "job": {
      "id": "676c8f1a2b3c4d5e6f789013",
      "companyId": "676c8f1a2b3c4d5e6f789013",
      "title": "Senior Software Developer",
      "description": "We are seeking an experienced software developer...",
      "location": "Sydney",
      "state": "NSW",
      "type": "Full Time",
      "jobTypeCategory": "Permanent",
      "workType": "Hybrid",
      "industry": "technology",
      "salaryDisplay": "$120,000 - $150,000",
      "tags": ["TypeScript", "React", "Node.js"],
      "status": "active",
      "applicantCount": 0,
      "viewCount": 0,
      "postedAt": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "company": {
      "id": "676c8f1a2b3c4d5e6f789013",
      "name": "Tech Solutions Pty Ltd",
      "description": "Leading technology solutions provider",
      "industry": ["technology"],
      "location": "Sydney",
      "website": "https://techsolutions.com.au",
      "logo": "/uploads/logo-1234567890.jpg",
      "size": "51-200",
      "founded": 2015,
      "contactEmail": "contact@techsolutions.com.au",
      "contactPhone": "+61299123456",
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### **2. Get Employer's Jobs (NEW)**
```http
GET /api/companies/jobs?page=1&limit=10
Authorization: Bearer {employer_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "676c8f1a2b3c4d5e6f789013",
        "title": "Senior Software Developer",
        "description": "We are seeking an experienced software developer...",
        "requirements": "5+ years experience in TypeScript and React",
        "keyResponsibilities": "Develop and maintain web applications",
        "contentFile": null,
        "location": "Sydney",
        "state": "NSW",
        "type": "Full Time",
        "jobTypeCategory": "Permanent",
        "workType": "Hybrid",
        "industry": "technology",
        "salaryDisplay": "$120,000 - $150,000",
        "salaryMin": null,
        "salaryMax": null,
        "sponsorshipAvailable": false,
        "tags": ["TypeScript", "React", "Node.js"],
        "status": "active",
        "company": {
          "name": "Tech Solutions Pty Ltd",
          "description": "Leading technology solutions provider",
          "website": "https://techsolutions.com.au",
          "logo": "/uploads/logo-1234567890.jpg",
          "size": "51-200",
          "founded": 2015,
          "industry": ["technology", "health"],
          "location": "Sydney",
          "contact": {
            "email": "contact@techsolutions.com.au",
            "phone": "+61299123456"
          }
        },
        "postedBy": "676c8f1a2b3c4d5e6f789012",
        "applicantCount": 0,
        "customFields": [],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
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

#### **3. Update Employer's Job (NEW)**
```http
PUT /api/companies/jobs/676c8f1a2b3c4d5e6f789013
Authorization: Bearer {employer_token}
Content-Type: application/json

{
  "title": "Updated Job Title",
  "salaryDisplay": "$130,000 - $160,000",
  "status": "inactive",
  "tags": "[\"TypeScript\", \"React\", \"Vue.js\"]"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "job": {
      "_id": "676c8f1a2b3c4d5e6f789013",
      "title": "Updated Job Title",
      "description": "We are seeking an experienced software developer...",
      "requirements": "5+ years experience in TypeScript and React",
      "keyResponsibilities": "Develop and maintain web applications",
      "contentFile": null,
      "location": "Sydney",
      "state": "NSW",
      "type": "Full Time",
      "jobTypeCategory": "Permanent",
      "workType": "Hybrid",
      "industry": "technology",
      "salaryDisplay": "$130,000 - $160,000",
      "salaryMin": null,
      "salaryMax": null,
      "sponsorshipAvailable": false,
      "tags": ["TypeScript", "React", "Vue.js"],
      "status": "inactive",
      "company": {
        "name": "Tech Solutions Pty Ltd",
        "description": "Leading technology solutions provider",
        "website": "https://techsolutions.com.au",
        "logo": "/uploads/logo-1234567890.jpg",
        "size": "51-200",
        "founded": 2015,
        "industry": ["technology", "health"],
        "location": "Sydney",
        "contact": {
          "email": "contact@techsolutions.com.au",
          "phone": "+61299123456"
        }
      },
      "postedBy": "676c8f1a2b3c4d5e6f789012",
      "applicantCount": 0,
      "customFields": [],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:45:00.000Z"
    }
  }
}
```

#### **4. Delete Employer's Job (NEW)**
```http
DELETE /api/companies/jobs/676c8f1a2b3c4d5e6f789013
Authorization: Bearer {employer_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

### **Unchanged GET Endpoints**
These endpoints maintain exact same response format for backward compatibility:

#### **Get All Jobs (Public)**
```http
GET /api/jobs?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "676c8f1a2b3c4d5e6f789013",
        "title": "Senior Software Developer",
        "description": "We are seeking an experienced software developer...",
        "requirements": "5+ years experience in TypeScript and React",
        "keyResponsibilities": "Develop and maintain web applications",
        "contentFile": null,
        "location": "Sydney",
        "state": "NSW",
        "type": "Full Time",
        "jobTypeCategory": "Permanent",
        "workType": "Hybrid",
        "industry": "technology",
        "salaryDisplay": "$120,000 - $150,000",
        "salaryMin": null,
        "salaryMax": null,
        "sponsorshipAvailable": false,
        "tags": ["TypeScript", "React", "Node.js"],
        "status": "active",
        "company": {
          "name": "Tech Solutions Pty Ltd",
          "description": "Leading technology solutions provider",
          "website": "https://techsolutions.com.au",
          "logo": "/uploads/logo-1234567890.jpg",
          "size": "51-200",
          "founded": 2015,
          "industry": ["technology", "health"],
          "location": "Sydney",
          "contact": {
            "email": "contact@techsolutions.com.au",
            "phone": "+61299123456"
          }
        },
        "postedBy": "676c8f1a2b3c4d5e6f789012",
        "applicantCount": 0,
        "customFields": [],
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

#### **Get Single Job (Public)**
```http
GET /api/jobs/676c8f1a2b3c4d5e6f789013
```

**Response:**
```json
{
  "success": true,
  "data": {
    "job": {
      "_id": "676c8f1a2b3c4d5e6f789013",
      "title": "Senior Software Developer",
      "description": "We are seeking an experienced software developer...",
      "requirements": "5+ years experience in TypeScript and React",
      "keyResponsibilities": "Develop and maintain web applications",
      "contentFile": null,
      "location": "Sydney",
      "state": "NSW",
      "type": "Full Time",
      "jobTypeCategory": "Permanent",
      "workType": "Hybrid",
      "industry": "technology",
      "salaryDisplay": "$120,000 - $150,000",
      "salaryMin": null,
      "salaryMax": null,
      "sponsorshipAvailable": false,
      "tags": ["TypeScript", "React", "Node.js"],
      "status": "active",
      "company": {
        "name": "Tech Solutions Pty Ltd",
        "description": "Leading technology solutions provider",
        "website": "https://techsolutions.com.au",
        "logo": "/uploads/logo-1234567890.jpg",
        "size": "51-200",
        "founded": 2015,
        "industry": ["technology", "health"],
        "location": "Sydney",
        "contact": {
          "email": "contact@techsolutions.com.au",
          "phone": "+61299123456"
        }
      },
      "postedBy": "676c8f1a2b3c4d5e6f789012",
      "applicantCount": 0,
      "customFields": [],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### **Get All Jobs Admin (Admin Only)**
```http
GET /api/jobs/admin/all?page=1&limit=10
Authorization: Bearer {admin_token}
```

**Response:** Same structure as public jobs endpoint but includes all jobs regardless of status

---

## 🗄️ Database Schema Changes

### **Complete Database Schema Documentation**

#### **1. User Model (Enhanced)**
```typescript
interface IUser {
  _id: ObjectId;                    // MongoDB auto-generated ID
  email: string;                    // Required, unique, lowercase, trimmed
  firstName: string;                // Required, trimmed
  lastName: string;                 // Required, trimmed
  password: string;                 // Required, bcrypt hashed, min 6 chars
  phone?: string;                   // Optional, trimmed
  role: 'candidate' | 'employer' | 'admin'; // Required, default: 'candidate'
  isEmailVerified: boolean;        // Default: false
  emailVerificationToken?: string;  // Optional, for email verification
  refreshToken?: string;            // Optional, JWT refresh token
  resetPasswordToken?: string;      // Optional, for password reset
  resetPasswordExpires?: Date;      // Optional, password reset expiry
  createdAt: Date;                 // Auto-generated timestamp
  updatedAt: Date;                 // Auto-generated timestamp
  
  // Methods:
  comparePassword(candidatePassword: string): Promise<boolean>;
}
```

**Validation Rules:**
- `email`: Valid email format, unique across collection
- `password`: Minimum 6 characters, automatically hashed
- `role`: Must be one of ['candidate', 'employer', 'admin']
- `phone`: Valid mobile phone format (any country)

**Indexes:**
- `email`: Unique index
- `role`: Regular index for role-based queries

#### **2. Company Model (New)**
```typescript
interface ICompany {
  _id: ObjectId;                    // MongoDB auto-generated ID
  userId: string;                   // Required, unique, references User._id
  name: string;                     // Required, trimmed
  description?: string;             // Optional, trimmed
  website?: string;                 // Optional, must be valid URL with http/https
  logo?: string;                    // Optional, file path to uploaded logo
  size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+'; // Optional
  founded?: number;                 // Optional, min: 1800, max: current year
  industry: ('health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology')[]; // Required array
  location: string;                 // Required, trimmed
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'; // Required
  contact: {                        // Required object
    email: string;                  // Required, lowercase, trimmed
    phone?: string;                 // Optional, trimmed
  };
  isVerified: boolean;             // Default: false
  createdAt: Date;                 // Auto-generated timestamp
  updatedAt: Date;                 // Auto-generated timestamp
}
```

**Validation Rules:**
- `userId`: Must reference existing User with role 'employer'
- `website`: Must start with http:// or https://
- `industry`: Must contain at least one valid industry
- `state`: Must be valid Australian state/territory
- `contact.email`: Valid email format

**Indexes:**
- `userId`: Unique index (one company per employer)
- `industry`: Multi-key index for industry searches
- `location, state`: Compound index for location-based queries

#### **3. CandidateProfile Model (Enhanced)**
```typescript
interface ICandidateProfile {
  _id: ObjectId;                    // MongoDB auto-generated ID
  userId: string;                   // Required, unique, references User._id
  fullName: string;                 // Optional, trimmed
  email: string;                    // Optional, trimmed, lowercase
  phone: string;                    // Optional, trimmed
  location: string;                 // Optional, trimmed
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'; // Optional
  preferredRole?: string;           // Optional, trimmed
  currentRole: string;              // Optional, trimmed
  currentCompany?: string;          // Optional, trimmed
  yearsExperience: '0-1' | '1-3' | '3-5' | '5-10' | '10+'; // Optional
  skills?: string;                  // Optional, free text
  education?: string;               // Optional, free text
  preferredIndustries: ('health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology')[]; // Optional array
  salaryExpectation?: number;       // Optional, min: 0
  availableFrom?: Date;             // Optional
  visaStatus: 'citizen' | 'pr' | 'visa_holder' | 'needs_sponsorship'; // Optional
  resumeUrl?: string;               // Optional, file path to uploaded resume
  portfolioUrl?: string;            // Optional, URL to portfolio
  linkedinUrl?: string;             // Optional, LinkedIn profile URL
  isOpenToWork: boolean;            // Default: true
  profileViews: number;             // Default: 0
  createdAt: Date;                 // Auto-generated timestamp
  updatedAt: Date;                 // Auto-generated timestamp
}
```

**Validation Rules:**
- `userId`: Must reference existing User with role 'candidate'
- `email`: Valid email format if provided
- `salaryExpectation`: Must be positive number
- `preferredIndustries`: Must contain valid industries

**Indexes:**
- `userId`: Unique index (one profile per candidate)
- `email`: Regular index for email searches
- `preferredIndustries`: Multi-key index
- `yearsExperience`: Regular index
- `isOpenToWork`: Regular index for filtering

#### **4. Job Model (Enhanced)**
```typescript
interface IJob {
  _id: ObjectId;                    // MongoDB auto-generated ID
  title: string;                    // Required, trimmed
  description?: string;             // Optional, job description text
  requirements?: string;            // Optional, job requirements text
  keyResponsibilities?: string;     // Optional, key responsibilities text
  contentFile?: string;             // Optional, path to uploaded content file
  location: string;                 // Required, job location
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'; // Required
  type: 'Full Time' | 'Part Time' | 'Contract' | 'FIFO 2:1' | 'FIFO 8:6'; // Required
  jobTypeCategory: 'Permanent' | 'Contract' | 'Apprenticeship' | 'Trainee'; // Required
  workType: 'On-Site' | 'Remote' | 'Hybrid'; // Required
  industry: 'health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology'; // Required
  salaryDisplay?: string;           // Optional, salary range display
  salaryMin?: number;               // Optional, minimum salary, min: 0
  salaryMax?: number;               // Optional, maximum salary, min: 0
  sponsorshipAvailable?: boolean;   // Optional, default: false
  tags: string[];                   // Optional array of job tags
  status: 'active' | 'inactive' | 'closed'; // Required, default: 'active'
  company?: {                       // Optional embedded company data
    name?: string;
    description?: string;
    website?: string;
    logo?: string;
    size?: string;
    founded?: number;
    industry?: ('health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology')[];
    location?: string;
    contact?: {
      email?: string;
      phone?: string;
    };
  };
  postedBy: string;                 // Required, references User._id (employer)
  applicantCount: number;           // Default: 0
  customFields?: Array<{            // Optional custom fields
    label: string;                  // Trimmed
    value: string;                  // Trimmed
  }>;
  createdAt: Date;                 // Auto-generated timestamp
  updatedAt: Date;                 // Auto-generated timestamp
}
```

**Validation Rules:**
- `title`: Required, non-empty string
- `state`: Must be valid Australian state/territory
- `type`: Must be valid job type
- `industry`: Must be valid industry
- `postedBy`: Must reference existing User with role 'employer'
- `salaryMin/Max`: Must be positive numbers

**Indexes:**
- `title, description`: Text index for search
- `location, state`: Compound index
- `industry`: Regular index
- `type`: Regular index
- `status`: Regular index
- `salaryMin, salaryMax`: Compound index
- `createdAt`: Descending index for sorting
- `postedBy`: Regular index for employer queries

#### **5. JobApplication Model (Existing)**
```typescript
interface IJobApplication {
  _id: ObjectId;                    // MongoDB auto-generated ID
  jobId: string;                    // Required, references Job._id
  candidateId: string;              // Required, references User._id (candidate)
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired'; // Required
  coverLetter?: string;             // Optional, candidate cover letter
  resumeUrl?: string;               // Optional, path to uploaded resume
  appliedAt: Date;                  // Required, application timestamp
  reviewedAt?: Date;                // Optional, when application was reviewed
  notes?: string;                   // Optional, employer notes
  createdAt: Date;                 // Auto-generated timestamp
  updatedAt: Date;                 // Auto-generated timestamp
}
```

#### **6. SavedJob Model (Existing)**
```typescript
interface ISavedJob {
  _id: ObjectId;                    // MongoDB auto-generated ID
  candidateId: string;              // Required, references User._id (candidate)
  jobId: string;                    // Required, references Job._id
  createdAt: Date;                 // Auto-generated timestamp
}
```

**Indexes:**
- `candidateId, jobId`: Unique compound index

### **Database Relationships**
```
User (1) ←→ (1) CandidateProfile  [candidates only]
User (1) ←→ (1) Company           [employers only]
User (1) ←→ (∞) Job               [employers post multiple jobs]
User (1) ←→ (∞) JobApplication    [candidates apply to multiple jobs]
User (1) ←→ (∞) SavedJob          [candidates save multiple jobs]
Job (1) ←→ (∞) JobApplication     [jobs receive multiple applications]
Job (1) ←→ (∞) SavedJob           [jobs can be saved by multiple candidates]
```

---

## 📡 API Endpoints Summary

### **Authentication Endpoints (NEW)**
| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| POST | `/api/auth/register` | No | - | Register candidate/employer |
| POST | `/api/auth/login` | No | - | Login user |
| POST | `/api/auth/refresh` | No | - | Refresh access token |
| POST | `/api/auth/logout` | Yes | Any | Logout user |
| GET | `/api/auth/profile` | Yes | Any | Get user profile |

### **Company Management Endpoints (NEW)**
| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| GET | `/api/companies/profile` | Yes | Employer | Get company profile |
| PUT | `/api/companies/profile` | Yes | Employer | Update company profile |
| GET | `/api/companies/jobs` | Yes | Employer | Get employer's jobs |
| PUT | `/api/companies/jobs/:id` | Yes | Employer | Update employer's job |
| DELETE | `/api/companies/jobs/:id` | Yes | Employer | Delete employer's job |

### **Modified Job Endpoints**
| Method | Endpoint | Auth Required | Role | Description | Change |
|--------|----------|---------------|------|-------------|--------|
| POST | `/api/jobs` | **Yes** | **Employer** | Create job | **Now requires auth** |
| GET | `/api/jobs` | No | - | Get public jobs | **Unchanged** |
| GET | `/api/jobs/:id` | No | - | Get job details | **Unchanged** |

### **Existing Endpoints (Unchanged)**
- All candidate routes
- All admin routes  
- All data routes
- All upload routes
- All application routes

---

## 🔒 Security Features

### **Authentication Security**
1. **JWT Tokens**: Secure token-based authentication
2. **Password Hashing**: bcrypt with salt rounds
3. **Token Expiry**: Short-lived access tokens (15min)
4. **Refresh Mechanism**: Secure token refresh system
5. **Role-Based Access**: Granular permission control

### **Authorization Middleware**
```typescript
// Available middleware functions:
authenticateToken        // Verify JWT token
requireRole(['role'])    // Require specific role(s)
requireCandidate        // Candidate only
requireEmployer         // Employer only  
requireAdmin           // Admin only
requireCandidateOrEmployer // Either candidate or employer
```

### **Input Validation**
- Email format validation
- Password strength requirements
- Phone number validation
- Australian state validation
- Industry/role validation
- File upload restrictions

### **Data Protection**
- User passwords hashed with bcrypt
- Refresh tokens stored securely
- User data isolation by role
- Job ownership verification
- Company profile access control

---

## 📁 File Structure Changes

### **New Files Created:**
```
src/
├── utils/
│   └── jwt.ts                    # JWT utility functions
├── models/
│   └── Company.ts               # Company model for employers
├── controllers/
│   ├── companyController.ts     # Company profile management
│   └── employerJobController.ts # Employer job management
└── routes/
    └── companies.ts             # Company and employer job routes
```

### **Modified Files:**
```
src/
├── models/
│   ├── User.ts                  # Added password, JWT fields, methods
│   └── CandidateProfile.ts      # Added userId reference, state field
├── controllers/
│   └── authController.ts        # Complete rewrite with JWT
├── middleware/
│   └── auth.ts                  # Added role-based middleware
├── routes/
│   ├── auth.ts                  # Updated with new endpoints
│   └── jobs.ts                  # Added employer authentication
└── server.ts                    # Added company routes
```

### **Configuration Files:**
```
├── .env                         # Added JWT_REFRESH_SECRET
├── test-auth.sh                # Authentication test script
└── JWT_AUTH_DOCUMENTATION.md   # Previous auth documentation
```

---

## 🧪 Testing & Validation

### **Test Script Usage**
```bash
# Make executable
chmod +x test-auth.sh

# Run complete authentication flow test
./test-auth.sh
```

### **Test Coverage:**
1. ✅ Candidate registration
2. ✅ Employer registration
3. ✅ User login (both roles)
4. ✅ Profile retrieval
5. ✅ Company profile updates
6. ✅ Job creation (employer)
7. ✅ Employer job management
8. ✅ Token refresh flow
9. ✅ Role-based access control

### **Manual Testing Endpoints**

#### **Register Candidate:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com",
    "firstName": "John",
    "lastName": "Doe", 
    "password": "password123",
    "role": "candidate"
  }'
```

#### **Register Employer:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employer@test.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "password": "password123", 
    "role": "employer"
  }'
```

#### **Create Job (Employer):**
```bash
curl -X POST http://localhost:3001/api/jobs \
  -H "Authorization: Bearer YOUR_EMPLOYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Developer",
    "description": "Great opportunity",
    "location": "Sydney",
    "state": "NSW",
    "type": "Full Time",
    "jobTypeCategory": "Permanent", 
    "workType": "Hybrid",
    "industry": "technology",
    "salaryDisplay": "$100,000"
  }'
```

---

## 🔄 Migration Guide

### **For Frontend Integration:**

#### **1. Update Authentication Flow:**
```javascript
// OLD: No authentication
const createJob = (jobData) => {
  return fetch('/api/jobs', {
    method: 'POST',
    body: formData
  });
};

// NEW: Requires employer authentication
const createJob = (jobData, token) => {
  return fetch('/api/jobs', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jobData)
  });
};
```

#### **2. Handle JWT Tokens:**
```javascript
// Store tokens securely
localStorage.setItem('accessToken', response.data.tokens.accessToken);
localStorage.setItem('refreshToken', response.data.tokens.refreshToken);

// Add to API requests
const apiCall = (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
};
```

#### **3. Role-Based UI:**
```javascript
// Show different UI based on user role
const UserDashboard = ({ user }) => {
  if (user.role === 'candidate') {
    return <CandidateDashboard />;
  } else if (user.role === 'employer') {
    return <EmployerDashboard />;
  } else if (user.role === 'admin') {
    return <AdminDashboard />;
  }
};
```

---

## 🚨 Breaking Changes

### **1. Job Creation Authentication**
- **BEFORE**: Anyone could create jobs
- **AFTER**: Only authenticated employers can create jobs
- **Impact**: Frontend must implement employer authentication

### **2. Company Data Source**
- **BEFORE**: Company data entered with each job
- **AFTER**: Company data pulled from employer's profile
- **Impact**: Employers must complete company profile first

### **3. Job Ownership**
- **BEFORE**: No job ownership tracking
- **AFTER**: Jobs linked to specific employers
- **Impact**: Job management now user-specific

---

## ✅ Backward Compatibility

### **Maintained Compatibility:**
1. **GET /api/jobs** - Exact same response format
2. **GET /api/jobs/:id** - Exact same response format  
3. All existing candidate endpoints
4. All existing admin endpoints
5. All existing data/upload endpoints

### **Response Format Preservation:**
All public GET endpoints return identical JSON structure to ensure frontend compatibility.

---

## 🔮 Future Enhancements

### **Planned Features:**
1. Email verification system
2. Password reset functionality
3. Company verification process
4. Advanced job analytics
5. Bulk job operations
6. Job templates for employers
7. Application tracking system
8. Real-time notifications

### **Security Enhancements:**
1. Rate limiting on auth endpoints
2. Account lockout after failed attempts
3. IP-based access controls
4. Advanced token validation
5. Audit logging system

---

## 📞 Support & Documentation

### **Environment Variables Required:**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/crossnations_backend
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here
FRONTEND_URL=http://localhost:3000
```

### **Development Commands:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production  
npm run build

# Start production server
npm start

# Run authentication tests
./test-auth.sh
```

---

## 📊 Summary of Changes

| Component | Status | Description |
|-----------|--------|-------------|
| **Authentication** | ✅ NEW | Complete JWT system with refresh tokens |
| **User Management** | ✅ ENHANCED | Role-based system with automatic profiles |
| **Company Profiles** | ✅ NEW | Separate company management for employers |
| **Job Creation** | ⚠️ MODIFIED | Now requires employer authentication |
| **Job Management** | ✅ NEW | Employer-specific job CRUD operations |
| **Database Schema** | ⚠️ MODIFIED | Added relationships and new models |
| **Security** | ✅ NEW | Role-based access control throughout |
| **API Responses** | ✅ PRESERVED | All GET endpoints unchanged |
| **File Uploads** | ✅ PRESERVED | Existing upload system maintained |
| **Testing** | ✅ NEW | Comprehensive test suite added |

**Total New Endpoints**: 10
**Modified Endpoints**: 1 (POST /api/jobs)
**Preserved Endpoints**: All existing GET endpoints
**New Models**: 1 (Company)
**Enhanced Models**: 3 (User, CandidateProfile, Job)

This comprehensive system transformation provides a solid foundation for a scalable, secure job portal platform while maintaining backward compatibility for existing integrations.