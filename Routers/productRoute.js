import express from 'express'
import { protect } from '../Middlewares/authMiddleware.js';
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from '../Controllers/productController.js';
import multer from 'multer'
import upload from '../utils/fileUpload.js';

const router = express.Router();


router.post('/',protect,upload.single("image"),createProduct);
router.get('/getAll',protect,getAllProducts);
router.get('/getProduct/:id',protect,getProduct);
router.delete('/deleteProduct/:id',protect,deleteProduct);
router.put('/updateProduct/:id',protect,upload.single("image"),updateProduct)

export default router