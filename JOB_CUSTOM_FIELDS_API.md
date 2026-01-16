# Job Custom Fields API

## Create Job with Custom Fields

**POST** `/api/jobs`

```json
{
  "title": "Senior Full Stack Developer",
  "description": "We are looking for an experienced developer",
  "location": "Sydney",
  "state": "NSW",
  "type": "Full Time",
  "jobTypeCategory": "Permanent",
  "workType": "Hybrid",
  "industry": "technology",
  "salaryMin": 100000,
  "salaryMax": 150000,
  
  "customFields": [
    {
      "label": "Benefits",
      "value": "Health Insurance, 401k, Dental Coverage"
    },
    {
      "label": "Perks",
      "value": "Free Gym, Monthly Team Lunches, Learning Budget"
    },
    {
      "label": "Visa Sponsorship",
      "value": "Available for qualified candidates"
    },
    {
      "label": "Tech Stack",
      "value": "React, Node.js, TypeScript, AWS"
    },
    {
      "label": "Team Size",
      "value": "15 developers"
    }
  ]
}
```

## Response Example

```json
{
  "job": {
    "_id": "job123",
    "title": "Senior Full Stack Developer",
    "customFields": [
      {
        "label": "Benefits",
        "value": "Health Insurance, 401k, Dental Coverage"
      },
      {
        "label": "Tech Stack",
        "value": "React, Node.js, TypeScript, AWS"
      }
    ]
  }
}
```

## Use Cases

Add any custom information about the job:
- Benefits and perks
- Visa sponsorship details
- Relocation assistance
- Team information
- Tech stack details
- Work schedule
- Career growth opportunities
- Company culture info
- Equipment provided
- Training opportunities

All fields are **optional** - add only what's relevant for your job posting!