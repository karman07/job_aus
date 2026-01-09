import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropOldIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('candidateprofiles');

    // Drop the old userId index
    try {
      await collection.dropIndex('userId_1');
      console.log('✅ Dropped userId_1 index');
    } catch (error) {
      console.log('ℹ️ userId_1 index does not exist or already dropped');
    }

    // List current indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    await mongoose.disconnect();
    console.log('✅ Database cleanup completed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

dropOldIndexes();