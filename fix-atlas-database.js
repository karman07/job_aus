const mongoose = require('mongoose');
require('dotenv').config();

const fixAtlasDatabase = async () => {
  try {
    // Connect to the specific database (add database name to URI)
    const mongoUri = process.env.MONGODB_URI + 'crossnations_backend';
    console.log('Connecting to Atlas database...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = mongoose.connection.db;
    console.log('Database name:', db.databaseName);
    
    // Check existing indexes on users collection
    const indexes = await db.collection('users').indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));
    
    // Drop the problematic username index if it exists
    try {
      await db.collection('users').dropIndex('username_1');
      console.log('✅ Dropped username_1 index from Atlas database');
    } catch (error) {
      console.log('ℹ️  username_1 index does not exist:', error.message);
    }
    
    // Check for users with username field or null username
    const usersWithUsername = await db.collection('users').find({ 
      $or: [
        { username: { $exists: true } },
        { username: null }
      ]
    }).toArray();
    
    console.log(`Found ${usersWithUsername.length} users with username issues`);
    
    if (usersWithUsername.length > 0) {
      // Remove username field from all users
      const result = await db.collection('users').updateMany(
        { username: { $exists: true } },
        { $unset: { username: "" } }
      );
      console.log(`✅ Removed username field from ${result.modifiedCount} users`);
    }
    
    // Ensure email index exists and is unique
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('✅ Ensured email index exists');
    } catch (error) {
      console.log('ℹ️  Email index already exists');
    }
    
    console.log('✅ Atlas database fixed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error fixing Atlas database:', error);
    process.exit(1);
  }
};

fixAtlasDatabase();