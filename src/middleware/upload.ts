import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for resumes
const resumeFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed for resumes'));
  }
};

// File filter for logos and images
const imageFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.svg'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and SVG files are allowed for images'));
  }
};

// File filter for markdown files
const markdownFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['.md', '.markdown'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Only MD and MARKDOWN files are allowed'));
  }
};

// General file filter for job content (PDF, MD, and images for logo)
const jobContentFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const imageTypes = ['.jpg', '.jpeg', '.png', '.svg'];
  const markdownTypes = ['.md', '.markdown'];
  const pdfTypes = ['.pdf'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  // Allow images for logo field, PDF and MD for contentFile field
  if (file.fieldname === 'logo' && imageTypes.includes(fileExt)) {
    cb(null, true);
  } else if (file.fieldname === 'contentFile' && (markdownTypes.includes(fileExt) || pdfTypes.includes(fileExt))) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Logo accepts images (JPG, PNG, SVG), contentFile accepts PDF and MD files`));
  }
};

// Resume upload configuration
export const resumeUpload = multer({
  storage: storage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Logo upload configuration
export const logoUpload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Job content upload (images and markdown)
export const jobContentUpload = multer({
  storage: storage,
  fileFilter: jobContentFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Markdown upload configuration
export const markdownUpload = multer({
  storage: storage,
  fileFilter: markdownFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Registration upload configuration (handles multiple file types)
const registrationFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const imageTypes = ['.jpg', '.jpeg', '.png', '.svg'];
  const documentTypes = ['.pdf', '.doc', '.docx'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (['profilePhoto', 'logo'].includes(file.fieldname) && imageTypes.includes(fileExt)) {
    cb(null, true);
  } else if (['resume', 'coverLetter', 'certificates'].includes(file.fieldname) && documentTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Images (JPG, PNG, SVG) for profilePhoto/logo, PDF/DOC/DOCX for documents`));
  }
};

export const registrationUpload = multer({
  storage: storage,
  fileFilter: registrationFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware to parse nested form data
export const parseNestedFormData = (req: any, res: any, next: any) => {
  if (req.body) {
    // Parse company nested fields
    const company: any = {};
    const candidate: any = {};
    
    Object.keys(req.body).forEach(key => {
      if (key.startsWith('company.')) {
        const nestedKey = key.replace('company.', '');
        if (nestedKey.includes('.')) {
          const [parentKey, childKey] = nestedKey.split('.');
          if (!company[parentKey]) company[parentKey] = {};
          company[parentKey][childKey] = req.body[key];
        } else {
          company[nestedKey] = req.body[key];
        }
        delete req.body[key];
      } else if (key.startsWith('candidate.')) {
        const nestedKey = key.replace('candidate.', '');
        candidate[nestedKey] = req.body[key];
        delete req.body[key];
      }
    });
    
    if (Object.keys(company).length > 0) {
      req.body.company = company;
    }
    if (Object.keys(candidate).length > 0) {
      req.body.candidate = candidate;
    }
  }
  next();
};