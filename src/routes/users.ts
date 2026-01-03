import { Router } from 'express';
import { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../controllers/userController';
import { authGuard } from '../middleware/auth';
import { 
  createUserValidation, 
  updateUserValidation, 
  mongoIdValidation,
  paginationValidation 
} from '../validators';

const router = Router();

router.post('/', authGuard, createUserValidation, createUser);
router.get('/', authGuard, paginationValidation, getAllUsers);
router.get('/:id', authGuard, mongoIdValidation, getUserById);
router.put('/:id', authGuard, updateUserValidation, updateUser);
router.delete('/:id', authGuard, mongoIdValidation, deleteUser);

export default router;