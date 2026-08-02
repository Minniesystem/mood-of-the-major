import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

const allowedMoods = [
  "happy",
  "calm",
  "tired",
  "stressed",
  "sad",
  "angry",
];

const moodSchema = new mongoose.Schema(
  {
    faculty: {
      type: String,
      required: true,
      trim: true,
    },
    major: {
      type: String,
      required: true,
      trim: true,
    },
    mood: {
      type: String,
      required: true,
      enum: allowedMoods,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Mood =
  mongoose.models.Mood || mongoose.model("Mood", moodSchema);

router.get("/", async (_req, res, next) => {
  try {
    const moods = await Mood.find()
      .sort({ createdAt: -1 })
      .lean();

    const data = moods.map((item) => ({
      id: item._id.toString(),
      faculty: item.faculty,
      major: item.major,
      mood: item.mood,
      message: item.message,
      createdAt: item.createdAt,
    }));

    res.json({ data });
  } catch (error) {
    next(error);
  }
});

router.get("/summary", async (_req, res, next) => {
  try {
    const grouped = await Mood.aggregate([
      {
        $group: {
          _id: "$mood",
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = Object.fromEntries(
      grouped.map((item) => [item._id, item.count])
    );

    const data = allowedMoods.map((mood) => ({
      mood,
      count: countMap[mood] ?? 0,
    }));

    const total = data.reduce((sum, item) => sum + item.count, 0);

    res.json({ total, data });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
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
      return res.status(400).json({
        message: "อารมณ์ที่เลือกไม่ถูกต้อง",
      });
    }

    if (message.length > 250) {
      return res.status(400).json({
        message: "ข้อความต้องไม่เกิน 250 ตัวอักษร",
      });
    }

    const newMood = await Mood.create({
      faculty,
      major,
      mood,
      message,
    });

    return res.status(201).json({
      message: "ส่งความรู้สึกเรียบร้อยแล้ว",
      data: {
        id: newMood._id.toString(),
        faculty: newMood.faculty,
        major: newMood.major,
        mood: newMood.mood,
        message: newMood.message,
        createdAt: newMood.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;