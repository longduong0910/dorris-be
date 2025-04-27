import jwtUtil from '../../../utils/auth/jwt.js';
import User from '../../../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
      const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userEmail = payload['email'];
      const userName = payload['name'];

      let user = await User.findByUsername(userName);
      if (!user) {
          user = await User.create(userName, userEmail, null);
      }
      
      const accessToken = jwtUtil.generateAccessToken({ id: user.id, username: user.username });
      const refreshToken = jwtUtil.generateRefreshToken({ id: user.id, username: user.username });
      res.json({ message: 'Đăng nhập thành công!', accessToken, refreshToken });
  } catch (error) {
      res.status(500).json({ message: 'Lỗi server!' , error: error.message });
  }
};

export default googleLogin;