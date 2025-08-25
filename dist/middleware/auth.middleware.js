"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAccessToken = exports.validateSigninForm = exports.validateSignupForm = void 0;
const signupForm_schema_1 = require("../libs/schemas/signupForm.schema");
const signinForm_schema_1 = require("../libs/schemas/signinForm.schema");
const zod_1 = __importDefault(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateSignupForm = (req, res, next) => {
    try {
        signupForm_schema_1.SignupFormSchema.parse(req.body);
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            console.error("Signup Form Validation error:\n", error);
            res.status(400).json({ message: error });
            return;
        }
        res.status(500).json({ message: "Internal server error" });
        return;
    }
    next();
};
exports.validateSignupForm = validateSignupForm;
const validateSigninForm = (req, res, next) => {
    try {
        signinForm_schema_1.SigninFormSchema.parse(req.body);
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            console.error("Signin Form Validation error:\n", error);
            res.status(400).json({ message: error });
            return;
        }
        res.status(500).json({ message: "Internal server error" });
        return;
    }
    next();
};
exports.validateSigninForm = validateSigninForm;
const validateAccessToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access token is missing" });
        return;
    }
    // Verify the token
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET);
        req.user = decoded;
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }
    next();
};
exports.validateAccessToken = validateAccessToken;
//# sourceMappingURL=auth.middleware.js.map