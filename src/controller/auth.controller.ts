import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const { email, password, name, type } = req.body;

  //check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, +process.env.BCRYPT_SALT_ROUNDS!);

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

  // Send response
  res.send({ user });
  return;
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
