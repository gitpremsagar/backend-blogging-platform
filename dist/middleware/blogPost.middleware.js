"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlogPostUpdateData = exports.validateBlogPostFormData = void 0;
const blogPostForm_schema_1 = require("../libs/schemas/blogPostForm.schema");
const zod_1 = __importDefault(require("zod"));
const validateBlogPostFormData = (req, res, next) => {
    try {
        const { title, excerpt, content, readTimeMin, imageUrl, imageAlt, tags, categoryId, authorId, isPublished, isFeatured } = req.body;
        const validatedData = blogPostForm_schema_1.BlogPostFormSchema.parse({
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
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            res.status(400).json({ message: error });
        }
        else {
            console.error("Error validating blog post form data:\n", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};
exports.validateBlogPostFormData = validateBlogPostFormData;
const validateBlogPostUpdateData = (req, res, next) => {
    try {
        const validatedData = blogPostForm_schema_1.BlogPostUpdateSchema.parse(req.body);
        req.body = validatedData;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            res.status(400).json({ message: error.message });
        }
        else {
            console.error("Error validating blog post update data:\n", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};
exports.validateBlogPostUpdateData = validateBlogPostUpdateData;
//# sourceMappingURL=blogPost.middleware.js.map