import jwtUtil from '../utils/auth/jwt.js';

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Không có token!' });

    try {
        const user = jwtUtil.verifyToken(token);
        req.user = user;
        next();
    } catch {
        res.status(403).json({ message: 'Token không hợp lệ!' });
    }
};

export default authenticateToken;
