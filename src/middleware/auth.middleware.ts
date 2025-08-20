import { Request, Response, NextFunction } from "express";
import { SignupFormSchema } from "../libs/schemas/signupForm.schema";
import {SigninFormSchema } from "../libs/schemas/signinForm.schema";
import z from "zod";

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
