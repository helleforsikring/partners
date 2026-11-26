import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, LogOut, Plus, Trash2, ExternalLink, Pencil, Trash, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchPages, fetchDeletedPages } from "@/lib/data";
import type { LandingPage } from "@/lib/types";

export default function AdminList() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [deleted, setDeleted] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrash, setShowTrash] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    Promise.all([fetchPages(), fetchDeletedPages()]).then(([p, d]) => {
      setPages(p.filter((x) => x.is_visible)); setDeleted(d); setLoading(false);
    });
  };
  useEffect(() => { load(); }, []);

  const remove = async (slug: string, name: string) => {
    if (!confirm(`Flyt "${name}" til papirkurven?`)) return;
    const { error } = await supabase.from("landing_pages")
      .update({ deleted_at: new Date().toISOString(), is_visible: false }).eq("slug", slug);
    if (error) alert("Kunne ikke slette: " + error.message);
    else load();
  };

  const restore = async (slug: string) => {
    const { error } = await supabase.from("landing_pages")
      .update({ deleted_at: null }).eq("slug", slug);
    if (error) alert("Kunne ikke genaktivere: " + error.message);
    else load();
  };

  const purge = async (slug: string, name: string) => {
    if (!confirm(`Slet "${name}" permanent? Dette kan ikke fortrydes.`)) return;
    const { error } = await supabase.from("landing_pages").delete().eq("slug", slug);
    if (error) alert("Kunne ikke slette: " + error.message);
    else load();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Til oversigten</Link>
          <h1 className="text-lg md:text-xl font-semibold text-foreground">Admin</h1>
          <button onClick={logout} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Log ud
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {showTrash ? "Papirkurv" : "Landingpages"}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowTrash((s) => !s)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
              <Trash className="h-4 w-4" />
              {showTrash ? "Vis aktive" : `Papirkurv${deleted.length ? ` (${deleted.length})` : ""}`}
            </button>
            {!showTrash && (
              <Link to="/admin/new" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4" /> Opret ny
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : showTrash ? (
          deleted.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10 text-center">Papirkurven er tom.</p>
          ) : (
            <ul className="space-y-3">
              {deleted.map((p) => (
                <li key={p.id} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4 opacity-90">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden bg-secondary shrink-0">
                    {p.logo_url ? <img src={p.logo_url} alt={p.name} className="max-h-8 max-w-8" />
                      : <span className="h-3 w-3 rounded-full" style={{ backgroundColor: p.accent_color }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Slettet {p.deleted_at ? new Date(p.deleted_at).toLocaleString("da-DK") : ""}
                    </div>
                  </div>
                  <button onClick={() => restore(p.slug)}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
                    <RotateCcw className="h-3.5 w-3.5" /> Genaktiver
                  </button>
                  <button onClick={() => purge(p.slug, p.name)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )
        ) : (
          <ul className="space-y-3">
            {pages.map((p) => (
              <li key={p.id} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden bg-secondary shrink-0">
                  {p.logo_url ? <img src={p.logo_url} alt={p.name} className="max-h-8 max-w-8" />
                    : <span className="h-3 w-3 rounded-full" style={{ backgroundColor: p.accent_color }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground">{p.name}</div>
                  <div className="text-xs text-muted-foreground">/p/{p.slug}</div>
                </div>
                <span className="hidden sm:inline-block h-5 w-5 rounded-full border border-border" style={{ backgroundColor: p.accent_color }} title={p.accent_color} />
                <Link to={`/p/${p.slug}`} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <ExternalLink className="h-3.5 w-3.5" /> Vis
                </Link>
                <Link to={`/admin/${p.slug}`} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
                  <Pencil className="h-3.5 w-3.5" /> Rediger
                </Link>
                <button onClick={() => remove(p.slug, p.name)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}