"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentSchema = exports.createCommentSchema = void 0;
const zod_1 = require("zod");
const createCommentSchema = zod_1.z.object({
    comment: zod_1.z.string().min(1, { message: "Comment is required" }).max(1000, { message: "Comment must be less than 1000 characters" }),
    blogPostId: zod_1.z.string().min(1, { message: "Blog post id is required" }),
});
exports.createCommentSchema = createCommentSchema;
const updateCommentSchema = zod_1.z.object({
    comment: zod_1.z.string().min(1, { message: "Comment is required" }),
});
exports.updateCommentSchema = updateCommentSchema;
//# sourceMappingURL=comment.schema.js.map