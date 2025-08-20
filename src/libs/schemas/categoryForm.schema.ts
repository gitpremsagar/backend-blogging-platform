import { z } from "zod";

export const BlogCategoryFormSchema = z.object({
  name: z.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(20, { message: "Name must be no more than 20 characters long" })
    .trim(),
});
