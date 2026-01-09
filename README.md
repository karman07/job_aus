# CrossNations Backend API

A comprehensive TypeScript Express.js backend for the CrossNations job portal platform with role-based authentication, built with MongoDB and comprehensive validation.

## Features

- **Role-Based Authentication**: Secure JWT-based authentication for candidates, employers, and admins
- **Job Management**: Full CRUD operations for job postings with Australian-specific categories
- **Application Management**: Complete application handling with file uploads and status tracking
- **Candidate Profiles**: Comprehensive candidate profile management with skills and preferences
- **Company Profiles**: Employer company profile management with logo uploads
- **Advanced Search**: Job search with filtering, sorting, and AI-powered matching
- **Analytics Dashboard**: Comprehensive analytics for jobs, applications, and user activity
- **File Upload**: Resume and logo upload using Multer with validation
- **Notifications**: Real-time notification system for job matches and application updates
- **Contact System**: Contact inquiry management for support and sales

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: Helmet, CORS, bcryptjs

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/crossnations_backend
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
- `POST /api/auth/register` - User registration (candidate/employer)
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify-email/:token` - Verify email address

### User Profile Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

### Jobs (Public & Protected Routes)
- `GET /api/jobs` - Get all jobs (with pagination & filters)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (Employer only)
- `PUT /api/jobs/:id` - Update job (Employer only)
- `DELETE /api/jobs/:id` - Delete job (Employer only)
- `POST /api/jobs/:id/apply` - Apply for job (Candidate only)
- `GET /api/jobs/:id/applications` - Get job applications (Employer only)
- `PUT /api/jobs/:jobId/applications/:applicationId` - Update application status (Employer only)

### Candidate Profile & Applications
- `GET /api/candidates/profile` - Get candidate profile
- `PUT /api/candidates/profile` - Update candidate profile
- `POST /api/candidates/upload-resume` - Upload resume
- `GET /api/candidates/applications` - Get candidate applications
- `PUT /api/candidates/applications/:id` - Update application
- `GET /api/candidates/saved-jobs` - Get saved jobs
- `POST /api/candidates/saved-jobs` - Save job
- `DELETE /api/candidates/saved-jobs/:jobId` - Remove saved job

### Company Management
- `GET /api/companies/:id` - Get company details (Public)
- `PUT /api/companies/profile` - Update company profile (Employer only)
- `POST /api/companies/upload-logo` - Upload company logo (Employer only)
- `GET /api/companies/profile/jobs` - Get company jobs (Employer only)

### Search & Recommendations
- `GET /api/search/jobs` - Advanced job search with AI matching
- `GET /api/search/recommendations/jobs` - Get job recommendations (Candidate only)
- `GET /api/search/recommendations/candidates` - Get candidate recommendations (Employer only)

### Analytics & Statistics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/jobs/:id` - Get job analytics (Employer only)

### Data & Reference
- `GET /api/data/industries` - Get available industries
- `GET /api/data/locations` - Get available locations (Australian states/cities)
- `GET /api/data/skills` - Get popular skills by industry

### Notifications & Contact
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `POST /api/contact` - Submit contact inquiry
- `GET /api/contact/inquiries` - Get contact inquiries (Admin only)

## Database Schema

### User Roles
- **Candidate**: Job seekers with profiles and application history
- **Employer**: Company representatives who post jobs and manage applications
- **Admin**: Platform administrators with full access

### Australian Job Categories
- **Industries**: Health, Hospitality, Childcare, Construction, Mining, Technology
- **States**: NSW, VIC, QLD, WA, SA, TAS, ACT, NT
- **Job Types**: Full Time, Part Time, Contract, FIFO 2:1, FIFO 8:6
- **Work Types**: On-Site, Remote, Hybrid

### Key Models
- **User**: Authentication and basic profile information
- **CandidateProfile**: Detailed candidate information, skills, preferences
- **Company**: Employer company information and branding
- **Job**: Job postings with Australian-specific categories
- **JobApplication**: Application tracking with status management
- **SavedJob**: Candidate job bookmarking
- **Notification**: Real-time user notifications
- **ContactInquiry**: Support and sales inquiries

## Security Features

- JWT token-based authentication with refresh tokens
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation and sanitization
- File upload restrictions and validation
- CORS configuration for frontend integration
- Helmet security headers
- MongoDB injection protection

## File Upload Support

### Supported File Types
- **Resumes**: PDF, DOC, DOCX (max 10MB)
- **Company Logos**: JPG, PNG, SVG (max 10MB)
- **Portfolio Files**: PDF, JPG, PNG (max 10MB)

### File Storage
Files are stored in the `/uploads` directory with unique filenames to prevent conflicts.

## Australian Job Market Features

### Industry-Specific Categories
- Healthcare & Medical
- Hospitality & Tourism
- Childcare & Education
- Construction & Trades
- Mining & Resources (including FIFO roles)
- Technology & IT

### Location Support
- All Australian states and territories
- Major cities and regional areas
- FIFO (Fly-In-Fly-Out) job support

### Visa Status Tracking
- Australian Citizen
- Permanent Resident
- Visa Holder
- Needs Sponsorship

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run type-check` - Check TypeScript types
- `npm start` - Start production server

## Environment Variables

- `PORT` - Server port (default: 3001)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "message": "Response message",
  "data": {
    // Response data
  },
  "errors": ["Validation errors"] // Only on error responses
}
```

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Future Enhancements

- AI-powered job matching algorithm
- Real-time chat between employers and candidates
- Video interview scheduling
- Advanced analytics and reporting
- Mobile app API support
- Integration with external job boards
- Automated email notifications
- Payment processing for premium features