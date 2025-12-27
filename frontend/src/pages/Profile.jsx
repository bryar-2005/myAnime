import { useEffect, useMemo, useState } from "react";
import { getFavorites, getHistory, getWatchlist, uploadProfileMedia } from "../lib/api";
import { useAuth } from "../components/AuthProvider";
import Footer from "../components/Footer";

const panelCls = "glass border border-line/60 rounded-2xl p-5 shadow-card";
const statCls = "px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center";

export default function Profile() {
  const { user, logout, setUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [avatar, setAvatar] = useState("");
  const [banner, setBanner] = useState("");
  const [savingImage, setSavingImage] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [favRes, watchRes, historyRes] = await Promise.all([getFavorites(), getWatchlist(), getHistory()]);
      setFavorites(favRes?.data || favRes || []);
      setWatchlist(watchRes?.data || watchRes || []);
      setHistory(historyRes?.data || historyRes || []);
    } catch (err) {
      setError(err.message || "نەتوانرا کتێبخانەکەت باربکرێت.");
      setFavorites([]);
      setWatchlist([]);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setAvatar(user?.avatar_url || "");
    setBanner(user?.banner_url || "");
  }, [user]);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append(type, file);
    try {
      setSavingImage(true);
      const res = await uploadProfileMedia(form);
      if (res?.user) {
        setUser((prev) => ({ ...(prev || {}), ...res.user }));
        setAvatar(res.user.avatar_url || avatar);
        setBanner(res.user.banner_url || banner);
      }
    } catch (err) {
      setError(err.message || "نەتوانرا وێنە نوێبکرێتەوە.");
    } finally {
      setSavingImage(false);
    }
  };

  const filteredHistory = useMemo(() => {
    if (filter === "all") return history;
    if (filter === "completed") return history.filter((h) => h.anime?.status === "completed");
    if (filter === "ongoing") return history.filter((h) => h.anime?.status === "ongoing");
    return history;
  }, [history, filter]);

  return (
    <main className="px-6 md:px-10 pb-12 space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-line/60 shadow-card">
        {banner ? (
          <img src={banner} alt="بانەری پڕۆفایل" className="w-full h-40 object-cover opacity-80" />
        ) : (
          <div className="w-full h-40 bg-gradient-to-r from-accent/30 to-accent2/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/20 to-background" />
        <div className="p-5 grid md:grid-cols-[1.5fr,1fr] gap-6 items-center relative">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-semibold text-surface text-xl overflow-hidden">
                {avatar ? <img src={avatar} alt="وێنەی پڕۆفایل" className="w-full h-full object-cover" /> : user?.name?.[0] || "U"}
              </div>
              <label className="absolute -bottom-2 right-0 text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10 cursor-pointer hover:border-accent transition">
                گۆڕین
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "avatar")}
                />
              </label>
            </div>
            <div>
              <p className="text-muted text-sm">بەژداربوو</p>
              <p className="text-lg font-semibold">{user?.name}</p>
              <p className="text-sm text-muted">{user?.email}</p>
              <p className="text-xs text-muted mt-1">
                بەژداربووە لە ساڵی {user?.created_at ? new Date(user.created_at).getFullYear() : "ساڵ"}
              </p>
              <label className="text-xs text-accent cursor-pointer mt-2 inline-block">
                گۆڕینی بانەر
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "banner")}
                />
              </label>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full border border-white/10 glass hover:border-accent transition"
            >
              {savingImage ? "پاشەکەوتکردن..." : "چوونەدەرەوە"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <div className={statCls}>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">دڵخوازەکان</p>
          <p className="text-2xl font-semibold">{favorites.length}</p>
        </div>
        <div className={statCls}>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">لیستی سەیرکردن</p>
          <p className="text-2xl font-semibold">{watchlist.length}</p>
        </div>
        <div className={statCls}>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">بینراوەکان</p>
          <p className="text-2xl font-semibold">{history.length}</p>
        </div>
      </section>

      {loading && (
        <div className="grid sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-surface/60 border border-line animate-pulse" />
          ))}
        </div>
      )}
      {error && (
        <div className="text-red-300 space-y-2">
          <p>نەتوانرا زانیاری پرۆفایلەکەت باربکرێت. {error}</p>
          <button
            onClick={loadData}
            className="px-3 py-2 rounded-lg border border-white/10 glass hover:border-accent transition text-sm"
          >
            دووبارە
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className={panelCls}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">دڵخوازەکان</p>
                  <h2 className="text-xl font-semibold">ئەنیمێ دڵخوازەکان</h2>
                </div>
              </div>
              <div className="space-y-3">
                {favorites.length === 0 && <p className="text-muted">هێشتا هیچ ئەنیمێیەک لە لیستی دڵخوازەکان نییە.</p>}
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="p-3 rounded-xl bg-surface/70 border border-line hover:border-accent transition"
                  >
                    <p className="text-sm text-muted">{fav.anime?.status === 'ongoing' ? "بەردەوامە" : (fav.anime?.status === 'completed' ? "تەواوبووە" : "بەمزوانە")}</p>
                    <p className="font-semibold">{fav.anime?.title}</p>
                    <p className="text-sm text-muted line-clamp-2">{fav.anime?.synopsis}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={panelCls}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">لیستی سەیرکردن</p>
                  <h2 className="text-xl font-semibold">ئامادەی سەیرکردن</h2>
                </div>
              </div>
              <div className="space-y-3">
                {watchlist.length === 0 && <p className="text-muted">هیچ لە لیستی سەیرکردن نییە.</p>}
                {watchlist.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-surface/70 border border-line hover:border-accent transition"
                  >
                    <p className="text-sm text-muted">{item.anime?.status === 'ongoing' ? "بەردەوامە" : (item.anime?.status === 'completed' ? "تەواوبووە" : "بەمزوانە")}</p>
                    <p className="font-semibold">{item.anime?.title}</p>
                    <p className="text-sm text-muted line-clamp-2">{item.anime?.synopsis}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={panelCls}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">بینراوەکان</p>
                <h2 className="text-xl font-semibold">دوایین بینراوەکان</h2>
              </div>
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-surface/70 border border-line text-sm focus:border-accent outline-none"
                >
                  <option value="all">هەموو</option>
                  <option value="ongoing">بەردەوام</option>
                  <option value="completed">تەواوبوو</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              {filteredHistory.length === 0 && <p className="text-muted">هێشتا مێژوو نییە.</p>}
              {filteredHistory.map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-xl bg-surface/70 border border-line hover:border-accent transition"
                >
                  <p className="text-sm text-muted">
                    ئەڵقەی {h.episode?.number ?? "?"} • {h.watched_at ? new Date(h.watched_at).toLocaleDateString('ku-IQ') : "دوایین"}
                  </p>
                  <p className="font-semibold">{h.anime?.title}</p>
                  <p className="text-sm text-muted line-clamp-2">{h.episode?.title || h.anime?.synopsis || "کورتەزانیاری بەردەست نییە"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}
