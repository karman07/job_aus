import express from 'express';
import { uploadLogo } from '../controllers/uploadController';
import { logoUpload } from '../middleware/upload';

const router = express.Router();

router.post('/logo', logoUpload.single('logo'), uploadLogo);

export default router;