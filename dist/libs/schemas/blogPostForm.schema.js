"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostUpdateSchema = exports.BlogPostFormSchema = void 0;
const zod_1 = require("zod");
const BlogPostFormSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(10, { message: "Title must be at least 10 characters long" })
        .max(100, { message: "Title must be no more than 100 characters long" })
        .trim(),
    excerpt: zod_1.z.string()
        .min(10, { message: "Excerpt must be at least 10 characters long" })
        .max(300, { message: "Excerpt must be no more than 300 characters long" })
        .trim(),
    content: zod_1.z.string().min(1, { message: "Content is required" }),
    readTimeMin: zod_1.z.number()
        .int({ message: "Read time must be an integer" })
        .min(1, { message: "Read time must be at least 1 minute" })
        .max(999, { message: "Read time must be less than 999 minutes" }),
    imageUrl: zod_1.z.string()
        .url({ message: "Image URL must be a valid URL" })
        .min(1, { message: "Image URL is required" }),
    imageAlt: zod_1.z.string()
        .min(1, { message: "Image alt text is required" })
        .max(200, { message: "Image alt text must be no more than 200 characters" })
        .trim(),
    tags: zod_1.z.array(zod_1.z.string().min(1, { message: "Tag cannot be empty" }))
        .min(1, { message: "At least one tag is required" })
        .max(10, { message: "Maximum 10 tags allowed" }),
    categoryId: zod_1.z.string().min(1, { message: "Category is required" }),
    authorId: zod_1.z.string().min(1, { message: "Author is required" }),
    isPublished: zod_1.z.boolean().optional().default(false),
    isFeatured: zod_1.z.boolean().optional().default(false),
});
exports.BlogPostFormSchema = BlogPostFormSchema;
const BlogPostUpdateSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(10, { message: "Title must be at least 10 characters long" })
        .max(100, { message: "Title must be no more than 100 characters long" })
        .trim()
        .optional(),
    excerpt: zod_1.z.string()
        .min(10, { message: "Excerpt must be at least 10 characters long" })
        .max(300, { message: "Excerpt must be no more than 300 characters long" })
        .trim()
        .optional(),
    content: zod_1.z.string().min(1, { message: "Content is required" }).optional(),
    readTimeMin: zod_1.z.number()
        .int({ message: "Read time must be an integer" })
        .min(1, { message: "Read time must be at least 1 minute" })
        .max(999, { message: "Read time must be less than 999 minutes" })
        .optional(),
    imageUrl: zod_1.z.string()
        .url({ message: "Image URL must be a valid URL" })
        .min(1, { message: "Image URL is required" })
        .optional(),
    imageAlt: zod_1.z.string()
        .min(1, { message: "Image alt text is required" })
        .max(200, { message: "Image alt text must be no more than 200 characters" })
        .trim()
        .optional(),
    tags: zod_1.z.array(zod_1.z.string().min(1, { message: "Tag cannot be empty" }))
        .min(1, { message: "At least one tag is required" })
        .max(10, { message: "Maximum 10 tags allowed" })
        .optional(),
    categoryId: zod_1.z.string().min(1, { message: "Category is required" }).optional(),
    isPublished: zod_1.z.boolean().optional(),
    isArchived: zod_1.z.boolean().optional(),
    isFeatured: zod_1.z.boolean().optional(),
});
exports.BlogPostUpdateSchema = BlogPostUpdateSchema;
//# sourceMappingURL=blogPostForm.schema.js.map