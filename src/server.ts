
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Route Handlers
import authRouteHandler from "./route/auth.route";
import blogPostRouteHandler from "./route/blogPost.route";
import blogCategoryRouteHandler from "./route/blogCategory.route";
import commentRouteHandler from "./route/comment.route";

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// allow all origins
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// endpoints
app.use("/api/auth", authRouteHandler);
app.use("/api/blog-post", blogPostRouteHandler);
app.use("/api/blog-category", blogCategoryRouteHandler);
app.use("/api/comment", commentRouteHandler);

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
