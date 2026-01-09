# Frontend Implementation Guide - Candidate Profile Management

## Overview
Frontend logic to manage candidate profiles using localStorage and conditional rendering based on profile completion status.

## LocalStorage Management

### Key Storage Structure
```javascript
// Store candidate profile data
localStorage.setItem('candidateProfile', JSON.stringify({
  _id: "candidate_id_from_api",
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+61234567890",
  location: "Sydney, NSW",
  currentRole: "Developer",
  yearsExperience: "3-5",
  // ... other profile fields
}));

// Store profile completion status
localStorage.setItem('profileCompleted', 'true');
```

## Page Flow Logic

### 1. Initial Page Load Check
```javascript
// Check if profile exists and is completed
function checkProfileStatus() {
  const profileData = localStorage.getItem('candidateProfile');
  const isCompleted = localStorage.getItem('profileCompleted');
  
  if (profileData && isCompleted === 'true') {
    // Profile exists - show profile page or job listings
    showProfilePage();
  } else {
    // No profile - show candidate entry form
    showCandidateEntryForm();
  }
}
```

### 2. Candidate Entry Form (First Time Only)
```javascript
// Show this form only if no profile exists
function showCandidateEntryForm() {
  // Display candidate registration form
  // On successful submission:
  
  async function submitCandidateProfile(formData) {
    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store profile data and mark as completed
        localStorage.setItem('candidateProfile', JSON.stringify(result.data.candidate));
        localStorage.setItem('profileCompleted', 'true');
        
        // Redirect to profile page or job listings
        showProfilePage();
      }
    } catch (error) {
      console.error('Profile creation failed:', error);
    }
  }
}
```

### 3. Profile Page (Edit Mode)
```javascript
// Show profile page for editing existing data
function showProfilePage() {
  const profileData = JSON.parse(localStorage.getItem('candidateProfile'));
  
  // Pre-populate form with existing data
  populateProfileForm(profileData);
  
  // Handle profile updates
  async function updateProfile(updatedData) {
    try {
      const response = await fetch(`/api/candidates/${profileData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update localStorage with new data
        localStorage.setItem('candidateProfile', JSON.stringify(result.data.candidate));
        showSuccessMessage('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  }
}
```

### 4. Job Application (Apply Now Button)
```javascript
// When "Apply Now" is clicked on any job
function handleApplyNow(jobId) {
  const profileData = JSON.parse(localStorage.getItem('candidateProfile'));
  
  if (!profileData) {
    // No profile - redirect to create profile first
    showCandidateEntryForm();
    return;
  }
  
  // Profile exists - directly apply using stored data
  applyForJob(jobId, profileData);
}

async function applyForJob(jobId, candidateData) {
  const formData = new FormData();
  
  // Use data from localStorage
  formData.append('candidateId', candidateData._id);
  formData.append('jobId', jobId);
  formData.append('fullName', candidateData.fullName);
  formData.append('email', candidateData.email);
  formData.append('phone', candidateData.phone);
  formData.append('location', candidateData.location);
  formData.append('currentRole', candidateData.currentRole);
  formData.append('yearsExperience', candidateData.yearsExperience);
  formData.append('skills', candidateData.skills || '');
  formData.append('education', candidateData.education || '');
  
  // Add resume file (if user uploads new one or use existing)
  const resumeFile = document.getElementById('resume-upload').files[0];
  if (resumeFile) {
    formData.append('resume', resumeFile);
  }
  
  try {
    const response = await fetch('/api/applications', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      showSuccessMessage('Application submitted successfully!');
      // Optionally close modal or redirect
    }
  } catch (error) {
    console.error('Application failed:', error);
  }
}
```

## Component Structure

### App.js - Main Router Logic
```javascript
function App() {
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkProfileStatus();
  }, []);
  
  function checkProfileStatus() {
    const profileData = localStorage.getItem('candidateProfile');
    const isCompleted = localStorage.getItem('profileCompleted');
    
    setProfileExists(profileData && isCompleted === 'true');
    setLoading(false);
  }
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobListings />} />
        <Route path="/profile" element={
          profileExists ? <ProfilePage /> : <CandidateEntryForm />
        } />
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Routes>
    </Router>
  );
}
```

### CandidateEntryForm.js (First Time Only)
```javascript
function CandidateEntryForm() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('candidateProfile', JSON.stringify(result.data.candidate));
        localStorage.setItem('profileCompleted', 'true');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields for candidate data */}
      <button type="submit">Create Profile</button>
    </form>
  );
}
```

### ProfilePage.js (Edit Mode)
```javascript
function ProfilePage() {
  const [profileData, setProfileData] = useState({});
  
  useEffect(() => {
    const storedProfile = localStorage.getItem('candidateProfile');
    if (storedProfile) {
      setProfileData(JSON.parse(storedProfile));
    }
  }, []);
  
  const handleUpdate = async (updatedData) => {
    try {
      const response = await fetch(`/api/candidates/${profileData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('candidateProfile', JSON.stringify(result.data.candidate));
        setProfileData(result.data.candidate);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div>
      <h2>Edit Profile</h2>
      {/* Pre-populated form with profileData */}
      <button onClick={() => handleUpdate(formData)}>Update Profile</button>
    </div>
  );
}
```

### JobDetails.js (Apply Now Logic)
```javascript
function JobDetails({ jobId }) {
  const handleApplyNow = () => {
    const profileData = localStorage.getItem('candidateProfile');
    const isCompleted = localStorage.getItem('profileCompleted');
    
    if (!profileData || isCompleted !== 'true') {
      // Redirect to create profile
      navigate('/profile');
      return;
    }
    
    // Profile exists - show application modal or direct apply
    showApplicationModal(jobId);
  };
  
  const showApplicationModal = (jobId) => {
    const candidateData = JSON.parse(localStorage.getItem('candidateProfile'));
    
    // Show modal with pre-filled data from localStorage
    // Only allow resume upload, other fields are read-only
    // On submit, call application API directly
  };
  
  return (
    <div>
      <h1>Job Details</h1>
      <button onClick={handleApplyNow}>Apply Now</button>
    </div>
  );
}
```

## Key Implementation Points

### ✅ Do This:
1. **Check localStorage on app load** - Determine if profile exists
2. **Show entry form only once** - First time users only
3. **Pre-fill all forms** - Use localStorage data
4. **Direct API calls** - Apply Now uses stored candidate ID
5. **Update localStorage** - Keep data in sync with API

### ❌ Don't Do This:
1. **Don't show entry form again** - Once profile is created
2. **Don't ask for data twice** - Use stored information
3. **Don't make unnecessary API calls** - Cache profile data locally

## Data Flow Summary

```
1. App Load → Check localStorage
2. No Profile → Show Entry Form → Create Profile → Store Data
3. Profile Exists → Show Profile Page (Edit Mode)
4. Apply Now → Use Stored Data → Call Application API Only
5. Profile Updates → Update API → Update localStorage
```

This approach ensures users only enter their information once and can easily apply to jobs using their stored profile data.