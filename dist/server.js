"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
// Route Handlers
const auth_route_1 = __importDefault(require("./route/auth.route"));
const blogPost_route_1 = __importDefault(require("./route/blogPost.route"));
const blogCategory_route_1 = __importDefault(require("./route/blogCategory.route"));
const comment_route_1 = __importDefault(require("./route/comment.route"));
const app = (0, express_1.default)();
// allow all origins
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_DOMAIN || "https://frontend-blogging-platform.vercel.app" || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
// endpoints
app.use("/api/auth", auth_route_1.default);
app.use("/api/blog-post", blogPost_route_1.default);
app.use("/api/blog-category", blogCategory_route_1.default);
app.use("/api/comment", comment_route_1.default);
const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Visit: http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map