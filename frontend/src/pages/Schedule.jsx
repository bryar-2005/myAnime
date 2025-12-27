import { useEffect, useState } from "react";
import { getAnimes } from "../lib/api";

export default function Schedule() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getAnimes({ sort: "recent", per_page: 15 });
        setItems(res.data || res);
      } catch (err) {
        setError(err.message || "نەتوانرا خشتە باربکرێت");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="px-6 md:px-10 pb-12 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">پەخش</p>
        <h1 className="text-3xl font-display font-semibold">خشتەی پەخش</h1>
      </div>

      {loading && <p className="text-muted">ئەڵقە داهاتووەکان بار دەکرێن...</p>}
      {error && <p className="text-red-300">{error}</p>}

      {!loading && !error && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-surface/70 border border-line hover:border-accent transition space-y-2"
            >
              <div className="flex items-center justify-between text-sm text-muted">
                <span>{item.status === 'ongoing' ? "بەردەوامە" : (item.status === 'completed' ? "تەواوبووە" : "بەمزوانە")}</span>
                <span>{item.year || "ساڵ"}</span>
              </div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted line-clamp-2">{item.synopsis || "ئەڵقەی تازە بەم نزیکانە."}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
