import Image from "next/image";
import { HiOutlineCake, HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone, HiOutlineTranslate } from "react-icons/hi";
import { MdFileDownload } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { profile, socials } from "@/data/portfolio";
import Blob from "./Blob";

const About = () => {
  const linkedin = socials.find((social) => social.name === "LinkedIn");
  const info = [
    { icon: <HiOutlineMail />, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: <HiOutlinePhone />, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    { icon: <HiOutlineLocationMarker />, label: "Location", value: profile.location },
    { icon: <HiOutlineCake />, label: "Birthday", value: profile.birthday },
    ...(profile.certificates ?? []).map((cert) => ({ icon: <HiOutlineTranslate />, label: cert.name, value: cert.value })),
  ];

  return (
    <section className="section section--alt" id="about" aria-label="About me">
      <div className="wrap about">
        <div className="about__visual reveal">
          <div className="avatar">
            <Blob className="avatar__blob" />
            <Image className="avatar__img" src={profile.avatar} alt={profile.name} width={440} height={658} sizes="360px" />
          </div>
        </div>

        <div className="about__copy">
          <span className="eyebrow reveal"><i /><b>04</b> Meet the maker</span>
          <h2 className="sec-title reveal" style={{ "--d": ".05s" }}>
            From IT student<br />
            <span className="muted">to game programmer.</span>
          </h2>
          <p className="reveal" style={{ "--d": ".1s" }}>
            Hi, I&apos;m Hieu. I studied Information Technology at the University of Greenwich, driven by a big
            curiosity for how software works. I started out building web, desktop and console apps, and found what
            I love most in games.
          </p>
          <p className="reveal" style={{ "--d": ".14s" }}>
            After a freelance Unreal Engine 5 internship in 2024, I became a game programmer intern on Roblox in
            11/2025 and moved into a full Game Programmer role in 04/2026, building gameplay, UI and live updates
            for Roblox games. I enjoy solving problems, learning new tools, and turning small ideas into things
            people actually play.
          </p>

          {profile.focus?.length > 0 && (
            <ul className="about__focus reveal" style={{ "--d": ".16s" }} aria-label="Focus areas">
              {profile.focus.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}

          <ul className="about__info reveal" style={{ "--d": ".18s" }}>
            {info.map((item) => (
              <li key={item.label}>
                <span className="about__icon" aria-hidden="true">{item.icon}</span>
                <div>
                  <small>{item.label}</small>
                  {item.href ? <a href={item.href}>{item.value}</a> : <b>{item.value}</b>}
                </div>
              </li>
            ))}
          </ul>

          <div className="about__cta reveal" style={{ "--d": ".22s" }}>
            <a className="btn btn--primary" href="#contact">Get in touch</a>
            <a className="btn btn--ghost" href={profile.cv} download={profile.cvFileName}>
              <MdFileDownload aria-hidden="true" />
              <span>Download CV</span>
            </a>
            {linkedin && (
              <a className="btn btn--ghost" href={linkedin.href} target="_blank" rel="noopener noreferrer">
                <FaLinkedin aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
