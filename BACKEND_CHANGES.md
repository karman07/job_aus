# Backend Changes Required for PDF/Image Viewing

## 1. Add CORS Headers for File Serving

Add these headers to your file serving endpoint:

```javascript
// In your Express.js backend
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Frame-Options', 'SAMEORIGIN'); // Allow framing from same origin
  next();
}, express.static('uploads'));
```

## 2. Add Content-Type Detection

```javascript
const path = require('path');
const mime = require('mime-types');

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  // Set proper content type
  const mimeType = mime.lookup(filePath);
  res.setHeader('Content-Type', mimeType || 'application/octet-stream');
  
  // Allow embedding in iframe
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' http://localhost:3000");
  
  res.sendFile(filePath);
});
```

## 3. Add File Type to API Response

Update your application model to include file type:

```javascript
// In your application schema
const applicationSchema = {
  // ... other fields
  resume: String,
  resumeType: String, // 'pdf', 'image', etc.
  // ... other fields
};

// When saving file, detect type
const fileExtension = path.extname(file.originalname).toLowerCase();
const resumeType = ['.pdf'].includes(fileExtension) ? 'pdf' : 
                  ['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension) ? 'image' : 'other';

application.resumeType = resumeType;
```

## 4. Install Required Dependencies

```bash
npm install mime-types
```

## 5. Alternative: Use Object URLs (Frontend Only)

If backend changes are not possible, you can fetch the file as blob:

```javascript
// Fetch file as blob and create object URL
const response = await fetch(fileUrl);
const blob = await response.blob();
const objectUrl = URL.createObjectURL(blob);
```

This approach bypasses CSP restrictions but requires additional memory management.