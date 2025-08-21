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
} from "../controller/blogPost.controller";
import { validateBlogPostFormData } from "../middleware/blogPost.middleware";
import { validateAccessToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", validateAccessToken, validateBlogPostFormData, createBlogPost);
router.get("/", getAllBlogPosts);
router.get("/:blogPostId", getBlogPostById);
router.get("/category/:categoryId", getBlogPostsByCategoryId);
router.get("/author/:authorId", getBlogPostsByAuthorId);
router.get(
  "/category/:categoryId/author/:authorId",
  getBlogPostsByCategoryAndAuthorId
);
router.get("/search", getBlogPostsBySearch);
router.put("/:blogPostId", validateAccessToken, validateBlogPostFormData, updateBlogPost);
router.delete("/:blogPostId", validateAccessToken, deleteBlogPost);

export default router;