import twilio from 'twilio';
import User from '../../models/User.js';
import otpStore from '../../utils/auth/resetPassword/otpStore.js';
import dotenv from 'dotenv';

dotenv.config();

const sendVerifyCodeViaPhone = async (userPhone, res) => {
  if (!userPhone) {
    return res.status(400).json({ message: 'Số điện thoại không được để trống!' });
  }

  const user = await User.findByPhoneNumber(userPhone);
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy người dùng với số điện thoại này!' });
  }

  const verifyCode = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(userPhone, { verifyCode, expiresAt });

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    await client.messages.create({
      body: `Mã xác thực của bạn là: ${verifyCode}. Mã này sẽ hết hạn sau 5 phút.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: userPhone,
    });

    res.status(200).json({ message: 'Mã xác thực đã được gửi đến số điện thoại của bạn.' });
  } catch (error) {
    res.status(500).json({ message: 'Không thể gửi mã xác thực. Vui lòng thử lại sau.' });
  }
};

export default sendVerifyCodeViaPhone;