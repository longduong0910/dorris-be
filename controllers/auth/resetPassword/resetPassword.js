import User from '../../../models/User.js';
import bcrypt from 'bcrypt';

const resetPassword = async (req, res) => {
  const { contact, newPassword } = req.body;
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  if (!contact || !newPassword) {
    return res.status(400).json({ message: "Email và mật khẩu mới không được để trống!" });
  }
  try {
    const user = isEmail ? await User.findByEmail(contact) : await User.findByPhone(contact);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng với email này!" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await User.updatePassword(contact, hashedPassword);
    return res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại sau." });
  }
}

export default resetPassword;