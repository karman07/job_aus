# Authentication Flow & Schema Changes

## Authentication Flow Updates

### 1. Dual Authentication System
```http
# Traditional Email/Password
POST /api/auth/register
POST /api/auth/login

# Google OAuth
POST /api/auth/google
```

### 2. Google OAuth Flow
```javascript
// Frontend sends Google ID token
POST /api/auth/google
{
  "token": "google_id_token",
  "role": "candidate|employer",
  "additionalData": { /* role-specific data */ }
}

// Backend verifies with Google & creates/finds user
// Returns JWT tokens + user data
```

### 3. JWT Token Generation
```typescript
// Updated to support additional fields
generateTokens(userId, email?, role?)

// Admin tokens include email + role
// Regular tokens include userId only
```

---

## Database Schema Changes

### User Model Updates
```typescript
interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;                    // 'google_oauth' for OAuth users
  phone?: string;
  role: 'candidate' | 'employer' | 'admin';
  isEmailVerified: boolean;
  
  // NEW FIELDS
  googleId?: string;                   // Google OAuth ID
  authProvider: 'email' | 'google';    // Authentication method
  
  // ... existing fields
}
```

### Password Handling Updates
```typescript
// Pre-save middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  // Skip hashing for Google OAuth users
  if (this.password === 'google_oauth') {
    this.authProvider = 'google';
    return next();
  }
  
  // Hash regular passwords
  this.password = await bcrypt.hash(this.password, 10);
  this.authProvider = 'email';
  next();
});

// Password comparison
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  // Google OAuth users can't use password login
  if (this.authProvider === 'google') return false;
  return bcrypt.compare(candidatePassword, this.password);
};
```

### New Indexes Added
```javascript
// User Collection
userSchema.index({ email: 1 });        // Unique email lookup
userSchema.index({ role: 1 });         // Role-based queries
userSchema.index({ createdAt: -1 });   // Date sorting
userSchema.index({ googleId: 1 });     // Google OAuth lookup (sparse)
```

---

## Environment Variables
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=110662316422499968559
GOOGLE_PROJECT_ID=youtube-data-api-v3-468414
```

---

## Service Account Integration
- Uses Firebase service account from `youtube-data-api-v3-468414-firebase-adminsdk-fbsvc-eaa81bc7ec.json`
- Server-side Google ID token verification
- No client secret required for ID token validation