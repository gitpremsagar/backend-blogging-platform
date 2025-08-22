
import { z } from "zod";

const BlogPostFormSchema = z.object({
    title: z.string()
        .min(10, { message: "Title must be at least 10 characters long" })
        .max(100, { message: "Title must be no more than 100 characters long" })
        .trim(),
    excerpt: z.string()
        .min(10, { message: "Excerpt must be at least 10 characters long" })
        .max(300, { message: "Excerpt must be no more than 300 characters long" })
        .trim(),
    content: z.string().min(1, { message: "Content is required" }),
    readTimeMin: z.number()
        .int({ message: "Read time must be an integer" })
        .min(1, { message: "Read time must be at least 1 minute" })
        .max(999, { message: "Read time must be less than 999 minutes" }),
    imageUrl: z.string()
        .url({ message: "Image URL must be a valid URL" })
        .min(1, { message: "Image URL is required" }),
    imageAlt: z.string()
        .min(1, { message: "Image alt text is required" })
        .max(200, { message: "Image alt text must be no more than 200 characters" })
        .trim(),
    tags: z.array(z.string().min(1, { message: "Tag cannot be empty" }))
        .min(1, { message: "At least one tag is required" })
        .max(10, { message: "Maximum 10 tags allowed" }),
    categoryId: z.string().min(1, { message: "Category is required" }),
    authorId: z.string().min(1, { message: "Author is required" }),
    isPublished: z.boolean().optional().default(false),
    isFeatured: z.boolean().optional().default(false),
});

const BlogPostUpdateSchema = z.object({
    title: z.string()
        .min(10, { message: "Title must be at least 10 characters long" })
        .max(100, { message: "Title must be no more than 100 characters long" })
        .trim()
        .optional(),
    excerpt: z.string()
        .min(10, { message: "Excerpt must be at least 10 characters long" })
        .max(300, { message: "Excerpt must be no more than 300 characters long" })
        .trim()
        .optional(),
    content: z.string().min(1, { message: "Content is required" }).optional(),
    readTimeMin: z.number()
        .int({ message: "Read time must be an integer" })
        .min(1, { message: "Read time must be at least 1 minute" })
        .max(999, { message: "Read time must be less than 999 minutes" })
        .optional(),
    imageUrl: z.string()
        .url({ message: "Image URL must be a valid URL" })
        .min(1, { message: "Image URL is required" })
        .optional(),
    imageAlt: z.string()
        .min(1, { message: "Image alt text is required" })
        .max(200, { message: "Image alt text must be no more than 200 characters" })
        .trim()
        .optional(),
    tags: z.array(z.string().min(1, { message: "Tag cannot be empty" }))
        .min(1, { message: "At least one tag is required" })
        .max(10, { message: "Maximum 10 tags allowed" })
        .optional(),
    categoryId: z.string().min(1, { message: "Category is required" }).optional(),
    isPublished: z.boolean().optional(),
    isArchived: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
});

export { BlogPostFormSchema, BlogPostUpdateSchema };