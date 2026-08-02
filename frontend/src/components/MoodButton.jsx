export default function MoodButton({ item, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.value)}
      className={`rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
          : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
      }`}
    >
      <div className="text-3xl">{item.emoji}</div>
      <div className="mt-2 font-semibold text-slate-800">{item.label}</div>
    </button>
  );
}
