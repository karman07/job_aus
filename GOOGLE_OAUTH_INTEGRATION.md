# Google OAuth Authentication Integration

## Overview
Complete Google OAuth integration for CrossNations job portal supporting both candidate and employer registration/login alongside traditional email/password authentication.

---

## Setup Requirements

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized domains and redirect URIs

### 2. Environment Variables
Add to your `.env` file:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 3. Install Dependencies
```bash
npm install google-auth-library
npm install @types/google-auth-library --save-dev
```

---

## API Endpoints

### Google OAuth Authentication
```http
POST /api/auth/google
Content-Type: application/json

{
  "token": "google_id_token_from_frontend",
  "role": "candidate", // or "employer"
  "additionalData": {
    // For candidates (optional)
    "location": "Sydney",
    "state": "NSW",
    "currentRole": "Software Developer",
    "yearsExperience": "3-5",
    "preferredIndustries": ["technology"],
    "visaStatus": "citizen",
    
    // For employers (required)
    "company": {
      "name": "Tech Solutions Pty Ltd",
      "description": "Leading technology company",
      "website": "https://techsolutions.com.au",
      "industry": ["technology", "health"],
      "location": "Sydney",
      "state": "NSW",
      "contact": {
        "email": "hr@techsolutions.com.au",
        "phone": "+61299000000"
      }
    }
  }
}
```

**Success Response (New User):**
```json
{
  "success": true,
  "message": "Google registration successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@gmail.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "candidate",
      "isEmailVerified": true,
      "profilePhoto": "https://lh3.googleusercontent.com/..."
    },
    "profile": {
      "_id": "profile_id",
      "userId": "user_id",
      "fullName": "John Doe",
      "email": "user@gmail.com",
      "profilePhoto": "https://lh3.googleusercontent.com/...",
      "location": "Sydney",
      "state": "NSW",
      "isOpenToWork": true
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    },
    "isNewUser": true
  }
}
```

**Success Response (Existing User):**
```json
{
  "success": true,
  "message": "Google login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@gmail.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "candidate",
      "isEmailVerified": true,
      "profilePhoto": "https://lh3.googleusercontent.com/..."
    },
    "profile": {
      // Existing profile data
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    },
    "isNewUser": false
  }
}
```

---

## Frontend Integration Examples

### React with Google OAuth

#### 1. Install Google OAuth Library
```bash
npm install @google-cloud/local-auth google-auth-library
# or for React
npm install react-google-login
```

#### 2. Google Login Component
```jsx
import { GoogleLogin } from 'react-google-login';

const GoogleAuthButton = ({ role, onSuccess, onError }) => {
  const handleGoogleSuccess = async (response) => {
    try {
      const result = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.tokenId,
          role: role, // 'candidate' or 'employer'
          additionalData: {
            // Add role-specific data here
            location: 'Sydney',
            state: 'NSW',
            // For employers, include company data
            company: role === 'employer' ? {
              name: 'Company Name',
              location: 'Sydney',
              state: 'NSW',
              industry: ['technology'],
              contact: {
                email: response.profileObj.email
              }
            } : undefined
          }
        }),
      });

      const data = await result.json();
      
      if (data.success) {
        // Store tokens
        localStorage.setItem('accessToken', data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
        
        onSuccess(data);
      } else {
        onError(data.message);
      }
    } catch (error) {
      onError('Google authentication failed');
    }
  };

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText={`Continue with Google as ${role}`}
      onSuccess={handleGoogleSuccess}
      onFailure={onError}
      cookiePolicy={'single_host_origin'}
      scope="profile email"
    />
  );
};

export default GoogleAuthButton;
```

#### 3. Usage in Registration/Login Forms
```jsx
const AuthPage = () => {
  const [selectedRole, setSelectedRole] = useState('candidate');

  const handleGoogleSuccess = (data) => {
    if (data.data.isNewUser) {
      // Redirect to profile completion if needed
      navigate('/complete-profile');
    } else {
      // Redirect to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div>
      <h2>Join CrossNations</h2>
      
      {/* Role Selection */}
      <div>
        <label>
          <input 
            type="radio" 
            value="candidate" 
            checked={selectedRole === 'candidate'}
            onChange={(e) => setSelectedRole(e.target.value)}
          />
          I'm looking for a job
        </label>
        <label>
          <input 
            type="radio" 
            value="employer" 
            checked={selectedRole === 'employer'}
            onChange={(e) => setSelectedRole(e.target.value)}
          />
          I'm hiring
        </label>
      </div>

      {/* Google OAuth Button */}
      <GoogleAuthButton 
        role={selectedRole}
        onSuccess={handleGoogleSuccess}
        onError={(error) => console.error(error)}
      />

      <div>--- OR ---</div>

      {/* Traditional Email/Password Form */}
      <EmailPasswordForm role={selectedRole} />
    </div>
  );
};
```

---

## Database Schema Updates

### User Model Changes
```typescript
interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;              // 'google_oauth' for OAuth users
  phone?: string;
  role: 'candidate' | 'employer' | 'admin';
  isEmailVerified: boolean;
  googleId?: string;             // Google OAuth ID
  authProvider: 'email' | 'google'; // Authentication method
  // ... other fields
}
```

### Profile Integration
- **Google Profile Photo**: Automatically set from Google account
- **Email Verification**: Auto-verified for Google users
- **Name Fields**: Pre-filled from Google profile
- **Additional Data**: Collected during registration flow

---

## Authentication Flow

### New User Registration Flow
1. **Frontend**: User clicks "Continue with Google"
2. **Google**: User authenticates with Google
3. **Frontend**: Receives Google ID token
4. **Backend**: Verifies token with Google
5. **Backend**: Creates new user account
6. **Backend**: Creates role-specific profile (candidate/employer)
7. **Backend**: Returns JWT tokens and user data
8. **Frontend**: Stores tokens and redirects user

### Existing User Login Flow
1. **Frontend**: User clicks "Continue with Google"
2. **Google**: User authenticates with Google
3. **Frontend**: Receives Google ID token
4. **Backend**: Verifies token with Google
5. **Backend**: Finds existing user by email
6. **Backend**: Updates Google ID if not present
7. **Backend**: Returns JWT tokens and user data
8. **Frontend**: Stores tokens and redirects user

---

## Security Features

### Token Verification
- **Google ID Token**: Verified server-side with Google's public keys
- **Audience Validation**: Ensures token is for your application
- **Issuer Validation**: Confirms token issued by Google
- **Expiration Check**: Validates token hasn't expired

### User Data Protection
- **Email Verification**: Google users are auto-verified
- **Profile Photos**: Stored as URLs, not uploaded files
- **Password Security**: OAuth users have placeholder passwords
- **Account Linking**: Prevents duplicate accounts with same email

---

## Error Handling

### Common Error Scenarios
```json
// Invalid Google Token
{
  "success": false,
  "message": "Invalid Google token"
}

// Missing Company Data for Employer
{
  "success": false,
  "message": "Company information is required for employer registration"
}

// Token Used Too Early
{
  "success": false,
  "message": "Google token is not yet valid. Please try again."
}

// Server Error
{
  "success": false,
  "message": "Google authentication failed",
  "error": "Authentication error"
}
```

---

## Testing

### Manual Testing
1. **Setup Google OAuth**: Configure client ID in Google Console
2. **Test Registration**: New user with Google account
3. **Test Login**: Existing user with Google account
4. **Test Role Selection**: Both candidate and employer flows
5. **Test Profile Creation**: Verify profiles are created correctly

### API Testing with Postman
```bash
# Get Google ID token from frontend first, then:
curl -X POST http://localhost:3001/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "token": "google_id_token_here",
    "role": "candidate",
    "additionalData": {
      "location": "Sydney",
      "state": "NSW"
    }
  }'
```

---

## Migration Guide

### For Existing Users
- **Email Match**: Existing users can link Google account by email
- **Profile Preservation**: Existing profiles remain unchanged
- **Authentication Choice**: Users can use either email/password or Google
- **Account Security**: No duplicate accounts created

### Database Migration
```javascript
// Optional: Add authProvider field to existing users
db.users.updateMany(
  { authProvider: { $exists: false } },
  { $set: { authProvider: 'email' } }
);
```

---

## Configuration

### Google Cloud Console Settings
```
Application Type: Web Application
Authorized JavaScript Origins: 
  - http://localhost:3000 (development)
  - https://yourdomain.com (production)

Authorized Redirect URIs:
  - http://localhost:3000/auth/callback (development)
  - https://yourdomain.com/auth/callback (production)
```

### Environment Configuration
```env
# Development
GOOGLE_CLIENT_ID=your_dev_client_id
GOOGLE_CLIENT_SECRET=your_dev_client_secret

# Production
GOOGLE_CLIENT_ID=your_prod_client_id
GOOGLE_CLIENT_SECRET=your_prod_client_secret
```

---

## Benefits

### User Experience
- **Faster Registration**: No need to fill lengthy forms
- **Password-less**: No password to remember
- **Auto-verification**: Email automatically verified
- **Profile Photos**: Automatic profile picture from Google

### Security
- **OAuth 2.0**: Industry-standard authentication
- **No Password Storage**: Reduced security risk
- **Google's Security**: Leverage Google's security infrastructure
- **Token-based**: Secure JWT token system

### Development
- **Reduced Complexity**: Less authentication code to maintain
- **Better Conversion**: Easier signup process
- **Social Integration**: Leverage existing Google accounts
- **Scalable**: Handles authentication at scale

---

This Google OAuth integration provides a seamless authentication experience while maintaining the flexibility of traditional email/password authentication for users who prefer it.