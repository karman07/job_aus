import { sendJobApplicationNotification, sendApplicationConfirmation } from './services/emailService';

async function testEmailService() {
  console.log('🧪 Testing Email Service...');
  
  try {
    // Test job application notification
    await sendJobApplicationNotification(
      'Test Applicant',
      'test@example.com',
      'Software Developer',
      'Test Company Ltd',
      undefined, // No resume for test
      'hr@testcompany.com'
    );
    
    // Test application confirmation
    await sendApplicationConfirmation(
      'karmansingharora01@gmail.com',
      'Test Applicant',
      'Software Developer',
      'Test Company Ltd'
    );
    
    console.log('✅ Test emails queued successfully');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testEmailService();