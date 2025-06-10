import express from 'express';
import multer from 'multer';
import { adminAccess } from '../middlewares/adminAccess';
import { authentication } from '../middlewares/authentication';
import { authOrSession } from '../middlewares/authOrSession';
import * as sso from '../controllers/sso.controller';
import * as product from '../controllers/product.controller';
import * as cart from '../controllers/cart.controller';
import * as user from '../controllers/user.controller';
import * as voucher from '../controllers/voucher.controller';
import * as order from '../controllers/order.controller';

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

// Routes for user
router.get('/users/shippingAddress', authentication, user.getAllShippingAddresses);
router.post('/users/shippingAddress', authentication, user.createShippingAddress);
router.put('/users/:userId', authentication, user.updateUserInfo);

// Routes for product
router.get('/products/:sku', product.getProductBySKU);
router.get('/products/detail/:productName', product.getProductsByName);
router.get('/products/category/:category', product.getProductsByCategory);
router.get('/products', product.getAllProducts);
router.post('/products', upload.array('images'), product.createProduct);
router.put('/products/:sku', adminAccess, upload.array('images'), product.updateProduct);
router.delete('/products/:sku', product.deleteProduct);

// Routes for cart
router.get('/cart', authOrSession, cart.getCart);
router.post('/cart', authOrSession, cart.addToCart);
router.put('/cart', authOrSession, cart.updateCartItem);
router.delete('/cart', authOrSession, cart.deleteCartItem);

// Routes for voucher
router.get('/vouchers', authentication, voucher.getAllVouchers);
router.get('/vouchers/:code', authentication, voucher.getVoucherByCode);
router.post('/vouchers', adminAccess, voucher.createVoucher);

// Routes for order
router.post('/orders', adminAccess, order.createOrder);

export default router;