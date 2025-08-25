"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateCommentForm = exports.validateCommentForm = void 0;
const comment_schema_1 = require("../libs/schemas/comment.schema");
const zod_1 = __importDefault(require("zod"));
const validateCommentForm = (req, res, next) => {
    try {
        const { comment, blogPostId } = req.body;
        const validatedData = comment_schema_1.createCommentSchema.parse({ comment, blogPostId });
        req.body = validatedData;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};
exports.validateCommentForm = validateCommentForm;
const validateUpdateCommentForm = (req, res, next) => {
    try {
        const { comment } = req.body;
        const validatedData = comment_schema_1.updateCommentSchema.parse({ comment });
        req.body = validatedData;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};
exports.validateUpdateCommentForm = validateUpdateCommentForm;
//# sourceMappingURL=comment.middleware.js.map