import { Request, Response, NextFunction } from "express";
import { BlogPostFormSchema, BlogPostUpdateSchema } from "../libs/schemas/blogPostForm.schema";
import z from "zod";

const validateBlogPostFormData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { 
      title, 
      excerpt, 
      content, 
      readTimeMin, 
      imageUrl, 
      imageAlt, 
      tags, 
      categoryId, 
      authorId, 
      isPublished, 
      isFeatured 
    } = req.body;
    
    const validatedData = BlogPostFormSchema.parse({
      title,
      excerpt,
      content,
      readTimeMin,
      imageUrl,
      imageAlt,
      tags,
      categoryId,
      authorId,
      isPublished,
      isFeatured,
    });
    req.body = validatedData;
    next();
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error });
    } else {
      console.error("Error validating blog post form data:\n", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

const validateBlogPostUpdateData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = BlogPostUpdateSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error validating blog post update data:\n", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export { validateBlogPostFormData, validateBlogPostUpdateData };
