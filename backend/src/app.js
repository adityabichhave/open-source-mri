import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import scanRoutes from "./routes/scanRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Open Source MRI backend is running"
  });
});

app.use("/api/scan", scanRoutes);

export default app;