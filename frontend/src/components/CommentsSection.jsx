import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { getComments, postComment } from "../lib/api";

export default function CommentsSection({ animeId }) {
  const { user, token } = useAuth();
  const canComment = Boolean(token);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getComments(animeId);
        setComments(res.data || res);
      } catch (err) {
        setError(err.message || "نەتوانرا کۆمێنتەکان بار بکرێن.");
      } finally {
        setLoading(false);
      }
    };
    if (animeId) load();
  }, [animeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed.length < 3) {
      setError("کۆمێنت دەبێت لایەنی کەم ٣ پیت بێت.");
      return;
    }
    try {
      setError("");
      const created = await postComment(animeId, trimmed);
      setComments((prev) => [created.data || created, ...(prev || [])]);
      setMessage("");
    } catch (err) {
      setError(err.message || "نەتوانرا کۆمێنت بنێردرێت");
    }
  };

  return (
    <div className="glass border border-line/60 rounded-2xl p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">گفتوگۆ</p>
          <h3 className="text-lg font-semibold">کۆمێنتەکان</h3>
        </div>
        <p className="text-xs text-muted">{canComment ? "تەنها بۆ چوونەژوورەوە" : "چوونەژوورەوە بکە بۆ کۆمێنت"}</p>
      </div>

      {error && <div className="text-sm text-red-300">{error}</div>}
      {loading && <div className="text-muted text-sm">کۆمێنتەکان بار دەکرێن...</div>}

      {canComment ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid sm:grid-cols-[1fr,2fr] gap-2">
            <input
              value={user?.name || ""}
              readOnly
              className="px-3 py-2 rounded-lg bg-surface/50 border border-line text-muted"
              placeholder="ناو"
            />
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="کۆمێنتێک بنووسە..."
              className="px-3 py-2 rounded-lg bg-surface/70 border border-line focus:border-accent outline-none"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-accent text-surface font-semibold shadow-card hover:translate-y-[-1px] transition"
            >
              ناردن
            </button>
          </div>
        </form>
      ) : (
        <div className="text-sm text-muted">تکایە بچۆ ژوورەوە بۆ ئەوەی بتوانیت کۆمێنت بنووسیت.</div>
      )}

      <div className="space-y-3">
        {(comments || []).length === 0 && !loading && <p className="text-muted text-sm">هیچ کۆمێنتێک نییە، ببە بە یەکەم کەس!</p>}
        {(comments || []).map((c) => (
          <div key={c.id} className="p-3 rounded-xl bg-surface/70 border border-line">
            <div className="flex items-center justify-between text-xs text-muted mb-1">
              <span>{c.user?.name || "بەکارهێنەر"}</span>
              <span>{new Date(c.created_at || c.at).toLocaleString()}</span>
            </div>
            <p className="text-sm">{c.body || c.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
