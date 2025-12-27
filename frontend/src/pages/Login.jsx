import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

export default function Login() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setMessage("تکایە ئیمەیڵێکی دروست بنووسە.");
      return;
    }
    if (password.length < 6) {
      setMessage("پێویستە وشەی نهێنی لایەنی کەم ٦ پیت بێت.");
      return;
    }
    try {
      setSubmitting(true);
      setMessage("");
      await login(email, password);
      navigate("/profile");
    } catch (err) {
      setMessage(err.message || "چوونەژوورەوە سەرکەوتوو نەبوو");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="px-6 md:px-10 pb-12 flex justify-center">
      <div className="glass border border-line/60 rounded-2xl p-8 shadow-card max-w-lg w-full mt-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2">بەخێربێیتەوە</p>
        <h1 className="text-3xl font-display font-semibold mb-6">چوونەژوورەوە</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1">ئیمەیڵ</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface/70 border border-line focus:border-accent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">وشەی نهێنی</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface/70 border border-line focus:border-accent outline-none"
              required
            />
          </div>
          {(message || error) && (
            <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
              {message || error}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl bg-accent text-surface font-semibold shadow-card hover:shadow-lg transition disabled:opacity-50"
          >
            {submitting ? "چوونەژوورەوە..." : "چوونەژوورەوە"}
          </button>
        </form>
        <p className="text-sm text-muted mt-4">
          هەژمار نیت؟{" "}
          <Link to="/signup" className="text-accent hover:text-white transition">
            تۆمارکردن
          </Link>
        </p>
      </div>
    </main>
  );
}
