import { Link } from "react-router-dom";

export default function AnimeCard({ anime }) {
  return (
    <Link
      to={`/anime/${anime.id}`}
      className="rounded-xl overflow-hidden bg-surface/60 border border-line hover:border-accent transition block shadow-card"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        {anime.cover_image ? (
          <img src={anime.cover_image} alt={anime.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-line" />
        )}
        {anime.status && (
          <span className="absolute left-3 top-3 px-3 py-1 text-xs rounded-full glass border border-white/10">
            {anime.status === 'ongoing' ? "بەردەوامە" : (anime.status === 'completed' ? "تەواوبووە" : "بەمزوانە")}
          </span>
        )}
      </div>
      <div className="p-4 space-y-2">
        <p className="text-sm text-muted">{anime.year || "ساڵ"}</p>
        <p className="font-semibold leading-tight line-clamp-2">{anime.title}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted">
          {(anime.genres || []).slice(0, 2).map((g) => (
            <span key={g.id} className="px-2 py-1 bg-white/5 rounded-full border border-white/5">
              {g.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
