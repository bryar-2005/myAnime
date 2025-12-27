import { useEffect, useMemo, useState } from "react";
import AnimeCard from "../components/AnimeCard";
import { getAnimes } from "../lib/api";
import Footer from "../components/Footer";
import HeroCarousel from "../components/HeroCarousel";

const pill = "px-3 py-1 text-xs uppercase tracking-wide rounded-full bg-white/10 border border-white/10";

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const [trending, setTrending] = useState([]);
  const [films, setFilms] = useState([]);
  const [series, setSeries] = useState([]);
  const [manga, setManga] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [popular, recent] = await Promise.all([
          getAnimes({ sort: "popular", per_page: 8 }),
          getAnimes({ sort: "recent", per_page: 6 }),
        ]);
        setFeatured(popular?.data?.[0] || null);
        setTrending(popular?.data || []);
        setLatest(recent?.data || []);
        setFilms((popular?.data || []).filter((a) => (a.type || "").toLowerCase() === "movie").slice(0, 6));
        setSeries((popular?.data || []).filter((a) => (a.type || "").toLowerCase() === "tv").slice(0, 6));
        setManga((popular?.data || []).filter((a) => (a.type || "").toLowerCase() === "manga").slice(0, 6));
      } catch (err) {
        setError(err.message || "نەتوانرا ئەنیمێ باربکرێت.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const primary = useMemo(() => featured || trending[0] || null, [featured, trending]);
  const mangaPicks = useMemo(
    () => trending.filter((item) => (item.type || "").toLowerCase() === "manga").slice(0, 4),
    [trending]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted">
        ئەنیمێ بار دەکرێت...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div className="space-y-3">
          <p className="text-lg font-semibold">نەتوانرا پەیوەندی بە API بکرێت</p>
          <p className="text-muted">{error}</p>
          <p className="text-sm text-muted">دڵنیابە کە VITE_API_URL بۆ /apiی لارافێل دانراوە و CORS کار دەکات.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative px-6 md:px-10 pb-12 space-y-10">
      {primary && <HeroCarousel items={latest.length ? latest : trending} fallback={primary} />}

      <section className="glass border border-line/60 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">ئەم هەفتەیە</p>
            <h2 className="text-xl font-semibold">پڕبینەرترینەکان</h2>
          </div>
          <a className="text-sm text-accent hover:text-white transition" href="/browse">
            هەمووی ببینە
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trending.map((item) => (
            <AnimeCard key={item.id} anime={item} />
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="glass border border-line/60 rounded-2xl p-5 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">تازەترین</p>
              <h2 className="text-xl font-semibold">تازەترین ئەڵقەکان</h2>
            </div>
            <a className="text-sm text-accent hover:text-white transition" href="/schedule">
              هەموو خشتەکە
            </a>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {latest.map((show) => (
              <div
                key={show.id}
                className="flex items-center justify-between p-4 rounded-xl bg-surface/60 border border-line"
              >
                <div>
                  <p className="text-sm text-muted">{show.studio?.name || "ستۆدیۆ"}</p>
                  <p className="font-semibold">{show.title}</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 text-sm">
                  {show.status === 'ongoing' ? "بەردەوامە" : (show.status === 'completed' ? "تەواوبووە" : "بەمزوانە")}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass border border-line/60 rounded-2xl p-5 shadow-card space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">دۆزینەوە</p>
          <h2 className="text-xl font-semibold">هەڵبژاردەی تازە</h2>
          <div className="space-y-3">
            {(trending.slice(0, 3) || []).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-surface/70 border border-line hover:border-accent transition"
              >
                <p className="text-sm text-muted mb-1">
                  {(item.genres || []).map((g) => g.name).join(" / ") || "ژانەر"}
                </p>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted line-clamp-2">{item.synopsis || "هیچ کورتەزانیارییەک بەردەست نییە."}</p>
              </div>
            ))}
          </div>
          {mangaPicks.length > 0 && (
            <div className="pt-2 border-t border-line/60 space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">مانگا</p>
              <div className="space-y-2">
                {mangaPicks.map((item) => (
                  <a
                    key={item.id}
                    href={`/anime/${item.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent transition"
                  >
                    <div>
                      <p className="text-sm text-muted">{item.status === 'ongoing' ? "بەردەوامە" : "تەواوبووە"}</p>
                      <p className="font-semibold">{item.title}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">مانگا</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="glass border border-line/60 rounded-2xl p-5 shadow-card space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">ئەنیمێ</p>
              <h2 className="text-xl font-semibold">سریالەکان</h2>
            </div>
            <a className="text-sm text-accent hover:text-white transition" href="/browse?type=TV">
              هەمووی ببینە
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {series.map((item) => (
              <AnimeCard key={item.id} anime={item} />
            ))}
          </div>
        </div>
        <div className="glass border border-line/60 rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">ئەنیمە</p>
              <h2 className="text-xl font-semibold">فیلمەکان</h2>
            </div>
            <a className="text-sm text-accent hover:text-white transition" href="/browse?type=Movie">
              هەمووی ببینە
            </a>
          </div>
          <div className="space-y-3">
            {films.map((item) => (
              <a
                key={item.id}
                href={`/anime/${item.id}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface/70 border border-line hover:border-accent transition"
              >
                {item.cover_image ? (
                  <img
                    src={item.cover_image}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded-lg"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-16 h-20 rounded-lg bg-line" />
                )}
                <div>
                  <p className="text-xs text-muted">{item.status || "فیلم"}</p>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted line-clamp-2">{item.synopsis}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="glass border border-line/60 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">مانگا</p>
            <h2 className="text-xl font-semibold">بابەتی تازە</h2>
          </div>
          <a className="text-sm text-accent hover:text-white transition" href="/browse?type=Manga">
            بینینی مانگا
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {manga.map((item) => (
            <AnimeCard key={item.id} anime={item} />
          ))}
          {manga.length === 0 && <p className="text-muted">هێشتا مانگا نییە.</p>}
        </div>
      </section>

      <Footer />
    </main>
  );
}
