import User from '../../models/User.js';
import bcrypt from 'bcrypt';

const signup = async (req, res) => {
  const { username, email, password } = req.body; 
  try {
      const user = await User.findByUsername(username);
      if (user) {
          return res.status(400).json({ message: 'Username đã tồn tại!' });
      }
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
          return res.status(400).json({ message: 'Email đã tồn tại!' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create(username, email, hashedPassword);
      res.json({ message: 'Đăng ký thành công!' });
  } catch (error) {
      res.status(500).json({ message: 'Lỗi server!' });
  }
};

export default signup;