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

// General file filter for job content
const jobContentFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const imageTypes = ['.jpg', '.jpeg', '.png', '.svg'];
  const markdownTypes = ['.md', '.markdown'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (imageTypes.includes(fileExt) || markdownTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, SVG) and markdown files (MD) are allowed'));
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