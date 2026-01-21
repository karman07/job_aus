# JWT Authentication API Documentation

## Overview
Complete JWT-based authentication system for CrossNations job portal with role-based access control for candidates, employers, and admins.

## Authentication Flow

### 1. User Registration
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
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
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "candidate",
      "isEmailVerified": false
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### 2. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "candidate",
      "isEmailVerified": false
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### 3. Refresh Access Token
**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "new_jwt_access_token",
      "refreshToken": "new_jwt_refresh_token"
    }
  }
}
```

### 4. Get User Profile
**Endpoint:** `GET /api/auth/profile`
**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "candidate",
      "isEmailVerified": false,
      "phone": "+61400000000"
    },
    "profile": {
      // CandidateProfile for candidates or Company for employers
    }
  }
}
```

### 5. Logout
**Endpoint:** `POST /api/auth/logout`
**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## Company Management (Employers Only)

### 1. Get Company Profile
**Endpoint:** `GET /api/companies/profile`
**Headers:** `Authorization: Bearer {access_token}`
**Role Required:** employer

**Response:**
```json
{
  "success": true,
  "data": {
    "company": {
      "userId": "user_id",
      "name": "Company Name",
      "description": "Company description",
      "website": "https://company.com",
      "industry": ["technology", "health"],
      "location": "Sydney",
      "state": "NSW",
      "size": "11-50",
      "contact": {
        "email": "contact@company.com",
        "phone": "+61400000000"
      },
      "isVerified": false
    }
  }
}
```

### 2. Update Company Profile
**Endpoint:** `PUT /api/companies/profile`
**Headers:** `Authorization: Bearer {access_token}`
**Role Required:** employer

**Request Body:**
```json
{
  "name": "Updated Company Name",
  "description": "Updated description",
  "website": "https://newwebsite.com",
  "industry": ["technology"],
  "location": "Melbourne",
  "state": "VIC",
  "size": "51-200",
  "contact": {
    "email": "newemail@company.com",
    "phone": "+61400000001"
  }
}
```

## Job Management (Employers Only)

### 1. Create Job
**Endpoint:** `POST /api/jobs`
**Headers:** `Authorization: Bearer {access_token}`
**Role Required:** employer

**Request Body:**
```json
{
  "title": "Senior Software Developer",
  "description": "Job description",
  "requirements": "Job requirements",
  "keyResponsibilities": "Key responsibilities",
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

**Note:** Company information is automatically populated from the employer's company profile.

### 2. Get Employer's Jobs
**Endpoint:** `GET /api/companies/jobs`
**Headers:** `Authorization: Bearer {access_token}`
**Role Required:** employer
**Query Parameters:** `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### 3. Update Employer's Job
**Endpoint:** `PUT /api/companies/jobs/{job_id}`
**Headers:** `Authorization: Bearer {access_token}`
**Role Required:** employer

**Request Body:** Same as create job (all fields optional)

### 4. Delete Employer's Job
**Endpoint:** `DELETE /api/companies/jobs/{job_id}`
**Headers:** `Authorization: Bearer {access_token}`
**Role Required:** employer

**Response:**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

## Token Information

### Access Token
- **Expiry:** 15 minutes
- **Usage:** Include in Authorization header as `Bearer {token}`
- **Purpose:** API access authentication

### Refresh Token
- **Expiry:** 7 days
- **Usage:** Used to get new access tokens
- **Storage:** Store securely on client side

## Role-Based Access Control

### Roles
- **candidate**: Job seekers with candidate profiles
- **employer**: Company representatives with company profiles
- **admin**: Platform administrators

### Middleware Usage
```typescript
// Require authentication
app.use('/protected-route', authenticateToken);

// Require specific role
app.use('/candidate-only', authenticateToken, requireCandidate);
app.use('/employer-only', authenticateToken, requireEmployer);
app.use('/admin-only', authenticateToken, requireAdmin);

// Allow multiple roles
app.use('/candidate-or-employer', authenticateToken, requireCandidateOrEmployer);
```

## Error Responses

### Authentication Errors
```json
{
  "success": false,
  "message": "Access token required"
}
```

```json
{
  "success": false,
  "message": "Invalid token"
}
```

```json
{
  "success": false,
  "message": "Token expired"
}
```

### Authorization Errors
```json
{
  "success": false,
  "message": "Access denied. Required role: employer"
}
```

### Validation Errors
```json
{
  "success": false,
  "errors": [
    "Please provide a valid email",
    "Password must be at least 6 characters long"
  ]
}
```

## Database Schema

### User Model
```typescript
{
  email: string;
  firstName: string;
  lastName: string;
  password: string; // hashed with bcrypt
  phone?: string;
  role: 'candidate' | 'employer' | 'admin';
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Company Model (for employers)
```typescript
{
  userId: string; // Reference to User
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
  createdAt: Date;
  updatedAt: Date;
}
```

### CandidateProfile Model (for candidates)
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
  createdAt: Date;
  updatedAt: Date;
}
```

## Environment Variables
```env
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here
```

## Testing
Run the test script to verify authentication flow:
```bash
./test-auth.sh
```

This will test:
1. Candidate registration
2. Employer registration  
3. Login for both roles
4. Profile retrieval
5. Company profile updates