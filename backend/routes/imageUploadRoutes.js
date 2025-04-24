import express from 'express';
import multer from 'multer';
import * as uploadController from '../controllers/imageUploadController.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('image'), uploadController.uploadImage);

export default router;