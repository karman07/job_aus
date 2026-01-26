import { Request, Response } from 'express';
import admin from 'firebase-admin';
import User from '../models/User';
import CandidateProfile from '../models/CandidateProfile';
import Company from '../models/Company';
import { generateTokens } from '../utils/jwt';
import path from 'path';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(path.join(__dirname, '../../youtube-data-api-v3-468414-firebase-adminsdk-fbsvc-eaa81bc7ec.json'))
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

    if (!user) {
      // User not registered - return error
      res.status(400).json({
        success: false,
        message: 'User not registered. Please register first before using Google login.',
        code: 'USER_NOT_REGISTERED'
      });
      return;
    }

    // Update existing user with Google ID if not present
    if (!user.googleId) {
      user.googleId = decodedToken.uid;
      await user.save();
    }
    console.log('✅ Existing user logged in via Google:', user._id);

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

    // Get existing profile
    if (user.role === 'candidate') {
      profileData = await CandidateProfile.findOne({ userId: user._id });
    } else if (user.role === 'employer') {
      profileData = await Company.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      message: 'Google login successful',
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
        isNewUser: false
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