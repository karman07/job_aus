const mongoose = require('mongoose');
require('dotenv').config();

const checkAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Check if the admin user exists
    const adminUser = await db.collection('users').findOne({ 
      _id: new mongoose.Types.ObjectId('6960cb8b0f2633134b8b537f') 
    });
    
    if (adminUser) {
      console.log('Admin user found:');
      console.log('- ID:', adminUser._id);
      console.log('- Email:', adminUser.email);
      console.log('- Role:', adminUser.role);
      console.log('- First Name:', adminUser.firstName);
      console.log('- Last Name:', adminUser.lastName);
    } else {
      console.log('Admin user not found');
      
      // Check if any admin users exist
      const allAdmins = await db.collection('users').find({ role: 'admin' }).toArray();
      console.log('All admin users:', allAdmins.length);
      allAdmins.forEach(admin => {
        console.log(`- ${admin.email} (${admin._id})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAdminUser();