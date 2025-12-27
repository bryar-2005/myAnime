import { useMemo, useState } from "react";

export default function HeroCarousel({ items = [], fallback }) {
  const data = useMemo(() => (items && items.length ? items : fallback ? [fallback] : []), [items, fallback]);
  const [index, setIndex] = useState(0);
  const active = data[index] || fallback;

  const next = () => setIndex((prev) => (prev + 1) % data.length);
  const prev = () => setIndex((prev) => (prev - 1 + data.length) % data.length);

  if (!active) return null;

  return (
    <section className="grid lg:grid-cols-2 gap-8 items-center hero-frame">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs uppercase tracking-wide rounded-full bg-white/10 border border-white/10">
            ئەڵقەی تازە
          </span>
          <span className="text-sm text-muted">تیشکەوەر</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight max-w-2xl">{active.title}</h1>
        <p className="text-muted max-w-2xl line-clamp-3">{active.synopsis}</p>
        <div className="flex flex-wrap gap-2">
          {(active.genres || []).slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 text-xs uppercase tracking-wide rounded-full bg-white/10 border border-white/10"
            >
              {tag.name}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={`/anime/${active.id}`}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-accent to-accent2 text-surface font-semibold shadow-card hover:translate-y-[-1px] transition"
          >
            بینینی ئەڵقە
          </a>
          <button
            onClick={prev}
            className="px-4 py-3 rounded-full bg-white/10 border border-white/10 hover:border-accent transition"
            disabled={data.length < 2}
          >
            پێشوو
          </button>
          <button
            onClick={next}
            className="px-4 py-3 rounded-full bg-white/10 border border-white/10 hover:border-accent transition"
            disabled={data.length < 2}
          >
            دواتر
          </button>
        </div>
        {data.length > 1 && (
          <div className="flex gap-2">
            {data.map((_, i) => (
              <span
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition ${i === index ? "bg-accent" : "bg-white/20"
                  }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <div className="glass rounded-3xl overflow-hidden shadow-card border border-line/50 glow">
          {active.banner_image || active.cover_image ? (
            <img
              src={active.banner_image || active.cover_image}
              alt={active.title}
              className="w-full h-[420px] object-cover"
            />
          ) : (
            <div className="w-full h-[420px] bg-line" />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-transparent" />
          <div className="absolute left-6 bottom-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">پەخش</div>
            <div>
              <p className="text-sm text-muted">
                {active.status === 'ongoing' ? "بەردەوامە" : (active.status === 'completed' ? "تەواوبووە" : "بەمزوانە")}
              </p>
              <p className="font-semibold">دەستپێبکە</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
