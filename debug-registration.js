const axios = require('axios');

const testRegistration = async () => {
  const startTime = Date.now();
  
  try {
    const response = await axios.post('http://localhost:3001/api/auth/register', {
      email: `test${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      password: 'password123',
      role: 'candidate',
      phone: '+61400000000'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
    const endTime = Date.now();
    console.log(`✅ Registration successful in ${endTime - startTime}ms`);
    console.log('Response:', response.data);
    
  } catch (error) {
    const endTime = Date.now();
    console.log(`❌ Registration failed in ${endTime - startTime}ms`);
    
    if (error.response) {
      console.log('Error response:', error.response.data);
      console.log('Status:', error.response.status);
    } else if (error.request) {
      console.log('No response received:', error.message);
    } else {
      console.log('Error:', error.message);
    }
  }
};

console.log('🚀 Testing registration performance...');
testRegistration();