import express from 'express';
import { getUser, loginUser, logoutUser, registerUser } from '../Controllers/userController.js';
import { protect } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/logout',logoutUser);
router.get('/getUser',protect,getUser);
export default router;