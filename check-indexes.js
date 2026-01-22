const mongoose = require('mongoose');
require('dotenv').config();

const checkAllIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collections = ['users', 'candidateprofiles', 'companies', 'jobs'];
    
    for (const collectionName of collections) {
      console.log(`\n📋 Checking ${collectionName} collection:`);
      
      try {
        const indexes = await db.collection(collectionName).indexes();
        console.log('Indexes:', indexes.map(idx => `${idx.name}: ${JSON.stringify(idx.key)}`));
        
        // Drop any username indexes
        for (const index of indexes) {
          if (index.name.includes('username')) {
            try {
              await db.collection(collectionName).dropIndex(index.name);
              console.log(`✅ Dropped ${index.name} from ${collectionName}`);
            } catch (error) {
              console.log(`ℹ️  Could not drop ${index.name}: ${error.message}`);
            }
          }
        }
      } catch (error) {
        console.log(`❌ Error checking ${collectionName}:`, error.message);
      }
    }
    
    console.log('\\n✅ Index check completed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkAllIndexes();