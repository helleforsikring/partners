import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Loader2, Plus, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchPageBySlug } from "@/lib/data";
import type { LandingPage, Product } from "@/lib/types";
import { CONTENT_DEFAULTS } from "@/lib/types";
import { PageProvider } from "@/lib/page-context";
import { LandingPageView } from "@/components/site/LandingPageView";

const DEFAULT_PRODUCTS: Product[] = [
  { key: "indbo", label: "Indboforsikring", calculator_url: "https://www.helleforsikring.dk/forsikring/indbo/beregn", input_type: "text", input_label: "Søg din adresse", input_placeholder: "F.eks. Strandgade 12, 1401 København K", input_suffix: "", options: [] },
  { key: "husleje", label: "Huslejeforsikring", calculator_url: "https://www.helleforsikring.dk/forsikring/husleje/beregn", input_type: "number", input_label: "Månedlig husleje", input_placeholder: "F.eks. 8500", input_suffix: "kr./md.", options: [] },
  { key: "ulykke", label: "Ulykkesforsikring", calculator_url: "https://www.helleforsikring.dk/forsikring/ulykke/beregn", input_type: "select", input_label: "Vælg din beskæftigelse", input_placeholder: "Vælg beskæftigelse", input_suffix: "", options: ["Lønmodtager","Selvstændig","Studerende","Pensionist","Arbejdssøgende","Andet"] },
];

const NEW_DEFAULTS = (slug: string, name: string): LandingPage => ({
  id: "",
  slug,
  name,
  badge_text: `Et samarbejde mellem ${name} og Helle Forsikring`,
  hero_highlight: "skræddersyet",
  accent_color: "#3994BA",
  accent_hover_color: "#2d7a99",
  badge_bg_color: "#321134",
  logo_url: null,
  meta_title: `${name} × Helle Forsikring — Forsikringsfordele for dig som lejer`,
  meta_description: `Som lejer hos ${name} har du adgang til specielt tilrettelagte forsikringer fra Helle Forsikring.`,
  is_visible: true,
  deleted_at: null,
  products: DEFAULT_PRODUCTS,
});

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[æ]/g, "ae").replace(/[ø]/g, "oe").replace(/[å]/g, "aa")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function AdminEditor() {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isNew = !routeSlug || routeSlug === "new";

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<LandingPage>(NEW_DEFAULTS("", ""));
  const [content, setContent] = useState<Record<string, string>>({});
  const [originalContent, setOriginalContent] = useState<Record<string, string>>({});
  const [savingPage, setSavingPage] = useState(false);
  const [pageSaved, setPageSaved] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const fieldRefs = useRef<Record<string, HTMLTextAreaElement | HTMLInputElement | null>>({});
  const [highlightKey, setHighlightKey] = useState<string | null>(null);

  const focusField = (key: string) => {
    setFilter("");
    setHighlightKey(key);
    setTimeout(() => {
      const el = fieldRefs.current[key];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
    }, 50);
    setTimeout(() => setHighlightKey((k) => (k === key ? null : k)), 1800);
  };

  useEffect(() => {
    if (isNew) {
      setPage(NEW_DEFAULTS("", ""));
      const empty: Record<string, string> = {};
      for (const k of Object.keys(CONTENT_DEFAULTS)) empty[k] = CONTENT_DEFAULTS[k];
      setContent(empty);
      setOriginalContent(empty);
      setLoading(false);
      return;
    }
    fetchPageBySlug(routeSlug!).then((d) => {
      if (!d) { navigate("/admin", { replace: true }); return; }
      setPage(d.page);
      const merged: Record<string, string> = {};
      for (const k of Object.keys(CONTENT_DEFAULTS)) merged[k] = d.content[k] ?? CONTENT_DEFAULTS[k];
      setContent(merged);
      setOriginalContent(merged);
      setLoading(false);
    });
  }, [routeSlug, isNew, navigate]);

  const groups = useMemo(() => {
    const all = Object.keys(CONTENT_DEFAULTS).filter((k) => {
      if (!filter.trim()) return true;
      const f = filter.toLowerCase();
      return k.toLowerCase().includes(f) || (content[k] ?? "").toLowerCase().includes(f);
    });
    const byGroup: Record<string, string[]> = {};
    for (const k of all) {
      const g = k.split(".")[0] ?? "andet";
      (byGroup[g] ??= []).push(k);
    }
    return byGroup;
  }, [content, filter]);

  const savePage = async () => {
    setSavingPage(true);
    setPageSaved(false);
    const slug = isNew ? slugify(page.slug || page.name) : page.slug;
    if (!slug || !page.name) { alert("Navn og slug skal udfyldes"); setSavingPage(false); return; }
    const payload = {
      slug, name: page.name, badge_text: page.badge_text, hero_highlight: page.hero_highlight,
      accent_color: page.accent_color, accent_hover_color: page.accent_hover_color,
      badge_bg_color: page.badge_bg_color, logo_url: page.logo_url,
      meta_title: page.meta_title, meta_description: page.meta_description,
      products: page.products as unknown as never,
    };
    if (isNew) {
      const { error } = await supabase.from("landing_pages").insert(payload);
      setSavingPage(false);
      if (error) { alert("Fejl: " + error.message); return; }
      navigate(`/admin/${slug}`, { replace: true });
    } else {
      const { error } = await supabase.from("landing_pages").update(payload).eq("slug", slug);
      setSavingPage(false);
      if (error) { alert("Fejl: " + error.message); return; }
      setPageSaved(true);
      setTimeout(() => setPageSaved(false), 1500);
    }
  };

  const saveKey = async (key: string) => {
    if (isNew) { alert("Gem siden først"); return; }
    setSavingKey(key);
    const value = content[key] ?? "";
    const { error } = await supabase.from("page_content").upsert(
      { slug: page.slug, key, value }, { onConflict: "slug,key" }
    );
    setSavingKey(null);
    if (error) { alert("Kunne ikke gemme: " + error.message); return; }
    setOriginalContent((o) => ({ ...o, [key]: value }));
    setSavedKey(key);
    setTimeout(() => setSavedKey((k) => (k === key ? null : k)), 1500);
  };

  const uploadLogo = async (file: File) => {
    if (isNew && !page.slug && !page.name) { alert("Udfyld navn først"); return; }
    const slug = page.slug || slugify(page.name);
    setUploading(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${slug}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("logos").upload(path, file, { upsert: true });
    if (error) { setUploading(false); alert("Upload-fejl: " + error.message); return; }
    const { data } = supabase.storage.from("logos").getPublicUrl(path);
    setPage((p) => ({ ...p, logo_url: data.publicUrl }));
    setUploading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1600px] px-6 py-5 flex items-center justify-between gap-4">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Tilbage
          </Link>
          <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">
            {isNew ? "Opret ny landing page" : `Redigér: ${page.name}`}
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 py-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <main className="space-y-8 min-w-0">
        {/* Side-indstillinger */}
        <section className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Side-indstillinger</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Navn (firma)">
              <input value={page.name} onChange={(e) => setPage({ ...page, name: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </Field>
            <Field label="Slug (URL)">
              <input value={page.slug} onChange={(e) => setPage({ ...page, slug: slugify(e.target.value) })} disabled={!isNew}
                placeholder={isNew ? "auto fra navn" : ""}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none disabled:opacity-60" />
            </Field>
          </div>

          <Field label="Badge-tekst (hero)">
            <input value={page.badge_text} onChange={(e) => setPage({ ...page, badge_text: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
          </Field>

          <Field label="Hero-fremhævet ord">
            <input value={page.hero_highlight} onChange={(e) => setPage({ ...page, hero_highlight: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <ColorField label="Accent-farve" value={page.accent_color} onChange={(v) => setPage({ ...page, accent_color: v })} />
            <ColorField label="Hover-farve" value={page.accent_hover_color} onChange={(v) => setPage({ ...page, accent_hover_color: v })} />
            <ColorField label="Badge-baggrund" value={page.badge_bg_color} onChange={(v) => setPage({ ...page, badge_bg_color: v })} />
          </div>

          <Field label="Logo">
            <div className="flex items-center gap-4">
              <div className="h-14 w-28 rounded-xl border border-border bg-secondary flex items-center justify-center overflow-hidden">
                {page.logo_url ? <img src={page.logo_url} alt="logo" className="max-h-12 max-w-24" /> : <span className="text-xs text-muted-foreground">Intet logo</span>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm hover:bg-secondary disabled:opacity-60">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload nyt logo
              </button>
            </div>
          </Field>

          <div className="grid gap-4">
            <Field label="Meta title (SEO)">
              <input value={page.meta_title} onChange={(e) => setPage({ ...page, meta_title: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </Field>
            <Field label="Meta description (SEO)">
              <textarea value={page.meta_description} onChange={(e) => setPage({ ...page, meta_description: e.target.value })} rows={2}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </Field>
          </div>

          <div className="flex justify-end">
            <button onClick={savePage} disabled={savingPage}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">
              {savingPage ? <Loader2 className="h-4 w-4 animate-spin" /> : pageSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {isNew ? "Opret side" : pageSaved ? "Gemt" : "Gem indstillinger"}
            </button>
          </div>
        </section>

        {/* Produkter (selector) */}
        <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Produkter (selector)</h2>
              <p className="text-xs text-muted-foreground mt-1">Produkter som vises i forsikrings-vælgeren. Husk at gemme indstillinger.</p>
            </div>
            <button
              onClick={() => setPage((p) => ({
                ...p,
                products: [...(p.products ?? []), {
                  key: `produkt-${(p.products?.length ?? 0) + 1}`,
                  label: "Nyt produkt",
                  calculator_url: "https://",
                  input_type: "text",
                  input_label: "Indtast oplysning",
                  input_placeholder: "",
                  input_suffix: "",
                  options: [],
                }],
              }))}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm hover:bg-secondary">
              <Plus className="h-4 w-4" /> Tilføj produkt
            </button>
          </div>
          <div className="space-y-4">
            {(page.products ?? []).map((p, idx) => {
              const update = (patch: Partial<Product>) => setPage((pg) => ({
                ...pg,
                products: pg.products.map((x, i) => i === idx ? { ...x, ...patch } : x),
              }));
              const remove = () => setPage((pg) => ({ ...pg, products: pg.products.filter((_, i) => i !== idx) }));
              return (
                <div key={idx} className="rounded-xl border border-border bg-background p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">#{idx + 1}</span>
                    <button onClick={remove} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-3 w-3" /> Fjern
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Navn (vises i listen)">
                      <input value={p.label} onChange={(e) => update({ label: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                    </Field>
                    <Field label="Nøgle (intern)">
                      <input value={p.key} onChange={(e) => update({ key: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                    </Field>
                  </div>
                  <Field label="Beregner-URL">
                    <input value={p.calculator_url} onChange={(e) => update({ calculator_url: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="Inputtype">
                      <select value={p.input_type} onChange={(e) => update({ input_type: e.target.value as Product["input_type"] })}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none">
                        <option value="text">Tekst</option>
                        <option value="number">Tal</option>
                        <option value="select">Dropdown</option>
                      </select>
                    </Field>
                    <Field label="Felt-label">
                      <input value={p.input_label} onChange={(e) => update({ input_label: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                    </Field>
                    <Field label="Suffix (fx kr./md.)">
                      <input value={p.input_suffix ?? ""} onChange={(e) => update({ input_suffix: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                    </Field>
                  </div>
                  <Field label="Placeholder">
                    <input value={p.input_placeholder} onChange={(e) => update({ input_placeholder: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  </Field>
                  {p.input_type === "select" && (
                    <Field label="Dropdown-valg (én pr. linje)">
                      <textarea
                        value={(p.options ?? []).join("\n")}
                        onChange={(e) => update({ options: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })}
                        rows={4}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                    </Field>
                  )}
                </div>
              );
            })}
            {(page.products ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground italic">Ingen produkter — tilføj et for at vise vælgeren.</p>
            )}
          </div>
        </section>

        {/* Tekstindhold */}
        {!isNew && (
          <>
            <div className="rounded-2xl border border-border bg-card p-4">
              <input type="text" placeholder="Søg efter nøgle eller tekst…" value={filter} onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
              <p className="mt-2 text-xs text-muted-foreground">Ændringer gemmes pr. felt.</p>
            </div>

            {Object.entries(groups).map(([group, keys]) => (
              <section key={group}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{group}</h2>
                <div className="space-y-3">
                  {keys.map((key) => {
                    const value = content[key] ?? "";
                    const dirty = value !== originalContent[key];
                    // Stabil beslutning baseret på standardteksten — undgår at feltet
                    // skifter mellem <input> og <textarea> mens man skriver (hvilket
                    // gjorde at fokus hoppede ud, fx ved mellemrum omkring 80 tegn).
                    const defaultValue = CONTENT_DEFAULTS[key] ?? "";
                    const multiline = defaultValue.length > 80 || defaultValue.includes("\n");
                    return (
                      <div key={key} className={`rounded-2xl border bg-card p-4 transition-colors ${highlightKey === key ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <code className="text-xs font-mono text-muted-foreground">{key}</code>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setContent((c) => ({ ...c, [key]: CONTENT_DEFAULTS[key] }))}
                              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
                              title="Nulstil til standard">
                              <RotateCcw className="h-3 w-3" /> Nulstil
                            </button>
                            <button onClick={() => saveKey(key)} disabled={!dirty || savingKey === key}
                              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-40">
                              {savingKey === key ? <Loader2 className="h-3 w-3 animate-spin" />
                                : savedKey === key ? <Check className="h-3 w-3" />
                                : <Save className="h-3 w-3" />}
                              {savedKey === key ? "Gemt" : "Gem"}
                            </button>
                          </div>
                        </div>
                        {multiline ? (
                          <textarea ref={(el) => { fieldRefs.current[key] = el; }} value={value} onChange={(e) => setContent((c) => ({ ...c, [key]: e.target.value }))}
                            rows={Math.min(8, Math.max(2, value.split("\n").length + 1))}
                            className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                        ) : (
                          <input ref={(el) => { fieldRefs.current[key] = el; }} type="text" value={value} onChange={(e) => setContent((c) => ({ ...c, [key]: e.target.value }))}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </>
        )}
        </main>

        {/* Live preview */}
        <aside className="hidden lg:block min-w-0">
          <div className="sticky top-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Live preview</h2>
              <span className="text-xs text-muted-foreground">Opdateres mens du skriver</span>
            </div>
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="flex items-center gap-1.5 border-b border-border bg-secondary/40 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs text-muted-foreground truncate">/p/{page.slug || "ny-side"}</span>
              </div>
              <div className="relative w-full overflow-hidden bg-background" style={{ height: "calc(100vh - 220px)" }}>
                <div className="absolute inset-0 overflow-y-auto">
                  <div style={{ width: "1440px", transform: "scale(0.4)", transformOrigin: "top left" }}>
                    <PageProvider page={page} content={content} onEditKey={isNew ? undefined : focusField}>
                      <LandingPageView />
                    </PageProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 rounded-lg border border-border bg-background cursor-pointer" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" />
      </div>
    </Field>
  );
}