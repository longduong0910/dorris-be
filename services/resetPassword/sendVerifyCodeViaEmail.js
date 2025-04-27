import nodemailer from 'nodemailer';
import User from '../../models/User.js';
import otpStore from '../../utils/auth/resetPassword/otpStore.js'; 
import dotenv from 'dotenv';

dotenv.config();

const sendVerifyCodeViaEmail = async (email, res) => { 
  if (!email) {
    return res.status(400).json({ message: 'Email không được để trống!' });
  }
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy người dùng với email này!' });
  }
  const verifyCode = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(email, { verifyCode, expiresAt }); 
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Mã xác thực đặt lại mật khẩu',
      text: `Mã xác thực của bạn là: ${verifyCode}. Mã này sẽ hết hạn sau 5 phút.`,
    });
    res.status(200).json({ message: 'Mã xác thực đã được gửi đến email của bạn.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Không thể gửi mã xác thực. Vui lòng thử lại sau.' });
  }
};

export default sendVerifyCodeViaEmail;