import express from 'express';
import multer from 'multer';
import * as sso from '../controllers/sso.controller';
import * as product from '../controllers/product.controller';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Routes for sso
router.post('/refresh', sso.refreshAccessToken);
router.post('/login', sso.login);
router.post('/login/google', sso.googleLogin);
router.post('/login/facebook', sso.facebookLogin);
router.post('/register', sso.register);
router.post('/forgot/request', sso.sendVerifyCode);
router.post('/forgot/verify', sso.verifyCode);
router.post('/forgot/reset', sso.resetPassword);

// Routes for product
router.get('/products/:productId', product.getProductById);
router.get('/products/category/:category', product.getProductByCategory);
router.post('/products', upload.array('images'), product.createProduct);
router.put('/products/:productId', upload.array('images'), product.updateProduct);
router.delete('/products/:productId', product.deleteProduct);

export default router;