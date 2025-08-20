
import express from "express";
const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// route handlers
import authRouteHandler from "./route/auth.route";

app.use(express.json());

app.use("/api/auth", authRouteHandler);

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
