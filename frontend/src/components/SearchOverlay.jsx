import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAnimes } from "../lib/api";

export default function SearchOverlay({ onClose }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        inputRef.current?.focus();
        const handleEsc = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await getAnimes({ q: query, per_page: 5 });
                setResults(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex justify-center pt-20 px-6">
            <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-200">
                <div className="relative group">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="ناو بنووسە بۆ گەڕان..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-surface/50 border border-line focus:border-accent outline-none text-xl shadow-2xl transition"
                    />
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                    >
                        Esc
                    </button>
                </div>

                <div className="mt-4 glass border border-line rounded-2xl overflow-hidden shadow-2xl max-h-[60vh] overflow-y-auto">
                    {loading && <div className="p-4 text-center text-muted">دەگەڕێم...</div>}
                    {!loading && results.length > 0 && (
                        <div className="divide-y divide-line">
                            {results.map((anime) => (
                                <Link
                                    key={anime.id}
                                    to={`/anime/${anime.id}`}
                                    onClick={onClose}
                                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition"
                                >
                                    <img src={anime.cover_image} className="w-12 h-16 object-cover rounded-lg" alt={anime.title} />
                                    <div>
                                        <h3 className="font-semibold">{anime.title}</h3>
                                        <p className="text-sm text-muted">{anime.year} • {anime.type}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    {!loading && query.length >= 2 && results.length === 0 && (
                        <div className="p-8 text-center text-muted">هیچ ئەنجامێک نەدۆزرایەوە.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
