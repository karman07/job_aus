import express from 'express';
import {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  createApplication
} from '../controllers/candidateController';
import { resumeUpload } from '../middleware/upload';

const router = express.Router();

// Candidate routes
router.post('/', createCandidate);
router.get('/', getAllCandidates);
router.get('/:id', getCandidateById);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);

// Application route
router.post('/applications', resumeUpload.single('resume'), createApplication);

export default router;