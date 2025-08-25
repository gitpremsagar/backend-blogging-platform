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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.forgotPassword = exports.decodeAccessToken = exports.refreshAccessToken = exports.signout = exports.signin = exports.signup = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, type } = req.body;
    //check if user already exists
    const existingUser = yield prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = yield bcrypt_1.default.hash(password, +process.env.BCRYPT_SALT_ROUNDS);
    try {
        // Create the user
        const user = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                type,
            },
        });
        // Send response
        res.status(201).json({ user });
        return;
    }
    catch (error) {
        console.error("Error creating user:\n", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Implement login logic here
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: "Invalid email or password" });
    }
    const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
    };
    // Generate JWT tokens
    const accessToken = jsonwebtoken_1.default.sign(Object.assign({}, userData), process.env.ACCESS_TOKEN_JWT_SECRET, { expiresIn: +process.env.ACCESS_TOKEN_JWT_EXPIRY });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.REFRESH_TOKEN_JWT_SECRET, { expiresIn: +process.env.REFRESH_TOKEN_JWT_EXPIRY });
    // send refresh token to client
    res
        .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // maxAge: +process.env.REFRESH_TOKEN_COOKIE_EXPIRY!,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "none",
        path: "/",
    })
        .cookie("accessToken", accessToken, {
        maxAge: +process.env.ACCESS_TOKEN_COOKIE_EXPIRY,
        path: "/",
    })
        .json({ accessToken, user: userData });
    return;
});
exports.signin = signin;
const signout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // remove refresh token cookie
    res
        .status(204)
        .cookie("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Match signin setting
        maxAge: 0,
        sameSite: "none", // Match signin setting
        path: "/",
    })
        .cookie("accessToken", "", {
        maxAge: 0,
        path: "/",
    })
        .send();
    return;
});
exports.signout = signout;
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    // console.log("Cookie is\n", req.cookies);
    if (!refreshToken) {
        console.log("Refreshing access token failed: Refresh token is missing");
        return res.status(401).json({ message: "Refresh token is missing" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_JWT_SECRET);
        const user = yield prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            type: user.type,
        };
        // Generate new access token
        const accessToken = jsonwebtoken_1.default.sign(Object.assign({}, userData), process.env.ACCESS_TOKEN_JWT_SECRET, { expiresIn: +process.env.ACCESS_TOKEN_JWT_EXPIRY } // Remove '+' if using "1h" etc.
        );
        res.cookie("accessToken", accessToken, {
            maxAge: +process.env.ACCESS_TOKEN_COOKIE_EXPIRY,
            path: "/",
        })
            .send({ accessToken, user: userData });
    }
    catch (error) {
        if (error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError") {
            console.log("Error while refreshing access token\n", error);
            return res
                .status(401)
                .json({ message: "Invalid or expired refresh token" });
        }
        console.error("Error refreshing access token:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.refreshAccessToken = refreshAccessToken;
const decodeAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(req.user);
});
exports.decodeAccessToken = decodeAccessToken;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // Implement forgot password logic here
});
exports.forgotPassword = forgotPassword;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    // Implement change password logic here
});
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map