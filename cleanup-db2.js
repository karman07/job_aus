import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropMoreIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('candidateprofiles');

    // Drop the preferredLocation index
    try {
      await collection.dropIndex('preferredLocation_1');
      console.log('✅ Dropped preferredLocation_1 index');
    } catch (error) {
      console.log('ℹ️ preferredLocation_1 index does not exist or already dropped');
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

dropMoreIndexes();