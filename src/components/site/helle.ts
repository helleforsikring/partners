export const HELLE = "https://www.helleforsikring.dk";

/** 3D-ikoner fra Helles eget designsystem på helleforsikring.dk */
export const helleIcon = (name: string) => `${HELLE}/brand/shared/ikoner-3d/${name}.webp`;

/** Ikon til et produkt i prisvælgeren — gætter ud fra nøgle eller beregner-URL */
export function productIcon(key: string, url = ""): string {
  const s = `${key} ${url}`.toLowerCase();
  for (const n of ["indbo", "husleje", "ulykke", "ejerudgift", "ejerskifte"]) if (s.includes(n)) return helleIcon(n);
  return helleIcon("pris");
}
