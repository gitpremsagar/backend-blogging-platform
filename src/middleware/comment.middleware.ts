import { Request, Response, NextFunction } from "express";
import { createCommentSchema, updateCommentSchema } from "../libs/schemas/comment.schema";
import z from "zod";

const validateCommentForm = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { comment, blogPostId } = req.body;
        const validatedData = createCommentSchema.parse({ comment, blogPostId });
        req.body = validatedData;
        next();
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

const validateUpdateCommentForm = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { comment } = req.body;
        const validatedData = updateCommentSchema.parse({ comment });
        req.body = validatedData;
        next();
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export { validateCommentForm, validateUpdateCommentForm }; 