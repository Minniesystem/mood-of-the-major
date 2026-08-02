import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import moodRouter from "./routes/moods.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Mood API is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();

app.use(helmet());
app.use(cors({ origin: ["http://localhost:5173", "https://mood-of-the-major-9rr3.vercel.app"] }));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Mood API is working" });
});

app.use("/api/moods", moodRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "เกิดข้อผิดพลาดภายในระบบ" });
});


