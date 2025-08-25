"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigninFormSchema = void 0;
const zod_1 = require("zod");
exports.SigninFormSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email address"),
    password: zod_1.z.string().min(6, "Invalid password").max(100, "Invalid password"),
});
//# sourceMappingURL=signinForm.schema.js.map