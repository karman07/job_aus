import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import candidateRoutes from './routes/candidates';
import userRoutes from './routes/users';
import dataRoutes from './routes/data';
import uploadRoutes from './routes/upload';
import applicationRoutes from './routes/applications';
import adminRoutes from './routes/admin';
import companyRoutes from './routes/companies';
import testRoutes from './routes/test';
import { requestTimer, logSlowRequests } from './middleware/performance';

dotenv.config();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: '*', credentials: true }));

// Add performance monitoring middleware
if (process.env.NODE_ENV === 'development') {
  app.use(requestTimer);
  app.use(logSlowRequests(2000)); // Log requests taking more than 2 seconds
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add compression middleware for better performance
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/test', testRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Direct job route for testing
// app.get('/api/jobs/:id', async (req, res) => {
//   try {
//     const Job = require('./models/Job').default;
//     const job = await Job.findById(req.params.id);
//     if (!job) {
//       res.status(404).json({ success: false, message: 'Job not found' });
//       return;
//     }
//     res.json({ success: true, data: { job } });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({ message: 'Server error' });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const connectDB = async () => {
  try {
    const mongooseOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    };
    
    await mongoose.connect(process.env.MONGODB_URI!, mongooseOptions);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB error:', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(console.error);