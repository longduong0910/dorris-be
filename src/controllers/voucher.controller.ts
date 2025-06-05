import { Request, Response } from 'express';
import * as voucherService from '../services/voucher.service';

export const getAllVouchers = async (req: Request, res: Response) => {
  try {
    const resData = await voucherService.getAllVouchers();
    res.json(resData.data);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}

export const getVoucherByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const resData = await voucherService.getVoucherByCode(code);
    res.json(resData.data);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}

export const createVoucher = async (req: Request, res: Response) => {
  try {
    const voucherjson = req.body;
    const resData = await voucherService.createVoucher(voucherjson);
    res.json(resData.data);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}