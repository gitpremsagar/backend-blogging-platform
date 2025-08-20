import { z } from "zod";

export const SignupFormSchema = z
  .object({
    email: z.email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password must be at most 100 characters long")
      .trim(),
    type: z.enum(["USER", "ADMIN"]),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(100, "Name must be at most 100 characters long")
      .trim(),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long")
      .max(100, "Confirm Password must be at most 100 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
