import express from 'express';
import signup from '../controllers/auth/signup.js';
import login from '../controllers/auth/login/login.js';
import googleLogin from '../controllers/auth/login/googleLogin.js';
import getUserInfo from '../controllers/auth/getUserInfo.js';
import refreshToken from '../controllers/auth/refreshToken.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/refresh-token', refreshToken);
router.get('/get-user-info', authenticateToken, getUserInfo);

export default router;