import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import { getAnimes } from "../lib/api";

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "";
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState(initialType);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = useMemo(
    () => [
      { label: "هەموو", value: "" },
      { label: "ئەنیمە (زنجیرە)", value: "TV" },
      { label: "ئەنیمە (فیلم)", value: "Movie" },
      { label: "مانگا", value: "Manga" },
    ],
    []
  );

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (type) next.set("type", type);
      else next.delete("type");
      return next;
    });
  }, [type, setSearchParams]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getAnimes({ q: query, status, type, per_page: 24 });
        setItems(res.data || res);
      } catch (err) {
        setError(err.message || "نەتوانرا ناونیشانەکان بهێنرێن");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [query, status, type]);

  return (
    <main className="px-6 md:px-10 pb-12 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">کتێبخانە</p>
            <h1 className="text-3xl font-display font-semibold">گەڕان لە ئەنیمێ و مانگا</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              placeholder="گەڕان..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-2 rounded-full bg-surface/70 border border-line focus:border-accent outline-none"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 rounded-full bg-surface/70 border border-line focus:border-accent outline-none"
            >
              <option value="">هەموو دۆخەکان</option>
              <option value="ongoing">بەردەوامە</option>
              <option value="completed">تەواوبووە</option>
              <option value="upcoming">بەمزوانە</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.value || "all"}
              onClick={() => setType(t.value)}
              className={`px-3 py-2 rounded-full border transition ${type === t.value ? "border-accent text-white bg-accent/10" : "border-line text-muted hover:text-white"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-surface/60 border border-line animate-pulse h-56" />
          ))}
        </div>
      )}
      {error && <p className="text-red-300">{error}</p>}
      {!loading && !error && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <AnimeCard key={item.id} anime={item} />
          ))}
          {items.length === 0 && <p className="text-muted">هیچ ئەنجامێک نییە.</p>}
        </div>
      )}
    </main>
  );
}
