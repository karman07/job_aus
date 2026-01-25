# Admin Job Management API

## Authentication Required
All endpoints require admin authentication with JWT token:
```
Authorization: Bearer <admin_jwt_token>
```

---

## Job Management Endpoints

### 1. Get All Jobs
**GET** `/api/admin/jobs`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status ('active', 'inactive', 'closed')

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Senior Software Developer",
        "description": "We are looking for an experienced software developer...",
        "requirements": "- 5+ years experience\n- JavaScript, React, Node.js\n- AWS knowledge",
        "keyResponsibilities": "- Lead development projects\n- Mentor junior developers\n- Code reviews",
        "contentFile": "job-description.pdf",
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
        "tags": ["javascript", "react", "nodejs", "aws"],
        "status": "active",
        "company": {
          "name": "Tech Innovations Pty Ltd",
          "description": "Leading Australian technology company",
          "website": "https://techinnovations.com.au",
          "logo": "https://example.com/logo.png",
          "size": "201-500",
          "founded": 2015,
          "industry": ["technology"],
          "location": "Sydney CBD",
          "contact": {
            "email": "careers@techinnovations.com.au",
            "phone": "+61 2 9876 5432"
          }
        },
        "postedBy": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "firstName": "Sarah",
          "lastName": "Johnson",
          "email": "sarah.johnson@techinnovations.com.au"
        },
        "applicantCount": 25,
        "customFields": [
          {
            "label": "Security Clearance",
            "value": "Baseline clearance preferred"
          },
          {
            "label": "Remote Work",
            "value": "3 days office, 2 days remote"
          }
        ],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-16T14:20:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

---

### 2. Create Job
**POST** `/api/admin/jobs`

**REQUIRED FIELDS:**
- `postedBy` (string): Valid employer user ID
- `title` (string): Job title
- `location` (string): Job location
- `state` (enum): Australian state
- `type` (enum): Job type
- `jobTypeCategory` (enum): Job category
- `workType` (enum): Work arrangement
- `industry` (enum): Industry sector

**Request Body:**
```json
{
  "postedBy": "64f8a1b2c3d4e5f6a7b8c9d1",
  "title": "Senior Software Developer",
  "description": "We are seeking an experienced software developer to join our growing team. You will be responsible for developing high-quality applications and working with cross-functional teams.",
  "requirements": "REQUIRED:\n- Bachelor's degree in Computer Science or related field\n- 5+ years of professional software development experience\n- Strong proficiency in JavaScript, React, and Node.js\n- Experience with AWS cloud services\n- Knowledge of database systems (PostgreSQL, MongoDB)\n\nPREFERRED:\n- Experience with TypeScript\n- Knowledge of Docker and Kubernetes\n- Agile/Scrum methodology experience",
  "keyResponsibilities": "- Design and develop scalable web applications\n- Lead technical discussions and architectural decisions\n- Mentor junior developers and conduct code reviews\n- Collaborate with product managers and designers\n- Ensure code quality and best practices\n- Participate in on-call rotation for production support",
  "contentFile": "senior-dev-job-description.pdf",
  "location": "Sydney CBD",
  "state": "NSW",
  "type": "Full Time",
  "jobTypeCategory": "Permanent",
  "workType": "Hybrid",
  "industry": "technology",
  "salaryDisplay": "$120,000 - $150,000 + Super + Benefits",
  "salaryMin": 120000,
  "salaryMax": 150000,
  "sponsorshipAvailable": true,
  "tags": ["javascript", "react", "nodejs", "aws", "senior", "full-stack"],
  "status": "active",
  "company": {
    "name": "Tech Innovations Pty Ltd",
    "description": "We are a leading Australian technology company specializing in enterprise software solutions. Founded in 2015, we've grown to over 300 employees across Australia.",
    "website": "https://techinnovations.com.au",
    "logo": "https://cdn.techinnovations.com.au/logo.png",
    "size": "201-500",
    "founded": 2015,
    "industry": ["technology"],
    "location": "Sydney CBD, NSW",
    "contact": {
      "email": "careers@techinnovations.com.au",
      "phone": "+61 2 9876 5432"
    }
  },
  "customFields": [
    {
      "label": "Security Clearance",
      "value": "Baseline security clearance preferred but not essential"
    },
    {
      "label": "Work Arrangement",
      "value": "3 days in office (Sydney CBD), 2 days remote"
    },
    {
      "label": "Travel Requirements",
      "value": "Occasional travel to Melbourne office (quarterly)"
    }
  ]
}
```

**Field Validations:**

**REQUIRED ENUMS:**
- `state`: "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT"
- `type`: "Full Time" | "Part Time" | "Contract" | "FIFO 2:1" | "FIFO 8:6"
- `jobTypeCategory`: "Permanent" | "Contract" | "Apprenticeship" | "Trainee"
- `workType`: "On-Site" | "Remote" | "Hybrid"
- `industry`: "health" | "hospitality" | "childcare" | "construction" | "mining" | "technology"
- `status`: "active" | "inactive" | "closed" (default: "inactive")

**OPTIONAL COMPANY ENUMS:**
- `company.size`: "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+"
- `company.industry`: Array of industry enums

**Response:**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "job": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Senior Software Developer",
      "description": "We are seeking an experienced software developer...",
      "location": "Sydney CBD",
      "state": "NSW",
      "type": "Full Time",
      "industry": "technology",
      "status": "active",
      "postedBy": "64f8a1b2c3d4e5f6a7b8c9d1",
      "applicantCount": 0,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 3. Update Job
**PUT** `/api/admin/jobs/:id`

**Request Body:** (All fields optional - same structure as Create Job)
```json
{
  "title": "Updated Job Title",
  "status": "inactive",
  "salaryMin": 130000,
  "salaryMax": 160000,
  "description": "Updated job description..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "job": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Updated Job Title",
      "status": "inactive",
      "updatedAt": "2024-01-16T15:45:00.000Z"
    }
  }
}
```

---

### 4. Delete Job
**DELETE** `/api/admin/jobs/:id`

**Response:**
```json
{
  "success": true,
  "message": "Job and related data deleted successfully"
}
```

**Note:** This will also delete:
- All job applications for this job
- All saved job records for this job

---

## Minimal Job Creation Example

For testing purposes, here's the absolute minimum required fields:

```json
{
  "postedBy": "VALID_EMPLOYER_USER_ID",
  "title": "Test Job",
  "location": "Sydney",
  "state": "NSW",
  "type": "Full Time",
  "jobTypeCategory": "Permanent",
  "workType": "On-Site",
  "industry": "technology"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid employer ID or user is not an employer"
}
```

### 400 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title is required",
    "State must be one of: NSW, VIC, QLD, WA, SA, TAS, ACT, NT"
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Job not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Detailed error message (development only)"
}
```

---

## Complete Field Reference

### Job Schema Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `postedBy` | ObjectId | ✅ | Employer user ID |
| `title` | String | ✅ | Job title |
| `description` | String | ❌ | Job description |
| `requirements` | String | ❌ | Job requirements |
| `keyResponsibilities` | String | ❌ | Key responsibilities |
| `contentFile` | String | ❌ | Uploaded job description file |
| `location` | String | ✅ | Job location |
| `state` | Enum | ✅ | Australian state |
| `type` | Enum | ✅ | Job type |
| `jobTypeCategory` | Enum | ✅ | Job category |
| `workType` | Enum | ✅ | Work arrangement |
| `industry` | Enum | ✅ | Industry sector |
| `salaryDisplay` | String | ❌ | Salary display text |
| `salaryMin` | Number | ❌ | Minimum salary |
| `salaryMax` | Number | ❌ | Maximum salary |
| `sponsorshipAvailable` | Boolean | ❌ | Visa sponsorship available |
| `tags` | Array[String] | ❌ | Job tags |
| `status` | Enum | ❌ | Job status (default: inactive) |
| `company` | Object | ❌ | Embedded company info |
| `applicantCount` | Number | ❌ | Number of applicants (auto) |
| `customFields` | Array[Object] | ❌ | Custom fields |

### Company Embedded Object Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | ❌ | Company name |
| `description` | String | ❌ | Company description |
| `website` | String | ❌ | Company website URL |
| `logo` | String | ❌ | Company logo URL |
| `size` | Enum | ❌ | Company size |
| `founded` | Number | ❌ | Year founded |
| `industry` | Array[Enum] | ❌ | Company industries |
| `location` | String | ❌ | Company location |
| `contact.email` | String | ❌ | Contact email |
| `contact.phone` | String | ❌ | Contact phone |

### Custom Fields Object

```json
{
  "label": "Field Label",
  "value": "Field Value"
}
```

---

## Australian Job Market Specific Values

### States
- `NSW` - New South Wales
- `VIC` - Victoria  
- `QLD` - Queensland
- `WA` - Western Australia
- `SA` - South Australia
- `TAS` - Tasmania
- `ACT` - Australian Capital Territory
- `NT` - Northern Territory

### Job Types (Australian Market)
- `Full Time` - Standard full-time employment
- `Part Time` - Part-time employment
- `Contract` - Contract/temporary work
- `FIFO 2:1` - Fly-in-fly-out 2 weeks on, 1 week off
- `FIFO 8:6` - Fly-in-fly-out 8 days on, 6 days off

### Industries (Australian Focus)
- `health` - Healthcare & Medical
- `hospitality` - Hospitality & Tourism
- `childcare` - Childcare & Education
- `construction` - Construction & Trades
- `mining` - Mining & Resources
- `technology` - Technology & IT

This documentation provides everything an admin needs to manage jobs through the API with complete field validation and Australian market-specific requirements.