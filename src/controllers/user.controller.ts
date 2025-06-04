import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userData = req.body;
    const resData = await userService.updateUserInfo(userId, userData);
    res.json(resData);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.status || 400,
      message: error.message,
    });
  }
}