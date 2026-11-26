import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchPages } from "@/lib/data";
import type { LandingPage } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";

export default function AdminVisibility() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchPages().then((p) => { setPages(p); setLoading(false); });
  }, []);

  const toggle = async (slug: string, next: boolean) => {
    setSavingSlug(slug);
    setPages((prev) => prev.map((p) => (p.slug === slug ? { ...p, is_visible: next } : p)));
    const { error } = await supabase.from("landing_pages").update({ is_visible: next }).eq("slug", slug);
    setSavingSlug(null);
    if (error) {
      toast.error("Kunne ikke gemme: " + error.message);
      setPages((prev) => prev.map((p) => (p.slug === slug ? { ...p, is_visible: !next } : p)));
    } else {
      toast.success(`${next ? "Synlig" : "Skjult"} på oversigten`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-6 py-5 flex items-center justify-between">
          <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Til admin
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Synlighed</h1>
          <span className="w-20" />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="mb-6 text-sm text-muted-foreground">Vælg hvilke landing pages der skal være synlige på forsiden.</p>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
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
                {savingSlug === p.slug && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                <Switch checked={p.is_visible} onCheckedChange={(v) => toggle(p.slug, v)} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}