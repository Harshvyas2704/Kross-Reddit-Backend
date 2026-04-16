import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/connectDB";
import authRoutes from "./routes/authRoutes";

// Load variables
dotenv.config();

// Initialize Engine
const app: Application = express();

// Security & Middleware Armor
app.use(helmet());
app.use(cors());
app.use(express.json()); // Body parser

// Ignite Database
connectDB();

// Health Check Route
app.get("/api/v1/health", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "Kross-Reddit Engine is Live" });
});

// Start Server
const PORT = process.env.PORT || 8777;
app.listen(PORT, () => {
  console.log(`[SERVER ONLINE] Engine running on port ${PORT}`);
});

app.use("/api/v1/auth", authRoutes);
