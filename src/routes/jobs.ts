import { Router } from 'express';
import { 
  createJob, 
  getAllJobs, 
  getJobById, 
  updateJob, 
  deleteJob 
} from '../controllers/jobController';
import { authGuard } from '../middleware/auth';
import { 
  createJobValidation, 
  updateJobValidation, 
  mongoIdValidation,
  paginationValidation 
} from '../validators';

const router = Router();

router.post('/', authGuard, createJobValidation, createJob);
router.get('/', authGuard, paginationValidation, getAllJobs);
router.get('/:id', authGuard, mongoIdValidation, getJobById);
router.put('/:id', authGuard, updateJobValidation, updateJob);
router.delete('/:id', authGuard, mongoIdValidation, deleteJob);

export default router;