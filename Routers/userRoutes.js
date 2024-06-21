import express from 'express';
import { forgotPassword, getUser, loginStatus, loginUser, logoutUser, registerUser, resetPassword, updatePassword, updateUser } from '../Controllers/userController.js';
import { protect } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/logout',logoutUser);
router.get('/getUser',protect,getUser);
router.get('/loginStatus',loginStatus);
router.put('/updateUser',protect,updateUser);
router.put('/updatePassword',protect,updatePassword);
router.post('/forgotPassword',forgotPassword);
router.put('/resetPassword/:resetToken',resetPassword);

export default router;