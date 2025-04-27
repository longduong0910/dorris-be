import express from 'express';
import sendVerifyCode from '../controllers/auth/resetPassword/sendVerifyCode.js';
import verifyCode from '../controllers/auth/resetPassword/verifyCode.js';
import resetPassword from '../controllers/auth/resetPassword/resetPassword.js';

const router = express.Router();

router.post('/send-verify-code', sendVerifyCode);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);

export default router;