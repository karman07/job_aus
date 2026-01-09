# Job Creation with Logo Upload

## Multipart Form Job Creation

### POST /api/jobs (with logo upload)

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `title`: Job title (required)
- `description`: Job description (required)
- `requirements`: Job requirements (required)
- `keyResponsibilities`: Key responsibilities (required)
- `location`: Job location (required)
- `state`: Australian state (required)
- `type`: Job type (required)
- `jobTypeCategory`: Job category (required)
- `workType`: Work type (required)
- `industry`: Industry (required)
- `salaryDisplay`: Salary display (required)
- `tags`: JSON string array of tags (optional)
- `company`: JSON string of company object (optional)
- `logo`: Logo image file (optional)

**Example cURL:**
```bash
curl -X POST http://localhost:3001/api/jobs \
  -F "title=Senior Developer" \
  -F "description=We are looking for an experienced developer" \
  -F "requirements=5+ years React, Node.js experience" \
  -F "keyResponsibilities=Lead development team, architect solutions" \
  -F "location=Sydney" \
  -F "state=NSW" \
  -F "type=Full Time" \
  -F "jobTypeCategory=Permanent" \
  -F "workType=Hybrid" \
  -F "industry=technology" \
  -F "salaryDisplay=$90k - $120k" \
  -F 'tags=["react", "nodejs", "javascript"]' \
  -F 'company={"name":"Tech Innovations","description":"Leading technology company","website":"https://techinnovations.com.au","size":"51-200","founded":2015,"industry":["technology"],"location":"Sydney, NSW","contact":{"email":"jobs@techinnovations.com.au","phone":"+61 2 9876 5432"}}' \
  -F "logo=@/path/to/logo.png"
```

**JavaScript/React Example:**
```javascript
const formData = new FormData();
formData.append('title', 'Senior Developer');
formData.append('description', 'We are looking for an experienced developer');
formData.append('requirements', '5+ years React, Node.js experience');
formData.append('keyResponsibilities', 'Lead development team, architect solutions');
formData.append('location', 'Sydney');
formData.append('state', 'NSW');
formData.append('type', 'Full Time');
formData.append('jobTypeCategory', 'Permanent');
formData.append('workType', 'Hybrid');
formData.append('industry', 'technology');
formData.append('salaryDisplay', '$90k - $120k');
formData.append('tags', JSON.stringify(['react', 'nodejs', 'javascript']));
formData.append('company', JSON.stringify({
  name: 'Tech Innovations',
  description: 'Leading technology company',
  website: 'https://techinnovations.com.au',
  size: '51-200',
  founded: 2015,
  industry: ['technology'],
  location: 'Sydney, NSW',
  contact: {
    email: 'jobs@techinnovations.com.au',
    phone: '+61 2 9876 5432'
  }
}));
formData.append('logo', logoFile); // File object from input

fetch('http://localhost:3001/api/jobs', {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "success": true,
  "data": {
    "job": {
      "_id": "...",
      "title": "Senior Developer",
      "description": "We are looking for an experienced developer",
      "requirements": "5+ years React, Node.js experience",
      "keyResponsibilities": "Lead development team, architect solutions",
      "location": "Sydney",
      "state": "NSW",
      "type": "Full Time",
      "jobTypeCategory": "Permanent",
      "workType": "Hybrid",
      "industry": "technology",
      "salaryDisplay": "$90k - $120k",
      "tags": ["react", "nodejs", "javascript"],
      "status": "inactive",
      "applicantCount": 0,
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
      },
      "createdAt": "2026-01-08T17:50:00.000Z",
      "updatedAt": "2026-01-08T17:50:00.000Z"
    }
  }
}
```

## Notes
- Logo file is automatically saved and path stored in `company.logo`
- `tags` and `company` must be JSON strings when using multipart form
- Job status defaults to `inactive` (requires admin approval)
- All validation rules still apply
- Maximum file size: 10MB
- Supported formats: JPG, PNG, SVG