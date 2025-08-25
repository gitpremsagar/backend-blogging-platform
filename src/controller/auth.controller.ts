import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const { email, password, name, type } = req.body;

  //check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
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
    return res.status(404).json({ message: "Invalid email or password" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    type: user.type,
  };

  // Generate JWT tokens
  const accessToken = jwt.sign(
    { ...userData },
    process.env.ACCESS_TOKEN_JWT_SECRET!,
    { expiresIn: +process.env.ACCESS_TOKEN_JWT_EXPIRY! }
  );
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_JWT_SECRET!,
    { expiresIn: +process.env.REFRESH_TOKEN_JWT_EXPIRY! }
  );

  // send refresh token to client
  res
  .cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // maxAge: +process.env.REFRESH_TOKEN_COOKIE_EXPIRY!,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "none",
    path: "/",
  })
  .cookie("accessToken", accessToken, {
    maxAge: +process.env.ACCESS_TOKEN_COOKIE_EXPIRY!,
    path: "/",
  })
  .json({ accessToken, user:userData });
  return;
};

export const signout = async (req: Request, res: Response) => {
  // remove refresh token cookie
  res
    .status(204)
    .cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Match signin setting
      maxAge: 0,
      sameSite: "none", // Match signin setting
      path: "/",
    })
    .cookie("accessToken", "", {
      maxAge: 0,
      path: "/",
    })
    .send();
  return;
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  // console.log("Cookie is\n", req.cookies);
  if (!refreshToken) {
    console.log("Refreshing access token failed: Refresh token is missing");
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

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
    };

    // Generate new access token
    const accessToken = jwt.sign(
      { ...userData },
      process.env.ACCESS_TOKEN_JWT_SECRET!,
      { expiresIn: +process.env.ACCESS_TOKEN_JWT_EXPIRY! } // Remove '+' if using "1h" etc.
    );

    res.cookie("accessToken", accessToken, {
      maxAge: +process.env.ACCESS_TOKEN_COOKIE_EXPIRY!,
      path: "/",
    })
    .send({ accessToken, user: userData });
  } catch (error: any) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      console.log("Error while refreshing access token\n", error);
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
