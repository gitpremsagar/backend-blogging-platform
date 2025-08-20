import express from "express";
import { signup, signin, signout, refreshAccessToken, forgotPassword, changePassword } from "../controller/auth.controller";
import { validateSignupForm,validateSigninForm } from "../middleware/auth.middleware";
const router = express.Router();

router.post("/signup", validateSignupForm, signup);

router.post("/signin", validateSigninForm, signin);

router.post("/signout", signout);

router.post("/refresh-access-token", refreshAccessToken);

router.post("/forgot-password", forgotPassword);

router.post("/change-password", changePassword);

router.post("/refresh-access-token", refreshAccessToken);

router.post("/forgot-password", forgotPassword);

router.post("/change-password", changePassword);

export default router;
