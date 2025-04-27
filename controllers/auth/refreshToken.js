import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import jwtUtil from '../../utils/auth/jwt.js';
import dotenv from 'dotenv';

dotenv.config();

const refreshToken = async (req, res) => {
  const refreshToken = req.headers['authorization']?.split(' ')[1];
  if (!refreshToken) {
    return res.status(400).json({ message: 'Cần cung cấp refresh token!' });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_REFRESH_KEY);
    if (!decoded) {
      return res.status(403).json({ message: 'Refresh token không hợp lệ' });
    }
    const user = await User.findById(decoded.userId); 
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    const newAccessToken = jwtUtil.generateAccessToken({ id: user.id, username: user.username });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server nội bộ' });
  }
};

export default refreshToken;
