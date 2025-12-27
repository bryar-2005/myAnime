import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import SearchOverlay from "./SearchOverlay";

export default function Header() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const navClasses = ({ isActive }) =>
    `text-sm tracking-wide uppercase transition ${isActive ? "text-white" : "text-muted hover:text-white"}`;

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="relative px-6 md:px-10 py-6 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-surface shadow-card glow uppercase logo-badge">
            Ot
          </div>
          <div className="hidden lg:block">
            <p className="text-xs text-muted tracking-[0.2em]">ئەنیمێ و مانگای هەڵبژێردراو</p>
            <p className="font-semibold text-lg">Otaku Haven</p>
          </div>
        </Link>

        <nav className="hidden md:flex gap-6">
          <NavLink to="/" className={navClasses} end>
            سەرەتا
          </NavLink>
          <NavLink to="/browse" className={navClasses}>
            کتێبخانە
          </NavLink>
          <NavLink to="/schedule" className={navClasses}>
            خشتەی پەخش
          </NavLink>
          <NavLink to="/profile" className={navClasses}>
            پڕۆفایل
          </NavLink>
          {user?.is_admin && (
            <NavLink to="/admin" className={navClasses}>
              ئەدمین
            </NavLink>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setSearchOpen(true)}
          className="p-3 rounded-full border border-white/10 glass hover:bg-white/5 transition group"
          title="گەڕان (/)"
        >
          <svg className="w-5 h-5 text-muted group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <button
            className="md:hidden px-3 py-2 rounded-full border border-white/10 glass"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? "✕" : "مینیو"}
          </button>
          {!token && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="hidden md:inline-flex px-4 py-2 text-sm rounded-full bg-accent text-surface font-semibold shadow-card hover:shadow-lg transition"
              >
                چوونەژوورەوە
              </button>
            </>
          )}
          {token && (
            <div className="hidden md:flex items-center gap-3">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs text-muted">بەخێربێیت</span>
                <span className="text-sm font-semibold">{user?.name || "بەکارهێنەر"}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-full border border-white/10 glass hover:border-accent transition group"
                title="چوونەدەرەوە"
              >
                <svg className="w-5 h-5 text-muted group-hover:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {open && (
        <div className="absolute top-full left-0 right-0 md:hidden px-6 pb-6 z-50">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div className="relative glass rounded-2xl border border-line/60 shadow-card p-4 space-y-3">
            <NavLink to="/" className={navClasses} end onClick={closeMenu}>
              سەرەتا
            </NavLink>
            <NavLink to="/browse" className={navClasses} onClick={closeMenu}>
              کتێبخانە
            </NavLink>
            <NavLink to="/schedule" className={navClasses} onClick={closeMenu}>
              خشتەی پەخش
            </NavLink>
            <NavLink to="/profile" className={navClasses} onClick={closeMenu}>
              پرۆفایل
            </NavLink>
            {user?.is_admin && (
              <NavLink to="/admin" className={navClasses} onClick={closeMenu}>
                ئەدمین
              </NavLink>
            )}
            <div className="pt-3 border-t border-line/60">
              {!token ? (
                <button
                  onClick={() => {
                    closeMenu();
                    navigate("/login");
                  }}
                  className="w-full px-4 py-2 text-sm rounded-full bg-accent text-surface font-semibold shadow-card transition"
                >
                  چوونەژوورەوە
                </button>
              ) : (
                <button
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                  className="w-full px-4 py-2 text-sm rounded-full border border-white/10 glass transition"
                >
                  چوونەدەرەوە
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
