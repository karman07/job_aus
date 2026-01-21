# Sample cURL Commands for Candidate Registration

## 🚀 Complete Candidate Registration Examples

### **1. Minimal Candidate Registration (JSON)**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123",
    "role": "candidate",
    "phone": "+61400000001"
  }'
```

### **2. Complete Candidate Registration (JSON)**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "complete.candidate@example.com",
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
      "portfolioUrl": "https://johndoe.dev",
      "linkedinUrl": "https://linkedin.com/in/johndoe",
      "isOpenToWork": true
    }
  }'
```

### **3. Candidate Registration with File Uploads (Multipart)**
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
  -F "candidate[currentCompany]=Startup Co" \
  -F "candidate[yearsExperience]=1-3" \
  -F "candidate[skills]=React, Node.js, TypeScript" \
  -F "candidate[education]=Bachelor of IT" \
  -F "candidate[preferredIndustries][]=technology" \
  -F "candidate[salaryExpectation]=75000" \
  -F "candidate[visaStatus]=pr" \
  -F "candidate[portfolioUrl]=https://portfolio.example.com" \
  -F "candidate[linkedinUrl]=https://linkedin.com/in/fileupload" \
  -F "candidate[isOpenToWork]=true" \
  -F "profilePhoto=@/path/to/profile-photo.jpg" \
  -F "resume=@/path/to/resume.pdf" \
  -F "coverLetter=@/path/to/cover-letter.pdf" \
  -F "certificates=@/path/to/certificate1.pdf" \
  -F "certificates=@/path/to/certificate2.pdf"
```

### **4. Healthcare Professional Registration**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nurse.professional@example.com",
    "firstName": "Sarah",
    "lastName": "Johnson",
    "password": "password123",
    "role": "candidate",
    "phone": "+61400000002",
    "candidate": {
      "fullName": "Sarah Elizabeth Johnson",
      "location": "Brisbane",
      "state": "QLD",
      "preferredRole": "Registered Nurse",
      "currentRole": "Staff Nurse",
      "currentCompany": "Brisbane General Hospital",
      "yearsExperience": "5-10",
      "skills": "Patient Care, Emergency Medicine, ICU, Medication Administration, Electronic Health Records",
      "education": "Bachelor of Nursing - Queensland University of Technology (2015-2018), Registered Nurse License",
      "preferredIndustries": ["health"],
      "salaryExpectation": 85000,
      "availableFrom": "2024-03-01T00:00:00.000Z",
      "visaStatus": "citizen",
      "isOpenToWork": true
    }
  }'
```

### **5. Construction Worker Registration**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "builder.mike@example.com",
    "firstName": "Mike",
    "lastName": "Thompson",
    "password": "password123",
    "role": "candidate",
    "phone": "+61400000003",
    "candidate": {
      "fullName": "Michael James Thompson",
      "location": "Perth",
      "state": "WA",
      "preferredRole": "Site Supervisor",
      "currentRole": "Construction Worker",
      "currentCompany": "Perth Construction Co",
      "yearsExperience": "10+",
      "skills": "Site Management, Safety Compliance, Team Leadership, Blueprint Reading, Heavy Machinery Operation",
      "education": "Certificate IV in Building and Construction, White Card, First Aid Certificate",
      "preferredIndustries": ["construction", "mining"],
      "salaryExpectation": 95000,
      "availableFrom": "2024-01-15T00:00:00.000Z",
      "visaStatus": "citizen",
      "isOpenToWork": false
    }
  }'
```

### **6. FIFO Mining Professional Registration**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "fifo.worker@example.com",
    "firstName": "David",
    "lastName": "Wilson",
    "password": "password123",
    "role": "candidate",
    "phone": "+61400000004",
    "candidate": {
      "fullName": "David Robert Wilson",
      "location": "Adelaide",
      "state": "SA",
      "preferredRole": "Mining Equipment Operator",
      "currentRole": "Heavy Equipment Operator",
      "currentCompany": "Mining Corp Australia",
      "yearsExperience": "5-10",
      "skills": "Heavy Machinery, Safety Protocols, Equipment Maintenance, FIFO Experience, Mining Operations",
      "education": "Certificate III in Surface Extraction Operations, HR License, Mining Induction",
      "preferredIndustries": ["mining", "construction"],
      "salaryExpectation": 120000,
      "availableFrom": "2024-02-15T00:00:00.000Z",
      "visaStatus": "pr",
      "isOpenToWork": true
    }
  }'
```

### **7. International Candidate (Needs Sponsorship)**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "international@example.com",
    "firstName": "Raj",
    "lastName": "Patel",
    "password": "password123",
    "role": "candidate",
    "phone": "+61400000005",
    "candidate": {
      "fullName": "Rajesh Kumar Patel",
      "location": "Sydney",
      "state": "NSW",
      "preferredRole": "Software Engineer",
      "currentRole": "Senior Developer",
      "currentCompany": "Tech Company India",
      "yearsExperience": "5-10",
      "skills": "Java, Spring Boot, Microservices, AWS, Kubernetes, React, PostgreSQL",
      "education": "Master of Computer Applications - Indian Institute of Technology (2015-2018)",
      "preferredIndustries": ["technology"],
      "salaryExpectation": 110000,
      "availableFrom": "2024-04-01T00:00:00.000Z",
      "visaStatus": "needs_sponsorship",
      "portfolioUrl": "https://rajpatel.dev",
      "linkedinUrl": "https://linkedin.com/in/rajpatel",
      "isOpenToWork": true
    }
  }'
```

## 🏢 Employer Registration with Logo Upload

### **Employer Registration with Company Logo (Multipart)**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -F "email=employer@techcompany.com.au" \
  -F "firstName=Jane" \
  -F "lastName=Smith" \
  -F "password=password123" \
  -F "role=employer" \
  -F "phone=+61400000006" \
  -F "company[name]=Tech Solutions Australia Pty Ltd" \
  -F "company[description]=Leading technology solutions provider" \
  -F "company[website]=https://techsolutions.com.au" \
  -F "company[size]=51-200" \
  -F "company[founded]=2015" \
  -F "company[industry][]=technology" \
  -F "company[industry][]=health" \
  -F "company[location]=Sydney" \
  -F "company[state]=NSW" \
  -F "company[contact][email]=info@techsolutions.com.au" \
  -F "company[contact][phone]=+61299123456" \
  -F "logo=@/path/to/company-logo.png"
```

## 📝 Response Format

All registration requests return the same format:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "676c8f1a2b3c4d5e6f789012",
      "email": "user@example.com",
      "firstName": "First",
      "lastName": "Last",
      "role": "candidate",
      "isEmailVerified": false,
      "phone": "+61400000001"
    },
    "profile": {
      // Complete candidate or company profile data
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

## 🔧 Testing Tips

1. **Replace localhost:3001** with your actual server URL
2. **Update file paths** in multipart examples to actual file locations
3. **Use valid email addresses** for testing
4. **Ensure files exist** before running multipart upload commands
5. **Check file size limits** (max 10MB for most files, 5MB for photos)
6. **Verify file types** are supported (PDF, DOC, DOCX for documents; JPG, PNG for images)

## 📱 Frontend Integration Example

```javascript
// Complete candidate registration with files
const registerCandidate = async (formData) => {
  const multipartData = new FormData();
  
  // Basic user data
  multipartData.append('email', formData.email);
  multipartData.append('firstName', formData.firstName);
  multipartData.append('lastName', formData.lastName);
  multipartData.append('password', formData.password);
  multipartData.append('role', 'candidate');
  multipartData.append('phone', formData.phone);
  
  // Candidate profile data
  Object.keys(formData.candidate).forEach(key => {
    if (key === 'preferredIndustries' && Array.isArray(formData.candidate[key])) {
      formData.candidate[key].forEach((industry, index) => {
        multipartData.append(`candidate[${key}][${index}]`, industry);
      });
    } else {
      multipartData.append(`candidate[${key}]`, formData.candidate[key]);
    }
  });
  
  // File uploads
  if (formData.profilePhoto) multipartData.append('profilePhoto', formData.profilePhoto);
  if (formData.resume) multipartData.append('resume', formData.resume);
  if (formData.coverLetter) multipartData.append('coverLetter', formData.coverLetter);
  
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    body: multipartData
  });
  
  return response.json();
};
```