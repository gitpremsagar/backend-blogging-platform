"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogCategoryFormSchema = void 0;
const zod_1 = require("zod");
exports.BlogCategoryFormSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(20, { message: "Name must be no more than 20 characters long" })
        .trim(),
});
//# sourceMappingURL=categoryForm.schema.js.map