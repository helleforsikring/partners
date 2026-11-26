import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import helleLogo from "@/assets/helle-logo-blomme.svg";
import { T, useText, usePage } from "@/lib/page-context";
import { HELLE } from "./helle";

const NAV = [
  { key: "header.nav.forsikringer", href: `${HELLE}/forsikring` },
  { key: "header.nav.kontakt", href: `${HELLE}/kontakt` },
  { key: "header.nav.omLea", href: `${HELLE}/om-helle` },
];

export function scrollToCalculator() {
  const el = document.getElementById("beregn");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => el.querySelector<HTMLButtonElement>("button")?.focus(), 400);
}

function Banner() {
  const url = useText("banner.url");
  const text = useText("banner.text");
  if (!text) return null;
  return (
    <div className="bg-helle-blomme px-4 py-2 text-center text-[15px] text-white">
      <T k="banner.text" />{" "}
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="ml-1 inline-flex items-center gap-1 font-semibold text-helle-pink hover:underline underline-offset-4">
        <T k="banner.linkText" /> <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { page } = usePage();

  return (
    <header className="sticky top-0 z-30">
      <Banner />
      <div className="px-4 pt-3 md:px-8">
        <div className="mx-auto w-full max-w-[77.5rem] rounded-3xl bg-white px-5 py-3.5 shadow-[0_.5rem_2rem_0_rgba(50,17,52,.08)] md:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link to={`/p/${page.slug}`} className="flex min-w-0 items-center gap-3" aria-label={`Helle × ${page.name} — forside`}>
              <img src={helleLogo} alt="Helle" className="h-7 w-auto shrink-0 md:h-[34px]" />
              {page.logo_url && (
                <>
                  <X className="h-3.5 w-3.5 shrink-0 text-helle-blomme" strokeWidth={3} aria-hidden="true" />
                  <img src={page.logo_url} alt={page.name} className="h-6 w-auto max-w-[140px] object-contain md:h-8" />
                </>
              )}
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              {NAV.map((n) => (
                <a key={n.key} href={n.href} target="_blank" rel="noopener noreferrer"
                  className="text-base text-helle-blomme transition hover:underline underline-offset-4">
                  <T k={n.key} />
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <a href={`${HELLE}/mit-helle`} target="_blank" rel="noopener noreferrer"
                className="inline-flex h-[50px] items-center rounded-full px-5 text-base font-medium text-helle-blomme ring-2 ring-inset ring-helle-pink transition hover:bg-helle-lavendel">
                <T k="header.mitHelle" />
              </a>
              <button type="button" onClick={scrollToCalculator}
                className="inline-flex h-[50px] items-center rounded-full bg-helle-blomme px-5 text-[17px] font-medium text-white transition hover:opacity-90">
                <T k="header.beregn" />
              </button>
            </div>

            <button aria-label="Menu" onClick={() => setOpen(!open)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-helle-blomme md:hidden">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {open && (
            <div className="mt-4 flex flex-col gap-3 border-t border-helle-linje pt-4 md:hidden">
              {NAV.map((n) => (
                <a key={n.key} href={n.href} target="_blank" rel="noopener noreferrer" className="text-base text-helle-blomme">
                  <T k={n.key} />
                </a>
              ))}
              <a href={`${HELLE}/mit-helle`} target="_blank" rel="noopener noreferrer" className="text-base text-helle-blomme">
                <T k="header.mitHelle" />
              </a>
              <button type="button" onClick={() => { setOpen(false); scrollToCalculator(); }}
                className="rounded-full bg-helle-blomme px-5 py-3 text-center text-base font-medium text-white">
                <T k="header.beregn" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
