import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { Prisma, PrismaClient } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

const createComment = async (req: AuthenticatedRequest, res: Response) => {
  const { comment, blogPostId } = req.body;
  const userId = (req.user as JwtPayload).id;

  try {
    const newComment = await prisma.comment.create({
      data: {
        comment,
        postId: blogPostId,
        userId,
        blogPost: { connect: { id: blogPostId } },
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json({ newComment });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ message: "Could not create comment" });
      return;
    }
    console.error("Error creating comment:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateComment = async (req: AuthenticatedRequest, res: Response) => {
  const { comment } = req.body;
  const userId = (req.user as JwtPayload).id;
  const { commentId } = req.params;

  try {
    const updatedComment = await prisma.comment.update({
      where: { id: commentId, userId },
      data: { comment },
    });
    res.status(200).json({ updatedComment });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ message: "Comment not found" });
        return;
      }
      res.status(400).json({ message: "Could not update comment" });
      return;
    }
    console.error("Error updating comment:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { createComment, updateComment };
