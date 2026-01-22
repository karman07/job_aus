const mongoose = require('mongoose');
require('dotenv').config();

const cleanupUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Check for users with username field
    const usersWithUsername = await db.collection('users').find({ username: { $exists: true } }).toArray();
    console.log(`Found ${usersWithUsername.length} users with username field`);
    
    if (usersWithUsername.length > 0) {
      console.log('Sample user with username:', usersWithUsername[0]);
      
      // Remove username field from all users
      const result = await db.collection('users').updateMany(
        { username: { $exists: true } },
        { $unset: { username: "" } }
      );
      console.log(`✅ Removed username field from ${result.modifiedCount} users`);
    }
    
    // Check for duplicate null username entries
    const nullUsernameUsers = await db.collection('users').find({ username: null }).toArray();
    console.log(`Found ${nullUsernameUsers.length} users with null username`);
    
    if (nullUsernameUsers.length > 1) {
      // Keep the first one, remove the rest
      const toRemove = nullUsernameUsers.slice(1);
      for (const user of toRemove) {
        await db.collection('users').deleteOne({ _id: user._id });
        console.log(`Removed duplicate user: ${user._id}`);
      }
    }
    
    // List all collections to check for other potential issues
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    console.log('✅ Database cleanup completed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    process.exit(1);
  }
};

cleanupUsers();