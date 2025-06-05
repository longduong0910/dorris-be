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

export const getAllShippingAddresses = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    if (!accessToken) {
      res.status(401).json({ status: 401, message: 'Missing access token' });
      return;
    }
    const resData = await userService.getAllShippingAddresses(accessToken);
    res.json(resData);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.status || 400,
      message: error.message,
    });
  }
}

export const createShippingAddress = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    if (!accessToken) {
      res.status(401).json({ status: 401, message: 'Missing access token' });
      return;
    }
    const shippingData = req.body;
    const resData = await userService.createShippingAddress(accessToken, shippingData);
    res.json(resData);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.status || 400,
      message: error.message,
    });
  }
}