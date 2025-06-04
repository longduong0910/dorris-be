import db from '../utils/db';
import { sendVerifyCodeEmail } from '../services/email.service';
import { getUserInfo } from './user.service';
import config from '../configs'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from 'redis';
import { OAuth2Client } from 'google-auth-library';

// Khởi tạo client Google OAuth2
const client = new OAuth2Client(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET);
// Khởi tạo client Redis
const redisClient = createClient({
  url: 'redis://127.0.0.1:6379' // Nếu Redis chạy local trên cổng 6379
})
redisClient.on('connect', () => {
  console.log('Connect Redis success!');
});
redisClient.connect();

// Hàm tạo access token
const generateAccessToken = (userId: string, username: string, secretKey: string, expiresIn: number) => {
  return jwt.sign(
    { 
      payload: {
        userId, 
        username 
      },
    },   
    secretKey, 
    { expiresIn }
  );
}

// Hàm tạo refresh token
const generateRefreshToken = (userId: string, secretKey: string, expiresIn: number) => {
  return jwt.sign(
    { 
      payload: {
        userId
      },
    },   
    secretKey, 
    { expiresIn }
  );
}

export const refreshAccessToken = async (refreshToken: string) => {
  // Xác thực refresh token
  const decoded = jwt.verify(refreshToken, config.SECRET_REFRESH_KEY) as any;
  // Lấy thông tin từ payload
  const { userId } = decoded.payload;
  // LẤY username TỪ DB
  const { User } = await db.connect();
  const user = await User.findByPk(userId);
  if (!user) {
    return {
      status: 401,
      message: 'User not found!',
    };
  }
  // Tạo access token mới
  const newAccessToken = generateAccessToken(
    user.userId + '',
    user.username + '',
    config.SECRET_KEY + '',
    5 * 60
  );
  return {
    status: 200,
    accessToken: newAccessToken,
  };
};

export const login = async (username: string, password: string) => {
  const { User } = await db.connect();
  // Kiểm tra xem username và password có hợp lệ không
  if (!username || !password) {
    return {
      status: 404,
      message: 'Invalid username or password!',
    };
  }
  // Tìm người dùng trong cơ sở dữ liệu
  const user = await User.findOne({
    where: {
      username: username,
    },
  });
  // So sánh mật khẩu
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return {
      status: 404,
      message: 'Invalid username or password!',
    };
  }
  // Tạo access token và refresh token
  const accessToken = generateAccessToken(
    user.userId + ``, 
    user.username + ``, 
    config.SECRET_KEY + ``,
    5 * 60,
  );
  const refreshToken = generateRefreshToken(
    user.userId + ``,
    config.SECRET_REFRESH_KEY + ``,
    30 * 24 * 60 * 60,
  );
  // Lấy thông tin người dùng
  const userInfo = await getUserInfo(user.userId);
  return {
    status: 200,
    accessToken,
    refreshToken,
    userInfo: userInfo.data,
  };
}

export const googleLogin = async (accessToken: string) => {
  const { User } = await db.connect();
  // Xác thực token Google
  const ticket = await client.verifyIdToken({
    idToken: accessToken,
    audience: config.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) {
    return {
      status: 400,
      message: 'Invalid Google token!',
    };
  }
  // Lấy thông tin người dùng từ payload
  const { email, name, sub } = payload;
  let user = await User.findOne({
    where: {
      email: email,
    },
  });
  // Nếu chưa tồn tại, tạo mới người dùng
  if (!user) {
    user = await User.create({
      username: name,
      email: email,
      role: 'user',
      ssoProvider: 'google',
      ssoId: sub, // Lưu Google User ID vào cột sso_id
    });
  } else if (user.ssoProvider === 'google' && !user.ssoId) {
    // Nếu đã tồn tại nhưng chưa có sso_id, cập nhật thêm
    user.ssoId = sub;
    await user.save();
  }
  // Tạo access token và refresh token
  const accessTokenGenerated = generateAccessToken(
    user.userId + ``,
    user.username + ``,
    config.SECRET_KEY + ``,
    5 * 60
  );
  const refreshTokenGenerated = generateRefreshToken(
    user.userId + ``,
    config.SECRET_REFRESH_KEY + ``,
    30 * 24 * 60 * 60
  );
  // Lấy thông tin người dùng
  const userInfo = await getUserInfo(user.userId);
  return {
    status: 200,
    accessToken: accessTokenGenerated,
    refreshToken: refreshTokenGenerated,
    userInfo: userInfo.data,
  };
}

export const facebookLogin = async (accessToken: string) => {
  const { User } = await db.connect();
  // Xác thực token Facebook
  const response = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`);
  const data = await response.json();
  // Kiểm tra xem token có hợp lệ không
  if (!data || !data.email) {
    return {
      status: 400,
      message: 'Invalid Facebook token!',
    };
  }
  // Lấy thông tin người dùng từ payload
  const { email, name, id } = data;
  let user = await User.findOne({
    where: {
      email: email,
    },
  });
  // Nếu chưa tồn tại, tạo mới người dùng
  if (!user) {
    user = await User.create({
      username: name,
      email: email,
      role: 'user',
      ssoProvider: 'facebook',
      ssoId: id, // Lưu Facebook User ID vào cột sso_id
    });
  } else if (user.ssoProvider === 'facebook' && !user.ssoId) {
    // Nếu đã tồn tại nhưng chưa có sso_id, cập nhật thêm
    user.ssoId = id;
    await user.save();
  }
  // Tạo access token và refresh token
  const accessTokenGenerated = generateAccessToken(
    user.userId + ``,
    user.username + ``,
    config.SECRET_KEY + ``,
    5 * 60
  );
  const refreshTokenGenerated = generateRefreshToken(
    user.userId + ``,
    config.SECRET_REFRESH_KEY + ``,
    30 * 24 * 60 * 60
  );
  // Lấy thông tin người dùng
  const userInfo = await getUserInfo(user.userId);
  return {
    status: 200,
    accessToken: accessTokenGenerated,
    refreshToken: refreshTokenGenerated,
    userInfo: userInfo.data,
  };
}

export const register = async (userjson:  any) => {
  const { User } = await db.connect();
  // Kiểm tra xem username, email và password có hợp lệ không
  if (!userjson.username || !userjson.email || !userjson.password) {
    return {
      status: 404,
      message: 'Invalid username, email or password!',
    };
  }
  const user = await User.findOne({
    where: {
      email: userjson.email,
    },
  });
  // Kiểm tra xem người dùng đã tồn tại hay chưa
  if (user) {
    if (user.username === userjson.username) {
      return {
        status: 400,
        message: 'Username already exists!',
      };
    }
    // Kiểm tra xem người dùng đã đăng ký bằng tài khoản Google hay chưa
    if (userjson.sso_provider === 'google') {
      return {
        status: 400,
        message: 'Email has been signup with google account. Please signin with google account!',
      };
    }
    // Kiểm tra xem người dùng đã đăng ký bằng tài khoản Facebook hay chưa
    if (userjson.sso_provider === 'facebook') {
      return {
        status: 400,
        message: 'Email has been signup with facebook account. Please signin with facebook account!',
      };
    }
    return {
      status: 404,
      message: 'Email already exists!',
    };
  }
  const hashedPassword = bcrypt.hashSync(userjson.password, 8);
  // Tạo người dùng mới
  await User.create({
    username: userjson.username,
    email: userjson.email,
    password: hashedPassword,
    role: 'user',
    ssoProvider: 'local',
    ssoId: null, // Không có sso_id cho tài khoản đăng ký thông thường
  });
  return {
    status: 200,
    message: 'User created!',
  };
}

export const sendVerifyCode = async (email: string) => {
  const { User } = await db.connect();
  // Kiểm tra email có hợp lệ không
  if (!email || !email.includes('@')) {
    return {
      status: 404,
      message: 'Invalid email!',
    };
  }
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  // Nếu người dùng không tồn tại
  if (!user) {
    return {
      status: 404,
      message: 'User not found!',
    };
  }
  // Tạo mã xác thực
  const verifyCode = Math.floor(100000 + Math.random() * 900000); 
  // Lưu mã xác thực vào Redis
  await redisClient.set(email, verifyCode, {
    EX: 10 * 60, // Thời gian sống của mã xác thực là 10 phút
  });
  // Gửi mã xác thực qua email
  await sendVerifyCodeEmail(email, verifyCode);
  return {
    status: 200,
    message: 'Verify code sent to email!',
  };
}

export const verifyCode = async (email: string, code: string) => {
  // Kiểm tra mã xác thực
  const verifyCode = await redisClient.get(email);
  if (!verifyCode) {
    return {
      status: 404,
      message: 'Verify code expired!',
    };
  }
  if (verifyCode !== code) {
    return {
      status: 404,
      message: 'Invalid verify code!',
    };
  }
  // Xóa mã xác thực sau khi xác thực thành công
  await redisClient.del(email);
  return {
    status: 200,
    message: 'Verify code is valid!',
  };
}

export const resetPassword = async (email: string, newPassword: string) => {
  const { User } = await db.connect();
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  // Nếu người dùng không tồn tại
  if (!user) {
    return {
      status: 404,
      message: 'User not found!',
    };
  }
  // Cập nhật mật khẩu mới
  const hashedPassword = bcrypt.hashSync(newPassword, 8);
  const updatedUserPassword = await User.update(
    { password: hashedPassword },
    { where: { email: email } }
  );
  // Kiểm tra xem mật khẩu có được cập nhật không
  if (!updatedUserPassword) {
    return {
      status: 404,
      message: 'Failed to update password!',
    };
  }
  return {
    status: 200,
    message: 'Password updated!',
  };
}