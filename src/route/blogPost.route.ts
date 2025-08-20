import express from "express";
import { getAllBlogPosts, getBlogPostById, getBlogPostsByCategoryId, createBlogPost, deleteBlogPost, updateBlogPost, getBlogPostsByAuthorId, getBlogPostsByCategoryAndAuthorId, getBlogPostsBySearch } from "../controller/blogPost.controller";
import { validateBlogPostFormData } from "../middleware/blogPost.middleware";

const router = express.Router();

router.post("/", validateBlogPostFormData, createBlogPost);//TODO: validate access token
router.get("/", getAllBlogPosts);
router.get("/:blogPostId", getBlogPostById);
router.get("/category/:categoryId", getBlogPostsByCategoryId);
router.get("/author/:authorId", getBlogPostsByAuthorId);
router.get("/category/:categoryId/author/:authorId", getBlogPostsByCategoryAndAuthorId);
router.get("/search", getBlogPostsBySearch);
router.put("/:blogPostId", validateBlogPostFormData, updateBlogPost);//TODO: validate access token
router.delete("/:blogPostId", deleteBlogPost);//TODO: validate access token 

export default router;