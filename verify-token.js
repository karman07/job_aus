const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTYwY2I4YjBmMjYzMzEzNGI4YjUzN2YiLCJlbWFpbCI6ImFkbWluQGNyb3NzbmF0aW9ucy5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjkwODg3MDUsImV4cCI6MTc2OTE3NTEwNX0.T-gEzECplN_h7K1P7aD3ZMqZIQiNqfLn262UTcsn5OI';

try {
  // Decode without verification first
  const decoded = jwt.decode(token);
  console.log('Decoded token:', decoded);
  
  // Check if token is expired
  const now = Math.floor(Date.now() / 1000);
  console.log('Current time:', now);
  console.log('Token expires:', decoded.exp);
  console.log('Is expired:', now > decoded.exp);
  
  // Try to verify with JWT secret
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', verified);
  } catch (verifyError) {
    console.log('Token verification failed:', verifyError.message);
  }
  
} catch (error) {
  console.log('Error decoding token:', error.message);
}