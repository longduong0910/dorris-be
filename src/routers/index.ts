import express from 'express';
import multer from 'multer';
import { adminAccess } from '../middlewares/adminAccess';
import { authentication } from '../middlewares/authentication';
import * as sso from '../controllers/sso.controller';
import * as product from '../controllers/product.controller';
import * as cart from '../controllers/cart.controller';
import { authOrSession } from '../middlewares/authOrSession';

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
router.post('/products', adminAccess, upload.array('images'), product.createProduct);
router.put('/products/:productId', adminAccess, upload.array('images'), product.updateProduct);
router.delete('/products/:productId', adminAccess, product.deleteProduct);

// Routes for cart
router.get('/cart', authOrSession, cart.getCart);
router.post('/cart', authOrSession, cart.addToCart);
router.put('/cart', authOrSession, cart.updateCartItem);
router.delete('/cart', authOrSession, cart.deleteCartItem);

export default router;