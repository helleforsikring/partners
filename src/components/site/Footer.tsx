import helleLogoPink from "@/assets/helle-logo-pink.svg";
import { T, useText } from "@/lib/page-context";
import { HELLE } from "./helle";

const COLS: { title: string; links: [string, string][] }[] = [
  {
    title: "Forsikringer",
    links: [
      ["Indboforsikring", "/forsikring/indbo"],
      ["Ulykkesforsikring", "/forsikring/ulykke"],
      ["Huslejeforsikring", "/forsikring/husleje"],
      ["Ejerudgift-Vedligeholdelsesforsikring", "/forsikring/ejerudgift"],
      ["Ejerskifteforsikring", "/forsikring/ejerskifte"],
      ["Udvidet Garanti til Bil", "/forsikring/garanti-bil"],
      ["Alle forsikringer", "/forsikring"],
    ],
  },
  {
    title: "Hjælp",
    links: [
      ["Mit Helle", "/mit-helle"],
      ["Hjælp og kontakt", "/kontakt"],
      ["Spørgsmål og svar", "/kontakt#spoergsmaal-og-svar"],
      ["Klager", "/kontakt#klager"],
    ],
  },
  { title: "Helle", links: [["Om Helle", "/om-helle"], ["Bliv partner", "/bliv-partner"]] },
  {
    title: "Dokumenter",
    links: [
      ["Betingelser og vilkår", "/betingelser-og-vilkaar"],
      ["Persondatapolitik", "/persondatapolitik"],
      ["Cookies", "/cookies"],
    ],
  },
];

export function Footer() {
  const phone = useText("footer.phone");
  const email = useText("footer.email");
  return (
    <footer className="bg-helle-blomme py-16 text-white md:py-20">
      <div className="mx-auto w-full max-w-[77.5rem] px-5 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1.5fr_1fr_1fr]">
          <div>
            <img src={helleLogoPink} alt="Helle" className="mb-6 h-14 w-auto md:h-16" />
            <p className="max-w-xs text-[15px] leading-[1.375rem] text-white/90"><T k="footer.tagline" /></p>
            <div className="mt-6 flex gap-4 text-[15px]">
              <a href="https://www.instagram.com/helleforsikring" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-helle-pink">Instagram</a>
              <a href="https://www.linkedin.com/company/lea-forsikring" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-helle-pink">LinkedIn</a>
            </div>
          </div>
          {[COLS[0], COLS[1], COLS[2]].map((col, i) => (
            <div key={col.title}>
              <FooterCol col={col} />
              {i === 0 && <div className="mt-8"><FooterCol col={COLS[3]} /></div>}
            </div>
          ))}
        </div>
        <div className="mt-14 border-t border-white/20 pt-8 text-[15px] leading-[1.375rem] text-white/80">
          <p><T k="footer.legal" /></p>
          <p className="mt-1">
            <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-white">{phone}</a>
            {" · "}
            <a href={`mailto:${email}`} className="hover:text-white">{email}</a>
            {" · "}© Helle Forsikringsformidling A/S
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ col }: { col: (typeof COLS)[number] }) {
  return (
    <>
      <h4 className="mb-4 text-[13px] font-medium uppercase tracking-[0.06em] text-helle-pink">{col.title}</h4>
      <ul className="space-y-2.5 text-[15px]">
        {col.links.map(([label, href]) => (
          <li key={href}>
            <a href={`${HELLE}${href}`} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">{label}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
