# Job Backend API

A comprehensive TypeScript Express.js backend for job posting management with admin authentication, built with MongoDB and comprehensive validation.

## Features

- **Admin Authentication**: Secure JWT-based login/signup for admins only
- **Job Management**: Full CRUD operations for job postings
- **Application Management**: Complete application handling with file uploads
- **File Upload**: Resume upload using Multer with validation
- **Type Safety**: Full TypeScript implementation with strict typing
- **Validation**: Comprehensive input validation using express-validator
- **Security**: Helmet, CORS, rate limiting, and secure file handling
- **Database**: MongoDB with Mongoose ODM and proper indexing

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: Helmet, CORS, bcryptjs
- **Development**: ts-node-dev, nodemon

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job_backend
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Admin signup
- `POST /api/auth/login` - Admin login

### Jobs (Protected Routes)
- `POST /api/jobs` - Create job
- `GET /api/jobs` - Get all jobs (with pagination & filters)
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `POST /api/applications` - Submit application (with resume upload)
- `GET /api/applications` - Get all applications (Protected)
- `GET /api/applications/:id` - Get application by ID (Protected)
- `PUT /api/applications/:id` - Update application status (Protected)
- `DELETE /api/applications/:id` - Delete application (Protected)
- `GET /api/applications/job/:jobId` - Get applications for specific job (Protected)

## Request Examples

### Admin Signup
```json
POST /api/auth/signup
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "Admin123"
}
```

### Create Job
```json
POST /api/jobs
Authorization: Bearer <token>
{
  "title": "Senior Developer",
  "description": "We are looking for a senior developer...",
  "company": "Tech Corp",
  "location": "New York, NY",
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "type": "full-time",
  "requirements": ["5+ years experience", "React", "Node.js"],
  "benefits": ["Health insurance", "401k"],
  "applicationDeadline": "2024-12-31T23:59:59.000Z"
}
```

### Submit Application
```json
POST /api/applications
Content-Type: multipart/form-data

jobId: "job_id_here"
applicantName: "John Doe"
email: "john@example.com"
phone: "+1234567890"
experience: 5
skills: ["JavaScript", "React", "Node.js"]
coverLetter: "I am interested in this position..."
resume: [file upload]
```

## Database Schema

### Admin
- username (unique, 3-30 chars)
- email (unique, validated)
- password (hashed, min 6 chars)

### Job
- title, description, company, location
- salary (min, max, currency)
- type (full-time, part-time, contract, internship)
- requirements, benefits (arrays)
- status (active, inactive, closed)
- postedBy (Admin reference)
- applicationDeadline

### Application
- jobId (Job reference)
- applicantName, email, phone
- resume (file path)
- coverLetter, experience, skills
- status (pending, reviewed, shortlisted, rejected, hired)
- reviewedBy (Admin reference)
- appliedAt, reviewedAt, notes

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- File upload restrictions (PDF, DOC, DOCX only)
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet security headers
- MongoDB injection protection

## File Upload

- Supported formats: PDF, DOC, DOCX
- Maximum file size: 5MB
- Files stored in `/uploads` directory
- Unique filename generation to prevent conflicts

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed validation errors"]
}
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run type-check` - Check TypeScript types without compilation
- `npm start` - Start production server

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS