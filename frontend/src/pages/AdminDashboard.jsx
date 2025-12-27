import { useEffect, useMemo, useState } from "react";
import {
  createAnime,
  createEpisode,
  createGenre,
  createStudio,
  getAnimes,
  getGenres,
  getStudios,
  updateAnime,
} from "../lib/api";

const panelCls = "glass border border-line/60 rounded-2xl p-5 shadow-card";
const inputCls = "w-full px-3 py-2 rounded-lg bg-surface/70 border border-line focus:border-accent outline-none";
const labelCls = "block text-sm text-muted mb-1";

export default function AdminDashboard() {
  const [animeForm, setAnimeForm] = useState({
    title: "",
    status: "ongoing",
    type: "TV",
    synopsis: "",
    cover_image: "",
    banner_image: "",
    pdf_url: "",
    year: "",
    season: "",
    studio_id: "",
  });
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [episodeForm, setEpisodeForm] = useState({
    animeId: "",
    number: "",
    title: "",
    synopsis: "",
    stream_url: "",
  });
  const [catalog, setCatalog] = useState([]);
  const [genres, setGenres] = useState([]);
  const [studios, setStudios] = useState([]);
  const [genreName, setGenreName] = useState("");
  const [studioName, setStudioName] = useState("");
  const [message, setMessage] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMeta, setLoadingMeta] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingList(true);
        const [list, genresRes, studiosRes] = await Promise.all([
          getAnimes({ per_page: 20, sort: "recent" }),
          getGenres(),
          getStudios(),
        ]);
        setCatalog(list.data || list);
        setGenres(genresRes.data || genresRes);
        setStudios(studiosRes.data || studiosRes);
      } catch (err) {
        setMessage(err.message || "نەتوانرا بەرهەم باربکرێت");
      } finally {
        setLoadingList(false);
        setLoadingMeta(false);
      }
    };
    load();
  }, []);

  const handleCreateAnime = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      const payload = {
        ...animeForm,
        year: animeForm.year ? Number(animeForm.year) : null,
        season: animeForm.season ? Number(animeForm.season) : null,
        studio_id: animeForm.studio_id ? Number(animeForm.studio_id) : null,
        genres: selectedGenres.map((id) => Number(id)),
      };
      const created = await createAnime(payload);
      setCatalog((prev) => [created.data || created, ...prev]);
      setMessage("ئەنیمێ/مانگا بە سەرکەوتوویی پاشەکەوتکرا.");
    } catch (err) {
      setMessage(err.message || "نەتوانرا پاشەکەوت بکرێت.");
    }
  };

  const handleUpdateAnime = async (animeId) => {
    try {
      setMessage("");
      await updateAnime(animeId, { status: "completed" });
      setMessage("وەک تەواوبوو دیاریکرا");
    } catch (err) {
      setMessage(err.message || "نوێکردنەوە سەرکەوتوو نەبوو");
    }
  };

  const handleCreateGenre = async (e) => {
    e.preventDefault();
    if (!genreName.trim()) return;
    try {
      setMessage("");
      const created = await createGenre({ name: genreName.trim() });
      setGenres((prev) => [...prev, created.data || created]);
      setGenreName("");
      setMessage("ژانەر زیادکرا");
    } catch (err) {
      setMessage(err.message || "نەتوانرا ژانەر زیادبکرێت");
    }
  };

  const handleCreateStudio = async (e) => {
    e.preventDefault();
    if (!studioName.trim()) return;
    try {
      setMessage("");
      const created = await createStudio({ name: studioName.trim() });
      setStudios((prev) => [...prev, created.data || created]);
      setStudioName("");
      setMessage("ستۆدیۆ زیادکرا");
    } catch (err) {
      setMessage(err.message || "نەتوانرا ستۆدیۆ زیادبکرێت");
    }
  };

  const toggleGenre = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const sortedGenres = useMemo(
    () => [...genres].sort((a, b) => (a.name || "").localeCompare(b.name || "")),
    [genres]
  );
  const sortedStudios = useMemo(
    () => [...studios].sort((a, b) => (a.name || "").localeCompare(b.name || "")),
    [studios]
  );

  const handleCreateEpisode = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      await createEpisode(episodeForm.animeId, {
        number: Number(episodeForm.number),
        title: episodeForm.title,
        synopsis: episodeForm.synopsis,
        stream_url: episodeForm.stream_url,
      });
      setMessage("ئەڵقە زیادکرا");
    } catch (err) {
      setMessage(err.message || "نەتوانرا ئەڵقە زیادبکرێت");
    }
  };

  const renderEmpty = (text) => (
    <div className="text-sm text-muted px-3 py-2 rounded-xl bg-white/5 border border-white/10">{text}</div>
  );

  return (
    <main className="px-6 md:px-10 pb-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">ئەدمین</p>
          <h1 className="text-3xl font-display font-semibold">داشبۆرد</h1>
        </div>
        {message && <div className="px-3 py-2 rounded-xl bg-white/10 border border-white/20">{message}</div>}
      </div>

      <section className="grid lg:grid-cols-2 gap-6">
        <form className={panelCls} onSubmit={handleCreateAnime}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">جۆری بەرهەم</p>
              <h2 className="text-xl font-semibold">زیادکردنی ئەنیمە/مانگا</h2>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>ناونیشان</label>
              <input
                className={inputCls}
                value={animeForm.title}
                onChange={(e) => setAnimeForm({ ...animeForm, title: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>دۆخ</label>
                <select
                  className={inputCls}
                  value={animeForm.status}
                  onChange={(e) => setAnimeForm({ ...animeForm, status: e.target.value })}
                >
                  <option value="ongoing">بەردەوامە</option>
                  <option value="completed">تەواوبووە</option>
                  <option value="upcoming">بەمزوانە</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>جۆر</label>
                <select
                  className={inputCls}
                  value={animeForm.type}
                  onChange={(e) => setAnimeForm({ ...animeForm, type: e.target.value })}
                >
                  <option value="TV">ئەنیمێ / TV</option>
                  <option value="Movie">فیلم</option>
                  <option value="Manga">مانگا</option>
                  <option value="OVA">OVA</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>ستۆدیۆ</label>
              <select
                className={inputCls}
                value={animeForm.studio_id}
                onChange={(e) => setAnimeForm({ ...animeForm, studio_id: e.target.value })}
              >
                <option value="">هیچ</option>
                {sortedStudios.map((studio) => (
                  <option key={studio.id} value={studio.id}>
                    {studio.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>ژانەرەکان</label>
              {loadingMeta && <p className="text-xs text-muted">بار دەکرێت...</p>}
              {!loadingMeta && (
                <div className="flex flex-wrap gap-2">
                  {sortedGenres.map((genre) => (
                    <label
                      key={genre.id}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre.id)}
                        onChange={() => toggleGenre(genre.id)}
                      />
                      {genre.name}
                    </label>
                  ))}
                  {sortedGenres.length === 0 && renderEmpty("هیچ ژانەرێک نییە")}
                </div>
              )}
            </div>
            <div>
              <label className={labelCls}>کورتە زانیاری</label>
              <textarea
                className={inputCls}
                rows="3"
                value={animeForm.synopsis}
                onChange={(e) => setAnimeForm({ ...animeForm, synopsis: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>ساڵ</label>
                <input
                  className={inputCls}
                  value={animeForm.year}
                  onChange={(e) => setAnimeForm({ ...animeForm, year: e.target.value })}
                  placeholder="2025"
                />
              </div>
              <div>
                <label className={labelCls}>وەرز (1-4)</label>
                <input
                  className={inputCls}
                  value={animeForm.season}
                  onChange={(e) => setAnimeForm({ ...animeForm, season: e.target.value })}
                  placeholder="1"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>لینکی وێنەی سەرپۆش (Cover)</label>
              <input
                className={inputCls}
                value={animeForm.cover_image}
                onChange={(e) => setAnimeForm({ ...animeForm, cover_image: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>لینکی وێنەی بانەر</label>
              <input
                className={inputCls}
                value={animeForm.banner_image}
                onChange={(e) => setAnimeForm({ ...animeForm, banner_image: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>لینکی PDFی مانگا (ئارەزوویی)</label>
              <input
                className={inputCls}
                value={animeForm.pdf_url}
                onChange={(e) => setAnimeForm({ ...animeForm, pdf_url: e.target.value })}
                placeholder="https://example.com/chapters/vol1.pdf"
              />
              <p className="text-xs text-muted mt-1">
                بۆ مانگا: لینکی PDF (وەک S3). بۆ ئەنیمێ بەتاڵ بهێڵە.
              </p>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-xl bg-accent text-surface font-semibold shadow-card hover:shadow-lg transition"
            >
              پاشەکەوتکردن
            </button>
          </div>
        </form>

        <form className={panelCls} onSubmit={handleCreateEpisode}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">ئەڵقەکان</p>
              <h2 className="text-xl font-semibold">زیادکردنی ئەڵقە</h2>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>ئەنیمە</label>
              <select
                className={inputCls}
                value={episodeForm.animeId}
                onChange={(e) => setEpisodeForm({ ...episodeForm, animeId: e.target.value })}
                required
              >
                <option value="">هەڵبژێرە</option>
                {catalog.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>ژمارەی ئەڵقە</label>
                <input
                  className={inputCls}
                  value={episodeForm.number}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, number: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>لینکی پەخش</label>
                <input
                  className={inputCls}
                  value={episodeForm.stream_url}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, stream_url: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>ناونیشان</label>
              <input
                className={inputCls}
                value={episodeForm.title}
                onChange={(e) => setEpisodeForm({ ...episodeForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>کورتە زانیاری</label>
              <textarea
                className={inputCls}
                rows="3"
                value={episodeForm.synopsis}
                onChange={(e) => setEpisodeForm({ ...episodeForm, synopsis: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-xl bg-accent text-surface font-semibold shadow-card hover:shadow-lg transition"
            >
              زیادکردنی ئەڵقە
            </button>
          </div>
        </form>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <form className={panelCls} onSubmit={handleCreateGenre}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">ژانەر</p>
              <h2 className="text-xl font-semibold">زیادکردنی ژانەر</h2>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>ناو</label>
              <input
                className={inputCls}
                value={genreName}
                onChange={(e) => setGenreName(e.target.value)}
                placeholder="Action, Drama..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-xl bg-accent text-surface font-semibold shadow-card hover:shadow-lg transition"
            >
              زیادکردن
            </button>
          </div>
        </form>

        <form className={panelCls} onSubmit={handleCreateStudio}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">ستۆدیۆ</p>
              <h2 className="text-xl font-semibold">زیادکردنی ستۆدیۆ</h2>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>ناو</label>
              <input
                className={inputCls}
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="بۆ نموونە: MAPPA, Madhouse..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-xl bg-accent text-surface font-semibold shadow-card hover:shadow-lg transition"
            >
              زیادکردن
            </button>
          </div>
        </form>
      </section>

      <section className={panelCls}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">پوختە</p>
            <h2 className="text-xl font-semibold">ناونیشانە تازەکان</h2>
          </div>
        </div>
        {loadingList && <p className="text-muted">کاتالۆگ بار دەکرێت...</p>}
        {!loadingList && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalog.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-surface/70 border border-line hover:border-accent transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">{item.type}</p>
                  <button
                    onClick={() => handleUpdateAnime(item.id)}
                    className="text-xs text-accent hover:text-white transition"
                  >
                    تەواوبوو دیاری بکە
                  </button>
                </div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted line-clamp-2">{item.synopsis || "هێشتا کورتە زانیاری نییە."}</p>
                <p className="text-xs text-muted">
                  {item.status || "دۆخ"} | {item.year || "ساڵ"}
                </p>
              </div>
            ))}
            {catalog.length === 0 && renderEmpty("هێشتا ناونیشان نییە. لە لای چەپ یەکێک دروست بکە.")}
          </div>
        )}
      </section>
    </main>
  );
}
