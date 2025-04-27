import bcrypt from 'bcrypt';
import jwtUtil from '../../../utils/auth/jwt.js';
import User from '../../../models/User.js';

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu!' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu!' });
        }
        const accessToken = jwtUtil.generateAccessToken({ id: user.id, username: user.username });
        const refreshToken = jwtUtil.generateRefreshToken({ id: user.id, username: user.username });
        res.json({ message: 'Đăng nhập thành công!', accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server!' , error: error.message });
    }
};

export default login;