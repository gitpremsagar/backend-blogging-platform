import express from "express";
import { getAllBlogPosts, getBlogPostById, getBlogPostsByCategoryId, } from "../controller/blogPost.controller";

const router = express.Router();

router.get("/", getAllBlogPosts);
router.get("/:blogPostId", getBlogPostById);
router.get("/category/:categoryId", getBlogPostsByCategoryId);
// router.get("/author/:authorId", getBlogPostsByAuthorId);
// router.get("/category/:categoryId/author/:authorId", getBlogPostsByCategoryAndAuthorId);
// router.get("/search", getBlogPostsBySearch);



export default router;