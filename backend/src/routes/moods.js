import { Router } from "express";
import crypto from "node:crypto";

const router = Router();

const allowedMoods = ["happy", "calm", "tired", "stressed", "sad", "angry"];

const moods = [
  {
    id: crypto.randomUUID(),
    faculty: "วิศวกรรมศาสตร์",
    major: "วิศวกรรมเคมี",
    mood: "tired",
    message: "วันนี้มีรายงานหลายวิชา แต่ยังไหวอยู่",
    createdAt: new Date().toISOString(),
  },
];

router.get("/", (_req, res) => {
  const newestFirst = [...moods].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.json({ data: newestFirst });
});

router.get("/summary", (_req, res) => {
  const summary = allowedMoods.map((mood) => ({
    mood,
    count: moods.filter((item) => item.mood === mood).length,
  }));

  res.json({ total: moods.length, data: summary });
});

router.post("/", (req, res) => {
  const faculty = String(req.body.faculty ?? "").trim();
  const major = String(req.body.major ?? "").trim();
  const mood = String(req.body.mood ?? "").trim();
  const message = String(req.body.message ?? "").trim();

  if (!faculty || !major || !mood) {
    return res.status(400).json({
      message: "กรุณาเลือกคณะ สาขา และอารมณ์ให้ครบ",
    });
  }

  if (!allowedMoods.includes(mood)) {
    return res.status(400).json({ message: "อารมณ์ที่เลือกไม่ถูกต้อง" });
  }

  if (message.length > 250) {
    return res.status(400).json({
      message: "ข้อความต้องไม่เกิน 250 ตัวอักษร",
    });
  }

  const newMood = {
    id: crypto.randomUUID(),
    faculty,
    major,
    mood,
    message,
    createdAt: new Date().toISOString(),
  };

  moods.push(newMood);
  return res.status(201).json({
    message: "ส่งความรู้สึกเรียบร้อยแล้ว",
    data: newMood,
  });
});

export default router;
