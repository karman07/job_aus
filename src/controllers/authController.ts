import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import CandidateProfile from '../models/CandidateProfile';
import Company from '../models/Company';
import { generateTokens, verifyRefreshToken, generateEmailVerificationToken } from '../utils/jwt';
import { AuthRequest } from '../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    console.log('🔍 Registration request received:', {
      body: req.body,
      files: req.files ? Object.keys(req.files) : 'no files'
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg)
      });
      return;
    }

    const { email, firstName, lastName, password, role, phone, company, candidate, googleAuth } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    console.log('📝 Parsed data:', { email, firstName, lastName, role, phone, googleAuth, company: !!company, candidate: !!candidate });

    // Handle Google OAuth registration
    if (googleAuth === 'true' || googleAuth === true) {
      console.log('🔐 Google OAuth registration detected');
      
      // For Google OAuth, set a placeholder password
      const userPassword = 'google_oauth';
      
      // Check if user exists
      const existingUser = await User.findOne({ email }).lean().select('_id');
      if (existingUser) {
        console.log('❌ User already exists:', email);
        res.status(400).json({
          success: false,
          message: 'User already exists with this email address'
        });
        return;
      }

      // Create Google OAuth user
      const user = new User({
        email,
        firstName,
        lastName,
        password: userPassword,
        role,
        phone,
        isEmailVerified: true, // Google users are auto-verified
        authProvider: 'google'
      });

      await user.save();
      console.log('✅ Google OAuth user created:', user._id);

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

      // Create profile based on role
      if (role === 'candidate') {
        console.log('👨💼 Creating candidate profile for Google user...');
        const profilePhoto = files?.profilePhoto?.[0] ? `/uploads/${files.profilePhoto[0].filename}` : '';
        const resumeUrl = files?.resume?.[0] ? `/uploads/${files.resume[0].filename}` : '';

        const candidateProfile = new CandidateProfile({
          userId: user._id,
          fullName: candidate?.fullName || `${firstName} ${lastName}`,
          email,
          phone,
          location: candidate?.location || '',
          state: candidate?.state || 'NSW',
          preferredRole: candidate?.preferredRole || '',
          profilePhoto: profilePhoto,
          currentRole: candidate?.currentRole || '',
          currentCompany: candidate?.currentCompany || '',
          yearsExperience: candidate?.yearsExperience || '0-1',
          skills: candidate?.skills || '',
          education: candidate?.education || '',
          preferredIndustries: Array.isArray(candidate?.preferredIndustries) 
            ? candidate.preferredIndustries 
            : (candidate?.preferredIndustries ? [candidate.preferredIndustries] : []),
          salaryExpectation: candidate?.salaryExpectation ? Number(candidate.salaryExpectation) : null,
          availableFrom: candidate?.availableFrom ? new Date(candidate.availableFrom) : null,
          visaStatus: candidate?.visaStatus || 'citizen',
          resumeUrl: resumeUrl,
          portfolioUrl: candidate?.portfolioUrl || '',
          linkedinUrl: candidate?.linkedinUrl || '',
          isOpenToWork: candidate?.isOpenToWork === 'true' || candidate?.isOpenToWork === true
        });
        await candidateProfile.save();
        profileData = candidateProfile;
        console.log('✅ Candidate profile created for Google user');
      } else if (role === 'employer' && company) {
        console.log('🏢 Creating company profile for Google user...');
        const logoUrl = files?.logo?.[0] ? `/uploads/${files.logo[0].filename}` : '';

        // Handle multiple industry values
        let industries = [];
        if (company?.industry) {
          if (Array.isArray(company.industry)) {
            industries = company.industry;
          } else {
            industries = [company.industry];
          }
        }

        const companyProfile = new Company({
          userId: user._id,
          name: company.name || '',
          description: company.description || '',
          website: company.website || '',
          logo: logoUrl,
          size: company.size || '',
          founded: company.founded ? Number(company.founded) : null,
          industry: industries,
          location: company.location || '',
          state: company.state || 'NSW',
          contact: {
            email: company.contact?.email || email,
            phone: company.contact?.phone || phone || ''
          },
          isVerified: false
        });
        await companyProfile.save();
        profileData = companyProfile;
        console.log('✅ Company profile created for Google user');
      }

      console.log('🎉 Google OAuth registration successful');
      res.status(201).json({
        success: true,
        message: 'Google OAuth registration successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            phone: user.phone,
            authProvider: 'google'
          },
          profile: profileData ? {
            id: profileData._id,
            userId: profileData.userId,
            ...(role === 'candidate' && 'fullName' in profileData ? {
              fullName: profileData.fullName,
              email: profileData.email,
              phone: profileData.phone,
              location: profileData.location,
              state: profileData.state,
              preferredRole: profileData.preferredRole,
              currentRole: profileData.currentRole,
              currentCompany: profileData.currentCompany,
              yearsExperience: profileData.yearsExperience,
              skills: profileData.skills,
              education: profileData.education,
              preferredIndustries: profileData.preferredIndustries,
              salaryExpectation: profileData.salaryExpectation,
              visaStatus: profileData.visaStatus,
              isOpenToWork: profileData.isOpenToWork,
              profilePhoto: profileData.profilePhoto,
              resumeUrl: profileData.resumeUrl,
              portfolioUrl: profileData.portfolioUrl,
              linkedinUrl: profileData.linkedinUrl
            } : role === 'employer' && 'name' in profileData ? {
              name: profileData.name,
              description: profileData.description,
              website: profileData.website,
              logo: profileData.logo,
              size: profileData.size,
              founded: profileData.founded,
              industry: profileData.industry,
              location: profileData.location,
              state: profileData.state,
              contact: profileData.contact,
              isVerified: profileData.isVerified
            } : {}),
            createdAt: profileData.createdAt,
            updatedAt: profileData.updatedAt
          } : null,
          tokens: {
            accessToken,
            refreshToken
          },
          registrationComplete: !!profileData,
          nextStep: role === 'employer' && !profileData ? 'complete-company-profile' : 'dashboard',
          profileType: role === 'candidate' ? 'candidate' : 'company'
        }
      });
      return;
    }

    // Regular email/password registration continues here
    if (!password) {
      res.status(400).json({
        success: false,
        message: 'Password is required for email registration'
      });
      return;
    }

    // Early email validation and existence check (with lean query for better performance)
    const existingUser = await User.findOne({ email }).lean().select('_id');
    if (existingUser) {
      console.log('❌ User already exists:', email);
      res.status(400).json({
        success: false,
        message: 'User already exists with this email address'
      });
      return;
    }

    // Validate company data for employers (optional now)
    if (role === 'employer' && company) {
      console.log('🏢 Validating employer data:', company);
      
      // Handle multiple industry values from form data
      let industries = [];
      if (company?.industry) {
        if (Array.isArray(company.industry)) {
          industries = company.industry;
        } else {
          industries = [company.industry];
        }
      }
      
      console.log('🏭 Processed industries:', industries);
      
      // Update company object with processed industries
      if (industries.length > 0) {
        company.industry = industries;
      }
    }

    console.log('👤 Creating user...');
    // Generate email verification token
    const emailVerificationToken = generateEmailVerificationToken();

    // Create user
    const user = new User({
      email,
      firstName,
      lastName,
      password,
      role,
      phone,
      emailVerificationToken
    });

    // Save user first
    await user.save();
    console.log('✅ User created:', user._id);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    
    let profileData = null;

    try {
      // Create profile based on role (in parallel with token update)
      const profilePromise = (async () => {
        if (role === 'candidate') {
          console.log('👨💼 Creating candidate profile...');
          // Handle file uploads for candidate
          const profilePhoto = files?.profilePhoto?.[0] ? `/uploads/${files.profilePhoto[0].filename}` : '';
          const resumeUrl = files?.resume?.[0] ? `/uploads/${files.resume[0].filename}` : '';
          const coverLetterUrl = files?.coverLetter?.[0] ? `/uploads/${files.coverLetter[0].filename}` : '';
          const certificatesUrls = files?.certificates?.map(file => `/uploads/${file.filename}`) || [];

          const candidateProfile = new CandidateProfile({
            userId: user._id,
            fullName: candidate?.fullName || `${firstName} ${lastName}`,
            email,
            phone,
            location: candidate?.location || '',
            state: candidate?.state,
            preferredRole: candidate?.preferredRole || '',
            profilePhoto: profilePhoto,
            currentRole: candidate?.currentRole || '',
            currentCompany: candidate?.currentCompany || '',
            yearsExperience: candidate?.yearsExperience || '0-1',
            skills: candidate?.skills || '',
            education: candidate?.education || '',
            preferredIndustries: Array.isArray(candidate?.preferredIndustries) 
              ? candidate.preferredIndustries 
              : (candidate?.preferredIndustries ? [candidate.preferredIndustries] : []),
            salaryExpectation: candidate?.salaryExpectation ? Number(candidate.salaryExpectation) : null,
            availableFrom: candidate?.availableFrom ? new Date(candidate.availableFrom) : null,
            visaStatus: candidate?.visaStatus || 'citizen',
            resumeUrl: resumeUrl,
            portfolioUrl: candidate?.portfolioUrl || '',
            linkedinUrl: candidate?.linkedinUrl || '',
            coverLetterUrl: coverLetterUrl,
            certificatesUrls: certificatesUrls,
            isOpenToWork: candidate?.isOpenToWork === 'true' || candidate?.isOpenToWork === true
          });
          await candidateProfile.save();
          console.log('✅ Candidate profile created');
          return candidateProfile;
        } else if (role === 'employer') {
          console.log('🏢 Creating company profile...');
          // Handle logo upload for employer
          const logoUrl = files?.logo?.[0] ? `/uploads/${files.logo[0].filename}` : '';

          const companyData = {
            userId: user._id,
            name: company?.name || '',
            description: company?.description || '',
            website: company?.website || '',
            logo: logoUrl,
            size: company?.size || '',
            founded: company?.founded ? Number(company.founded) : null,
            industry: company?.industry ? (Array.isArray(company.industry) ? company.industry : [company.industry]) : [],
            location: company?.location || '',
            state: company?.state || null,
            contact: {
              email: company?.contact?.email || email,
              phone: company?.contact?.phone || phone || ''
            },
            isVerified: false
          };
          
          console.log('🏢 Company data to save:', companyData);
          
          // Create complete company profile with all provided data
          const companyProfile = new Company(companyData);
          await companyProfile.save();
          
          console.log(`✅ Company profile created for employer ${user._id}:`, {
            name: companyProfile.name,
            location: companyProfile.location,
            state: companyProfile.state,
            industry: companyProfile.industry
          });
          return companyProfile;
        }
        return null;
      })();

      // Update user with refresh token in parallel
      const tokenUpdatePromise = (async () => {
        user.refreshToken = refreshToken;
        await user.save();
      })();

      // Wait for both operations to complete
      const [profile] = await Promise.all([profilePromise, tokenUpdatePromise]);
      profileData = profile;

    } catch (profileError: any) {
      // If profile creation fails, clean up the user
      console.error('💥 Profile creation failed, cleaning up user:', profileError.message);
      await User.findByIdAndDelete(user._id);
      
      // Handle profile validation errors
      if (profileError.name === 'ValidationError') {
        const validationErrors = Object.values(profileError.errors).map((err: any) => err.message);
        res.status(400).json({
          success: false,
          message: 'Profile validation failed',
          errors: validationErrors
        });
        return;
      }
      
      throw profileError;
    }

    console.log('🎉 Registration successful');
    const totalTime = Date.now() - startTime;
    console.log(`⏱️ Total registration time: ${totalTime}ms`);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          phone: user.phone,
          authProvider: user.authProvider || 'email'
        },
        profile: profileData ? {
          id: profileData._id,
          userId: profileData.userId,
          ...(role === 'candidate' && 'fullName' in profileData ? {
            fullName: profileData.fullName,
            email: profileData.email,
            phone: profileData.phone,
            location: profileData.location,
            state: profileData.state,
            preferredRole: profileData.preferredRole,
            currentRole: profileData.currentRole,
            currentCompany: profileData.currentCompany,
            yearsExperience: profileData.yearsExperience,
            skills: profileData.skills,
            education: profileData.education,
            preferredIndustries: profileData.preferredIndustries,
            salaryExpectation: profileData.salaryExpectation,
            visaStatus: profileData.visaStatus,
            isOpenToWork: profileData.isOpenToWork,
            profilePhoto: profileData.profilePhoto,
            resumeUrl: profileData.resumeUrl,
            portfolioUrl: profileData.portfolioUrl,
            linkedinUrl: profileData.linkedinUrl
          } : role === 'employer' && 'name' in profileData ? {
            name: profileData.name,
            description: profileData.description,
            website: profileData.website,
            logo: profileData.logo,
            size: profileData.size,
            founded: profileData.founded,
            industry: profileData.industry,
            location: profileData.location,
            state: profileData.state,
            contact: profileData.contact,
            isVerified: profileData.isVerified
          } : {}),
          createdAt: profileData.createdAt,
          updatedAt: profileData.updatedAt
        } : null,
        tokens: {
          accessToken,
          refreshToken
        },
        registrationComplete: !!profileData,
        nextStep: role === 'employer' && !profileData ? 'complete-company-profile' : 'dashboard',
        profileType: role === 'candidate' ? 'candidate' : 'company'
      }
    });
  } catch (error: any) {
    console.error('💥 Registration error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Database validation failed',
        errors: validationErrors,
        details: error.message
      });
      return;
    }
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      console.log('🔍 Duplicate key error details:', {
        message: error.message,
        keyPattern: error.keyPattern,
        keyValue: error.keyValue
      });
      
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      let message = 'This record already exists';
      
      if (field === 'email') {
        message = 'User already exists with this email address';
      } else if (field === 'userId') {
        message = 'Profile already exists for this user';
      } else if (field === 'username') {
        message = 'User already exists with this email address'; // Treat username as email
      }
      
      res.status(400).json({
        success: false,
        message: message,
        error: `Duplicate ${field}`
      });
      return;
    }
    
    // Handle Multer file upload errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'File too large',
        error: 'Maximum file size is 10MB'
      });
      return;
    }
    
    if (error.message && error.message.includes('files are allowed')) {
      res.status(400).json({
        success: false,
        message: 'Invalid file type',
        error: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array().map(err => err.msg)
      });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

export const refreshTokenHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken) as any;
    
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id.toString());
    
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      data: {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken
        }
      }
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
      error: error.message
    });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: error.message
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    let profileData = null;
    
    if (user.role === 'candidate') {
      profileData = await CandidateProfile.findOne({ userId: user._id });
    } else if (user.role === 'employer') {
      profileData = await Company.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          phone: user.phone
        },
        profile: profileData
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};