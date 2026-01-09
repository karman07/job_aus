# Job Posting API

## Schema

### Job Fields
- `title` (required): Job title
- `description` (required): Job description  
- `requirements` (required): Job requirements
- `keyResponsibilities` (required): Key responsibilities for the role
- `location` (required): Job location
- `state` (required): NSW | VIC | QLD | WA | SA | TAS | ACT | NT
- `type` (required): Full Time | Part Time | Contract | FIFO 2:1 | FIFO 8:6
- `jobTypeCategory` (required): Permanent | Contract | Apprenticeship | Trainee
- `workType` (required): On-Site | Remote | Hybrid
- `industry` (required): health | hospitality | childcare | construction | mining | technology
- `salaryDisplay` (required): Salary range as string
- `tags` (optional): Array of skill tags
- `company` (optional): Company details object
- `applicantCount` (auto): Number of applicants (default: 0)

### Company Object
- `name`: Company name
- `description`: Company description
- `website`: Valid URL (must start with http:// or https://)
- `logo`: Logo file path (use upload endpoint first)
- `size`: 1-10 | 11-50 | 51-200 | 201-500 | 500+
- `founded`: Year founded (number)
- `industry`: Array of industries (health | hospitality | childcare | construction | mining | technology)
- `location`: Company location
- `contact.email`: Contact email
- `contact.phone`: Contact phone

## API Endpoints

### Upload Logo
```bash
curl -X POST http://localhost:3001/api/upload/logo \
  -F "logo=@/path/to/logo.png"
```

### Create Job
```bash
curl -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Developer",
    "description": "We are looking for an experienced developer",
    "requirements": "5+ years React, Node.js experience",
    "keyResponsibilities": "Lead development team, architect solutions, mentor junior developers",
    "location": "Sydney",
    "state": "NSW",
    "type": "Full Time",
    "jobTypeCategory": "Permanent",
    "workType": "Hybrid",
    "industry": "technology",
    "salaryDisplay": "$90k - $120k",
    "tags": ["react", "nodejs", "javascript"],
    "company": {
      "name": "Tech Innovations",
      "description": "Leading technology company",
      "website": "https://techinnovations.com.au",
      "logo": "/uploads/logo-1234567890.png",
      "size": "51-200",
      "founded": 2015,
      "industry": ["technology"],
      "location": "Sydney, NSW",
      "contact": {
        "email": "jobs@techinnovations.com.au",
        "phone": "+61 2 9876 5432"
      }
    }
  }'
```

### Get Jobs
```bash
# Get all jobs with pagination
curl http://localhost:3001/api/jobs

# Get jobs with specific page and limit
curl http://localhost:3001/api/jobs?page=1&limit=5

# Get single job by ID
curl http://localhost:3001/api/jobs/JOB_ID
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "695fce6d92b78350cb46288c",
        "title": "Developer",
        "description": "Sample job description",
        "requirements": "Job requirements",
        "keyResponsibilities": "Key responsibilities for the role",
        "location": "Sydney",
        "state": "NSW",
        "type": "Full Time",
        "jobTypeCategory": "Permanent",
        "workType": "On-Site",
        "industry": "technology",
        "salaryDisplay": "$80000",
        "tags": ["JS", "TS"],
        "status": "active",
        "applicantCount": 0,
        "company": {
          "name": "Company Name",
          "description": "Company description",
          "website": "https://company.com",
          "logo": "/uploads/logo-123.png",
          "size": "51-200",
          "founded": 2015,
          "industry": ["technology"],
          "location": "Sydney, NSW",
          "contact": {
            "email": "jobs@company.com",
            "phone": "+61 2 1234 5678"
          }
        },
        "createdAt": "2026-01-08T15:34:05.777Z",
        "updatedAt": "2026-01-08T15:34:05.777Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

## Notes
- No authentication required
- Website URLs must include protocol (http:// or https://)
- Company industry must match valid enum values
- Logo upload returns URL to use in job creation