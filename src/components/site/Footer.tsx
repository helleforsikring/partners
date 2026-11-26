import leaLogoWhite from "@/assets/lea-logo-white.png";
import { T, useText, usePage } from "@/lib/page-context";

export function Footer() {
  const phone = useText("footer.phone");
  const email = useText("footer.email");
  const { page } = usePage();
  return (
    <footer className="mt-24 px-4 pb-4">
      <div className="mx-auto w-full max-w-[1400px] rounded-3xl px-6 py-16 text-white"
        style={{ backgroundColor: page.accent_color }}>
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <img src={leaLogoWhite} alt="Lea" className="mb-5 h-10 w-auto" />
            <p className="max-w-sm text-sm leading-relaxed text-white/80"><T k="footer.tagline" /></p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold"><T k="footer.shortcuts" /></h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="https://leaforsikring.dk/persondatapolitik" className="hover:text-white"><T k="footer.persondata" /></a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold"><T k="footer.follow" /></h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="https://www.instagram.com/leaforsikring" className="hover:text-white">Instagram</a></li>
              <li><a href="https://www.linkedin.com/company/leaforsikring" className="hover:text-white">LinkedIn</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold"><T k="footer.contact" /></h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><T k="footer.address1" /></li>
              <li><T k="footer.address2" /></li>
              <li><a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-white">{phone}</a></li>
              <li><a href={`mailto:${email}`} className="hover:text-white">{email}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/15 pt-6 text-xs text-white/70">
          <T k="footer.legal" /> {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}