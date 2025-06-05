import db from '../utils/db';
import config from '../configs';
import jwt from 'jsonwebtoken';

export const getUserInfo = async (userId: number) => {
  const { User } = await db.connect();
  const user = await User.findOne({
    where: {
      userId: userId,
    },
  });
  if (!user) {
    return {
      status: 404,
      message: 'User not found',
    };
  }
  return {
    status: 200,
    data: user,
  };
}

export const updateUserInfo = async (userId: string, userData: any) => {
  const { User } = await db.connect();
  const user = await User.findOne({
    where: { userId: userId },
  });
  if (!user) {
    return {
      status: 404,
      message: 'User not found',
    };
  }
  // Danh sách các trường được phép cập nhật
  const allowedFields = ['fullName', 'username', 'email', 'phoneNumber', 'address'];
  const updates: any = {};
  // Kiểm tra và chỉ thêm những trường hợp lệ
  for (const field of allowedFields) {
    if (field in userData) {
      const value = userData[field];
      if (value !== null && value !== undefined && typeof value !== 'string') {
        return {
          status: 400,
          message: `Invalid value for ${field}, must be a string or null`,
        };
      }
      if (field === 'email' && !validateEmail(value)) {
        return {
          status: 400,
          message: 'Invalid email format',
        };
      }
      updates[field] = value; // Chỉ thêm nếu hợp lệ
    }
  }
  if (Object.keys(updates).length === 0) {
    return {
      status: 400,
      message: 'No valid fields provided to update',
    };
  }
  try {
    await User.update(updates, {
      where: { userId: userId },
    });
    // Lấy lại thông tin user sau khi cập nhật
    const updatedUser = await User.findOne({
      where: { userId: userId },
    });
    return {
      status: 200,
      message: 'User information updated successfully',
      userInfo: updatedUser,
    };
  } catch (error) {
    console.error('Update error:', error);
    return {
      status: 500,
      message: 'An error occurred while updating user information',
    };
  }
};

// Hàm helper kiểm tra định dạng email
function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

export const getAllShippingAddresses = async (accessToken: string) => {
  const { ShippingAddress } = await db.connect();
  const { User } = await db.connect();
  if (!accessToken) {
    return {
      status: 401,
      message: 'Access token is missing',
    };
  }
  let decoded;
  try {
    // Giải mã token (thay 'your_jwt_secret' bằng secret thực tế của bạn)
    decoded = jwt.verify(accessToken, config.SECRET_KEY);
  } catch (error) {
    return {
      status: 401,
      message: 'Invalid access token',
    };
  }
  const userId = (decoded as any).payload.userId; // hoặc decoded.userId tùy payload token
  // Kiểm tra user tồn tại trong DB (nếu cần)
  const user = await User.findOne({ where: { userId } });
  if (!user) {
    return {
      status: 404,
      message: 'User not found',
    };
  }
  // Lấy tất cả địa chỉ giao hàng của người dùng
  const addresses = await ShippingAddress.findAll({ where: { userId } });
  return {
    status: 200,
    data: addresses,
  };
}

export const createShippingAddress = async (accessToken: string, addressData: any) => {
  const { ShippingAddress } = await db.connect();
  const { User } = await db.connect();
  if (!accessToken) {
    return {
      status: 401,
      message: 'Access token is missing',
    };
  }
  let decoded;
  try {
    // Giải mã token (thay 'your_jwt_secret' bằng secret thực tế của bạn)
    decoded = jwt.verify(accessToken, config.SECRET_KEY);
  } catch (error) {
    return {
      status: 401,
      message: 'Invalid access token',
    };
  }
  const userId = (decoded as any).payload.userId; // hoặc decoded.userId tùy payload token
  // Kiểm tra user tồn tại trong DB (nếu cần)
  const user = await User.findOne({ where: { userId } });
  if (!user) {
    return {
      status: 404,
      message: 'User not found',
    };
  }
  // Kiểm tra tính hợp lệ của dữ liệu địa chỉ
  if (!addressData.fullName || !addressData.shippingAddress || !addressData.phoneNumber) {
    return {
      status: 400,
      message: 'Missing required fields: fullName, shippingAddress, phoneNumber',
    };
  }
  try {
    const newAddress = await ShippingAddress.create({
      userId: userId,
      fullName: addressData.fullName,
      shippingAddress: addressData.shippingAddress,
      phoneNumber: addressData.phoneNumber,
    });
    return {
      status: 201,
      message: 'Shipping address created successfully',
      data: newAddress,
    };
  } catch (error) {
    console.error('Create shipping address error:', error);
    return {
      status: 500,
      message: 'An error occurred while creating shipping address',
    };
  }
};