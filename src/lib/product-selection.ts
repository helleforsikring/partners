// Partner-specific direct destinations bypass the selector's input step.
export function directProductDestination(slug: string, productKey: string): string | null {
  return slug === "gobolig" && productKey === "indbo"
    ? "https://www.helleforsikring.dk/forsikring/indbo/beregn"
    : null;
}

// External calculators block embedded previews; open outside the iframe.
export function openProductDestination(destination: string): void {
  window.open(destination, "_blank", "noopener,noreferrer");
}