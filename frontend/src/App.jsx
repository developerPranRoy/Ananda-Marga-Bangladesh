import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import MainLayout from "./components/layouts/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProgramsPage from "./pages/ProgramsPage";
import ContactPage from "./pages/ContactPage";
import DonationPage from "./pages/DonationPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ServicePage from "./pages/ServicePage";


// Blog
import BlogListPage from "./pages/blog/BlogListPage";
import BlogDetailPage from "./pages/blog/BlogDetailPage";
import BlogWritePage from "./pages/blog/BlogWritePage";


// Auth
import AuthPage from "./pages/auth/AuthPage";

// Protected route wrapper
function Protected({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuthStore();

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d1f1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#78716c", fontFamily: "'Noto Serif Bengali', serif" }}>লোড হচ্ছে...</p>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && profile && !profile.is_admin) return <Navigate to="/" replace />;

  return children;
}
export default function App() {
  const { init } = useAuthStore();

  // Init auth session on app start
  useEffect(() => { init(); }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — no layout */}
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/admin" element={<Protected adminOnly><AdminDashboard /></Protected>} />

        {/* Main layout pages */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/service" element={<ServicePage />} />



          {/* Blog */}
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/write" element={<Protected><BlogWritePage /></Protected>} />
          <Route path="/blog/edit/:id" element={<Protected><BlogWritePage /></Protected>} />
          <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}