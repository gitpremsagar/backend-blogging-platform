import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  // Implement registration logic here
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Implement login logic here
};

export const signout = async (req: Request, res: Response) => {
  // Implement logout logic here
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  // Implement token refresh logic here
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  // Implement forgot password logic here
};

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  // Implement change password logic here
};
