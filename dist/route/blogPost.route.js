"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogPost_controller_1 = require("../controller/blogPost.controller");
const blogPost_middleware_1 = require("../middleware/blogPost.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public routes (order matters - specific routes before parameterized ones)
router.get("/", blogPost_controller_1.getAllBlogPosts);
router.get("/featured", blogPost_controller_1.getFeaturedBlogPosts);
router.get("/search", blogPost_controller_1.getBlogPostsBySearch);
router.get("/category/:categoryId", blogPost_controller_1.getBlogPostsByCategoryId);
router.get("/author/:authorId", blogPost_controller_1.getBlogPostsByAuthorId);
router.get("/category/:categoryId/author/:authorId", blogPost_controller_1.getBlogPostsByCategoryAndAuthorId);
router.get("/:blogPostId", blogPost_controller_1.getBlogPostById);
// Protected routes (require authentication)
router.post("/", auth_middleware_1.validateAccessToken, blogPost_middleware_1.validateBlogPostFormData, blogPost_controller_1.createBlogPost);
router.put("/:blogPostId", auth_middleware_1.validateAccessToken, blogPost_middleware_1.validateBlogPostUpdateData, blogPost_controller_1.updateBlogPost);
router.delete("/:blogPostId", auth_middleware_1.validateAccessToken, blogPost_controller_1.deleteBlogPost);
router.patch("/:blogPostId/archive", auth_middleware_1.validateAccessToken, blogPost_controller_1.archiveBlogPost);
router.patch("/:blogPostId/like", auth_middleware_1.validateAccessToken, blogPost_controller_1.likeBlogPost);
router.patch("/:blogPostId/dislike", auth_middleware_1.validateAccessToken, blogPost_controller_1.dislikeBlogPost);
exports.default = router;
//# sourceMappingURL=blogPost.route.js.map