import { Request, Response, NextFunction } from "express";
import { SignupFormSchema } from "../libs/schemas/signupForm.schema";
import {SigninFormSchema } from "../libs/schemas/signinForm.schema";
import z from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";

//extending default Request type to define type of custom req.user data
export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload 
}

export const validateSignupForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    SignupFormSchema.parse(req.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Signup Form Validation error:\n", error);
      res.status(400).json({ message: error });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
    return;
  }
  next();
};

export const validateSigninForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    SigninFormSchema.parse(req.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Signin Form Validation error:\n", error);
      res.status(400).json({ message: error });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
    return;
  }
  next();
};

export const validateAccessToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Access token is missing" });
    return;
  }
  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET!);
    req.user = decoded;
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
  next();
};
