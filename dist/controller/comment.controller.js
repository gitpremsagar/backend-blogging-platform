"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComment = exports.createComment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment, blogPostId } = req.body;
    const userId = req.user.id;
    try {
        const newComment = yield prisma.comment.create({
            data: {
                comment,
                postId: blogPostId,
                userId,
                blogPost: { connect: { id: blogPostId } },
                user: { connect: { id: userId } },
            },
        });
        res.status(201).json({ newComment });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            res.status(400).json({ message: "Could not create comment" });
            return;
        }
        console.error("Error creating comment:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createComment = createComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment } = req.body;
    const userId = req.user.id;
    const { commentId } = req.params;
    try {
        const updatedComment = yield prisma.comment.update({
            where: { id: commentId, userId },
            data: { comment },
        });
        res.status(200).json({ updatedComment });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                res.status(404).json({ message: "Comment not found" });
                return;
            }
            res.status(400).json({ message: "Could not update comment" });
            return;
        }
        console.error("Error updating comment:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateComment = updateComment;
//# sourceMappingURL=comment.controller.js.map