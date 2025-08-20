import { Request, Response } from "express";
import { Prisma, PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const createBlogPost = async (req: Request, res: Response) => {
  const { title, content, categoryId, authorId } = req.body;
  try {
    const blogPost = await prisma.blogPost.create({
      data: { title, content, categoryId, authorId },
    });
    res.status(201).json({ createdBlogPost: blogPost });
  } catch (error: any) {
    console.error("Error creating blog post:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

const getBlogPostsByAuthorId = async (req: Request, res: Response) => {
  const { authorId } = req.params;
  try {
    const blogPosts = await prisma.blogPost.findMany({ where: { authorId } });
    res.status(200).json({ blogPosts });
  } catch (error: any) {
    console.error("Error getting blog posts by author id:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBlogPostsByCategoryAndAuthorId = async (
  req: Request,
  res: Response
) => {
  const { categoryId, authorId } = req.params;
  try {
    const blogPosts = await prisma.blogPost.findMany({
      where: { categoryId, authorId },
    });
    res.status(200).json({ blogPosts });
  } catch (error: any) {
    console.error(
      "Error getting blog posts by category and author id:\n",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBlogPostsBySearch = async (req: Request, res: Response) => {
  const { search } = req.query;
  try {
    const blogPosts = await prisma.blogPost.findMany({
      where: { title: { contains: search as string, mode: "insensitive" } },
    });
    res.status(200).json({ blogPosts });
    return;
  } catch (error: any) {
    console.error("Error getting blog posts by search:\n", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const updateBlogPost = async (req: Request, res: Response) => {
  const { blogPostId } = req.params;  
  const { title, content, categoryId, authorId } = req.body;
  try {
    const blogPost = await prisma.blogPost.update({
      where: { id: blogPostId },
      data: { title, content, categoryId, authorId },
    });
    res.status(200).json({ updatedBlogPost: blogPost });
    return;
  } catch (error: any) {
    console.error("Error updating blog post:\n", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const deleteBlogPost = async (req: Request, res: Response) => {
  const { blogPostId } = req.params;
  try {
    await prisma.blogPost.delete({ where: { id: blogPostId } });
    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }
    }
    console.error("Error deleting blog post:\n", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export {
  getAllBlogPosts,
  getBlogPostById,
  getBlogPostsByCategoryId,
  createBlogPost,
  getBlogPostsByAuthorId,
  getBlogPostsByCategoryAndAuthorId,
  getBlogPostsBySearch,
  updateBlogPost,
  deleteBlogPost,
};
