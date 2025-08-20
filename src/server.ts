
import express from "express";
import cookieParser from "cookie-parser";

// Route Handlers
import authRouteHandler from "./route/auth.route";
import blogPostRouteHandler from "./route/blogPost.route";
import blogCategoryRouteHandler from "./route/blogCategory.route";

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouteHandler);
app.use("/api/blog-post", blogPostRouteHandler);
app.use("/api/blog-category", blogCategoryRouteHandler);

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
