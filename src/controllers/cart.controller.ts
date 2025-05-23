import { Request, Response } from 'express';
import * as cartItemService from '../services/cartItem.service';

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || null; // Lấy userId từ req.user
    const sessionId = req.sessionId || null; // Lấy sessionId từ req.sessionId
    const result = await cartItemService.getCart(userId, sessionId);
    res.json(result);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.userId || null; // Lấy userId từ req.user
    const sessionId = req.sessionId || null; // Lấy sessionId từ req.sessionId
    const result = await cartItemService.addToCart(userId, sessionId, productId, quantity);
    res.json(result);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.userId || null; // Lấy userId từ req.user
    const sessionId = req.sessionId || null; // Lấy sessionId từ req.sessionId
    const result = await cartItemService.updateCartItem(userId, sessionId, productId, quantity);
    res.json(result);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.user?.userId || null; // Lấy userId từ req.user
    const sessionId = req.sessionId || null; // Lấy sessionId từ req.sessionId
    const result = await cartItemService.deleteCartItem(userId, sessionId, productId);
    res.json(result);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}