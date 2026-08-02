export default function Hero() {
  return (
    <header className="border-b border-white/80 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 py-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          Anonymous Student Mood Space
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Mood of the Major
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          พื้นที่แบ่งปันความรู้สึกแบบไม่เปิดเผยตัวตน
          และดูภาพรวมบรรยากาศของนักศึกษาแต่ละสาขา
        </p>
      </div>
    </header>
  );
}