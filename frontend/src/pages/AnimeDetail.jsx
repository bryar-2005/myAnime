import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import CommentsSection from "../components/CommentsSection";
import Rating from "../components/Rating";
import { useAuth } from "../components/AuthProvider";
import { getAnime, getEpisodes, toggleFavorite, toggleWatchlist } from "../lib/api";

export default function AnimeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [a, eps] = await Promise.all([
          getAnime(id),
          getEpisodes(id, { per_page: 50 }),
        ]);
        setAnime(a);
        setEpisodes(eps.data || eps);
      } catch (err) {
        setError(err.message || "نەتوانرا ئەنیمێ باربکرێت.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleFavorite = async () => {
    try {
      await toggleFavorite(id);
      setActionMessage("دڵخوازەکان نوێکرانەوە");
    } catch (err) {
      setActionMessage(err.message || "نەتوانرا دڵخوازەکان نوێبکرێن");
    }
  };

  const handleWatchlist = async () => {
    try {
      await toggleWatchlist(id);
      setActionMessage("لێستەی سەیرکردن نوێکرایەوە");
    } catch (err) {
      setActionMessage(err.message || "نەتوانرا لێستەی سەیرکردن نوێبکرێت");
    }
  };

  const streamableEpisodes = useMemo(() => (episodes || []).filter((ep) => ep.stream_url), [episodes]);
  const primaryEpisode = streamableEpisodes[0] || episodes[0];
  const isManga = (anime?.type || "").toLowerCase() === "manga";

  const resumeEpisode = anime?.resume_episode;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted">
        بار دەکرێت...
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div className="space-y-3">
          <p className="text-lg font-semibold">نەتوانرا ئەم ئەنیمێیە باربکرێت</p>
          <p className="text-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="px-6 md:px-10 pb-12 space-y-6">
      <section className="glass border border-line/60 rounded-2xl overflow-hidden shadow-card hero-frame">
        <div className="grid lg:grid-cols-[2fr,1fr]">
          <div className="relative">
            {anime.banner_image || anime.cover_image ? (
              <img
                src={anime.banner_image || anime.cover_image}
                alt={anime.title}
                className="w-full h-full max-h-[480px] object-cover"
              />
            ) : (
              <div className="w-full h-full bg-line min-h-[300px]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10">{anime.type || "TV"}</span>
              <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10">
                {anime.status === 'ongoing' ? "بەردەوامە" : (anime.status === 'completed' ? "تەواوبووە" : "بەمزوانە")}
              </span>
              <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10">
                {anime.year || "ساڵ"}
              </span>
            </div>
            <h1 className="text-4xl font-display font-semibold">{anime.title}</h1>
            <p className="text-muted leading-relaxed line-clamp-4">{anime.synopsis || "هێشتا کورتە زانیاری نییە."}</p>

            <div className="flex flex-wrap gap-2">
              {(anime.genres || []).map((g) => (
                <span key={g.id} className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/10">
                  {g.name}
                </span>
              ))}
            </div>

            {user && (
              <div className="pt-2 border-t border-line/40">
                <Rating animeId={anime.id} initialRating={anime.user_rating} />
              </div>
            )}

            <div className="flex gap-3 flex-wrap pt-4">
              {resumeEpisode && (
                <a
                  href={resumeEpisode.episode?.stream_url || "#"}
                  className="px-6 py-2 rounded-xl bg-white text-surface font-bold shadow-card hover:bg-white/90 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  بەردەوامبوون (ئەڵقەی {resumeEpisode.episode?.number || "?"})
                </a>
              )}

              {!isManga && primaryEpisode?.stream_url && !resumeEpisode && (
                <a
                  href={primaryEpisode.stream_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2 rounded-xl bg-accent text-surface font-bold shadow-card hover:translate-y-[-1px] transition"
                >
                  دەستپێکردن لە ئەڵقەی ١
                </a>
              )}
              {isManga && anime.pdf_url && (
                <a
                  href={anime.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2 rounded-xl bg-accent text-surface font-bold shadow-card hover:translate-y-[-1px] transition"
                >
                  خوێندنەوەی PDF
                </a>
              )}
              <button
                onClick={handleFavorite}
                className="p-3 rounded-xl border border-white/10 glass hover:border-accent transition group"
                title="دڵخواز"
              >
                <svg className="w-5 h-5 group-hover:text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={handleWatchlist}
                className="p-3 rounded-xl border border-white/10 glass hover:border-accent transition group"
                title="لێستەی سەیرکردن"
              >
                <svg className="w-5 h-5 group-hover:text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </button>
              {actionMessage && <span className="text-sm text-accent self-center">{actionMessage}</span>}
            </div>
          </div>
        </div>
      </section>

      <section className="glass border border-line/60 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">ئەڵقەکان</p>
            <h2 className="text-xl font-semibold">هەموو ئەڵقەکان</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {episodes.map((ep) => (
            <div key={ep.id} className="p-4 rounded-xl bg-surface/70 border border-line hover:border-accent transition card-hover">
              <p className="text-sm text-muted mb-1">ئەڵقە {ep.number}</p>
              <p className="font-semibold">{ep.title || "بێ ناونیشان"}</p>
              <p className="text-sm text-muted line-clamp-2">{ep.synopsis || "زانیاری زیاتر بەم نزیکانە..."}</p>
              {ep.stream_url && (
                <a
                  href={ep.stream_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-2 text-sm text-accent hover:text-white"
                >
                  بینین
                </a>
              )}
            </div>
          ))}
          {episodes.length === 0 && <p className="text-muted">هێشتا ئەڵقە نییە.</p>}
        </div>
      </section>

      <CommentsSection animeId={anime.id} />
    </main>
  );
}
