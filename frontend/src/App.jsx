import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import { useAuth } from "./components/AuthProvider";

const AnimeDetail = lazy(() => import("./pages/AnimeDetail"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Browse = lazy(() => import("./pages/Browse"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Signup = lazy(() => import("./pages/Signup"));

const PageFallback = () => <div className="p-10 text-muted">پەڕە بار دەکرێت...</div>;

function RequireAuth({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="p-10 text-muted">پشکنینی چوونەژوورەوە...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user, token, loading } = useAuth();
  if (loading) return <div className="p-10 text-muted">پشکنینی چوونەژوورەوە...</div>;
  if (!token) return <Navigate to="/login" replace />;
  if (!user?.is_admin) {
    return <div className="p-10 text-muted">پێویستت بە دەسەڵاتی ئەدمینە بۆ بینینی ئەم پەڕەیە.</div>;
  }
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-white relative">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute -left-32 top-10 w-96 h-96 rounded-full bg-accent blur-[120px] animate-glow" />
        <div className="absolute right-0 bottom-0 w-[28rem] h-[28rem] rounded-full bg-accent2 blur-[160px] animate-glow" />
      </div>
      <Header />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route path="*" element={<div className="p-10 text-muted">پەڕە نەدۆزرایەوە.</div>} />
        </Routes>
      </Suspense>
    </div>
  );
}
