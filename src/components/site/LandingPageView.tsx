import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronsUpDown, Search, Tag } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { T, useText, usePage } from "@/lib/page-context";
import type { Product } from "@/lib/types";
import { directProductDestination, openProductDestination } from "@/lib/product-selection";

export function LandingPageView() {
  const { page } = usePage();
  useEffect(() => {
    if (page.meta_title) document.title = page.meta_title;
    if (page.meta_description) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
      }
      m.setAttribute("content", page.meta_description);
    }
  }, [page.meta_title, page.meta_description]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Products />
        <TrustCta />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  const { page } = usePage();
  return (
    <section className="px-4 pt-10 pb-6 md:pt-14 md:pb-8">
      <div className="mx-auto max-w-[1400px] text-center">
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white mb-5"
          style={{ backgroundColor: page.badge_bg_color }}>
          {page.badge_text}
        </span>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-4">
          <T k="hero.titleStart" />{" "}
          <span style={{ color: page.accent_color }}>{page.hero_highlight}</span>{" "}
          <T k="hero.titleEnd" />
        </h1>
        <p className="mx-auto max-w-4xl text-lg md:text-xl text-muted-foreground">
          <T k="hero.subtitle" />
        </p>
      </div>
    </section>
  );
}

function ContinueButton({ url }: { url: string }) {
  const { page } = usePage();
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 text-base font-medium text-white shadow-sm transition-all hover:shadow-md"
      style={{ backgroundColor: page.accent_color }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = page.accent_hover_color)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = page.accent_color)}>
      <T k="selector.cta" />
      <ArrowRight className="h-5 w-5" />
    </a>
  );
}

function ProductSelector() {
  const { page } = usePage();
  const products = page.products ?? [];
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const placeholder = useText("selector.placeholder");
  const selected: Product | undefined = products.find((p) => p.key === selectedKey);

  return (
    <div className="mx-auto max-w-3xl mb-8 md:mb-10">
      <div className="rounded-3xl bg-card p-6 md:p-7 shadow-[var(--shadow-soft)] border border-border">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <label className="text-base md:text-lg font-medium text-foreground whitespace-nowrap">
            <T k="selector.label" />
          </label>
          <div ref={ref} className="relative flex-1">
            <button type="button" onClick={() => setOpen(!open)}
              className="flex w-full items-center justify-between gap-3 rounded-full px-6 py-3.5 text-left text-white shadow-sm transition-colors"
              style={{ backgroundColor: page.accent_color }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = page.accent_hover_color)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = page.accent_color)}>
              <span className="font-medium">{selected ? selected.label : placeholder}</span>
              <ChevronsUpDown className="h-4 w-4 opacity-80" />
            </button>
            {open && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-sm text-muted-foreground">
                  <Search className="h-4 w-4" />
                  <span><T k="selector.searchLabel" /></span>
                </div>
                <ul className="p-2">
                  {products.map((opt) => (
                    <li key={opt.key}>
                      <button type="button"
                        onClick={() => {
                          const destination = directProductDestination(page.slug, opt.key);
                          if (destination) {
                            setSelectedKey(null);
                            setOpen(false);
                            openProductDestination(destination);
                            return;
                          }
                          setSelectedKey(opt.key); setValue(""); setOpen(false);
                        }}
                        className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-foreground transition-colors hover:bg-accent">
                        <span className="font-medium">{opt.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {selected && (
          <div className="mt-5 border-t border-border pt-5">
            <Field icon={<Tag className="h-4 w-4" style={{ color: page.accent_color }} />} label={selected.input_label}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                {selected.input_type === "select" ? (
                  <select value={value} onChange={(e) => setValue(e.target.value)}
                    className="flex-1 min-w-0 rounded-xl border-2 border-border bg-background px-4 py-3 text-base focus:outline-none">
                    <option value="">{selected.input_placeholder}</option>
                    {(selected.options ?? []).map((o) => (<option key={o} value={o}>{o}</option>))}
                  </select>
                ) : (
                  <div className="relative flex-1 min-w-0">
                    <input
                      type={selected.input_type === "number" ? "number" : "text"}
                      inputMode={selected.input_type === "number" ? "numeric" : undefined}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={selected.input_placeholder}
                      className={`w-full rounded-xl border-2 border-border bg-background px-4 py-3 ${selected.input_suffix ? "pr-16" : ""} text-base focus:outline-none`}
                    />
                    {selected.input_suffix && (
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{selected.input_suffix}</span>
                    )}
                  </div>
                )}
                <ContinueButton url={selected.calculator_url} />
              </div>
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">
        <span className="inline-flex items-center gap-2">{icon}{label}</span>
      </label>
      {children}
    </div>
  );
}

const PRODUCT_KEYS = [
  { titleKey: "products.indbo.title", descKey: "products.indbo.description", urlKey: "products.indbo.cardCtaUrl" },
  { titleKey: "products.husleje.title", descKey: "products.husleje.description", urlKey: "products.husleje.cardCtaUrl" },
  { titleKey: "products.ulykke.title", descKey: "products.ulykke.description", urlKey: "products.ulykke.cardCtaUrl" },
];

function Products() {
  const { page } = usePage();
  return (
    <section id="produkter" className="px-4 py-8 md:py-10">
      <div className="mx-auto max-w-[1400px]">
        <ProductSelector />
        <div className="text-center mb-8 md:mb-10">
          <span className="inline-block rounded-full px-4 py-1.5 text-sm font-medium text-white mb-3"
            style={{ backgroundColor: page.badge_bg_color }}>
            <T k="products.badge" />
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-3">
            <T k="products.title" />
          </h2>
          <p className="mx-auto text-base md:text-lg text-muted-foreground"><T k="products.subtitle" /></p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PRODUCT_KEYS.map((p) => (
            <ProductCard key={p.titleKey} titleKey={p.titleKey} descKey={p.descKey} urlKey={p.urlKey} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ titleKey, descKey, urlKey }: { titleKey: string; descKey: string; urlKey: string }) {
  const { page } = usePage();
  const url = useText(urlKey) || "https://www.helleforsikring.dk/forsikring";
  return (
    <article className="flex flex-col rounded-3xl bg-card p-7 md:p-8 shadow-[var(--shadow-card)] border border-border">
      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3"><T k={titleKey} /></h3>
      <p className="text-base text-muted-foreground leading-relaxed flex-1 mb-6"><T k={descKey} /></p>
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 self-start rounded-full px-5 py-2.5 text-sm font-medium text-white transition-colors"
        style={{ backgroundColor: page.accent_color }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = page.accent_hover_color)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = page.accent_color)}>
        <T k="products.cardCta" />
        <ArrowRight className="h-4 w-4" />
      </a>
    </article>
  );
}

function TrustCta() {
  const { page } = usePage();
  return (
    <section className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="relative overflow-hidden rounded-3xl px-6 py-12 md:px-16 md:py-16 text-white shadow-[var(--shadow-soft)]"
          style={{ backgroundColor: page.accent_color }}>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6 text-center"><T k="trust.title" /></h2>
          <div className="mx-auto max-w-3xl space-y-5 text-base md:text-lg text-white/90 leading-relaxed">
            <p><T k="trust.p1" /></p>
            <p><T k="trust.p2" /></p>
            <p><T k="trust.p3" /></p>
            <p><T k="trust.p4" /></p>
          </div>
          <div className="mt-10 flex justify-center">
            <a href="https://www.helleforsikring.dk/forsikring" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-7 py-4 text-base font-medium text-foreground shadow-sm transition-all hover:opacity-90">
              <T k="trust.cta" />
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}