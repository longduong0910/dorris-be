import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import db from '../utils/db';
import config from '../configs';

// Thừa kế interface Request của Express để thêm thuộc tính user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const adminAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Access Denied. No token provided.' });
      return;
    }
    const { User } = await db.connect();
    // Kiểm tra xem token có hợp lệ không
    const decoded = jwt.verify(token, config.SECRET_KEY);
    const userId = (decoded as any).payload.userId;
    const user = await User.findOne({
      where: {
        userId: userId,
      },
    });
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    // Kiểm tra quyền
    if (user.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden. Admin access required.' });
      return;
    }
    // Gán user vào request để dùng ở controller nếu cần
    req.user = user;
    next(); // Cho phép đi tiếp nếu là admin
  } catch (error) {
    console.error('Error in adminAccess middleware:', error);
    res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  }
};
