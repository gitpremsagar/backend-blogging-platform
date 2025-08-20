import { z } from "zod";

export const SigninFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6,"Invalid password").max(100,"Invalid password"),
});
