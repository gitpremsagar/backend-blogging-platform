import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

const createBlogCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  // check if the blog category already exists
  try {
    const blogCategory = await prisma.blogCategory.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (blogCategory) {
      res.status(400).json({ message: "Blog category already exists" });
      return;
    }
  } catch (error: any) {
    console.error("Error checking if blog category already exists:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }

  // create the blog category
  try {
    const blogCategory = await prisma.blogCategory.create({ data: { name } });
    res.status(200).json({ createdBlogCategory: blogCategory });
  } catch (error: any) {
    console.error("Error creating blog category:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllBlogCategories = async (req: Request, res: Response) => {
  try {
    const blogCategories = await prisma.blogCategory.findMany();
    res.status(200).json({ foundBlogCategories: blogCategories });
  } catch (error: any) {
    console.error("Error getting all blog categories:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBlogCategoryById = async (req: Request, res: Response) => {
  try {
    const { blogCategoryId } = req.params;
    const blogCategory = await prisma.blogCategory.findUnique({
      where: { id: blogCategoryId },
    });
    res.status(200).json({ foundBlogCategory: blogCategory });
  } catch (error: any) {
    if (error.code === "P2023") {
      res.status(400).json({ message: "Invalid blog category id" });
      return;
    }

    console.error("Error getting blog category by id:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateBlogCategory = async (req: AuthenticatedRequest, res: Response) => {
  const userType = (req.user as JwtPayload).type;
  // check if the user is admin
  if (userType !== "ADMIN") {
    res.status(403).json({ message: "You are not authorized to update this blog category" });
    return;
  }

  // update the blog category
  try {
    const { blogCategoryId } = req.params;
    const { name } = req.body;
    const blogCategory = await prisma.blogCategory.update({
      where: { id: blogCategoryId },
      data: { name },
    });
    res.status(200).json({ updatedBlogCategory: blogCategory });
  } catch (error: any) {
    console.error("Error updating blog category:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteBlogCategory = async (req: AuthenticatedRequest, res: Response) => {
  const userType = (req.user as JwtPayload).type;
  // check if the user is admin
  if (userType !== "ADMIN") {
    res.status(403).json({ message: "You are not authorized to delete this blog category" });
    return;
  }

  // delete the blog category
  try {
    const { blogCategoryId } = req.params;
    const blogCategory = await prisma.blogCategory.delete({
      where: { id: blogCategoryId },
    });
    res.status(200).json({ deletedBlogCategory: blogCategory });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "No record was found" });
      return;
    }

    console.error("Error deleting blog category:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getAllBlogCategories,
  getBlogCategoryById,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
};
