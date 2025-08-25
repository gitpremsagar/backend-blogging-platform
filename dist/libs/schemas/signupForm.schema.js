"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupFormSchema = void 0;
const zod_1 = require("zod");
exports.SignupFormSchema = zod_1.z
    .object({
    email: zod_1.z.email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must be at most 100 characters long")
        .trim(),
    type: zod_1.z.enum(["USER", "ADMIN"]),
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters long")
        .max(100, "Name must be at most 100 characters long")
        .trim(),
    confirmPassword: zod_1.z
        .string()
        .min(6, "Confirm Password must be at least 6 characters long")
        .max(100, "Confirm Password must be at most 100 characters long"),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
//# sourceMappingURL=signupForm.schema.js.map