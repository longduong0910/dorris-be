import { Request, Response } from 'express';
import * as orderService from '../services/order.service';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderJson = req.body;
    const result = await orderService.createOrder(orderJson);
    res.json(result);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}