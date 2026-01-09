# CrossNations Backend Data Structures & Schemas

## Database Models

### User Model
```typescript
interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'candidate' | 'employer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

### Company Model
```typescript
interface ICompany {
  id: string;
  name: string;
  description: string;
  website?: string;
  logo?: string;
  size: string; // e.g., "5,000+ employees"
  founded?: string;
  industry: string[];
  location: string;
  contactEmail: string;
  contactPhone?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Job Model
```typescript
interface IJob {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string;
  duties?: string;
  location: string;
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  type: 'Full Time' | 'Part Time' | 'Contract' | 'FIFO 2:1' | 'FIFO 8:6';
  jobTypeCategory: 'Permanent' | 'Contract' | 'Apprenticeship' | 'Trainee';
  workType: 'On-Site' | 'Remote' | 'Hybrid';
  industry: 'health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology';
  salaryMin?: number;
  salaryMax?: number;
  salaryDisplay: string; // e.g., "$90k - $110k"
  benefits?: string[];
  tags: string[];
  featured: boolean;
  urgent: boolean;
  status: 'draft' | 'active' | 'paused' | 'closed';
  applicantCount: number;
  viewCount: number;
  postedAt: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Candidate Profile Model
```typescript
interface ICandidateProfile {
  id: string;
  userId: string;
  currentRole?: string;
  currentCompany?: string;
  yearsExperience: '0-1' | '1-3' | '3-5' | '5-10' | '10+';
  skills?: string;
  education?: string;
  preferredRole?: string;
  preferredLocation?: string;
  preferredIndustries: string[];
  salaryExpectation?: number;
  availableFrom?: Date;
  visaStatus: 'citizen' | 'pr' | 'visa_holder' | 'needs_sponsorship';
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  isOpenToWork: boolean;
  profileViews: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Job Application Model
```typescript
interface IJobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'offered' | 'rejected' | 'withdrawn';
  coverLetter?: string;
  resumeUrl?: string;
  additionalDocuments?: string[];
  appliedAt: Date;
  reviewedAt?: Date;
  interviewScheduledAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Saved Job Model
```typescript
interface ISavedJob {
  id: string;
  candidateId: string;
  jobId: string;
  createdAt: Date;
}
```

### Company Follow Model
```typescript
interface ICompanyFollow {
  id: string;
  candidateId: string;
  companyId: string;
  createdAt: Date;
}
```

### File Upload Model
```typescript
interface IFileUpload {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  type: 'resume' | 'cover_letter' | 'portfolio' | 'company_logo' | 'job_attachment';
  createdAt: Date;
}
```

### Notification Model
```typescript
interface INotification {
  id: string;
  userId: string;
  type: 'job_match' | 'application_status' | 'new_job' | 'profile_view' | 'message';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}
```

### Contact Inquiry Model
```typescript
interface IContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  type: 'general' | 'employer' | 'candidate' | 'support';
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}
```

## Australian Reference Data

### States and Territories
```typescript
const AUSTRALIAN_STATES = [
  'NSW', // New South Wales
  'VIC', // Victoria
  'QLD', // Queensland
  'WA',  // Western Australia
  'SA',  // South Australia
  'TAS', // Tasmania
  'ACT', // Australian Capital Territory
  'NT'   // Northern Territory
];
```

### Industries
```typescript
const INDUSTRIES = [
  {
    value: 'health',
    label: 'Healthcare & Medical',
    description: 'Healthcare professionals, medical practitioners, and support staff'
  },
  {
    value: 'hospitality',
    label: 'Hospitality & Tourism',
    description: 'Hotels, restaurants, tourism, and customer service roles'
  },
  {
    value: 'childcare',
    label: 'Childcare & Education',
    description: 'Early childhood education, childcare workers, and educators'
  },
  {
    value: 'construction',
    label: 'Construction & Trades',
    description: 'Building, construction, electrical, plumbing, and trade work'
  },
  {
    value: 'mining',
    label: 'Mining & Resources',
    description: 'Mining operations, FIFO roles, and resource extraction'
  },
  {
    value: 'technology',
    label: 'Technology & IT',
    description: 'Software development, IT support, and technology roles'
  }
];
```

### Job Types
```typescript
const JOB_TYPES = [
  'Full Time',
  'Part Time',
  'Contract',
  'FIFO 2:1', // Fly-In-Fly-Out 2 weeks on, 1 week off
  'FIFO 8:6'  // Fly-In-Fly-Out 8 days on, 6 days off
];
```

### Work Types
```typescript
const WORK_TYPES = [
  'On-Site',
  'Remote',
  'Hybrid'
];
```

### Job Categories
```typescript
const JOB_CATEGORIES = [
  'Permanent',
  'Contract',
  'Apprenticeship',
  'Trainee'
];
```

### Visa Status Options
```typescript
const VISA_STATUS = [
  'citizen',           // Australian Citizen
  'pr',               // Permanent Resident
  'visa_holder',      // Visa Holder
  'needs_sponsorship' // Needs Sponsorship
];
```

### Experience Levels
```typescript
const EXPERIENCE_LEVELS = [
  '0-1',   // 0-1 years
  '1-3',   // 1-3 years
  '3-5',   // 3-5 years
  '5-10',  // 5-10 years
  '10+'    // 10+ years
];
```

## Skills by Industry

### Health Industry Skills
```typescript
const HEALTH_SKILLS = [
  { name: 'Patient Care', category: 'Clinical', popularity: 95 },
  { name: 'Medical Records', category: 'Administrative', popularity: 80 },
  { name: 'CPR Certification', category: 'Certification', popularity: 90 },
  { name: 'Nursing', category: 'Clinical', popularity: 85 },
  { name: 'First Aid', category: 'Certification', popularity: 88 }
];
```

### Hospitality Industry Skills
```typescript
const HOSPITALITY_SKILLS = [
  { name: 'Customer Service', category: 'Service', popularity: 95 },
  { name: 'Food Safety', category: 'Certification', popularity: 85 },
  { name: 'POS Systems', category: 'Technical', popularity: 70 },
  { name: 'Event Management', category: 'Management', popularity: 65 },
  { name: 'RSA Certificate', category: 'Certification', popularity: 80 }
];
```

### Childcare Industry Skills
```typescript
const CHILDCARE_SKILLS = [
  { name: 'Child Development', category: 'Educational', popularity: 90 },
  { name: 'Early Childhood Education', category: 'Educational', popularity: 95 },
  { name: 'Behavior Management', category: 'Management', popularity: 85 },
  { name: 'First Aid (Child)', category: 'Certification', popularity: 92 },
  { name: 'Activity Planning', category: 'Creative', popularity: 80 }
];
```

### Construction Industry Skills
```typescript
const CONSTRUCTION_SKILLS = [
  { name: 'Safety Protocols', category: 'Safety', popularity: 95 },
  { name: 'Blueprint Reading', category: 'Technical', popularity: 85 },
  { name: 'Power Tools', category: 'Technical', popularity: 90 },
  { name: 'White Card', category: 'Certification', popularity: 98 },
  { name: 'Project Management', category: 'Management', popularity: 70 }
];
```

### Mining Industry Skills
```typescript
const MINING_SKILLS = [
  { name: 'FIFO Experience', category: 'Operational', popularity: 90 },
  { name: 'Heavy Machinery', category: 'Technical', popularity: 85 },
  { name: 'Safety Training', category: 'Safety', popularity: 98 },
  { name: 'Mining Operations', category: 'Operational', popularity: 88 },
  { name: 'HR Licence', category: 'Certification', popularity: 80 }
];
```

### Technology Industry Skills
```typescript
const TECHNOLOGY_SKILLS = [
  { name: 'JavaScript', category: 'Programming', popularity: 90 },
  { name: 'React', category: 'Framework', popularity: 85 },
  { name: 'Node.js', category: 'Backend', popularity: 80 },
  { name: 'Python', category: 'Programming', popularity: 88 },
  { name: 'AWS', category: 'Cloud', popularity: 75 }
];
```

## Location Data

### States with Major Cities
```typescript
const LOCATION_DATA = [
  {
    state: 'NSW',
    cities: ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Blue Mountains']
  },
  {
    state: 'VIC',
    cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton']
  },
  {
    state: 'QLD',
    cities: ['Brisbane', 'Gold Coast', 'Cairns', 'Townsville', 'Toowoomba']
  },
  {
    state: 'WA',
    cities: ['Perth', 'Fremantle', 'Bunbury', 'Geraldton', 'Kalgoorlie']
  },
  {
    state: 'SA',
    cities: ['Adelaide', 'Mount Gambier', 'Whyalla', 'Port Augusta', 'Murray Bridge']
  },
  {
    state: 'TAS',
    cities: ['Hobart', 'Launceston', 'Devonport', 'Burnie', 'Kingston']
  },
  {
    state: 'ACT',
    cities: ['Canberra', 'Gungahlin', 'Tuggeranong', 'Belconnen', 'Woden']
  },
  {
    state: 'NT',
    cities: ['Darwin', 'Alice Springs', 'Katherine', 'Nhulunbuy', 'Tennant Creek']
  }
];
```

## File Upload Configuration

### Supported File Types
```typescript
const FILE_TYPES = {
  resume: ['.pdf', '.doc', '.docx'],
  logo: ['.jpg', '.jpeg', '.png', '.svg'],
  portfolio: ['.pdf', '.jpg', '.jpeg', '.png']
};
```

### File Size Limits
```typescript
const FILE_LIMITS = {
  resume: 10 * 1024 * 1024,     // 10MB
  logo: 10 * 1024 * 1024,       // 10MB
  portfolio: 10 * 1024 * 1024   // 10MB
};
```

## JWT Token Structure
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: 'candidate' | 'employer' | 'admin';
  companyId?: string;
  iat: number;
  exp: number;
}
```

## API Response Format
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}
```

## Pagination Structure
```typescript
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

## Search Filters
```typescript
interface JobFilters {
  keyword?: string;
  industry?: string;
  location?: string;
  state?: string;
  workType?: string;
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
  featured?: boolean;
  urgent?: boolean;
}
```

## Analytics Data Structures

### Dashboard Statistics
```typescript
interface DashboardStats {
  totalJobs: number;
  totalApplications: number;
  totalCandidates: number;
  totalCompanies: number;
  recentActivity: {
    newJobs: number;
    newApplications: number;
    newCandidates: number;
  };
}
```

### Job Analytics
```typescript
interface JobAnalytics {
  views: number;
  applications: number;
  viewsByDay: { date: string; views: number }[];
  applicationsByDay: { date: string; applications: number }[];
  topSources: { source: string; count: number }[];
}
```

## Environment Variables
```typescript
interface EnvironmentConfig {
  PORT: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  NODE_ENV: 'development' | 'production';
  FRONTEND_URL: string;
}
```