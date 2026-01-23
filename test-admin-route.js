const axios = require('axios');

const testAdminRoute = async () => {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTYwY2I4YjBmMjYzMzEzNGI4YjUzN2YiLCJlbWFpbCI6ImFkbWluQGNyb3NzbmF0aW9ucy5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjkwODg3MDUsImV4cCI6MTc2OTE3NTEwNX0.T-gEzECplN_h7K1P7aD3ZMqZIQiNqfLn262UTcsn5OI';
    
    console.log('Testing admin route...');
    
    const response = await axios.get('http://localhost:3001/api/jobs/admin/all?page=1&limit=10', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Success!');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
  } catch (error) {
    console.log('❌ Error:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Headers:', error.response.headers);
      console.log('Data:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('Server is not running');
    } else {
      console.log('Error:', error.message);
    }
  }
};

testAdminRoute();