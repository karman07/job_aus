# Admin Authentication System - Changes Documentation

## Overview
Added JWT-based authentication system for admin users with automatic token management in Postman collection.

## New Features Added

### 🔐 Admin Login Endpoint
```bash
POST /api/admin/login
```

**Request:**
```json
{
  "email": "admin@crossnations.com",
  "password": "admin123"
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
      "_id": "65a1b2c3d4e5f6789012345",
      "email": "admin@crossnations.com",
      "firstName": "System",
      "lastName": "Administrator",
      "role": "admin"
    }
  }
}
```

### 🔑 JWT Token Features
- **24-hour expiration** for security
- **Automatic extraction** in Postman collection
- **Bearer token authentication** for protected routes
- **Role-based access** (admin role required)

## Updated Endpoints

### Admin Management Routes
All admin management routes now require JWT authentication:

#### Get All Admins
```bash
curl -X GET http://localhost:3001/api/admin \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Admin
```bash
curl -X PUT http://localhost:3001/api/admin/ADMIN_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "admin@crossnations.com",
    "firstName": "Updated",
    "lastName": "Administrator",
    "password": "newpassword123",
    "phone": "+61987654321"
  }'
```

#### Delete Admin
```bash
curl -X DELETE http://localhost:3001/api/admin/ADMIN_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Job Management Routes (Admin)
Protected admin job operations:

#### Update Job
```bash
curl -X PUT http://localhost:3001/api/jobs/admin/JOB_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Senior Software Developer",
    "status": "active"
  }'
```

#### Delete Job
```bash
curl -X DELETE http://localhost:3001/api/jobs/admin/JOB_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get All Jobs (Admin View)
```bash
curl -X GET http://localhost:3001/api/jobs/admin/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Postman Collection Updates

### New Collection: `CrossNations_Auth.postman_collection.json`

#### 🆕 Features Added:
1. **Admin Login Request** with automatic token extraction
2. **adminToken Variable** for storing JWT token
3. **Authorization Headers** on all protected routes
4. **Test Scripts** for automatic token management

#### 📁 Collection Structure:
```
🔐 Admin Authentication
├── Admin Login (Auto-saves token)
└── Create Admin

🔧 Admin Management (Protected)
├── Get All Admins
├── Update Admin
└── Delete Admin

💼 Job Management (Mixed)
├── Create Job (Public)
├── Get All Jobs (Public)
├── Get Job by ID (Public)
├── Update Job (Admin - Protected)
├── Delete Job (Admin - Protected)
└── Get All Jobs Admin (Protected)

👥 Candidate Management (Public)
📋 Application Management (Public)
📊 Data & Reference (Public)
🏥 Health Check (Public)
```

### 🔄 Automatic Token Management
The collection includes a test script that automatically:
1. **Extracts JWT token** from login response
2. **Saves token** to collection variable `adminToken`
3. **Uses token** in all protected requests

```javascript
// Auto-extraction script in Admin Login request
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data.token) {
        pm.collectionVariables.set('adminToken', response.data.token);
        console.log('Admin token saved:', response.data.token);
    }
}
```

## Security Implementation

### 🔒 JWT Token Structure
```javascript
{
  userId: admin._id,
  email: admin.email,
  role: admin.role,
  exp: 24h_from_now
}
```

### 🛡️ Password Security
- **Bcrypt hashing** with salt rounds: 10
- **Password exclusion** from API responses
- **Secure comparison** for login validation

### 🔐 Environment Variables
```env
JWT_SECRET=your_super_secret_jwt_key_here
```

## Usage Workflow

### 1. Setup Admin Account
```bash
# Create first admin
curl -X POST http://localhost:3001/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@crossnations.com",
    "firstName": "System",
    "lastName": "Administrator",
    "password": "admin123",
    "phone": "+61234567890"
  }'
```

### 2. Login and Get Token
```bash
# Login to get JWT token
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@crossnations.com",
    "password": "admin123"
  }'
```

### 3. Use Token for Protected Operations
```bash
# Use token in Authorization header
curl -X GET http://localhost:3001/api/admin \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Postman Testing Steps

### 🚀 Quick Start:
1. **Import Collection**: `CrossNations_Auth.postman_collection.json`
2. **Create Admin**: Run "Create Admin" request
3. **Login**: Run "Admin Login" request (token auto-saved)
4. **Test Protected Routes**: All admin routes now work with saved token

### 🔄 Token Refresh:
- **Token expires**: After 24 hours
- **Re-login required**: Run "Admin Login" again
- **Auto-update**: Token automatically updates in collection

## Error Handling

### 🚫 Authentication Errors:
- **401 Unauthorized**: Invalid credentials or expired token
- **403 Forbidden**: Valid token but insufficient permissions
- **400 Bad Request**: Missing email/password in login

### 📝 Example Error Responses:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

```json
{
  "success": false,
  "message": "Token expired"
}
```

## Migration Notes

### From Previous Version:
1. **No breaking changes** for public endpoints
2. **Admin routes now protected** - require authentication
3. **New login endpoint** added for token generation
4. **Updated Postman collection** with auth support

### Backward Compatibility:
- ✅ **Public endpoints**: Still work without authentication
- ✅ **Candidate operations**: No authentication required
- ✅ **Job viewing**: Public access maintained
- ❌ **Admin operations**: Now require JWT token

This authentication system provides secure admin access while maintaining the simplicity of public candidate and job operations.