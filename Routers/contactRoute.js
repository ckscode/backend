import express from 'express'
import { protect } from '../Middlewares/authMiddleware.js';
import { contactUs } from '../Controllers/contactController.js';
import upload from '../utils/fileUpload.js';

const router = express.Router();

router.post('/',protect,upload.any(),contactUs);

export default router;