export type Product = {
  key: string;
  label: string;
  calculator_url: string;
  input_type: "text" | "number" | "select";
  input_label: string;
  input_placeholder: string;
  input_suffix?: string;
  options?: string[];
};

export type LandingPage = {
  id: string;
  slug: string;
  name: string;
  badge_text: string;
  hero_highlight: string;
  accent_color: string;
  accent_hover_color: string;
  badge_bg_color: string;
  logo_url: string | null;
  meta_title: string;
  meta_description: string;
  is_visible: boolean;
  deleted_at: string | null;
  products: Product[];
};

export type ContentRow = { slug: string; key: string; value: string };

export const CONTENT_DEFAULTS: Record<string, string> = {
  // Header
  "header.cta": "Læs mere om partnerskabet",
  "header.nav.forsikringer": "Forsikringer",
  "header.nav.omLea": "Om LEA",
  "header.nav.kontakt": "Kontakt",

  // Hero
  "hero.titleStart": "Forsikringsfordele,",
  "hero.titleEnd": "til dit lejeliv",
  "hero.subtitle": "",

  // Selector
  "selector.label": "Tegn din forsikring hos LEA",
  "selector.placeholder": "Vælg forsikring",
  "selector.searchLabel": "Vælg forsikring",
  "selector.cta": "Beregn pris",
  "selector.indbo.label": "Søg din adresse",
  "selector.indbo.placeholder": "F.eks. Strandgade 12, 1401 København K",
  "selector.husleje.label": "Månedlig husleje",
  "selector.husleje.placeholder": "F.eks. 8500",
  "selector.ulykke.label": "Vælg din beskæftigelse",
  "selector.ulykke.placeholder": "Vælg beskæftigelse",
  "product.indbo": "Indboforsikring",
  "product.husleje": "Huslejeforsikring",
  "product.ulykke": "Ulykkesforsikring",

  // Products section
  "products.badge": "Forsikringer",
  "products.title": "Tre forsikringer til dit lejeliv",
  "products.subtitle": "Vælg de produkter, der passer til netop din situation — eller kombiner dem for fuld tryghed.",
  "products.indbo.title": "Indboforsikring",
  "products.indbo.description": "Dækker dine personlige ejendele i hjemmet — fra møbler og elektronik til tøj og cykler. Beskyttelse mod tyveri, brand og vandskade.",
  "products.husleje.title": "Huslejeforsikring",
  "products.husleje.description": "Sikrer dig hvis du pludselig ikke kan betale din husleje på grund af ufrivillig arbejdsløshed eller alvorlig sygdom. Tryghed for både dig og din udlejer.",
  "products.ulykke.title": "Ulykkesforsikring",
  "products.ulykke.description": "Beskytter dig økonomisk ved ulykker i hverdagen — uanset om de sker hjemme, på arbejde eller i fritiden. Erstatning ved varigt mén.",
  "products.cardCta": "Læs mere",
  "products.indbo.cardCtaUrl": "https://leaforsikring.dk/forsikringer",
  "products.husleje.cardCtaUrl": "https://leaforsikring.dk/forsikringer",
  "products.ulykke.cardCtaUrl": "https://leaforsikring.dk/forsikringer",

  // Trust
  "trust.title": "",
  "trust.p1": "",
  "trust.p2": "",
  "trust.p3": "",
  "trust.p4": "",
  "trust.cta": "Læs mere om samarbejdet",

  // Footer
  "footer.tagline": "L står for lejere. For LEA er nemlig bygget til alle os, der lejer. I LEA er alle de forsikringsløsninger, som giver mening i et lejeliv, samlet ét sted.",
  "footer.shortcuts": "Genveje",
  "footer.persondata": "Persondatapolitik",
  "footer.follow": "Følg os",
  "footer.contact": "Kontakt",
  "footer.address1": "Strandgade 12",
  "footer.address2": "1401 København K",
  "footer.phone": "+45 70 80 74 60",
  "footer.email": "info@leaforsikring.dk",
  "footer.legal": "CVR-nummer: 45418669 · © All Rights Reserved Lea",
};