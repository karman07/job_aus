# CrossNations Backend - Admin Documentation

## Overview
Complete admin documentation for the CrossNations job portal backend API with full database schemas and administrative routes.

---

## Database Schemas

### 1. User Schema
**Collection:** `users`

```typescript
interface IUser {
  email: string;                    // Unique, required
  firstName: string;                // Required
  lastName: string;                 // Required
  password: string;                 // Hashed, min 6 chars
  phone?: string;                   // Optional
  role: 'candidate' | 'employer' | 'admin';  // Required, default: 'candidate'
  isEmailVerified: boolean;         // Default: false
  emailVerificationToken?: string;  // For email verification
  refreshToken?: string;            // JWT refresh token
  resetPasswordToken?: string;      // Password reset token
  resetPasswordExpires?: Date;      // Token expiry
  createdAt: Date;                  // Auto-generated
  updatedAt: Date;                  // Auto-generated
}
```

**Indexes:**
- `email: 1` (unique)
- `role: 1`
- `createdAt: -1`

---

### 2. CandidateProfile Schema
**Collection:** `candidateprofiles`

```typescript
interface ICandidateProfile {
  userId: string;                   // Ref to User, unique
  
  // Personal Details
  fullName: string;
  email: string;
  phone: string;
  location: string;
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  preferredRole?: string;
  profilePhoto?: string;            // File path
  
  // Experience
  currentRole: string;
  currentCompany?: string;
  yearsExperience: '0-1' | '1-3' | '3-5' | '5-10' | '10+';
  skills?: string;
  education?: string;
  
  // Additional Info
  preferredIndustries: ('health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology')[];
  salaryExpectation?: number;       // Min: 0
  availableFrom?: Date;
  visaStatus: 'citizen' | 'pr' | 'visa_holder' | 'needs_sponsorship';
  resumeUrl?: string;               // File path
  portfolioUrl?: string;
  linkedinUrl?: string;
  coverLetterUrl?: string;          // File path
  certificatesUrls?: string[];      // File paths array
  isOpenToWork: boolean;            // Default: true
  profileViews: number;             // Default: 0
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `email: 1`
- `preferredIndustries: 1`
- `yearsExperience: 1`
- `isOpenToWork: 1`
- `userId: 1`

---

### 3. Company Schema
**Collection:** `companies`

```typescript
interface ICompany {
  userId: string;                   // Ref to User, unique
  name: string;                     // Required
  description?: string;
  website?: string;                 // Must start with http:// or https://
  logo?: string;                    // File path
  size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  founded?: number;                 // Min: 1800, Max: current year
  industry: ('health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology')[];
  location: string;                 // Required
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';  // Required
  contact: {
    email: string;                  // Required
    phone?: string;
  };
  isVerified: boolean;              // Default: false
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `userId: 1`
- `industry: 1`
- `location: 1, state: 1`

---

### 4. Job Schema
**Collection:** `jobs`

```typescript
interface IJob {
  title: string;                    // Required
  description?: string;
  requirements?: string;
  keyResponsibilities?: string;
  contentFile?: string;             // File path
  location: string;                 // Required
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';  // Required
  type: 'Full Time' | 'Part Time' | 'Contract' | 'FIFO 2:1' | 'FIFO 8:6';  // Required
  jobTypeCategory: 'Permanent' | 'Contract' | 'Apprenticeship' | 'Trainee';  // Required
  workType: 'On-Site' | 'Remote' | 'Hybrid';  // Required
  industry: 'health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology';  // Required
  salaryDisplay?: string;
  salaryMin?: number;               // Min: 0
  salaryMax?: number;               // Min: 0
  sponsorshipAvailable?: boolean;   // Default: false
  tags: string[];
  status: 'active' | 'inactive' | 'closed';  // Default: 'inactive'
  company?: {                       // Embedded company info
    name?: string;
    description?: string;
    website?: string;
    logo?: string;
    size?: string;
    founded?: number;
    industry?: string[];
    location?: string;
    contact?: {
      email?: string;
      phone?: string;
    };
  };
  postedBy: string;                 // Ref to User (employer only)
  applicantCount: number;           // Default: 0
  customFields?: Array<{
    label: string;
    value: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `title: 'text', description: 'text'` (text search)
- `location: 1, state: 1`
- `industry: 1`
- `type: 1`
- `status: 1`
- `salaryMin: 1, salaryMax: 1`
- `createdAt: -1`

---

### 5. JobApplication Schema
**Collection:** `jobapplications`

```typescript
interface IJobApplication {
  candidateId: string;              // Ref to CandidateProfile
  jobId: string;                    // Ref to Job
  
  // Personal Details
  fullName: string;
  email: string;
  phone: string;
  location: string;
  preferredRole?: string;
  
  // Experience
  currentRole: string;
  currentCompany?: string;
  yearsExperience: '0-1' | '1-3' | '3-5' | '5-10' | '10+';
  skills?: string;
  education?: string;
  
  // Documents
  resumeUrl: string;                // Required
  
  // Custom Fields
  customFields?: Array<{
    fieldName: string;
    fieldValue: string;
  }>;
  
  // Metadata
  appliedAt: Date;                  // Default: Date.now
  status: 'Pending' | 'Reviewed' | 'Interview' | 'Rejected' | 'Hired';  // Default: 'Pending'
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `candidateId: 1`
- `jobId: 1`
- `status: 1`
- `appliedAt: -1`

---

### 6. SavedJob Schema
**Collection:** `savedjobs`

```typescript
interface ISavedJob {
  candidateId: string;              // Ref to User
  jobId: string;                    // Ref to Job
  createdAt: Date;
}
```

**Indexes:**
- `candidateId: 1, jobId: 1` (unique compound)

---

## Admin API Routes

### Authentication Routes
**Base URL:** `/api/admin`

#### 1. Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
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
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"
    }
  }
}
```

#### 2. Create Admin
```http
POST /api/admin/create
Content-Type: application/json

{
  "email": "newadmin@example.com",
  "firstName": "New",
  "lastName": "Admin",
  "password": "password123",
  "phone": "+61400000000"
}
```

#### 3. Get All Admins
```http
GET /api/admin/
Authorization: Bearer {jwt_token}
```

#### 4. Update Admin
```http
PUT /api/admin/{admin_id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "firstName": "Updated",
  "lastName": "Admin",
  "email": "updated@example.com",
  "password": "newpassword123"
}
```

#### 5. Delete Admin
```http
DELETE /api/admin/{admin_id}
Authorization: Bearer {jwt_token}
```

---

### User Management Routes
**Base URL:** `/api/users`

#### 1. Get All Users
```http
GET /api/users/
Authorization: Bearer {jwt_token}
```

#### 2. Get User by ID
```http
GET /api/users/{user_id}
Authorization: Bearer {jwt_token}
```

#### 3. Update User
```http
PUT /api/users/{user_id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "firstName": "Updated",
  "lastName": "Name",
  "email": "updated@example.com",
  "role": "candidate"
}
```

#### 4. Delete User
```http
DELETE /api/users/{user_id}
Authorization: Bearer {jwt_token}
```

#### 5. Verify User Email
```http
POST /api/users/{user_id}/verify-email
Authorization: Bearer {jwt_token}
```

---

### Job Management Routes
**Base URL:** `/api/jobs`

#### 1. Get All Jobs (Admin)
```http
GET /api/jobs/admin/all
Authorization: Bearer {jwt_token}
```

#### 2. Create Job (Admin)
```http
POST /api/jobs/admin
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

{
  "title": "Software Developer",
  "description": "Job description",
  "location": "Sydney",
  "state": "NSW",
  "type": "Full Time",
  "jobTypeCategory": "Permanent",
  "workType": "Hybrid",
  "industry": "technology",
  "salaryDisplay": "$80,000 - $100,000",
  "salaryMin": 80000,
  "salaryMax": 100000,
  "status": "active"
}
```

#### 3. Update Job (Admin)
```http
PUT /api/jobs/admin/{job_id}
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
```

#### 4. Delete Job (Admin)
```http
DELETE /api/jobs/admin/{job_id}
Authorization: Bearer {jwt_token}
```

#### 5. Get Job Applications
```http
GET /api/jobs/{job_id}/applications
Authorization: Bearer {jwt_token}
```

#### 6. Update Application Status
```http
PUT /api/jobs/{job_id}/applications/{application_id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "status": "Interview"
}
```

---

### Company Management Routes
**Base URL:** `/api/companies`

#### 1. Get All Companies
```http
GET /api/companies/
Authorization: Bearer {jwt_token}
```

#### 2. Get Company by ID
```http
GET /api/companies/{company_id}
Authorization: Bearer {jwt_token}
```

#### 3. Update Company
```http
PUT /api/companies/{company_id}
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

{
  "name": "Updated Company Name",
  "description": "Updated description",
  "website": "https://example.com",
  "location": "Melbourne",
  "state": "VIC",
  "industry": ["technology", "health"],
  "isVerified": true
}
```

#### 4. Delete Company
```http
DELETE /api/companies/{company_id}
Authorization: Bearer {jwt_token}
```

#### 5. Verify Company
```http
POST /api/companies/{company_id}/verify
Authorization: Bearer {jwt_token}
```

---

### Candidate Management Routes
**Base URL:** `/api/candidates`

#### 1. Get All Candidates
```http
GET /api/candidates/
Authorization: Bearer {jwt_token}
```

#### 2. Get Candidate Profile
```http
GET /api/candidates/{candidate_id}
Authorization: Bearer {jwt_token}
```

#### 3. Update Candidate Profile
```http
PUT /api/candidates/{candidate_id}
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

{
  "fullName": "Updated Name",
  "location": "Brisbane",
  "state": "QLD",
  "currentRole": "Senior Developer",
  "yearsExperience": "5-10",
  "visaStatus": "citizen",
  "isOpenToWork": true
}
```

#### 4. Delete Candidate
```http
DELETE /api/candidates/{candidate_id}
Authorization: Bearer {jwt_token}
```

#### 5. Get Candidate Applications
```http
GET /api/candidates/{candidate_id}/applications
Authorization: Bearer {jwt_token}
```

---

### Application Management Routes
**Base URL:** `/api/applications`

#### 1. Get All Applications
```http
GET /api/applications/
Authorization: Bearer {jwt_token}
```

#### 2. Get Application by ID
```http
GET /api/applications/{application_id}
Authorization: Bearer {jwt_token}
```

#### 3. Update Application Status
```http
PUT /api/applications/{application_id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "status": "Reviewed"
}
```

#### 4. Delete Application
```http
DELETE /api/applications/{application_id}
Authorization: Bearer {jwt_token}
```

#### 5. Get Applications by Job
```http
GET /api/applications/job/{job_id}
Authorization: Bearer {jwt_token}
```

#### 6. Get Applications by Candidate
```http
GET /api/applications/candidate/{candidate_id}
Authorization: Bearer {jwt_token}
```

---

### Analytics Routes
**Base URL:** `/api/analytics`

#### 1. Dashboard Analytics
```http
GET /api/analytics/dashboard
Authorization: Bearer {jwt_token}
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

#### 2. User Analytics
```http
GET /api/analytics/users
Authorization: Bearer {jwt_token}
```

#### 3. Job Analytics
```http
GET /api/analytics/jobs
Authorization: Bearer {jwt_token}
```

#### 4. Application Analytics
```http
GET /api/analytics/applications
Authorization: Bearer {jwt_token}
```

---

### File Management Routes
**Base URL:** `/api/upload`

#### 1. Upload Resume
```http
POST /api/upload/resume
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

{
  "resume": file
}
```

#### 2. Upload Company Logo
```http
POST /api/upload/logo
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

{
  "logo": file
}
```

#### 3. Upload Profile Photo
```http
POST /api/upload/profile-photo
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

{
  "profilePhoto": file
}
```

---

### Data Management Routes
**Base URL:** `/api/data`

#### 1. Get Industries
```http
GET /api/data/industries
```

**Response:**
```json
{
  "success": true,
  "data": {
    "industries": [
      "health",
      "hospitality", 
      "childcare",
      "construction",
      "mining",
      "technology"
    ]
  }
}
```

#### 2. Get Australian States
```http
GET /api/data/states
```

#### 3. Get Job Types
```http
GET /api/data/job-types
```

#### 4. Get Skills by Industry
```http
GET /api/data/skills/{industry}
```

---

## Admin Permissions

### Full Access Rights
Admins have complete access to:

1. **User Management**
   - View all users (candidates, employers, admins)
   - Create, update, delete users
   - Verify email addresses
   - Reset passwords
   - Change user roles

2. **Job Management**
   - View all jobs (active, inactive, closed)
   - Create jobs on behalf of employers
   - Edit any job posting
   - Delete jobs
   - Manage job status
   - View job analytics

3. **Company Management**
   - View all companies
   - Verify companies
   - Edit company profiles
   - Delete companies
   - Manage company verification status

4. **Application Management**
   - View all applications
   - Update application status
   - Delete applications
   - Export application data
   - Manage application workflow

5. **Content Management**
   - Upload and manage files
   - Moderate job content
   - Manage platform data
   - Configure system settings

6. **Analytics & Reporting**
   - Access all platform analytics
   - Generate reports
   - Export data
   - Monitor platform performance

---

## File Upload Specifications

### Supported File Types
- **Resumes:** PDF, DOC, DOCX (max 10MB)
- **Company Logos:** JPG, PNG, SVG (max 10MB)
- **Profile Photos:** JPG, PNG (max 10MB)
- **Certificates:** PDF, JPG, PNG (max 10MB each)
- **Job Content:** PDF, DOC, DOCX (max 10MB)

### File Storage
- Files stored in `/uploads` directory
- Unique filenames to prevent conflicts
- Organized by type and date

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Security Features

1. **JWT Authentication** - All admin routes require valid JWT tokens
2. **Role-Based Access Control** - Admin role verification
3. **Input Validation** - Comprehensive validation using express-validator
4. **File Upload Security** - File type and size restrictions
5. **Password Hashing** - bcrypt with salt rounds
6. **CORS Protection** - Configured for frontend integration
7. **Helmet Security Headers** - Additional security headers

---

## Environment Variables

```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

This documentation provides complete admin access to all platform functionality with full CRUD operations on all data models.