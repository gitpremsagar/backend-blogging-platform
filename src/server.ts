
import express from "express";
import cookieParser from "cookie-parser";
import authRouteHandler from "./route/auth.route";
const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouteHandler);

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
