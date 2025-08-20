import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const { email, password, name, type } = req.body;

  //check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(
    password,
    +process.env.BCRYPT_SALT_ROUNDS!
  );

  try {
    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        type,
      },
    });

    // Send response
    res.status(201).json({ user });
    return;
  } catch (error) {
    console.error("Error creating user:\n", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Implement login logic here
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Generate JWT tokens
  const accessToken = jwt.sign(
    { Id: user.id, email: user.email, name: user.name, type: user.type },
    process.env.ACCESS_TOKEN_JWT_SECRET!,
    { expiresIn: +process.env.ACCESS_TOKEN_JWT_EXPIRY! }
  );
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_JWT_SECRET!,
    { expiresIn: +process.env.REFRESH_TOKEN_JWT_EXPIRY! }
  );

  // send refresh token to client
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: +process.env.REFRESH_TOKEN_COOKIE_EXPIRY!,
  });

  // Send tokens in response
  res.send({ accessToken });
  return;
};

export const signout = async (req: Request, res: Response) => {
  // Implement logout logic here
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is missing" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_JWT_SECRET!
    ) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { Id: user.id, email: user.email, name: user.name, type: user.type },
      process.env.ACCESS_TOKEN_JWT_SECRET!,
      { expiresIn: +process.env.ACCESS_TOKEN_JWT_EXPIRY! } // Remove '+' if using "1h" etc.
    );

    res.send({ accessToken });
  } catch (error: any) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }
    console.error("Error refreshing access token:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const decodeAccessToken = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  res.send(req.user);
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  // Implement forgot password logic here
};

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  // Implement change password logic here
};
