import otpStore from "../../../utils/auth/resetPassword/otpStore.js";

const verifyCode = (req, res) => {
  const { contact, code } = req.body;
  const storedCode = otpStore.get(contact);
  if (!storedCode) {
    return res.status(401).json({ message: "Mã xác thực không hợp lệ" });
  }
  const { verifyCode, expiresAt } = storedCode;
  if (Date.now() > expiresAt) {
    otpStore.delete(contact);
    return res.status(404).json({ message: "Mã xác thực đã hết hạn" });
  }
  if (code !== verifyCode) {
    return res.status(400).json({ message: "Mã xác thực không chính xác" });
  }
  otpStore.delete(contact);
  return res.status(200).json({ message: "Xác thực thành công" });
};

export default verifyCode;