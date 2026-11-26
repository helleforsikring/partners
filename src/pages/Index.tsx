import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Plus, Settings } from "lucide-react";
import { fetchPages } from "@/lib/data";
import type { LandingPage } from "@/lib/types";
import leaLogo from "@/assets/lea-logo.png";

export default function Index() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages().then((p) => { setPages(p.filter((x) => x.is_visible)); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={leaLogo} alt="LEA" className="h-8 w-auto" />
            <span className="text-sm text-muted-foreground hidden sm:inline">Landingpages</span>
          </div>
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" /> Admin
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">Alle landingpages</h1>
          <p className="mt-3 text-lg text-muted-foreground">Oversigt over alle samarbejdspartneres landing pages hos LEA Forsikring.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((p) => (
              <Link key={p.id} to={`/p/${p.slug}`}
                className="group rounded-3xl border border-border bg-card p-6 transition-all hover:shadow-lg">
                <div className="flex h-16 items-center mb-5">
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name} className="max-h-12 w-auto" />
                  ) : (
                    <div className="h-12 w-12 rounded-full" style={{ backgroundColor: p.accent_color }} />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{p.name}</h2>
                    <p className="text-xs text-muted-foreground mt-1">/p/{p.slug}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" style={{ color: p.accent_color }} />
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: p.accent_color }} />
                  <span className="text-xs text-muted-foreground">{p.accent_color}</span>
                </div>
              </Link>
            ))}

            <Link to="/admin/new"
              className="group rounded-3xl border-2 border-dashed border-border bg-card p-6 flex flex-col items-center justify-center text-center transition-colors hover:border-primary hover:bg-accent/30 min-h-[220px]">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Opret ny landing page</h2>
              <p className="mt-1 text-sm text-muted-foreground">Kopiér strukturen og tilret farve, logo og tekst.</p>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
