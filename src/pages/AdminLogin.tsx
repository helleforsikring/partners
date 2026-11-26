import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("info@leaforsikring.dk");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setError("Forkert email eller adgangskode");
      return;
    }
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 text-foreground">
          <Lock className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold">Admin login</h1>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Adgangskode</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}Log ind
        </button>
      </form>
    </div>
  );
}