"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlogCategoryForm = void 0;
const categoryForm_schema_1 = require("../libs/schemas/categoryForm.schema");
const zod_1 = __importDefault(require("zod"));
const validateBlogCategoryForm = (req, res, next) => {
    try {
        const { name } = req.body;
        categoryForm_schema_1.BlogCategoryFormSchema.parse({ name });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            res.status(400).json({ message: error.message });
            return;
        }
        console.error("Error validating create blog category form:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.validateBlogCategoryForm = validateBlogCategoryForm;
//# sourceMappingURL=blogCategory.middleware.js.map