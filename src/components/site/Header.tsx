import { useCallback, useRef, useState } from "react";
import { ArrowRight, ChevronDown, ChevronRight, Menu, Phone, X } from "lucide-react";
import { Link } from "react-router-dom";
import helleLogo from "@/assets/helle-logo-blomme.svg";
import { T, useText, usePage } from "@/lib/page-context";
import { HELLE } from "./helle";
import { ProductOptions, useDismiss, useToggle } from "./ProductOptions";

const NAV = [
  { key: "header.nav.kontakt", href: `${HELLE}/kontakt` },
  { key: "header.nav.omLea", href: `${HELLE}/om-helle` },
];

const FOCUS = "outline-none focus-visible:shadow-[0_0_0_.125rem_#fff,0_0_0_.25rem_#321134]";

const INSURANCES: [string, string][] = [
  ["Indboforsikring", "/forsikring/indbo"],
  ["Ulykkesforsikring", "/forsikring/ulykke"],
  ["Huslejeforsikring", "/forsikring/husleje"],
  ["Ejerudgift-Vedligeholdelsesforsikring", "/forsikring/ejerudgift"],
  ["Ejerskifteforsikring", "/forsikring/ejerskifte"],
  ["Udvidet Garanti til Bil", "/forsikring/garanti-bil"],
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
  const [mega, setMega] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMega = useCallback(() => setMega(false), []);
  useDismiss(menuRef, mega, closeMega);
  const { page } = usePage();

  return (
    <header className="sticky top-0 z-30">
      <Banner />
      <div className="px-4 pt-4 xl:px-8">
        <div ref={menuRef} className="relative mx-auto w-full max-w-[86rem] rounded-[22px] bg-white px-5 py-3 shadow-[0_.5rem_2rem_0_rgba(50,17,52,.08)] md:px-10 md:py-0">
          <div className="flex items-center gap-6 md:h-[84px]">
            <Link to={`/p/${page.slug}`} className={`flex min-w-0 shrink-0 items-center gap-3 rounded-xl md:gap-5 ${FOCUS}`} aria-label={`Helle × ${page.name} — forside`}>
              <img src={helleLogo} alt="Helle" className="h-8 w-auto shrink-0 md:h-[45px]" />
              {page.logo_url && (
                <>
                  <X className="h-3.5 w-3.5 shrink-0 text-helle-blomme md:h-4 md:w-4" strokeWidth={3} aria-hidden="true" />
                  <img src={page.logo_url} alt={page.name} className="h-7 w-auto max-w-[150px] object-contain md:h-10 md:max-w-[240px]" />
                </>
              )}
            </Link>

            <nav className="hidden min-w-0 flex-1 items-center justify-center gap-8 lg:flex">
              <button type="button" onClick={() => setMega(!mega)} aria-expanded={mega}
                className={`inline-flex h-11 items-center gap-1 rounded-xl px-1 text-[17px] text-helle-blomme underline-offset-[6px] hover:underline ${mega ? "underline" : ""} ${FOCUS}`}>
                <T k="header.nav.forsikringer" />
                <ChevronDown className={`h-4 w-4 transition-transform ${mega ? "rotate-180" : ""}`} />
              </button>
              {NAV.map((n) => (
                <a key={n.key} href={n.href} target="_blank" rel="noopener noreferrer"
                  className={`inline-flex h-11 items-center rounded-xl px-1 text-[17px] text-helle-blomme transition hover:underline underline-offset-[6px] ${FOCUS}`}>
                  <T k={n.key} />
                </a>
              ))}
            </nav>

            <div className="ml-auto hidden shrink-0 items-center gap-5 md:flex">
              <a href={`${HELLE}/mit-helle`} target="_blank" rel="noopener noreferrer"
                className={`inline-flex h-[50px] w-[110px] items-center justify-center rounded-full text-base font-medium text-helle-blomme ring-2 ring-inset ring-helle-pink transition hover:bg-helle-lavendel ${FOCUS}`}>
                <T k="header.mitHelle" />
              </a>
              <CalcButton />
            </div>

            <button aria-label="Menu" onClick={() => setOpen(!open)}
              className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-helle-blomme md:hidden">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mega && <MegaMenu onClose={() => setMega(false)} />}

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
      {mega && <div className="fixed inset-0 -z-10 bg-helle-blomme/25" aria-hidden="true" />}
    </header>
  );
}

function CalcButton() {
  const { open, setOpen, ref } = useToggle();
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}
        className={`inline-flex h-[52px] items-center gap-2.5 rounded-full bg-helle-blomme px-[26px] text-[17px] font-medium text-white transition hover:opacity-90 ${FOCUS}`}>
        <T k="header.beregn" />
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <ProductOptions onPicked={() => setOpen(false)} className="absolute right-0 top-full z-40 mt-3 w-[22rem]" />}
    </div>
  );
}

function MegaMenu({ onClose }: { onClose: () => void }) {
  const phone = useText("footer.phone");
  const [calc, setCalc] = useState(false);
  return (
    <div className="absolute left-0 right-0 top-full z-40 mt-3 hidden gap-6 rounded-[1.5rem] bg-white p-6 shadow-[0_1rem_2.5rem_0_rgba(50,17,52,.14)] lg:grid lg:grid-cols-[1fr_18rem]">
      <div>
        <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.06em] text-helle-daempet">Forsikringer</p>
        <ul className="grid grid-cols-2 gap-3">
          {INSURANCES.map(([label, href]) => (
            <li key={href}>
              <a href={`${HELLE}${href}`} target="_blank" rel="noopener noreferrer" onClick={onClose}
                className={`flex items-center justify-between rounded-[0.875rem] bg-helle-creme px-6 py-4 text-base text-helle-blomme transition hover:bg-helle-lavendel ${FOCUS}`}>
                {label} <ChevronRight className="h-4 w-4 shrink-0" />
              </a>
            </li>
          ))}
        </ul>
        <a href={`${HELLE}/forsikring`} target="_blank" rel="noopener noreferrer"
          className={`mt-5 inline-flex items-center gap-2 rounded-lg text-[15px] text-helle-blomme hover:underline underline-offset-4 ${FOCUS}`}>
          Alle forsikringer <ArrowRight className="h-4 w-4" />
        </a>
      </div>
      <div className="flex flex-col gap-4 rounded-[1.25rem] bg-helle-lavendel p-6">
        <p className="text-[1.375rem] font-semibold leading-7"><T k="header.beregn" /></p>
        <button type="button" onClick={() => setCalc(!calc)} aria-expanded={calc}
          className={`inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-helle-blomme px-6 text-base font-medium text-white hover:opacity-90 ${FOCUS}`}>
          <T k="header.beregn" /> <ChevronDown className={`h-4 w-4 transition-transform ${calc ? "rotate-180" : ""}`} />
        </button>
        {calc && <ProductOptions onPicked={onClose} className="shadow-none" />}
        <a href={`tel:${phone.replace(/\s+/g, "")}`} className={`inline-flex items-center gap-2 rounded-lg text-[15px] text-helle-blomme hover:underline ${FOCUS}`}>
          <Phone className="h-4 w-4" /> Ring {phone.replace(/^\+45\s*/, "")}
        </a>
      </div>
    </div>
  );
}
