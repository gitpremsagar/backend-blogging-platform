import express from "express";
import { validateAccessToken } from "../middleware/auth.middleware";
import { validateCommentForm, validateUpdateCommentForm } from "../middleware/comment.middleware";
import { createComment, updateComment } from "../controller/comment.controller";

const router = express.Router();

router.post("/", validateAccessToken, validateCommentForm, createComment);
router.put("/:commentId", validateAccessToken, validateUpdateCommentForm, updateComment);

export default router;