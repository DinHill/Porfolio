import { profile, socials } from "@/data/portfolio";
import { PxIcon } from "./Pixel";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span className="footer__sign">
          <span data-secret>© {new Date().getFullYear()} {profile.name}</span>
          <span className="footer__thanks"><PxIcon name="heart" /> Thanks for playing</span>
        </span>
        <nav className="footer__links" aria-label="Social">
          {socials.map((social) => (
            <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
              {social.name}
            </a>
          ))}
        </nav>
        <span className="footer__end">
          <a href="/privacy">Privacy</a>
          <a href="#top">Back to top <PxIcon name="arrowUp" /></a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
