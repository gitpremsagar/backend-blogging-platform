import { z } from "zod";

const createCommentSchema = z.object({
  comment: z.string().min(1, { message: "Comment is required" }).max(1000, { message: "Comment must be less than 1000 characters" }),
  blogPostId: z.string().min(1, { message: "Blog post id is required" }),
});

const updateCommentSchema = z.object({
  comment: z.string().min(1, { message: "Comment is required" }),
});

export { createCommentSchema, updateCommentSchema };
