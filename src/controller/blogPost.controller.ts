import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const getAllBlogPosts = async (req: Request, res: Response) => {
  try {
    const blogPosts = await prisma.blogPost.findMany();
    res.status(200).json({ blogPosts });
  } catch (error: any) {
    console.error("Error getting all blog posts:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBlogPostById = async (req: Request, res: Response) => {
  try {
    const { blogPostId } = req.params;
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: blogPostId },
    });
    res.status(200).json({ blogPost });
  } catch (error: any) {
    console.error("Error getting blog post by id:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBlogPostsByCategoryId = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    const blogPosts = await prisma.blogPost.findMany({ where: { categoryId } });
    res.status(200).json({ blogPosts });
  } catch (error: any) {
    console.error("Error getting blog posts by category id:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export { getAllBlogPosts, getBlogPostById, getBlogPostsByCategoryId, getBlogPostsByAuthorId, getBlogPostsByCategoryAndAuthorId, getBlogPostsBySearch, getBlogPostsByCategory }
export { getAllBlogPosts, getBlogPostById, getBlogPostsByCategoryId };
