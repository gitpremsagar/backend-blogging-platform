"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogCategory_controller_1 = require("../controller/blogCategory.controller");
const blogCategory_middleware_1 = require("../middleware/blogCategory.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/", blogCategory_controller_1.getAllBlogCategories);
router.get("/:blogCategoryId", blogCategory_controller_1.getBlogCategoryById);
router.post("/", blogCategory_middleware_1.validateBlogCategoryForm, blogCategory_controller_1.createBlogCategory); //TODO: Add authentication
router.put("/:blogCategoryId", auth_middleware_1.validateAccessToken, blogCategory_controller_1.updateBlogCategory);
router.delete("/:blogCategoryId", auth_middleware_1.validateAccessToken, blogCategory_controller_1.deleteBlogCategory);
exports.default = router;
//# sourceMappingURL=blogCategory.route.js.map