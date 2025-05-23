// src/middlewares/authOrSession.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import db from '../utils/db';
import config from '../configs';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      sessionId?: string;
    }
  }
}

export const authOrSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      // Nếu có token, xác thực và gán req.user, KHÔNG tạo session
      const { User } = await db.connect();
      const decoded = jwt.verify(token, config.SECRET_KEY);
      const userId = (decoded as any).payload.userId;
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        res.status(401).json({ message: 'User not found.' });
        return;
      }
      req.user = user;
      next(); // Có token, không tạo session, đi tiếp
    }
    // Không có token → tạo sessionId (guest)
    let sessionId = req.cookies?.sessionId;
    if (!sessionId) {
      sessionId = uuidv4();
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 ngày
      });
    }
    req.sessionId = sessionId;
    next(); // Không có token, dùng session
  } catch (error) {
    console.error('authOrSession error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
