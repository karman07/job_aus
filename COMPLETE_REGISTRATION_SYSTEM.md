# Complete Registration System - Candidates & Employers

## 🚀 Overview
Complete documentation for enhanced registration system supporting full profile creation for both candidates and employers with file uploads during registration.

---

## 📋 Table of Contents
1. [Candidate Registration with Complete Profile](#candidate-registration-with-complete-profile)
2. [Employer Registration with Company Data](#employer-registration-with-company-data)
3. [File Upload Support](#file-upload-support)
4. [API Endpoints](#api-endpoints)
5. [Complete Examples](#complete-examples)

---

## 👤 Candidate Registration with Complete Profile

### **Enhanced Candidate Registration API**
**Endpoint:** `POST /api/auth/register`
**Content-Type:** `multipart/form-data` (for file uploads) or `application/json`

### **Complete Candidate Registration Request:**
```json
{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123",
  "role": "candidate",
  "phone": "+61400000001",
  "candidate": {
    "fullName": "John Michael Doe",
    "location": "Sydney",
    "state": "NSW",
    "preferredRole": "Software Developer",
    "profilePhoto": "/uploads/profile-photo-1234567890.jpg",
    "currentRole": "Junior Developer",
    "currentCompany": "Tech Startup Pty Ltd",
    "yearsExperience": "1-3",
    "skills": "JavaScript, React, Node.js, Python, MongoDB, AWS",
    "education": "Bachelor of Computer Science - University of Sydney (2020-2023)",
    "preferredIndustries": ["technology", "health"],
    "salaryExpectation": 85000,
    "availableFrom": "2024-02-01T00:00:00.000Z",
    "visaStatus": "citizen",
    "resumeUrl": "/uploads/resume-john-doe-1234567890.pdf",
    "portfolioUrl": "https://johndoe.dev",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "coverLetterUrl": "/uploads/cover-letter-1234567890.pdf",
    "certificatesUrls": [
      "/uploads/aws-cert-1234567890.pdf",
      "/uploads/react-cert-1234567890.pdf"
    ],
    "isOpenToWork": true
  }
}
```

### **Candidate Registration Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "676c8f1a2b3c4d5e6f789012",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "candidate",
      "isEmailVerified": false,
      "phone": "+61400000001",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "profile": {
      "_id": "676c8f1a2b3c4d5e6f789013",
      "userId": "676c8f1a2b3c4d5e6f789012",
      "fullName": "John Michael Doe",
      "email": "john.doe@example.com",
      "phone": "+61400000001",
      "location": "Sydney",
      "state": "NSW",
      "preferredRole": "Software Developer",
      "profilePhoto": "/uploads/profile-photo-1234567890.jpg",
      "currentRole": "Junior Developer",
      "currentCompany": "Tech Startup Pty Ltd",
      "yearsExperience": "1-3",
      "skills": "JavaScript, React, Node.js, Python, MongoDB, AWS",
      "education": "Bachelor of Computer Science - University of Sydney (2020-2023)",
      "preferredIndustries": ["technology", "health"],
      "salaryExpectation": 85000,
      "availableFrom": "2024-02-01T00:00:00.000Z",
      "visaStatus": "citizen",
      "resumeUrl": "/uploads/resume-john-doe-1234567890.pdf",
      "portfolioUrl": "https://johndoe.dev",
      "linkedinUrl": "https://linkedin.com/in/johndoe",
      "coverLetterUrl": "/uploads/cover-letter-1234567890.pdf",
      "certificatesUrls": [
        "/uploads/aws-cert-1234567890.pdf",
        "/uploads/react-cert-1234567890.pdf"
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

### **Required Candidate Fields:**
- ✅ `email` - User email
- ✅ `firstName` - User first name
- ✅ `lastName` - User last name
- ✅ `password` - User password
- ✅ `role` - Must be "candidate"

### **Optional Candidate Profile Fields:**
- 🔸 `candidate.fullName` - Complete full name
- 🔸 `candidate.location` - Current location/city
- 🔸 `candidate.state` - Australian state (NSW, VIC, QLD, WA, SA, TAS, ACT, NT)
- 🔸 `candidate.preferredRole` - Desired job title
- 🔸 `candidate.profilePhoto` - Profile photo URL/path
- 🔸 `candidate.currentRole` - Current job title
- 🔸 `candidate.currentCompany` - Current employer
- 🔸 `candidate.yearsExperience` - Experience level (0-1, 1-3, 3-5, 5-10, 10+)
- 🔸 `candidate.skills` - Skills description
- 🔸 `candidate.education` - Education background
- 🔸 `candidate.preferredIndustries` - Array of preferred industries
- 🔸 `candidate.salaryExpectation` - Expected salary (number)
- 🔸 `candidate.availableFrom` - Available start date
- 🔸 `candidate.visaStatus` - Visa status (citizen, pr, visa_holder, needs_sponsorship)
- 🔸 `candidate.resumeUrl` - Resume file URL/path
- 🔸 `candidate.portfolioUrl` - Portfolio website URL
- 🔸 `candidate.linkedinUrl` - LinkedIn profile URL
- 🔸 `candidate.coverLetterUrl` - Cover letter file URL/path
- 🔸 `candidate.certificatesUrls` - Array of certificate file URLs/paths
- 🔸 `candidate.isOpenToWork` - Open to work status (boolean, default: true)

---

## 🏢 Employer Registration with Company Data

### **Enhanced Employer Registration API**
**Endpoint:** `POST /api/auth/register`
**Content-Type:** `multipart/form-data` (for logo upload) or `application/json`

### **Complete Employer Registration Request:**
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
    "logo": "/uploads/logo-techsolutions-1234567890.jpg",
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

### **Required Company Fields:**
- ✅ `company.name` - Company name
- ✅ `company.location` - Company location/city
- ✅ `company.state` - Australian state
- ✅ `company.industry` - Array of industries (min 1)
- ✅ `company.contact.email` - Company contact email

---

## 📁 File Upload Support

### **Supported File Types & Limits**

#### **Candidate Files:**
- **Profile Photo**: JPG, PNG, GIF (max 5MB)
- **Resume**: PDF, DOC, DOCX (max 10MB)
- **Cover Letter**: PDF, DOC, DOCX (max 10MB)
- **Certificates**: PDF, JPG, PNG (max 10MB each)
- **Portfolio Files**: PDF, JPG, PNG (max 10MB each)

#### **Employer Files:**
- **Company Logo**: JPG, PNG, SVG (max 10MB)

### **File Upload Process:**
1. **During Registration**: Files can be uploaded as part of multipart/form-data
2. **File Validation**: Automatic file type and size validation
3. **Unique Naming**: Files stored with unique names to prevent conflicts
4. **Path Storage**: File paths stored in database for retrieval

### **File Upload Example (Multipart Form):**
```javascript
const formData = new FormData();
formData.append('email', 'john.doe@example.com');
formData.append('firstName', 'John');
formData.append('lastName', 'Doe');
formData.append('password', 'password123');
formData.append('role', 'candidate');
formData.append('phone', '+61400000001');

// Candidate profile data
formData.append('candidate[fullName]', 'John Michael Doe');
formData.append('candidate[location]', 'Sydney');
formData.append('candidate[state]', 'NSW');
formData.append('candidate[preferredRole]', 'Software Developer');

// File uploads
formData.append('profilePhoto', profilePhotoFile);
formData.append('resume', resumeFile);
formData.append('coverLetter', coverLetterFile);
formData.append('certificates', certificateFile1);
formData.append('certificates', certificateFile2);

fetch('/api/auth/register', {
  method: 'POST',
  body: formData
});
```

---

## 🔗 API Endpoints

### **Registration Endpoints:**
- `POST /api/auth/register` - Complete registration for candidates/employers
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

### **File Upload Endpoints:**
- `POST /api/candidates/upload-photo` - Upload profile photo
- `POST /api/candidates/upload-resume` - Upload resume
- `POST /api/candidates/upload-documents` - Upload certificates/documents
- `POST /api/companies/upload-logo` - Upload company logo

### **Profile Management:**
- `GET /api/candidates/profile` - Get candidate profile
- `PUT /api/candidates/profile` - Update candidate profile
- `GET /api/companies/profile` - Get company profile
- `PUT /api/companies/profile` - Update company profile

---

## 📝 Complete Examples

### **1. Minimal Candidate Registration:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "simple@example.com",
    "firstName": "Simple",
    "lastName": "User",
    "password": "password123",
    "role": "candidate",
    "phone": "+61400000001"
  }'
```

### **2. Complete Candidate Registration:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "complete@example.com",
    "firstName": "Complete",
    "lastName": "User",
    "password": "password123",
    "role": "candidate",
    "phone": "+61400000001",
    "candidate": {
      "fullName": "Complete Professional User",
      "location": "Melbourne",
      "state": "VIC",
      "preferredRole": "Senior Developer",
      "currentRole": "Developer",
      "currentCompany": "Current Tech Co",
      "yearsExperience": "3-5",
      "skills": "React, Node.js, AWS, Docker",
      "education": "Bachelor of IT",
      "preferredIndustries": ["technology"],
      "salaryExpectation": 95000,
      "visaStatus": "citizen",
      "portfolioUrl": "https://portfolio.example.com",
      "linkedinUrl": "https://linkedin.com/in/completeuser",
      "isOpenToWork": true
    }
  }'
```

### **3. Complete Employer Registration:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employer@company.com.au",
    "firstName": "Business",
    "lastName": "Owner",
    "password": "password123",
    "role": "employer",
    "phone": "+61400000001",
    "company": {
      "name": "Amazing Company Pty Ltd",
      "description": "We build amazing software solutions",
      "website": "https://amazing.com.au",
      "size": "11-50",
      "founded": 2020,
      "industry": ["technology", "health"],
      "location": "Brisbane",
      "state": "QLD",
      "contact": {
        "email": "info@amazing.com.au",
        "phone": "+61733123456"
      }
    }
  }'
```

### **4. File Upload Registration (JavaScript):**
```javascript
const registerWithFiles = async () => {
  const formData = new FormData();
  
  // Basic user data
  formData.append('email', 'fileuser@example.com');
  formData.append('firstName', 'File');
  formData.append('lastName', 'User');
  formData.append('password', 'password123');
  formData.append('role', 'candidate');
  formData.append('phone', '+61400000001');
  
  // Candidate profile data
  formData.append('candidate[fullName]', 'File Upload User');
  formData.append('candidate[location]', 'Perth');
  formData.append('candidate[state]', 'WA');
  formData.append('candidate[preferredRole]', 'Full Stack Developer');
  formData.append('candidate[yearsExperience]', '5-10');
  formData.append('candidate[visaStatus]', 'pr');
  
  // File uploads
  const profilePhoto = document.getElementById('profilePhoto').files[0];
  const resume = document.getElementById('resume').files[0];
  const coverLetter = document.getElementById('coverLetter').files[0];
  
  if (profilePhoto) formData.append('profilePhoto', profilePhoto);
  if (resume) formData.append('resume', resume);
  if (coverLetter) formData.append('coverLetter', coverLetter);
  
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('Registration successful:', result);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

---

## 🔒 Security Features

### **File Upload Security:**
- File type validation (whitelist approach)
- File size limits enforced
- Unique filename generation
- Virus scanning (recommended for production)
- Secure file storage location

### **Data Validation:**
- Email format validation
- Password strength requirements
- Phone number format validation
- URL format validation for websites/portfolios
- Industry/state enum validation

### **Authentication Security:**
- JWT token-based authentication
- Refresh token rotation
- Password hashing with bcrypt
- Email verification tokens
- Role-based access control

---

## 🚀 Benefits

### **For Candidates:**
- ✅ Complete profile setup during registration
- ✅ Immediate job application capability
- ✅ File upload support for resume/documents
- ✅ Professional profile with photo
- ✅ Skills and preference tracking

### **For Employers:**
- ✅ Complete company setup during registration
- ✅ Immediate job posting capability
- ✅ Company branding with logo upload
- ✅ Professional company profile
- ✅ Contact information management

### **For Platform:**
- ✅ Higher profile completion rates
- ✅ Better user engagement
- ✅ Reduced onboarding friction
- ✅ Complete data collection upfront
- ✅ Professional user base

---

## 📊 Data Flow

### **Candidate Registration Flow:**
1. **User Input** → Basic user data + candidate profile data + files
2. **Validation** → Email uniqueness + data validation + file validation
3. **User Creation** → Create User record with authentication data
4. **Profile Creation** → Create CandidateProfile with complete data
5. **File Processing** → Upload and store files, save paths to profile
6. **Token Generation** → Generate JWT access/refresh tokens
7. **Response** → Return user data + profile data + tokens

### **Employer Registration Flow:**
1. **User Input** → Basic user data + company data + logo file
2. **Validation** → Email uniqueness + company data validation + file validation
3. **User Creation** → Create User record with authentication data
4. **Company Creation** → Create Company profile with complete data
5. **File Processing** → Upload and store logo, save path to company
6. **Token Generation** → Generate JWT access/refresh tokens
7. **Response** → Return user data + company data + tokens

This complete registration system ensures users can create full, professional profiles immediately upon registration, reducing friction and improving platform engagement.