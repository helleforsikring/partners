import { useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import helleLogo from "@/assets/helle-logo-blomme.svg";
import { T, useText, usePage } from "@/lib/page-context";
import { HELLE } from "./helle";
import { ProductOptions, useToggle } from "./ProductOptions";

const NAV = [
  { key: "header.nav.forsikringer", href: `${HELLE}/forsikring` },
  { key: "header.nav.kontakt", href: `${HELLE}/kontakt` },
  { key: "header.nav.omLea", href: `${HELLE}/om-helle` },
];

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
      <div className="px-4 pt-4 md:px-10">
        <div className="w-full rounded-[22px] bg-white px-5 py-3 shadow-[0_.5rem_2rem_0_rgba(50,17,52,.08)] md:px-10 md:py-0">
          <div className="flex items-center justify-between gap-6 md:h-[84px]">
            <Link to={`/p/${page.slug}`} className="flex min-w-0 items-center gap-3 md:gap-5" aria-label={`Helle × ${page.name} — forside`}>
              <img src={helleLogo} alt="Helle" className="h-8 w-auto shrink-0 md:h-[45px]" />
              {page.logo_url && (
                <>
                  <X className="h-3.5 w-3.5 shrink-0 text-helle-blomme md:h-4 md:w-4" strokeWidth={3} aria-hidden="true" />
                  <img src={page.logo_url} alt={page.name} className="h-7 w-auto max-w-[150px] object-contain md:h-10 md:max-w-[240px]" />
                </>
              )}
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              {NAV.map((n) => (
                <a key={n.key} href={n.href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex h-11 items-center px-1 text-[17px] text-helle-blomme transition hover:underline underline-offset-4">
                  <T k={n.key} />
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-5 md:flex">
              <a href={`${HELLE}/mit-helle`} target="_blank" rel="noopener noreferrer"
                className="inline-flex h-[50px] w-[110px] items-center justify-center rounded-full text-base font-medium text-helle-blomme ring-2 ring-inset ring-helle-pink transition hover:bg-helle-lavendel">
                <T k="header.mitHelle" />
              </a>
              <CalcButton />
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
              <p className="pt-2 text-base font-medium text-helle-blomme"><T k="header.beregn" /></p>
              <ProductOptions onPicked={() => setOpen(false)} className="shadow-none ring-1 ring-helle-linje" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function CalcButton() {
  const { open, setOpen, ref } = useToggle();
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}
        className="inline-flex h-[52px] items-center gap-2.5 rounded-full bg-helle-blomme px-[26px] text-[17px] font-medium text-white transition hover:opacity-90">
        <T k="header.beregn" />
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <ProductOptions onPicked={() => setOpen(false)} className="absolute right-0 top-full z-40 mt-3 w-[22rem]" />}
    </div>
  );
}
