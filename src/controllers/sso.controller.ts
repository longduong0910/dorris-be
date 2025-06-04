import { Request, Response } from 'express';
import * as ssoService from '../services/sso.service';

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const resData = await ssoService.refreshAccessToken(refreshToken);
    res.json(resData);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const resData = await ssoService.login(username, password);
    res.json(resData);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    const resData = await ssoService.googleLogin(accessToken);
    res.json(resData);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}

export const facebookLogin = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    const resData = await ssoService.facebookLogin(accessToken);
    res.json(resData);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const resData = await ssoService.register({ username, email, password });
    res.json(resData);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}

export const sendVerifyCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const resData = await ssoService.sendVerifyCode(email);
    res.json(resData);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}

export const verifyCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    const resData = await ssoService.verifyCode(email, code);
    res.json(resData);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    const resData = await ssoService.resetPassword(email, newPassword);
    res.json(resData);
  } catch (error: any) {
    console.log(error);
    res.send({
      status: error.code || 400,
      message: error.message,
    });
  }
}