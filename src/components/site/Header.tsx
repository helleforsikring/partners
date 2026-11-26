import { useState } from "react";
import { X } from "lucide-react";
import leaLogo from "@/assets/lea-logo.png";
import { T, usePage } from "@/lib/page-context";

const NAV = [
  { key: "header.nav.forsikringer", href: "https://leaforsikring.dk/forsikringer" },
  { key: "header.nav.omLea", href: "https://leaforsikring.dk/om-lea" },
  { key: "header.nav.kontakt", href: "https://leaforsikring.dk/kontakt" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { page } = usePage();
  const accent = page.accent_color;
  const hover = page.accent_hover_color;

  return (
    <div className="px-4 pt-4">
      <header className="mx-auto w-full max-w-[1400px] rounded-3xl bg-card px-6 py-4 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between">
          <a href={`/p/${page.slug}`} className="flex items-center gap-3" aria-label={`${page.name} × LEA — forside`}>
            {page.logo_url && (
              <img src={page.logo_url} alt={page.name} className="h-9 w-auto md:h-10" />
            )}
            <X className="h-3.5 w-3.5 text-muted-foreground/70" aria-hidden="true" />
            <img src={leaLogo} alt="LEA" className="h-9 w-auto md:h-10" />
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <nav className="flex items-center gap-8">
              {NAV.map((n) => (
                <a key={n.key} href={n.href} target="_blank" rel="noopener noreferrer"
                  className="text-[15px] text-foreground/85 transition hover:opacity-80"
                  style={{ color: undefined }}>
                  <T k={n.key} />
                </a>
              ))}
            </nav>
            <a href="https://leaforsikring.dk/bliv-partner" target="_blank" rel="noopener noreferrer"
              className="inline-flex rounded-full px-6 py-3 text-[15px] font-medium text-white transition-colors"
              style={{ backgroundColor: accent }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = accent)}>
              <T k="header.cta" />
            </a>
          </div>

          <button aria-label="Menu" onClick={() => setOpen(!open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full md:hidden">
            <span className="h-0.5 w-5 bg-foreground" />
            <span className="h-0.5 w-5 bg-foreground" />
            <span className="h-0.5 w-5 bg-foreground" />
          </button>
        </div>

        {open && (
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 md:hidden">
            {NAV.map((n) => (
              <a key={n.key} href={n.href} target="_blank" rel="noopener noreferrer" className="text-sm">
                <T k={n.key} />
              </a>
            ))}
            <a href="https://leaforsikring.dk/bliv-partner" target="_blank" rel="noopener noreferrer"
              className="rounded-full px-5 py-2.5 text-center text-sm font-medium text-white"
              style={{ backgroundColor: accent }}>
              <T k="header.cta" />
            </a>
          </div>
        )}
      </header>
    </div>
  );
}