"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/sign-up", auth_middleware_1.validateSignupForm, auth_controller_1.signup);
router.post("/sign-in", auth_middleware_1.validateSigninForm, auth_controller_1.signin);
router.post("/sign-out", auth_controller_1.signout);
router.post("/decode-access-token", auth_middleware_1.validateAccessToken, auth_controller_1.decodeAccessToken);
router.post("/refresh-access-token", auth_controller_1.refreshAccessToken);
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.post("/change-password", auth_controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=auth.route.js.map