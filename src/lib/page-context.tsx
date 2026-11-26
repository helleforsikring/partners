import { createContext, useContext, type ReactNode } from "react";
import type { LandingPage } from "./types";
import { CONTENT_DEFAULTS } from "./types";

type Ctx = {
  page: LandingPage;
  content: Record<string, string>;
  onEditKey?: (key: string) => void;
};

const PageCtx = createContext<Ctx | null>(null);

export function PageProvider({
  page,
  content,
  onEditKey,
  children,
}: {
  page: LandingPage;
  content: Record<string, string>;
  onEditKey?: (key: string) => void;
  children: ReactNode;
}) {
  return <PageCtx.Provider value={{ page, content, onEditKey }}>{children}</PageCtx.Provider>;
}

export function usePage() {
  const ctx = useContext(PageCtx);
  if (!ctx) throw new Error("usePage must be used inside PageProvider");
  return ctx;
}

export function useText(key: string): string {
  const { content } = usePage();
  return content[key] ?? CONTENT_DEFAULTS[key] ?? "";
}

export function T({ k }: { k: string }) {
  const text = useText(k);
  const { onEditKey } = usePage();
  if (!onEditKey) return <>{text}</>;
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEditKey(k); }}
      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onEditKey(k); } }}
      title={`Redigér: ${k}`}
      className="cursor-pointer rounded-sm outline outline-1 outline-transparent hover:outline-primary hover:bg-primary/10 transition-colors"
    >
      {text}
    </span>
  );
}