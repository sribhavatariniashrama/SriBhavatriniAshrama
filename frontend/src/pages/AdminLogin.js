import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatApiErrorDetail } from "../lib/api";
import { toast } from "sonner";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/admin", { replace: true });
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg-dark)" }}>
      <div className="w-full max-w-md">
        <Link to="/" className="label-eyebrow block text-center mb-8">← Back to site</Link>
        <div className="p-10" style={{ background: "var(--bg-primary)" }}>
          <div className="flex items-center gap-3 mb-8">
            <Lock size={22} strokeWidth={1.5} style={{ color: "var(--accent-saffron)" }} />
            <h1 className="font-serif text-3xl" style={{ color: "var(--text-primary)" }}>Admin Login</h1>
          </div>
          <form onSubmit={submit} data-testid="admin-login-form" className="space-y-4">
            <input data-testid="login-email" type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 font-sans outline-none border focus:border-[var(--accent-saffron)] transition-colors"
              style={{ borderColor: "var(--border-light)", background: "var(--bg-secondary)" }} />
            <input data-testid="login-password" type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 font-sans outline-none border focus:border-[var(--accent-saffron)] transition-colors"
              style={{ borderColor: "var(--border-light)", background: "var(--bg-secondary)" }} />
            <button data-testid="login-submit" type="submit" disabled={loading}
              className="w-full py-4 font-sans transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
              style={{ background: "var(--accent-saffron)", color: "var(--text-inverse)" }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
