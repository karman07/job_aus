# Frontend Schema Guide - CrossNations Job Portal

## Complete Job Schema for Frontend Integration

### Job Model Interface
```typescript
interface IJob {
  _id: string;
  title: string;
  description?: string;
  requirements?: string;
  keyResponsibilities?: string;
  contentFile?: string;
  location: string;
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  type: 'Full Time' | 'Part Time' | 'Contract' | 'FIFO 2:1' | 'FIFO 8:6';
  jobTypeCategory: 'Permanent' | 'Contract' | 'Apprenticeship' | 'Trainee';
  workType: 'On-Site' | 'Remote' | 'Hybrid';
  industry: 'health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology';
  salaryDisplay?: string;
  salaryMin?: number;
  salaryMax?: number;
  tags: string[];
  status: 'active' | 'inactive' | 'closed';
  company: ICompany;
  postedBy?: string;
  applicantCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ICompany {
  name?: string;
  description?: string;
  website?: string;
  logo?: string;
  size?: string;
  founded?: number;
  industry?: ('health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology')[];
  location?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
}
```

## Form Fields for Job Creation

### Required Fields
```typescript
const requiredFields = {
  title: string,
  location: string,
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT',
  type: 'Full Time' | 'Part Time' | 'Contract' | 'FIFO 2:1' | 'FIFO 8:6',
  jobTypeCategory: 'Permanent' | 'Contract' | 'Apprenticeship' | 'Trainee',
  workType: 'On-Site' | 'Remote' | 'Hybrid',
  industry: 'health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology',
  salaryDisplay: string
};
```

### Optional Fields
```typescript
const optionalFields = {
  description?: string,
  requirements?: string,
  keyResponsibilities?: string,
  contentFile?: File,
  salaryMin?: number,
  salaryMax?: number,
  tags?: string[],
  company: {
    name?: string,
    description?: string,
    website?: string,
    logo?: File,
    size?: string,
    founded?: number,
    industry?: string[],
    location?: string,
    contact?: {
      email?: string,
      phone?: string
    }
  }
};
```

## File Upload Configuration

### Supported File Types
```typescript
const fileTypes = {
  logo: {
    accept: '.jpg,.jpeg,.png,.svg',
    maxSize: '10MB',
    field: 'logo'
  },
  contentFile: {
    accept: '.md,.markdown',
    maxSize: '5MB',
    field: 'contentFile'
  },
  resume: {
    accept: '.pdf,.doc,.docx',
    maxSize: '10MB',
    field: 'resume'
  }
};
```

### FormData Structure
```typescript
const formData = new FormData();

// Job fields
formData.append('title', jobData.title);
formData.append('location', jobData.location);
formData.append('state', jobData.state);
formData.append('type', jobData.type);
formData.append('jobTypeCategory', jobData.jobTypeCategory);
formData.append('workType', jobData.workType);
formData.append('industry', jobData.industry);
formData.append('salaryDisplay', jobData.salaryDisplay);

// Optional content (either text OR file)
if (contentFile) {
  formData.append('contentFile', contentFile);
} else {
  formData.append('description', jobData.description);
  formData.append('requirements', jobData.requirements);
  formData.append('keyResponsibilities', jobData.keyResponsibilities);
}

// Company fields
formData.append('company.name', companyData.name);
formData.append('company.size', companyData.size);
if (logoFile) formData.append('logo', logoFile);

// Salary range
if (salaryMin) formData.append('salaryMin', salaryMin.toString());
if (salaryMax) formData.append('salaryMax', salaryMax.toString());

// Tags
formData.append('tags', JSON.stringify(tags));
```

## API Endpoints

### Job Management
```typescript
const endpoints = {
  // Public
  getJobs: 'GET /api/jobs',
  getJobById: 'GET /api/jobs/:id',
  
  // Protected
  createJob: 'POST /api/jobs',
  updateJob: 'PUT /api/jobs/:id',
  deleteJob: 'DELETE /api/jobs/:id',
  
  // Admin
  getAllJobs: 'GET /api/jobs/admin/all'
};
```

### Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## Validation Rules

### Frontend Validation
```typescript
const validation = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 200
  },
  location: {
    required: true,
    minLength: 1
  },
  state: {
    required: true,
    enum: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']
  },
  salaryDisplay: {
    required: true,
    pattern: /^\$[\d,]+ - \$[\d,]+$/
  },
  website: {
    pattern: /^https?:\/\/.+/
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};
```

## Australian-Specific Options

### States and Territories
```typescript
const australianStates = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' }
];
```

### Job Types
```typescript
const jobTypes = [
  { value: 'Full Time', label: 'Full Time' },
  { value: 'Part Time', label: 'Part Time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'FIFO 2:1', label: 'FIFO 2:1' },
  { value: 'FIFO 8:6', label: 'FIFO 8:6' }
];

const jobCategories = [
  { value: 'Permanent', label: 'Permanent' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Apprenticeship', label: 'Apprenticeship' },
  { value: 'Trainee', label: 'Trainee' }
];

const workTypes = [
  { value: 'On-Site', label: 'On-Site' },
  { value: 'Remote', label: 'Remote' },
  { value: 'Hybrid', label: 'Hybrid' }
];
```

### Industries
```typescript
const industries = [
  { value: 'health', label: 'Healthcare & Medical' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'childcare', label: 'Childcare & Education' },
  { value: 'construction', label: 'Construction & Trades' },
  { value: 'mining', label: 'Mining & Resources' },
  { value: 'technology', label: 'Technology & IT' }
];
```

## Example React Components

### Job Creation Form
```tsx
const JobForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    state: '',
    type: '',
    jobTypeCategory: '',
    workType: '',
    industry: '',
    salaryDisplay: '',
    description: '',
    requirements: '',
    keyResponsibilities: ''
  });
  
  const [files, setFiles] = useState({
    logo: null,
    contentFile: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Append form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    
    // Append files
    if (files.logo) data.append('logo', files.logo);
    if (files.contentFile) data.append('contentFile', files.contentFile);
    
    await fetch('/api/jobs', {
      method: 'POST',
      body: data
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="title" 
        placeholder="Job Title"
        required 
      />
      <select name="state" required>
        {australianStates.map(state => (
          <option key={state.value} value={state.value}>
            {state.label}
          </option>
        ))}
      </select>
      <input 
        type="file" 
        name="logo" 
        accept=".jpg,.png,.svg"
        onChange={(e) => setFiles({...files, logo: e.target.files[0]})}
      />
      <button type="submit">Create Job</button>
    </form>
  );
};
```

### File Upload Component
```tsx
const FileUpload = ({ accept, maxSize, onFileSelect, label }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= maxSize) {
      onFileSelect(file);
    } else {
      alert(`File size must be less than ${maxSize / 1024 / 1024}MB`);
    }
  };

  return (
    <div>
      <label>{label}</label>
      <input 
        type="file" 
        accept={accept}
        onChange={handleFileChange}
      />
    </div>
  );
};
```