const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('🧪 Testing registration...');
    
    const testUser = {
      email: `test${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      password: 'password123',
      role: 'candidate',
      phone: '+61400000000'
    };
    
    console.log('📤 Sending registration request for:', testUser.email);
    
    const response = await axios.post('http://localhost:3001/api/auth/register', testUser, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Registration successful!');
    console.log('Response:', {
      success: response.data.success,
      message: response.data.message,
      userId: response.data.data?.user?.id
    });
    
  } catch (error) {
    console.log('❌ Registration failed');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running. Please start the server first.');
    } else {
      console.log('Error:', error.message);
    }
  }
};

// Test duplicate email
const testDuplicateEmail = async () => {
  try {
    console.log('\n🧪 Testing duplicate email...');
    
    const duplicateUser = {
      email: 'test@example.com', // Use a known email
      firstName: 'Duplicate',
      lastName: 'User',
      password: 'password123',
      role: 'candidate'
    };
    
    const response = await axios.post('http://localhost:3001/api/auth/register', duplicateUser, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('⚠️  Unexpected success for duplicate email');
    
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Correctly rejected duplicate email');
      console.log('Message:', error.response.data.message);
    } else {
      console.log('❌ Unexpected error:', error.response?.data || error.message);
    }
  }
};

const runTests = async () => {
  await testRegistration();
  await testDuplicateEmail();
  console.log('\n🎉 Tests completed!');
};

runTests();