# Admin Management API

## Overview
Complete admin user management system for creating, updating, and deleting admin accounts.

## Admin Management Endpoints

### Create Admin
```bash
curl -X POST http://localhost:3001/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@crossnations.com",
    "firstName": "System",
    "lastName": "Administrator",
    "phone": "+61234567890"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "admin": {
      "_id": "65a1b2c3d4e5f6789012345",
      "email": "admin@crossnations.com",
      "role": "admin",
      "name": "System Administrator",
      "createdAt": "2024-01-08T10:00:00.000Z"
    }
  }
}
```

### Get All Admins
```bash
curl -X GET http://localhost:3001/api/admin
```

**Response:**
```json
{
  "success": true,
  "data": {
    "admins": [
      {
        "_id": "65a1b2c3d4e5f6789012345",
        "email": "admin@crossnations.com",
        "role": "admin",
        "name": "System Administrator",
        "isEmailVerified": true,
        "createdAt": "2024-01-08T10:00:00.000Z",
        "updatedAt": "2024-01-08T10:00:00.000Z"
      }
    ]
  }
}
```

### Update Admin
```bash
curl -X PUT http://localhost:3001/api/admin/ADMIN_ID \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@crossnations.com",
    "name": "Updated Admin Name",
    "password": "newpassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "admin": {
      "_id": "65a1b2c3d4e5f6789012345",
      "email": "admin@crossnations.com",
      "role": "admin",
      "name": "Updated Admin Name",
      "isEmailVerified": true,
      "createdAt": "2024-01-08T10:00:00.000Z",
      "updatedAt": "2024-01-08T11:00:00.000Z"
    }
  }
}
```

### Delete Admin
```bash
curl -X DELETE http://localhost:3001/api/admin/ADMIN_ID
```

**Response:**
```json
{
  "success": true,
  "message": "Admin deleted successfully",
  "data": {
    "deletedAdmin": "admin@crossnations.com"
  }
}
```

## Quick Setup Commands

### Create First Admin
```bash
# Create the main system administrator
curl -X POST http://localhost:3001/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@crossnations.com",
    "password": "SecureAdmin123!",
    "name": "Main Administrator"
  }'
```

### Create Additional Admins
```bash
# Create HR admin
curl -X POST http://localhost:3001/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hr@crossnations.com",
    "password": "HRAdmin123!",
    "name": "HR Administrator"
  }'

# Create Tech admin
curl -X POST http://localhost:3001/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tech@crossnations.com",
    "password": "TechAdmin123!",
    "name": "Technical Administrator"
  }'
```

## Admin Features

### Full System Access
- ✅ **Job Management**: Create, edit, delete all jobs
- ✅ **Candidate Management**: View, edit, delete candidate profiles
- ✅ **Application Oversight**: Manage all job applications
- ✅ **User Management**: Create and manage other admin accounts
- ✅ **Analytics Access**: View system analytics and reports
- ✅ **System Settings**: Configure platform settings

### Security Features
- 🔒 **Password Hashing**: All passwords encrypted with bcrypt
- 🔒 **Role Verification**: Admin role required for admin operations
- 🔒 **Email Uniqueness**: Prevents duplicate admin accounts
- 🔒 **Auto-Verification**: Admin accounts auto-verified

## Postman Collection

### Import Instructions
1. **Download**: Save the `CrossNations_API.postman_collection.json` file
2. **Import**: Open Postman → Import → Select the JSON file
3. **Variables**: Update the collection variables:
   - `baseUrl`: http://localhost:3001/api
   - `candidateId`: Set after creating a candidate
   - `jobId`: Set after creating a job
   - `applicationId`: Set after creating an application
   - `adminId`: Set after creating an admin

### Collection Structure
```
📁 CrossNations Job Portal API
├── 📁 Admin Management
│   ├── Create Admin
│   ├── Get All Admins
│   ├── Update Admin
│   └── Delete Admin
├── 📁 Candidate Management
│   ├── Create Candidate
│   ├── Get All Candidates
│   ├── Get Candidate by ID
│   ├── Update Candidate
│   └── Delete Candidate
├── 📁 Job Management
│   ├── Create Job
│   ├── Get All Jobs
│   ├── Get Job by ID
│   ├── Update Job (Admin)
│   ├── Delete Job (Admin)
│   └── Get All Jobs (Admin)
├── 📁 Application Management
│   ├── Apply for Job
│   ├── Get All Applications
│   ├── Get Application by ID
│   ├── Get Applications by Job
│   ├── Get Applications by Candidate
│   ├── Update Application Status
│   ├── Update Application Details
│   └── Delete Application
├── 📁 Data & Reference
│   ├── Get Industries
│   ├── Get Locations
│   └── Get Skills by Industry
└── 📁 Health Check
    └── Server Health
```

## Testing Workflow

### 1. Setup Phase
```bash
# 1. Create admin
POST /api/admin/create

# 2. Create candidate
POST /api/candidates

# 3. Create job
POST /api/jobs
```

### 2. Application Flow
```bash
# 1. Apply for job
POST /api/applications

# 2. View applications
GET /api/applications

# 3. Update application status
PATCH /api/applications/:id/status
```

### 3. Management Operations
```bash
# 1. View all data
GET /api/candidates
GET /api/jobs
GET /api/applications

# 2. Update records
PUT /api/candidates/:id
PUT /api/jobs/admin/:id

# 3. Delete records
DELETE /api/candidates/:id
DELETE /api/jobs/admin/:id
DELETE /api/applications/:id
```

## Environment Variables

### Collection Variables
```json
{
  "baseUrl": "http://localhost:3001/api",
  "candidateId": "{{candidate_id_from_response}}",
  "jobId": "{{job_id_from_response}}",
  "applicationId": "{{application_id_from_response}}",
  "adminId": "{{admin_id_from_response}}"
}
```

### Usage Tips
1. **Create First**: Always create admin, candidate, and job first
2. **Copy IDs**: Copy the `_id` from responses to collection variables
3. **Test Flow**: Follow the testing workflow for best results
4. **File Uploads**: Use actual files for resume and logo uploads
5. **Status Updates**: Test different application status transitions

The Postman collection provides a complete testing environment for all API endpoints with proper variable management and realistic test data.