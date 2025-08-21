import express from "express";
import { getAllBlogCategories, getBlogCategoryById, createBlogCategory, updateBlogCategory, deleteBlogCategory } from "../controller/blogCategory.controller";
import { validateBlogCategoryForm } from "../middleware/blogCategory.middleware";
import { validateAccessToken } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getAllBlogCategories);

router.get("/:blogCategoryId", getBlogCategoryById);

router.post("/", validateAccessToken, validateBlogCategoryForm, createBlogCategory);

router.put("/:blogCategoryId", validateAccessToken, updateBlogCategory);

router.delete("/:blogCategoryId", validateAccessToken, deleteBlogCategory);

export default router;