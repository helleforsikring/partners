import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown, ChevronRight } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { HELLE, helleIcon, productIcon } from "./helle";
import { T, useText, usePage } from "@/lib/page-context";
import { directProductDestination, openProductDestination } from "@/lib/product-selection";

const SECTION = "mx-auto w-full max-w-[77.5rem] px-5 md:px-10";

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
    <div className="flex min-h-screen flex-col bg-helle-creme font-helle text-helle-blomme antialiased">
      <Header />
      <main className="flex-1">
        <Hero />
        <Products />
        <Partnership />
        <AboutHelle />
      </main>
      <Footer />
    </div>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  const { page } = usePage();
  const image = useText("hero.image");
  const imageAlt = useText("hero.imageAlt");
  const usps: [string, string][] = [["usp.1", "pris"], ["usp.2", "digitalt-med-helle"], ["usp.3", "raadgivning"]];
  return (
    <section className="pb-16 pt-10 md:pb-24 md:pt-14">
      <div className={`${SECTION} grid items-center gap-12 lg:grid-cols-2 lg:gap-16`}>
        <div>
          <span className="inline-flex rounded-full bg-helle-pink px-3.5 py-1.5 text-[13px] font-medium leading-4">
            {page.badge_text}
          </span>
          <h1 className="mt-5 text-[2.5rem] font-bold leading-[2.875rem] tracking-[-0.02em] md:text-[3.75rem] md:leading-[4rem]">
            <T k="hero.titleStart" />{" "}
            <span style={{ color: page.accent_color }}>{page.hero_highlight}</span>{" "}
            <T k="hero.titleEnd" />
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-7 md:text-[1.3125rem] md:leading-8">
            <T k="hero.subtitle" />
          </p>
          <ul className="mt-8 grid max-w-[28rem] grid-cols-2 gap-x-6 gap-y-4">
            {usps.map(([k, icon]) => (
              <li key={k} className="flex items-center gap-3 text-[15px] leading-[1.375rem]">
                <img src={helleIcon(icon)} alt="" className="h-12 w-12 shrink-0 mix-blend-multiply" />
                <span className="max-w-[7rem]"><T k={k} /></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[30rem] lg:mr-0">
          {image && (
            <img src={image} alt={imageAlt} className="aspect-[471/528] w-full rounded-[2rem] object-cover" />
          )}
          <div className={image ? "relative -mt-24 px-4 sm:px-0 lg:absolute lg:-left-10 lg:bottom-0 lg:mt-0 lg:w-[26rem]" : ""}>
            <ProductSelector />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductSelector() {
  const { page, onEditKey } = usePage();
  const products = page.products ?? [];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
  }, []);

  const go = (key: string, url: string) => {
    setOpen(false);
    const destination = directProductDestination(page.slug, key) ?? url;
    if (!destination || destination === "https://") return;
    // I admin-forhåndsvisningen åbnes beregneren i en ny fane
    if (onEditKey) openProductDestination(destination);
    else window.location.assign(destination);
  };

  return (
    <div id="beregn" ref={ref} className="relative rounded-[2rem] bg-white p-6 shadow-[0_1rem_2.5rem_0_rgba(50,17,52,.14)]">
      <p className="mb-4 text-[1.375rem] font-semibold leading-7 tracking-[-0.005em]"><T k="selector.label" /></p>
      <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}
        className="flex h-14 w-full items-center justify-between rounded-xl border border-helle-blomme bg-white px-4 text-left text-lg focus:outline-none focus-visible:shadow-[0_0_0_.25rem_#F4B0F9]">
        <T k="selector.placeholder" />
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul role="listbox"
          className="absolute bottom-full left-0 right-0 z-20 mb-2 flex flex-col gap-2 rounded-[1.25rem] bg-white p-2 shadow-[0_1rem_2.5rem_0_rgba(50,17,52,.14)]">
          {products.map((p) => (
            <li key={p.key}>
              <button type="button" role="option" aria-selected={false} onClick={() => go(p.key, p.calculator_url)}
                className="flex w-full items-center gap-3 rounded-[0.875rem] bg-helle-creme px-3 py-2 text-left text-lg leading-6 transition hover:bg-helle-lavendel hover:shadow-[inset_0_0_0_2px_#321134]">
                <img src={productIcon(p.key, p.calculator_url)} alt="" className="h-10 w-10 shrink-0 mix-blend-multiply" />
                <span className="flex-1">{p.label}</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}

/* ---------- Produkter ---------- */

const PRODUCT_KEYS = ["indbo", "husleje", "ulykke"];

function Products() {
  return (
    <section id="produkter" className="bg-white py-20 md:py-[7.5rem]">
      <div className={SECTION}>
        <h2 className="mb-10 text-[2.25rem] font-bold leading-[2.75rem] tracking-[-0.02em] md:mb-14 md:text-[3.75rem] md:leading-[4rem]">
          <T k="products.title" />
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {PRODUCT_KEYS.map((k) => <ProductCard key={k} k={k} />)}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ k }: { k: string }) {
  const { page } = usePage();
  const url = useText(`products.${k}.cardCtaUrl`) || `${HELLE}/forsikring`;
  const image = useText(`products.${k}.image`);
  const discount = useText(`products.${k}.discount`);
  const chip = useText("products.chip");
  return (
    <article className="flex flex-col rounded-[2rem] bg-helle-creme p-6 md:p-8">
      {image && (
        <div className="relative mb-6 overflow-hidden rounded-xl bg-white">
          <img src={image} alt="" className="aspect-[275/164] w-full object-cover" loading="lazy" />
          <div className="absolute left-3 right-3 top-3 flex flex-wrap items-center justify-between gap-2">
            {chip && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-helle-pink px-3 py-1.5 text-[13px] font-medium uppercase leading-4 tracking-[0.06em]">
                <Check className="h-3 w-3" strokeWidth={3} /> <T k="products.chip" />
              </span>
            )}
            {discount && (
              <span className="rounded-full px-3 py-1.5 text-[13px] font-medium leading-4 tracking-[0.06em] text-white"
                style={{ backgroundColor: page.accent_color }}>
                <T k={`products.${k}.discount`} />
              </span>
            )}
          </div>
        </div>
      )}
      <h3 className="mb-4 text-[1.625rem] font-bold leading-8 tracking-[-0.01em] [hyphens:auto] md:text-[1.875rem] md:leading-9" lang="da">
        <T k={`products.${k}.title`} />
      </h3>
      <p className="mb-8 flex-1 whitespace-pre-line text-lg leading-7 text-helle-daempet">
        <T k={`products.${k}.description`} />
      </p>
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="inline-flex h-12 items-center gap-2 self-start rounded-full px-5 text-[17px] font-medium text-white transition-colors"
        style={{ backgroundColor: page.accent_color }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = page.accent_hover_color || page.accent_color)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = page.accent_color)}>
        <T k="products.cardCta" />
        <ArrowRight className="h-4 w-4" />
      </a>
    </article>
  );
}

/* ---------- Tekstsektioner ---------- */

function TwoCol({ eyebrow, title, children, className = "" }: { eyebrow: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`${SECTION} grid gap-8 md:grid-cols-2 md:gap-16 ${className}`}>
      <div>
        <p className="mb-4 text-[13px] font-medium uppercase leading-4 tracking-[0.06em] text-helle-daempet"><T k={eyebrow} /></p>
        <h2 className="max-w-[30rem] text-[2.25rem] font-bold leading-[2.75rem] tracking-[-0.02em] md:text-[3.25rem] md:leading-[3.5rem]">
          <T k={title} />
        </h2>
      </div>
      <div className="space-y-5 text-lg leading-7 md:pt-8">{children}</div>
    </div>
  );
}

function TextLink({ href, k }: { href: string; k: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-2 pt-2 text-[17px] font-medium underline underline-offset-4 hover:no-underline">
      <T k={k} /> <ArrowRight className="h-4 w-4" />
    </a>
  );
}

function Partnership() {
  const title = useText("trust.title");
  if (!title) return null;
  return (
    <section className="bg-helle-creme py-20 md:py-[7.5rem]">
      <TwoCol eyebrow="trust.eyebrow" title="trust.title">
        {["trust.p1", "trust.p2", "trust.p3", "trust.p4"].map((k) => <Para key={k} k={k} />)}
        <TextLink href={`${HELLE}/forsikring`} k="trust.cta" />
      </TwoCol>
    </section>
  );
}

function Para({ k }: { k: string }) {
  const text = useText(k);
  if (!text) return null;
  return <p><T k={k} /></p>;
}

function AboutHelle() {
  return (
    <section className="bg-white pb-20 md:pb-[7.5rem]">
      <div className={`${SECTION}`}><div className="border-t border-helle-linje" /></div>
      <TwoCol eyebrow="about.eyebrow" title="about.title" className="pt-16 md:pt-[5rem]">
        <p><T k="about.text" /></p>
        <TextLink href={`${HELLE}/om-helle`} k="about.cta" />
      </TwoCol>
    </section>
  );
}
