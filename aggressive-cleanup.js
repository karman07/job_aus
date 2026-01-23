const mongoose = require('mongoose');
require('dotenv').config();

const aggressiveCleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = mongoose.connection.db;
    console.log('Working on database:', db.databaseName);
    
    // Step 1: Check current state
    console.log('\n🔍 Step 1: Checking current state...');
    const indexes = await db.collection('users').indexes();
    console.log('Current indexes:', indexes.map(idx => `${idx.name}: ${JSON.stringify(idx.key)}`));
    
    // Step 2: Force drop ALL indexes except _id
    console.log('\n🗑️  Step 2: Dropping all custom indexes...');
    for (const index of indexes) {
      if (index.name !== '_id_') {
        try {
          await db.collection('users').dropIndex(index.name);
          console.log(`✅ Dropped ${index.name}`);
        } catch (error) {
          console.log(`❌ Failed to drop ${index.name}:`, error.message);
        }
      }
    }
    
    // Step 3: Remove username field from ALL documents
    console.log('\n🧹 Step 3: Cleaning user documents...');
    const usersCount = await db.collection('users').countDocuments();
    console.log(`Total users: ${usersCount}`);
    
    // Remove username field from all documents
    const updateResult = await db.collection('users').updateMany(
      {},
      { $unset: { username: "" } }
    );
    console.log(`✅ Processed ${updateResult.matchedCount} users, modified ${updateResult.modifiedCount}`);
    
    // Step 4: Recreate only the necessary indexes
    console.log('\n🔧 Step 4: Recreating proper indexes...');
    
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('✅ Created email index');
    } catch (error) {
      console.log('❌ Email index error:', error.message);
    }
    
    try {
      await db.collection('users').createIndex({ role: 1 });
      console.log('✅ Created role index');
    } catch (error) {
      console.log('❌ Role index error:', error.message);
    }
    
    try {
      await db.collection('users').createIndex({ createdAt: -1 });
      console.log('✅ Created createdAt index');
    } catch (error) {
      console.log('❌ CreatedAt index error:', error.message);
    }
    
    // Step 5: Final verification
    console.log('\n✅ Step 5: Final verification...');
    const finalIndexes = await db.collection('users').indexes();
    console.log('Final indexes:', finalIndexes.map(idx => `${idx.name}: ${JSON.stringify(idx.key)}`));
    
    // Check for any remaining username fields
    const usersWithUsername = await db.collection('users').find({ username: { $exists: true } }).limit(5).toArray();
    console.log(`Users with username field: ${usersWithUsername.length}`);
    
    console.log('\n🎉 Aggressive cleanup completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
};

aggressiveCleanup();