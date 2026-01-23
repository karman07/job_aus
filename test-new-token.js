const jwt = require('jsonwebtoken');
require('dotenv').config();

const newToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTYwY2I4YjBmMjYzMzEzNGI4YjUzN2YiLCJlbWFpbCI6ImFkbWluQGNyb3NzbmF0aW9ucy5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjkwODk5MTIsImV4cCI6MTc2OTE3NjMxMn0.UFO_4K_DkIoWicQCPECwyjP51oP-oxGRtCdFd2AalK';

console.log('Testing new token...');

try {
  const verified = jwt.verify(newToken, process.env.JWT_SECRET);
  console.log('✅ Token verified successfully:', verified);
} catch (error) {
  console.log('❌ Token verification failed:', error.message);
}

// Decode to see the payload
const decoded = jwt.decode(newToken);
console.log('Token payload:', decoded);