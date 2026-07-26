import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (user === null)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="label-eyebrow animate-pulse">Loading…</div>
      </div>
    );
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  return (
    <div className="App">
      <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
        <AuthProvider>
          <Toaster position="top-center" richColors />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ReactLenis>
    </div>
  );
}

export default App;
