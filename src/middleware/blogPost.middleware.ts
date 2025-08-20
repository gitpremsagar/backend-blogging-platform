import { Request, Response, NextFunction } from "express";
import { BlogPostFormSchema } from "../libs/schemas/blogPostForm.schema";
import z from "zod";

const validateBlogPostFormData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, categoryId, authorId } = req.body;
    const validatedData = BlogPostFormSchema.parse({
      title,
      content,
      categoryId,
      authorId,
    });
    req.body = validatedData;
    next();
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error validating blog post form data:\n", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export { validateBlogPostFormData };
