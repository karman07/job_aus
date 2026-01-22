const mongoose = require('mongoose');
require('dotenv').config();

const findCorrectDatabase = async () => {
  try {
    // Connect without specifying database name
    const mongoUri = process.env.MONGODB_URI;
    console.log('Connecting to Atlas...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');
    
    const adminDb = mongoose.connection.db.admin();
    
    // List all databases
    const databases = await adminDb.listDatabases();
    console.log('Available databases:');
    databases.databases.forEach(db => {
      console.log(`- ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    // Check the default database (test)
    const db = mongoose.connection.db;
    console.log('\nCurrent database:', db.databaseName);
    
    // List collections in current database
    const collections = await db.listCollections().toArray();
    console.log('Collections in current database:');
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });
    
    // Check if users collection exists and has the problematic index
    if (collections.some(col => col.name === 'users')) {
      console.log('\n🔍 Checking users collection indexes...');
      const indexes = await db.collection('users').indexes();
      console.log('Users collection indexes:', indexes.map(idx => idx.name));
      
      // Check for username index
      const hasUsernameIndex = indexes.some(idx => idx.name === 'username_1');
      if (hasUsernameIndex) {
        console.log('❌ Found problematic username_1 index!');
        
        // Drop it
        try {
          await db.collection('users').dropIndex('username_1');
          console.log('✅ Successfully dropped username_1 index');
        } catch (error) {
          console.log('❌ Failed to drop index:', error.message);
        }
      } else {
        console.log('✅ No username_1 index found');
      }
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

findCorrectDatabase();