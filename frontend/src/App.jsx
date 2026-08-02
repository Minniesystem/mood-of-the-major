import { useCallback, useEffect, useMemo, useState } from "react";
import MoodButton from "./components/MoodButton.jsx";

import Hero from "./components/Hero.jsx";

const moodOptions = [
  { value: "happy", label: "มีความสุข", emoji: "😊" },
  { value: "calm", label: "สบายใจ", emoji: "😌" },
  { value: "tired", label: "เหนื่อย", emoji: "😴" },
  { value: "stressed", label: "เครียด", emoji: "😰" },
  { value: "sad", label: "เศร้า", emoji: "😢" },
  { value: "angry", label: "หงุดหงิด", emoji: "😠" },
];

const majorsByFaculty = {
  วิศวกรรมศาสตร์: [
    "วิศวกรรมเคมี",
    "วิศวกรรมเครื่องกล",
    "วิศวกรรมไฟฟ้า",
    "วิศวกรรมคอมพิวเตอร์",
  ],
  วิทยาศาสตร์: ["เคมี", "ชีววิทยา", "คณิตศาสตร์", "วิทยาการคอมพิวเตอร์"],
  บริหารธุรกิจ: ["การตลาด", "การเงิน", "การจัดการ", "บัญชี"],
};
const API_URL = "https://mood-of-the-major-nine.vercel.app/api";



function getMoodMeta(value) {
  return moodOptions.find((item) => item.value === value) ?? {
    label: value,
    emoji: "🙂",
  };
}

function formatTime(dateString) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

export default function App() {
  const [form, setForm] = useState({
    faculty: "วิศวกรรมศาสตร์",
    major: "วิศวกรรมเคมี",
    mood: "",
    message: "",
  });
  const [posts, setPosts] = useState([]);
  const [summary, setSummary] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const majors = useMemo(
    () => majorsByFaculty[form.faculty] ?? [],
    [form.faculty]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const [postsResponse, summaryResponse] = await Promise.all([
        fetch(`${API_URL}/moods`),
        fetch(`${API_URL}/moods/summary`),
      ]);

      if (!postsResponse.ok || !summaryResponse.ok) {
        throw new Error("โหลดข้อมูลไม่สำเร็จ");
      }

      const postsJson = await postsResponse.json();
      const summaryJson = await summaryResponse.json();

      setPosts(postsJson.data);
      setSummary(summaryJson.data);
    } catch {
      setStatus({
        type: "error",
        message:
          "เชื่อมต่อ Backend ไม่ได้ กรุณาตรวจว่า Terminal ของ Backend เปิดอยู่",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleFacultyChange(event) {
    const faculty = event.target.value;
    const firstMajor = majorsByFaculty[faculty][0];

    setForm((current) => ({
      ...current,
      faculty,
      major: firstMajor,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!form.mood) {
      setStatus({ type: "error", message: "กรุณาเลือกอารมณ์ก่อนส่ง" });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/moods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ส่งข้อมูลไม่สำเร็จ");
      }

      setForm((current) => ({ ...current, mood: "", message: "" }));
      setStatus({ type: "success", message: result.message });
      await loadData();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-slate-100">
      <Hero />

      <div className="mx-auto grid max-w-6xl gap-7 px-5 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-white bg-white p-6 shadow-xl shadow-slate-200/60">
          <div>
            <p className="text-sm font-semibold text-orange-600">SHARE YOUR MOOD</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              วันนี้รู้สึกอย่างไร
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              ไม่ต้องกรอกชื่อ อีเมล หรือรหัสนักศึกษา
            </p>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">คณะ</span>
                <select
                  value={form.faculty}
                  onChange={handleFacultyChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                >
                  {Object.keys(majorsByFaculty).map((faculty) => (
                    <option key={faculty} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">สาขา</span>
                <select
                  value={form.major}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      major: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                >
                  {majors.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700">
                เลือกอารมณ์
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {moodOptions.map((item) => (
                  <MoodButton
                    key={item.value}
                    item={item}
                    selected={form.mood === item.value}
                    onSelect={(mood) =>
                      setForm((current) => ({ ...current, mood }))
                    }
                  />
                ))}
              </div>
            </div>

            <label className="block space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  ข้อความเพิ่มเติม
                </span>
                <span className="text-xs text-slate-400">
                  {form.message.length}/250
                </span>
              </div>
              <textarea
                value={form.message}
                maxLength={250}
                rows={4}
                placeholder="เล่าได้สั้น ๆ ว่าวันนี้เกิดอะไรขึ้น (ไม่บังคับ)"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    message: event.target.value,
                  }))
                }
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </label>

            {status.message && (
              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-orange-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "กำลังส่ง..." : "ส่งความรู้สึก"}
            </button>
          </form>
        </section>
        
        <section className="space-y-6">
          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
            <p className="text-sm font-semibold text-orange-300">MOOD OVERVIEW</p>
            <h2 className="mt-1 text-2xl font-bold">ภาพรวมอารมณ์</h2>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {summary.map((item) => {
                const meta = getMoodMeta(item.mood);
                return (
                  <div
                    key={item.mood}
                    className="rounded-2xl bg-white/10 p-4 backdrop-blur"
                  >
                    <div className="text-2xl">{meta.emoji}</div>
                    <div className="mt-2 text-sm text-slate-300">{meta.label}</div>
                    <div className="mt-1 text-2xl font-bold">{item.count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white bg-white p-6 shadow-xl shadow-slate-200/60">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-orange-600">RECENT POSTS</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  ความรู้สึกล่าสุด
                </h2>
              </div>
              <button
                type="button"
                onClick={loadData}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                รีเฟรช
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {loading ? (
                <p className="text-slate-500">กำลังโหลด...</p>
              ) : posts.length === 0 ? (
                <p className="text-slate-500">ยังไม่มีข้อมูล</p>
              ) : (
                posts.slice(0, 8).map((post) => {
                  const meta = getMoodMeta(post.mood);
                  return (
                    <article
                      key={post.id}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{meta.emoji}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2">
                            <h3 className="font-bold text-slate-800">{meta.label}</h3>
                            <span className="text-xs text-slate-400">
                              {formatTime(post.createdAt)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-orange-600">
                            {post.faculty} · {post.major}
                          </p>
                          {post.message && (
                            <p className="mt-2 break-words text-slate-600">
                              “{post.message}”
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>
        
      </div>
    </main>
  );
}
