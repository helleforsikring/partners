import helleLogoPink from "@/assets/helle-lockup-pink.svg";
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
  { title: "Helle", links: [["Om Helle", "/om-helle"]] },
  {
    title: "Dokumenter",
    links: [
      ["Betingelser og vilkår", "/betingelser-og-vilkaar"],
      ["Persondatapolitik", "/persondatapolitik"],
      ["Cookies", "/cookies"],
      ["Cookie-indstillinger", "/cookies#indstillinger"],
    ],
  },
];

export function Footer() {
  const phone = useText("footer.phone");
  const email = useText("footer.email");
  return (
    <footer className="bg-helle-blomme py-16 text-white md:py-20">
      <div className="mx-auto w-full max-w-[77.5rem] px-5 md:px-10 xl:px-0">
        <div className="grid gap-12 lg:grid-cols-[340px_1fr] lg:gap-0">
          <div className="lg:pr-10">
            <img src={helleLogoPink} alt="Helle forsikring" className="h-[95px] w-auto" />
            <p className="mt-6 max-w-[300px] text-[15px] leading-[1.375rem] text-white/85"><T k="footer.tagline" /></p>
            <div className="mt-6 flex gap-4 text-[15px]">
              <a href="https://www.instagram.com/helleforsikring" target="_blank" rel="noopener noreferrer" className="text-helle-pink underline underline-offset-4 hover:no-underline">Instagram</a>
              <a href="https://www.linkedin.com/company/lea-forsikring" target="_blank" rel="noopener noreferrer" className="text-helle-pink underline underline-offset-4 hover:no-underline">LinkedIn</a>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-14 gap-y-10">
            {COLS.map((col) => <div key={col.title}><FooterCol col={col} /></div>)}
          </div>
        </div>
        <div className="mt-16 border-t border-white pt-16 text-[15px] leading-[1.375rem] text-white/75">
          <p><T k="footer.legal" /></p>
          <p>
            <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-white">{phone.replace(/^\+45\s*/, "")}</a>
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
      <ul className="space-y-3 text-[15px] leading-[1.375rem]">
        {col.links.map(([label, href]) => (
          <li key={href}>
            <a href={`${HELLE}${href}`} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">{label}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
