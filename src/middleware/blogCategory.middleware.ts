import { Request, Response, NextFunction } from "express";
import { BlogCategoryFormSchema } from "../libs/schemas/categoryForm.schema";
import z from "zod";

const validateBlogCategoryForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    BlogCategoryFormSchema.parse({ name });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.message });
      return;
    }

    console.error("Error validating create blog category form:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { validateBlogCategoryForm };
