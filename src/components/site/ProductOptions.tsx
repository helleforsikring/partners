import { useEffect, useRef, useState, type RefObject } from "react";
import { ChevronRight } from "lucide-react";
import { usePage } from "@/lib/page-context";
import { directProductDestination, openProductDestination } from "@/lib/product-selection";
import { productIcon } from "./helle";

/** Sender kunden videre til beregneren for det valgte produkt */
export function useGoToProduct() {
  const { page, onEditKey } = usePage();
  return (key: string, url: string) => {
    const destination = directProductDestination(page.slug, key) ?? url;
    if (!destination || destination === "https://") return;
    // I admin-forhåndsvisningen åbnes beregneren i en ny fane
    if (onEditKey) openProductDestination(destination);
    else window.location.assign(destination);
  };
}

/** Lukker en dropdown ved klik udenfor eller Escape */
export function useDismiss(ref: RefObject<HTMLElement>, open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
  }, [ref, open, close]);
}

/** Listen med forsikringer (ikon, navn, pil) — bruges i hero-boksen og i headeren */
export function ProductOptions({ onPicked, className = "" }: { onPicked?: () => void; className?: string }) {
  const { page } = usePage();
  const go = useGoToProduct();
  return (
    <ul role="listbox" className={`flex flex-col gap-2 rounded-[1.25rem] bg-white p-2 shadow-[0_1rem_2.5rem_0_rgba(50,17,52,.14)] ${className}`}>
      {(page.products ?? []).map((p) => (
        <li key={p.key}>
          <button type="button" role="option" aria-selected={false}
            onClick={() => { onPicked?.(); go(p.key, p.calculator_url); }}
            className="flex w-full items-center gap-3 rounded-[0.875rem] bg-helle-creme px-3 py-2 text-left text-lg leading-6 text-helle-blomme transition hover:bg-helle-lavendel hover:shadow-[inset_0_0_0_2px_#321134]">
            <img src={productIcon(p.key, p.calculator_url)} alt="" className="h-10 w-10 shrink-0 mix-blend-multiply" />
            <span className="flex-1">{p.label}</span>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </button>
        </li>
      ))}
    </ul>
  );
}

export function useToggle() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(() => setOpen(false)).current;
  useDismiss(ref, open, close);
  return { open, setOpen, ref };
}
