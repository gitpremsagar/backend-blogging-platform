
import { z } from "zod";

const BlogPostFormSchema = z.object({
    title: z.string()
        .min(10, { message: "Title must be at least 10 characters long" })
        .max(100, { message: "Title must be no more than 100 characters long" })
        .trim(),
    content: z.string().min(1, { message: "Content is required" }),
    categoryId: z.string().min(1, { message: "Category is required" }),
    authorId: z.string().min(1, { message: "Author is required" }),
});

export { BlogPostFormSchema };