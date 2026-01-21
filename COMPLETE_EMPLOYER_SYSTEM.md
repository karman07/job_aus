# Complete Employer System - Registration, Profile & Company Management

## 🚀 Overview
Complete documentation for the enhanced employer system including registration with company details, profile management, company data retrieval, and user management APIs.

---

## 📋 Table of Contents
1. [Employer Registration with Company Data](#employer-registration-with-company-data)
2. [Profile Management APIs](#profile-management-apis)
3. [Company Data Retrieval](#company-data-retrieval)
4. [User Profile APIs](#user-profile-apis)
5. [Job Posting Integration](#job-posting-integration)
6. [Complete API Reference](#complete-api-reference)

---

## 🔐 Employer Registration with Company Data

### **Enhanced Registration API**
**Endpoint:** `POST /api/auth/register`
**Content-Type:** `application/json`

### **Complete Registration Request:**
```json
{
  "email": "employer@techsolutions.com.au",
  "firstName": "Jane",
  "lastName": "Smith",
  "password": "password123",
  "role": "employer",
  "phone": "+61400000001",
  "company": {
    "name": "Tech Solutions Pty Ltd",
    "description": "Leading technology solutions provider in Australia",
    "website": "https://techsolutions.com.au",
    "logo": "",
    "size": "51-200",
    "founded": 2015,
    "industry": ["technology", "health"],
    "location": "Sydney",
    "state": "NSW",
    "contact": {
      "email": "contact@techsolutions.com.au",
      "phone": "+61299123456"
    }
  }
}
```

### **Registration Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "676c8f1a2b3c4d5e6f789012",
      "email": "employer@techsolutions.com.au",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "employer",
      "isEmailVerified": false,
      "phone": "+61400000001",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "profile": {
      "_id": "676c8f1a2b3c4d5e6f789014",
      "userId": "676c8f1a2b3c4d5e6f789012",
      "name": "Tech Solutions Pty Ltd",
      "description": "Leading technology solutions provider in Australia",
      "website": "https://techsolutions.com.au",
      "logo": "",
      "size": "51-200",
      "founded": 2015,
      "industry": ["technology", "health"],
      "location": "Sydney",
      "state": "NSW",
      "contact": {
        "email": "contact@techsolutions.com.au",
        "phone": "+61299123456"
      },
      "isVerified": false,
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

### **Required Company Fields:**
- ✅ `company.name` - Company name
- ✅ `company.location` - Company location/city
- ✅ `company.state` - Australian state
- ✅ `company.industry` - Array of industries (min 1)
- ✅ `company.contact.email` - Company contact email

### **Optional Company Fields:**
- 🔸 `company.description` - Company description
- 🔸 `company.website` - Company website URL
- 🔸 `company.logo` - Company logo URL/path
- 🔸 `company.size` - Company size
- 🔸 `company.founded` - Year founded
- 🔸 `company.contact.phone` - Company phone

---

## 👤 Profile Management APIs

### **1. Get User Profile**
**Endpoint:** `GET /api/auth/profile`
**Authentication:** Required (JWT Token)

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "676c8f1a2b3c4d5e6f789012",
      "email": "employer@techsolutions.com.au",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "employer",
      "isEmailVerified": false,
      "phone": "+61400000001",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "profile": {
      "_id": "676c8f1a2b3c4d5e6f789014",
      "userId": "676c8f1a2b3c4d5e6f789012",
      "name": "Tech Solutions Pty Ltd",
      "description": "Leading technology solutions provider in Australia",
      "website": "https://techsolutions.com.au",
      "logo": "/uploads/logo-1234567890.jpg",
      "size": "51-200",
      "founded": 2015,
      "industry": ["technology", "health"],
      "location": "Sydney",
      "state": "NSW",
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

### **2. Update User Profile**
**Endpoint:** `PUT /api/users/profile`
**Authentication:** Required (JWT Token)
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+61400000002",
  "email": "jane.smith@techsolutions.com.au"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "676c8f1a2b3c4d5e6f789012",
      "email": "jane.smith@techsolutions.com.au",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "employer",
      "isEmailVerified": false,
      "phone": "+61400000002",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:45:00.000Z"
    }
  }
}
```

---

## 🏢 Company Data Retrieval

### **1. Get Company Profile by Employer ID**
**Endpoint:** `GET /api/companies/profile`
**Authentication:** Required (Employer JWT Token)

**Response:**
```json
{
  "success": true,
  "data": {
    "company": {
      "_id": "676c8f1a2b3c4d5e6f789014",
      "userId": "676c8f1a2b3c4d5e6f789012",
      "name": "Tech Solutions Pty Ltd",
      "description": "Leading technology solutions provider in Australia",
      "website": "https://techsolutions.com.au",
      "logo": "/uploads/logo-1234567890.jpg",
      "size": "51-200",
      "founded": 2015,
      "industry": ["technology", "health"],
      "location": "Sydney",
      "state": "NSW",
      "contact": {
        "email": "contact@techsolutions.com.au",
        "phone": "+61299123456"
      },
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "employer": {
      "id": "676c8f1a2b3c4d5e6f789012",
      "email": "jane.smith@techsolutions.com.au",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "employer"
    }
  }
}
```

### **2. Update Company Profile**
**Endpoint:** `PUT /api/companies/profile`
**Authentication:** Required (Employer JWT Token)
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "name": "Tech Solutions Australia Pty Ltd",
  "description": "Leading technology and digital solutions provider across Australia",
  "website": "https://techsolutions.com.au",
  "size": "201-500",
  "founded": 2015,
  "industry": ["technology", "health", "construction"],
  "location": "Sydney",
  "state": "NSW",
  "contact": {
    "email": "info@techsolutions.com.au",
    "phone": "+61299123456"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Company profile updated successfully",
  "data": {
    "company": {
      "_id": "676c8f1a2b3c4d5e6f789014",
      "userId": "676c8f1a2b3c4d5e6f789012",
      "name": "Tech Solutions Australia Pty Ltd",
      "description": "Leading technology and digital solutions provider across Australia",
      "website": "https://techsolutions.com.au",
      "logo": "/uploads/logo-1234567890.jpg",
      "size": "201-500",
      "founded": 2015,
      "industry": ["technology", "health", "construction"],
      "location": "Sydney",
      "state": "NSW",
      "contact": {
        "email": "info@techsolutions.com.au",
        "phone": "+61299123456"
      },
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    }
  }
}
```

### **3. Get Company Data by User ID (Internal)**
**Endpoint:** `GET /api/companies/by-user/:userId`
**Authentication:** Required (Admin JWT Token)

**Response:**
```json
{
  "success": true,
  "data": {
    "company": {
      "_id": "676c8f1a2b3c4d5e6f789014",
      "userId": "676c8f1a2b3c4d5e6f789012",
      "name": "Tech Solutions Pty Ltd",
      "description": "Leading technology solutions provider in Australia",
      "website": "https://techsolutions.com.au",
      "logo": "/uploads/logo-1234567890.jpg",
      "size": "51-200",
      "founded": 2015,
      "industry": ["technology", "health"],
      "location": "Sydney",
      "state": "NSW",
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

---

## 💼 Job Posting Integration

### **Automatic Company Data Fetching in Job Creation**
**Endpoint:** `POST /api/jobs`
**Authentication:** Required (Employer JWT Token)

**Request Body (Simplified - No Company Data Needed):**
```json
{
  "title": "Senior Software Developer",
  "description": "We are seeking an experienced software developer to join our growing team.",
  "requirements": "5+ years experience in TypeScript, React, and Node.js",
  "keyResponsibilities": "Develop and maintain web applications, mentor junior developers",
  "location": "Sydney",
  "state": "NSW",
  "type": "Full Time",
  "jobTypeCategory": "Permanent",
  "workType": "Hybrid",
  "industry": "technology",
  "salaryDisplay": "$120,000 - $150,000",
  "salaryMin": 120000,
  "salaryMax": 150000,
  "sponsorshipAvailable": true,
  "tags": ["TypeScript", "React", "Node.js", "AWS"]
}
```

**Response (With Auto-Fetched Company Data):**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "job": {
      "id": "676c8f1a2b3c4d5e6f789013",
      "title": "Senior Software Developer",
      "description": "We are seeking an experienced software developer to join our growing team.",
      "requirements": "5+ years experience in TypeScript, React, and Node.js",
      "keyResponsibilities": "Develop and maintain web applications, mentor junior developers",
      "location": "Sydney",
      "state": "NSW",
      "type": "Full Time",
      "jobTypeCategory": "Permanent",
      "workType": "Hybrid",
      "industry": "technology",
      "salaryDisplay": "$120,000 - $150,000",
      "salaryMin": 120000,
      "salaryMax": 150000,
      "sponsorshipAvailable": true,
      "tags": ["TypeScript", "React", "Node.js", "AWS"],
      "status": "active",
      "applicantCount": 0,
      "postedBy": "676c8f1a2b3c4d5e6f789012",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "company": {
      "id": "676c8f1a2b3c4d5e6f789014",
      "userId": "676c8f1a2b3c4d5e6f789012",
      "name": "Tech Solutions Pty Ltd",
      "description": "Leading technology solutions provider in Australia",
      "website": "https://techsolutions.com.au",
      "logo": "/uploads/logo-1234567890.jpg",
      "size": "51-200",
      "founded": 2015,
      "industry": ["technology", "health"],
      "location": "Sydney",
      "state": "NSW",
      "contact": {
        "email": "contact@techsolutions.com.au",
        "phone": "+61299123456"
      },
      "isVerified": false
    },
    "employer": {
      "id": "676c8f1a2b3c4d5e6f789012",
      "email": "jane.smith@techsolutions.com.au",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "employer",
      "phone": "+61400000001"
    }
  }
}
```

---

## 📡 Complete API Reference

### **Authentication APIs**
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | No | - | Register with company data |
| POST | `/api/auth/login` | No | - | Login user |
| POST | `/api/auth/refresh` | No | - | Refresh access token |
| POST | `/api/auth/logout` | Yes | Any | Logout user |
| GET | `/api/auth/profile` | Yes | Any | Get user + profile data |

### **User Management APIs**
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/users/profile` | Yes | Any | Get user profile |
| PUT | `/api/users/profile` | Yes | Any | Update user profile |
| DELETE | `/api/users/account` | Yes | Any | Delete user account |

### **Company Management APIs**
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/companies/profile` | Yes | Employer | Get company profile |
| PUT | `/api/companies/profile` | Yes | Employer | Update company profile |
| GET | `/api/companies/by-user/:userId` | Yes | Admin | Get company by user ID |

### **Job Management APIs**
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/jobs` | Yes | Employer | Create job (auto-fetch company) |
| GET | `/api/companies/jobs` | Yes | Employer | Get employer's jobs |
| PUT | `/api/companies/jobs/:id` | Yes | Employer | Update employer's job |
| DELETE | `/api/companies/jobs/:id` | Yes | Employer | Delete employer's job |

---

## 🚀 cURL Examples

### **1. Register Employer with Complete Company Data**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employer@techsolutions.com.au",
    "firstName": "Jane",
    "lastName": "Smith",
    "password": "password123",
    "role": "employer",
    "phone": "+61400000001",
    "company": {
      "name": "Tech Solutions Pty Ltd",
      "description": "Leading technology solutions provider in Australia",
      "website": "https://techsolutions.com.au",
      "size": "51-200",
      "founded": 2015,
      "industry": ["technology", "health"],
      "location": "Sydney",
      "state": "NSW",
      "contact": {
        "email": "contact@techsolutions.com.au",
        "phone": "+61299123456"
      }
    }
  }'
```

### **2. Get User Profile with Company Data**
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **3. Update User Profile**
```bash
curl -X PUT http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+61400000002",
    "email": "jane.smith@techsolutions.com.au"
  }'
```

### **4. Get Company Profile**
```bash
curl -X GET http://localhost:3001/api/companies/profile \
  -H "Authorization: Bearer YOUR_EMPLOYER_JWT_TOKEN"
```

### **5. Update Company Profile**
```bash
curl -X PUT http://localhost:3001/api/companies/profile \
  -H "Authorization: Bearer YOUR_EMPLOYER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Solutions Australia Pty Ltd",
    "description": "Leading technology and digital solutions provider across Australia",
    "website": "https://techsolutions.com.au",
    "size": "201-500",
    "industry": ["technology", "health", "construction"],
    "location": "Sydney",
    "state": "NSW",
    "contact": {
      "email": "info@techsolutions.com.au",
      "phone": "+61299123456"
    }
  }'
```

### **6. Create Job (Auto-Fetch Company Data)**
```bash
curl -X POST http://localhost:3001/api/jobs \
  -H "Authorization: Bearer YOUR_EMPLOYER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Developer",
    "description": "We are seeking an experienced software developer to join our growing team.",
    "location": "Sydney",
    "state": "NSW",
    "type": "Full Time",
    "jobTypeCategory": "Permanent",
    "workType": "Hybrid",
    "industry": "technology",
    "salaryDisplay": "$120,000 - $150,000",
    "tags": ["TypeScript", "React", "Node.js"]
  }'
```

### **7. Get Employer's Jobs**
```bash
curl -X GET http://localhost:3001/api/companies/jobs \
  -H "Authorization: Bearer YOUR_EMPLOYER_JWT_TOKEN"
```

---

## 🔄 Data Flow Diagram

```
1. Employer Registration
   ↓
2. User + Company Profile Created
   ↓
3. JWT Tokens Generated
   ↓
4. Profile APIs Available
   ↓
5. Job Creation (Auto-Fetch Company Data)
   ↓
6. Complete Job + Company + Employer Response
```

---

## 🛡️ Security Features

### **1. Role-Based Access Control**
- **Employer Registration**: Creates User + Company profile
- **Profile Access**: Users can only access their own profiles
- **Company Access**: Employers can only access their own company
- **Job Creation**: Only employers with complete company profiles

### **2. Data Validation**
- **Registration**: Complete company data validation
- **Profile Updates**: Field-level validation
- **Company Updates**: Business rule validation
- **Job Creation**: Company completeness check

### **3. Authentication Pipeline**
- **JWT Tokens**: Secure token-based authentication
- **Refresh Mechanism**: Automatic token renewal
- **Role Verification**: Endpoint-level role checking
- **Ownership Validation**: User can only access own data

---

## 📊 Summary

| Feature | Status | Description |
|---------|--------|-------------|
| **Enhanced Registration** | ✅ Complete | Collects full company data during employer registration |
| **Profile Management** | ✅ Complete | User profile CRUD operations |
| **Company Data Retrieval** | ✅ Complete | Get company data by employer ID |
| **Auto-Fetch Integration** | ✅ Complete | Jobs automatically fetch company data |
| **Security & Validation** | ✅ Complete | Role-based access and data validation |
| **Complete API Coverage** | ✅ Complete | All CRUD operations for users and companies |

**Total APIs**: 12
**New Features**: 6
**Enhanced Security**: Role-based access control
**Data Integration**: Automatic company data fetching
**Complete Workflow**: Registration → Profile → Company → Jobs

This comprehensive system provides complete employer lifecycle management from registration through job posting with automatic data integration and robust security.