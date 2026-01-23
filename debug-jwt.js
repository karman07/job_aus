const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTYwY2I4YjBmMjYzMzEzNGI4YjUzN2YiLCJlbWFpbCI6ImFkbWluQGNyb3NzbmF0aW9ucy5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjkwODk0MzIsImV4cCI6MTc2OTE3NTgzMn0.tD_XTfp5FaKzQ4NaU59NTMzgPmrKQP5T7mYOnT1iL7I';

console.log('JWT_SECRET from env:', process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET from env:', process.env.JWT_REFRESH_SECRET);

// Try different secrets
const secrets = [
  process.env.JWT_SECRET,
  process.env.JWT_REFRESH_SECRET,
  'fallback_secret',
  'fallback_refresh_secret'
];

secrets.forEach((secret, index) => {
  try {
    const verified = jwt.verify(token, secret);
    console.log(`✅ Secret ${index + 1} (${secret?.substring(0, 10)}...) WORKS:`, verified);
  } catch (error) {
    console.log(`❌ Secret ${index + 1} (${secret?.substring(0, 10)}...) failed:`, error.message);
  }
});

// Also try to decode without verification to see the payload
const decoded = jwt.decode(token, { complete: true });
console.log('\nToken header:', decoded.header);
console.log('Token payload:', decoded.payload);