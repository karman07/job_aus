# Job Schema Updates - File Upload Support

## Changes Made

### 1. Job Model Updates (`src/models/Job.ts`)
- **Company Logo Only**: Removed `image` field from company schema, keeping only `logo` field
- **Flexible Content Input**: Made `description`, `requirements`, and `keyResponsibilities` optional
- **Content File Support**: Added `contentFile` field for markdown file uploads
- **Removed Size Enum**: Company size is now free text instead of predefined options
- **Salary Range Fields**: Added `salaryMin` and `salaryMax` number fields for filtering

### 2. Upload Middleware Updates (`src/middleware/upload.ts`)
- **Logo File Filter**: Support for company logos (JPG, PNG, SVG)
- **Markdown File Filter**: Added support for markdown files (.md, .markdown)
- **Job Content Upload**: Combined upload handler for logos and markdown files
- **Multiple Upload Types**: Separate configurations for resumes, logos, and job content

### 3. Job Controller Updates (`src/controllers/jobController.ts`)
- **Single File Handling**: Support for logo and content file uploads only
- **Conditional Content**: Uses either text fields OR uploaded markdown file
- **Enhanced Logging**: Added file upload tracking in console logs

### 4. Job Routes Updates (`src/routes/jobs.ts`)
- **Logo and Content Files**: Support for `logo` and `contentFile` uploads only
- **Relaxed Validation**: Removed required validation for description, requirements, and keyResponsibilities

## API Usage

### Job Creation with Files
```bash
curl -X POST http://localhost:3001/api/jobs \
  -H "x-user-id: admin123" \
  -F "title=Software Developer" \
  -F "location=Sydney" \
  -F "state=NSW" \
  -F "type=Full Time" \
  -F "jobTypeCategory=Permanent" \
  -F "workType=Hybrid" \
  -F "industry=technology" \
  -F "salaryDisplay=$80,000 - $100,000" \
  -F "salaryMin=80000" \
  -F "salaryMax=100000" \
  -F "logo=@company-logo.png" \
  -F "contentFile=@job-details.md" \
  -F "company.name=Tech Corp" \
  -F "company.size=50-100 employees"
```

### Content Options
**Option 1: Text Fields**
```bash
-F "description=Job description text"
-F "requirements=Job requirements text"  
-F "keyResponsibilities=Key responsibilities text"
```

**Option 2: Markdown File**
```bash
-F "contentFile=@job-content.md"
```

## File Support
- **Logo**: JPG, PNG, SVG (max 10MB)
- **Content File**: MD, MARKDOWN (max 5MB)  
- **Resume**: PDF, DOC, DOCX (max 10MB)

## Schema Changes
```typescript
interface ICompany {
  name: string;
  logo?: string;         // Company logo URL
  size?: string;         // CHANGED: Free text instead of enum
  description?: string;
}

interface IJob {
  title: string;
  location: string;
  state: string;
  type: 'Full Time' | 'Part Time' | 'Contract' | 'FIFO 2:1' | 'FIFO 8:6';
  industry: string;
  workType: 'On-Site' | 'Remote' | 'Hybrid';
  
  // Flexible content system
  description?: string;      // CHANGED: Optional
  requirements?: string;     // CHANGED: Optional  
  keyResponsibilities?: string; // CHANGED: Optional
  contentFile?: string;      // NEW: Markdown file URL
  
  company: ICompany;
  visaSponsorship: boolean;
  
  // Salary structure
  salaryDisplay?: string;    // Display text: "$80,000 - $100,000"
  salaryMin?: number;        // NEW: Minimum salary amount
  salaryMax?: number;        // NEW: Maximum salary amount
}
```

## Frontend Integration

### Enhanced Job Creation Form
```typescript
// Option A: Traditional text fields
<textarea name="description" placeholder="Job description" />
<textarea name="requirements" placeholder="Requirements" />

// Option B: Rich markdown file upload
<input type="file" name="contentFile" accept=".md,.markdown" />

// Salary input options
<input type="text" name="salaryDisplay" placeholder="$80,000 - $100,000" />
<input type="number" name="salaryMin" placeholder="80000" />
<input type="number" name="salaryMax" placeholder="100000" />
```

### Multi-File Upload Component
```typescript
// Company branding uploads
<input type="file" name="logo" accept=".jpg,.png,.svg" />
<input type="text" name="company.size" placeholder="e.g., 50-100 employees" />
```

### Australian Job Market Features
- **Industry Categories**: Healthcare, Hospitality, Childcare, Construction, Mining, Technology
- **Location Support**: All Australian states with FIFO job types
- **Visa Status Integration**: Sponsorship tracking and filtering
- **Work Type Flexibility**: On-Site, Remote, Hybrid options

### API Response Format
```json
{
  "success": true,
  "data": {
    "_id": "job_id",
    "title": "Software Developer",
    "company": {
      "name": "Tech Corp",
      "logo": "/uploads/logos/company-logo-123.png",
      "size": "50-100 employees"
    },
    "contentFile": "/uploads/content/job-details-789.md",
    "salaryDisplay": "$80,000 - $100,000",
    "salaryMin": 80000,
    "salaryMax": 100000,
    "description": null,
    "requirements": null
  }
}
```