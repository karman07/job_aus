import { Router } from 'express';
import { 
  createApplication, 
  getAllApplications, 
  getApplicationById, 
  updateApplication, 
  deleteApplication,
  getApplicationsByJob
} from '../controllers/applicationController';
import { authGuard } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { 
  createApplicationValidation, 
  updateApplicationValidation, 
  mongoIdValidation,
  paginationValidation 
} from '../validators';

const router = Router();

router.post('/', upload.single('resume'), createApplicationValidation, createApplication);
router.get('/', authGuard, paginationValidation, getAllApplications);
router.get('/job/:jobId', authGuard, mongoIdValidation, paginationValidation, getApplicationsByJob);
router.get('/:id', authGuard, mongoIdValidation, getApplicationById);
router.put('/:id', authGuard, updateApplicationValidation, updateApplication);
router.delete('/:id', authGuard, mongoIdValidation, deleteApplication);

export default router;