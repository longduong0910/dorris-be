import sendVerifyCodeViaEmail from "../../../services/resetPassword/sendVerifyCodeViaEmail.js";
import sendVerifyCodeViaPhone from "../../../services/resetPassword/sendVerifyCodeViaPhone.js";

const sendVerifyCode = async (req, res) => {
  const { contact } = req.body;
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const isPhoneNumber = /^\+?[1-9]\d{1,14}$/.test(contact);
  if (isEmail) {
    await sendVerifyCodeViaEmail(contact, res);
  } else if (isPhoneNumber) {
    await sendVerifyCodeViaPhone(contact, res);
  } else {
    return res.status(400).json({ message: "Input không hợp lệ!" });
  }
};

export default sendVerifyCode;