import express from "express";
import cors from "cors";
import helmet from "helmet";
import moodRouter from "./routes/moods.js";

const app = express();
const PORT = process.env.PORT || 4000;

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

app.listen(PORT, () => {
  console.log(`Mood API is running at http://localhost:${PORT}`);
});
