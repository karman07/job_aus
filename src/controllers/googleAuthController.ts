import { Request, Response } from 'express';
import admin from 'firebase-admin';
import User from '../models/User';
import CandidateProfile from '../models/CandidateProfile';
import Company from '../models/Company';
import { generateTokens } from '../utils/jwt';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
  };
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
}

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    const { token, googleToken, role, additionalData } = req.body;

    // Accept either 'token' or 'googleToken' field
    const idToken = token || googleToken;

    if (!idToken) {
      res.status(400).json({
        success: false,
        message: 'Google token is required'
      });
      return;
    }

    // Default role to 'candidate' if not provided
    const userRole = role || 'candidate';

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const { email, name, picture, email_verified } = decodedToken;
    const [given_name, ...lastNameParts] = (name || '').split(' ');
    const family_name = lastNameParts.join(' ') || given_name;

    if (!email || !given_name || !family_name) {
      res.status(400).json({
        success: false,
        message: 'Required user information not available from Google'
      });
      return;
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      // Create new user
      isNewUser = true;
      user = new User({
        email,
        firstName: given_name,
        lastName: family_name,
        password: 'google_oauth', // Placeholder password for OAuth users
        role: userRole,
        isEmailVerified: email_verified || false,
        googleId: decodedToken.uid
      });
      await user.save();
      console.log('✅ New Google user created:', user._id);
    } else {
      // Update existing user with Google ID if not present
      if (!user.googleId) {
        user.googleId = decodedToken.uid;
        await user.save();
      }
      console.log('✅ Existing user logged in via Google:', user._id);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(), 
      user.email, 
      user.role
    );

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    let profileData = null;

    // Create profile for new users
    if (isNewUser) {
      if (userRole === 'candidate') {
        const candidateProfile = new CandidateProfile({
          userId: user._id,
          fullName: `${given_name} ${family_name}`,
          email,
          profilePhoto: picture || '',
          // Set defaults or use additional data if provided
          location: additionalData?.location || '',
          state: additionalData?.state || 'NSW',
          currentRole: additionalData?.currentRole || '',
          yearsExperience: additionalData?.yearsExperience || '0-1',
          preferredIndustries: additionalData?.preferredIndustries || [],
          visaStatus: additionalData?.visaStatus || 'citizen',
          isOpenToWork: true
        });
        await candidateProfile.save();
        profileData = candidateProfile;
        console.log('✅ Candidate profile created for Google user');

      } else if (userRole === 'employer') {
        if (!additionalData?.company) {
          res.status(400).json({
            success: false,
            message: 'Company information is required for employer registration'
          });
          return;
        }

        const companyProfile = new Company({
          userId: user._id,
          name: additionalData.company.name,
          description: additionalData.company.description || '',
          website: additionalData.company.website || '',
          logo: picture || '',
          industry: additionalData.company.industry || ['technology'],
          location: additionalData.company.location,
          state: additionalData.company.state,
          contact: {
            email: additionalData.company.contact?.email || email,
            phone: additionalData.company.contact?.phone || ''
          },
          isVerified: false
        });
        await companyProfile.save();
        profileData = companyProfile;
        console.log('✅ Company profile created for Google user');
      }
    } else {
      // Get existing profile
      if (user.role === 'candidate') {
        profileData = await CandidateProfile.findOne({ userId: user._id });
      } else if (user.role === 'employer') {
        profileData = await Company.findOne({ userId: user._id });
      }
    }

    res.status(isNewUser ? 201 : 200).json({
      success: true,
      message: isNewUser ? 'Google registration successful' : 'Google login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          profilePhoto: picture
        },
        profile: profileData,
        tokens: {
          accessToken,
          refreshToken
        },
        isNewUser
      }
    });

  } catch (error: any) {
    console.error('💥 Google auth error:', error);
    
    if (error.message?.includes('Token used too early')) {
      res.status(400).json({
        success: false,
        message: 'Google token is not yet valid. Please try again.'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Authentication error'
    });
  }
};