# Company Jobs API Documentation

## Get Company Jobs
**GET** `/api/companies/jobs`

### Headers
```
Authorization: Bearer <jwt_token>
```

### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by job status (`active`, `inactive`, `closed`)

### Response
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "job_id",
        "title": "Software Developer",
        "description": "Job description",
        "location": "Sydney",
        "state": "NSW",
        "type": "Full Time",
        "industry": "technology",
        "status": "active",
        "applicationCount": 5,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

## Edit Company Job
**PUT** `/api/companies/jobs/:id`

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

### Form Data Fields (Complete Job Schema)

#### Required Fields
- `title` (string, required): Job title
- `location` (string, required): Job location
- `state` (string, required): Australian state (`NSW`, `VIC`, `QLD`, `WA`, `SA`, `TAS`, `ACT`, `NT`)
- `type` (string, required): Job type (`Full Time`, `Part Time`, `Contract`, `FIFO 2:1`, `FIFO 8:6`)
- `jobTypeCategory` (string, required): Category (`Permanent`, `Contract`, `Apprenticeship`, `Trainee`)
- `workType` (string, required): Work type (`On-Site`, `Remote`, `Hybrid`)
- `industry` (string, required): Industry (`health`, `hospitality`, `childcare`, `construction`, `mining`, `technology`)

#### Optional Fields
- `description` (string): Job description
- `requirements` (string): Job requirements
- `keyResponsibilities` (string): Key responsibilities
- `contentFile` (file): Job description file (PDF, DOC, DOCX, max 10MB)
- `salaryDisplay` (string): Salary display text
- `salaryMin` (number, min: 0): Minimum salary
- `salaryMax` (number, min: 0): Maximum salary
- `sponsorshipAvailable` (boolean, default: false): Sponsorship available
- `tags` (JSON string): Array of tags `["tag1", "tag2"]`
- `status` (string, default: inactive): Job status (`active`, `inactive`, `closed`)
- `applicantCount` (number, default: 0): Number of applicants (auto-calculated)

#### Company Information (Embedded)
- `company.name` (string): Company name
- `company.description` (string): Company description
- `company.website` (string): Company website URL
- `company.logo` (string): Company logo path
- `company.size` (string): Company size (`1-10`, `11-50`, `51-200`, `201-500`, `501-1000`, `1000+`)
- `company.founded` (number): Founded year
- `company.industry` (array): Company industries
- `company.location` (string): Company location
- `company.contact.email` (string): Contact email
- `company.contact.phone` (string): Contact phone

#### Custom Fields
- `customFields` (array): Array of custom field objects
  - `customFields[].label` (string): Field label
  - `customFields[].value` (string): Field value

#### System Fields (Read-only)
- `_id`: Job ID
- `postedBy`: Employer user ID
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### cURL Example
```bash
curl -X PUT "http://localhost:3001/api/companies/jobs/JOB_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Updated Software Developer" \
  -F "description=Updated job description" \
  -F "location=Melbourne" \
  -F "state=VIC" \
  -F "type=Full Time" \
  -F "industry=technology" \
  -F "salaryMin=80000" \
  -F "salaryMax=120000" \
  -F "sponsorshipAvailable=true" \
  -F "tags=[\"React\", \"Node.js\", \"TypeScript\"]" \
  -F "status=active"
```

### Response
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "job": {
      "_id": "job_id",
      "title": "Updated Software Developer",
      "description": "Updated job description",
      "location": "Melbourne",
      "state": "VIC",
      "type": "Full Time",
      "industry": "technology",
      "salaryMin": 80000,
      "salaryMax": 120000,
      "sponsorshipAvailable": true,
      "tags": ["React", "Node.js", "TypeScript"],
      "status": "active",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Error Responses
- `403`: Access denied (not an employer or not job owner)
- `404`: Job not found
- `400`: Validation errors
- `500`: Server error

### Security Notes
- Only employers can access these endpoints
- Employers can only edit their own jobs
- File uploads are validated for type and size
- All inputs are sanitized and validated