import { profile, socials } from "@/data/portfolio";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <nav className="footer__links" aria-label="Social">
          {socials.map((social) => (
            <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
              {social.name}
            </a>
          ))}
        </nav>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
};

export default Footer;
