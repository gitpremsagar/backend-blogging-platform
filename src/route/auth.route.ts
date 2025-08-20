import express from "express";
import { signup, signin, signout, refreshAccessToken, forgotPassword, changePassword } from "../controller/auth.controller";
const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/signout", signout);

router.post("/refresh-access-token", refreshAccessToken);

router.post("/forgot-password", forgotPassword);

router.post("/change-password", changePassword);

router.post("/refresh-access-token", refreshAccessToken);

router.post("/forgot-password", forgotPassword);

router.post("/change-password", changePassword);

export default router;
