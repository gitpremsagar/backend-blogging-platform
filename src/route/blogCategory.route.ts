import express from "express";
import { getAllBlogCategories, getBlogCategoryById, createBlogCategory, updateBlogCategory, deleteBlogCategory } from "../controller/blogCategory.controller";
import { validateBlogCategoryForm } from "../middleware/blogCategory.middleware";

const router = express.Router();

router.get("/", getAllBlogCategories);

router.get("/:blogCategoryId", getBlogCategoryById);

router.post("/", validateBlogCategoryForm, createBlogCategory);

router.put("/:blogCategoryId", updateBlogCategory);

router.delete("/:blogCategoryId", deleteBlogCategory);

export default router;