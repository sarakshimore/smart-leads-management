import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db";

import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
