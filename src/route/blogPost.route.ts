import express from "express";
import {
  getAllBlogPosts,
  getBlogPostById,
  getBlogPostsByCategoryId,
  createBlogPost,
  deleteBlogPost,
  updateBlogPost,
  getBlogPostsByAuthorId,
  getBlogPostsByCategoryAndAuthorId,
  getBlogPostsBySearch,
  getFeaturedBlogPosts,
  likeBlogPost,
  dislikeBlogPost,
  archiveBlogPost,
} from "../controller/blogPost.controller";
import { validateBlogPostFormData, validateBlogPostUpdateData } from "../middleware/blogPost.middleware";
import { validateAccessToken } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes (order matters - specific routes before parameterized ones)
router.get("/", getAllBlogPosts);
router.get("/featured", getFeaturedBlogPosts);
router.get("/search", getBlogPostsBySearch);
router.get("/category/:categoryId", getBlogPostsByCategoryId);
router.get("/author/:authorId", getBlogPostsByAuthorId);
router.get(
  "/category/:categoryId/author/:authorId",
  getBlogPostsByCategoryAndAuthorId
);
router.get("/:blogPostId", getBlogPostById);

// Protected routes (require authentication)
router.post("/", validateAccessToken, validateBlogPostFormData, createBlogPost);
router.put("/:blogPostId", validateAccessToken, validateBlogPostUpdateData, updateBlogPost);
router.delete("/:blogPostId", validateAccessToken, deleteBlogPost);
router.patch("/:blogPostId/archive", validateAccessToken, archiveBlogPost);
router.patch("/:blogPostId/like", validateAccessToken, likeBlogPost);
router.patch("/:blogPostId/dislike", validateAccessToken, dislikeBlogPost);

export default router;