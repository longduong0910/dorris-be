import express from 'express';
import * as sso from '../controllers/sso.controller';

const router = express.Router();

// Routes for sso
router.post('/refresh', sso.refreshAccessToken);
router.post('/login', sso.login);
router.post('/login/google', sso.googleLogin);
router.post('/login/facebook', sso.facebookLogin);
router.post('/register', sso.register);
router.post('/forgot/request', sso.sendVerifyCode);
router.post('/forgot/verify', sso.verifyCode);
router.post('/forgot/reset', sso.resetPassword);

export default router;
