import nodemailer from 'nodemailer';
import config from '../configs';

// Tạo một transporter để gửi email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
})

export const sendVerifyCodeEmail = async (email: string, verifyCode: number) => {
  await transporter.sendMail({
    from: config.EMAIL_USER,
    to: email,
    subject: 'Verify code for reset password',
    text: `Your verify code is ${verifyCode}. This code is valid for 10 minutes.`,
  });
}