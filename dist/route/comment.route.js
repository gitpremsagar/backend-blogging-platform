"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const comment_middleware_1 = require("../middleware/comment.middleware");
const comment_controller_1 = require("../controller/comment.controller");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.validateAccessToken, comment_middleware_1.validateCommentForm, comment_controller_1.createComment);
router.put("/:commentId", auth_middleware_1.validateAccessToken, comment_middleware_1.validateUpdateCommentForm, comment_controller_1.updateComment);
exports.default = router;
//# sourceMappingURL=comment.route.js.map