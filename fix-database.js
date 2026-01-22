const mongoose = require('mongoose');
require('dotenv').config();

const fixDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Check existing indexes on users collection
    const indexes = await db.collection('users').indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));
    
    // Drop the problematic username index if it exists
    try {
      await db.collection('users').dropIndex('username_1');
      console.log('✅ Dropped username_1 index');
    } catch (error) {
      console.log('ℹ️  username_1 index does not exist or already dropped');
    }
    
    // Ensure email index exists
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('✅ Created email index');
    } catch (error) {
      console.log('ℹ️  Email index already exists');
    }
    
    console.log('✅ Database indexes fixed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    process.exit(1);
  }
};

fixDatabase();