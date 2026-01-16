# Custom Application Fields API

## Overview
Employers can now add custom fields to job postings that applicants must fill when applying.

## 1. Create Job with Custom Fields

**POST** `/api/jobs`

```json
{
  "title": "Senior Developer",
  "description": "Looking for experienced developer",
  "location": "Sydney",
  "state": "NSW",
  "type": "Full Time",
  "jobTypeCategory": "Permanent",
  "workType": "Hybrid",
  "industry": "technology",
  "salaryMin": 80000,
  "salaryMax": 120000,
  "customApplicationFields": [
    "LinkedIn Profile URL",
    "GitHub Profile",
    "Years of React Experience",
    "Portfolio Website",
    "Why do you want to work here?"
  ]
}
```

## 2. Submit Application with Custom Fields

**POST** `/api/applications`

```json
{
  "jobId": "job_id_here",
  "candidateId": "candidate_id_here",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+61400000000",
  "location": "Sydney",
  "currentRole": "Software Developer",
  "yearsExperience": "5-10",
  "skills": "React, Node.js, TypeScript",
  "resumeUrl": "https://example.com/resume.pdf",
  "customFields": [
    {
      "fieldName": "LinkedIn Profile URL",
      "fieldValue": "https://linkedin.com/in/johndoe"
    },
    {
      "fieldName": "GitHub Profile",
      "fieldValue": "https://github.com/johndoe"
    },
    {
      "fieldName": "Years of React Experience",
      "fieldValue": "5 years"
    },
    {
      "fieldName": "Portfolio Website",
      "fieldValue": "https://johndoe.dev"
    },
    {
      "fieldName": "Why do you want to work here?",
      "fieldValue": "I'm passionate about your mission and technology stack..."
    }
  ]
}
```

## 3. Get Job with Custom Fields

**GET** `/api/jobs/:id`

Response includes `customApplicationFields` array:
```json
{
  "job": {
    "_id": "job_id",
    "title": "Senior Developer",
    "customApplicationFields": [
      "LinkedIn Profile URL",
      "GitHub Profile",
      "Years of React Experience",
      "Portfolio Website",
      "Why do you want to work here?"
    ]
  }
}
```

## 4. Get Application with Custom Fields

**GET** `/api/applications/:id`

Response includes `customFields` array:
```json
{
  "application": {
    "_id": "application_id",
    "fullName": "John Doe",
    "customFields": [
      {
        "fieldName": "LinkedIn Profile URL",
        "fieldValue": "https://linkedin.com/in/johndoe"
      },
      {
        "fieldName": "GitHub Profile",
        "fieldValue": "https://github.com/johndoe"
      }
    ]
  }
}
```

## Use Cases

1. **Technical Roles**: Ask for GitHub, portfolio, coding challenge links
2. **Sales Roles**: Ask for sales achievements, CRM experience
3. **Creative Roles**: Ask for portfolio, design samples
4. **Any Role**: Ask custom questions specific to your company

## Benefits

- ✅ Flexible application forms
- ✅ Collect specific information per job
- ✅ No code changes needed for new fields
- ✅ Easy to filter candidates based on custom answers