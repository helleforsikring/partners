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
  // Topbanner
  "banner.text": "LEA hedder nu Helle.",
  "banner.linkText": "Læs mere",
  "banner.url": "https://www.helleforsikring.dk/lea-hedder-nu-helle",

  // Header
  "header.mitHelle": "Mit Helle",
  "header.beregn": "Beregn din pris",
  "header.nav.forsikringer": "Forsikringer",
  "header.nav.omLea": "Om Helle",
  "header.nav.kontakt": "Kontakt",

  // Hero
  "hero.titleStart": "Forsikringsfordele,",
  "hero.titleEnd": "til dit lejeliv",
  "hero.subtitle": "",
  "hero.image": "https://cdn.sanity.io/images/s87ydv4j/production/1047c4cb0165053b4f9e454a44121925e558d0b2-1333x2000.jpg?w=1000&q=80&auto=format",
  "hero.imageAlt": "Et smilende menneske i en rød sofa med et æble i hånden",
  "usp.1": "Prisen med det samme",
  "usp.2": "Alt klares digitalt",
  "usp.3": "Ærlig rådgivning",

  // Selector
  "selector.label": "Beregn din pris",
  "selector.placeholder": "Vælg forsikring",

  // Products section
  "products.title": "Tre forsikringer til dit lejeliv",
  "products.indbo.title": "Indboforsikring",
  "products.indbo.description": "Dækker dine personlige ejendele i hjemmet — fra møbler og elektronik til tøj og cykler. Beskyttelse mod tyveri, brand og vandskade.",
  "products.husleje.title": "Huslejeforsikring",
  "products.husleje.description": "Sikrer dig hvis du pludselig ikke kan betale din husleje på grund af ufrivillig arbejdsløshed eller alvorlig sygdom. Tryghed for både dig og din udlejer.",
  "products.ulykke.title": "Ulykkesforsikring",
  "products.ulykke.description": "Beskytter dig økonomisk ved ulykker i hverdagen — uanset om de sker hjemme, på arbejde eller i fritiden. Erstatning ved varigt mén.",
  "products.cardCta": "Læs mere",
  "products.chip": "Køb online",
  "products.indbo.image": "https://cdn.sanity.io/images/s87ydv4j/production/f27e0e912479e472fb3ae0d2cd87acf8ae2e6238-1344x896.jpg?w=700&h=420&fit=crop&q=80&auto=format",
  "products.husleje.image": "https://cdn.sanity.io/images/s87ydv4j/production/6f61095ddf32d2986a3084b6f070e3b077a5cd1d-1536x1024.png?w=700&h=420&fit=crop&q=80&auto=format",
  "products.ulykke.image": "https://cdn.sanity.io/images/s87ydv4j/production/dad925df8248baeb95436096468d439b3eb4a20e-1024x1024.jpg?w=700&h=420&fit=crop&q=80&auto=format",
  "products.indbo.discount": "",
  "products.husleje.discount": "",
  "products.ulykke.discount": "",
  "products.indbo.cardCtaUrl": "https://www.helleforsikring.dk/forsikring/indbo",
  "products.husleje.cardCtaUrl": "https://www.helleforsikring.dk/forsikring/husleje",
  "products.ulykke.cardCtaUrl": "https://www.helleforsikring.dk/forsikring/ulykke",

  // Trust
  "trust.title": "",
  "trust.p1": "",
  "trust.p2": "",
  "trust.p3": "",
  "trust.p4": "",
  "trust.eyebrow": "Samarbejdet",
  "trust.cta": "Se alle forsikringer",

  // Om Helle
  "about.eyebrow": "Om Helle",
  "about.title": "Tryghed starter med klar besked.",
  "about.text": "Helle er forsikringsformidler. Vi hjælper dig med at finde din forsikring, og det er forsikringsselskaberne bag, der står for dækningen. Du skal nemt kunne se, hvad forsikringen dækker, og hvilke begrænsninger der gælder.",
  "about.cta": "Læs om Helle og vores forsikringspartnere",

  // Footer
  "footer.tagline": "Helle er forsikringsformidler. Vi formidler forsikringer fra de forsikringsselskaber, vi samarbejder med, og gør det nemt at finde, forstå og købe den rette.",
  "footer.phone": "+45 70 80 74 60",
  "footer.email": "info@helleforsikring.dk",
  "footer.legal": "Helle Forsikringsformidling A/S · Strandgade 12, 1401 København K · CVR 45418669 · Forsikringsformidler registreret hos Finanstilsynet, FT-nr. 48105",
};