"use client";

import { useState } from "react";
import emailjs from "emailjs-com";
import { profile, socials } from "@/data/portfolio";
import { trackAction } from "@/lib/analytics/client";
import { PxIcon } from "./Pixel";

const Contact = () => {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();
    const form = e.target;
    setStatus("sending");
    emailjs
      .sendForm("service_5dyrdyy", "template_8a6nppf", form, "Mi4jfuwgYIkDyOCNX")
      .then(
        () => {
          setStatus("sent");
          trackAction("message");
          form.reset();
        },
        (error) => {
          console.log(error.text);
          setStatus("error");
        }
      );
  };

  return (
    <section className="section contact" id="contact" aria-label="Contact">
      <div className="wrap">
        <div className="contact__card reveal">
          <div className="contact__glow" aria-hidden="true" />
          <div className="contact__grid">
            <div className="contact__intro">
              <span className="eyebrow"><i /><b>05</b> Let&apos;s talk</span>
              <h2 className="contact__title">
                Ready for<br />
                <span className="hl">player two?</span>
              </h2>
              <p className="contact__sub">
                I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of
                your vision.
              </p>
              <ul className="contact__list">
                <li>
                  <small>Email</small>
                  <span className="contact__email">
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                    <button type="button" className="contact__copy" onClick={copyEmail} data-track="email">
                      {copied ? "Copied ✓" : "Copy"}
                    </button>
                  </span>
                </li>
                <li><small>Phone</small><a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a></li>
                <li><small>Location</small><b>{profile.location}</b></li>
              </ul>
              <nav className="contact__socials" aria-label="Social profiles">
                {socials.map((social) => (
                  <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
                    {social.name} <PxIcon name="arrowUpRight" />
                  </a>
                ))}
              </nav>
            </div>

            <form className="form" onSubmit={sendEmail}>
              <div className="form__row">
                <label>
                  <span>First name *</span>
                  <input name="firstname" placeholder="First name" required />
                </label>
                <label>
                  <span>Last name *</span>
                  <input name="lastname" placeholder="Last name" required />
                </label>
              </div>
              <label>
                <span>Email *</span>
                <input type="email" name="email" placeholder="you@email.com" required />
              </label>
              <label>
                <span>Message *</span>
                <textarea name="message" placeholder="Write your message..." rows={5} required />
              </label>
              <button className="btn btn--primary btn--lg" disabled={status === "sending"}>
                <span>{status === "sending" ? "Sending..." : "Send message"}</span>
                <PxIcon name="arrowRight" />
              </button>
              <p className={`form__status form__status--${status}`} role="status">
                {status === "sent" && "Message sent — thanks! I'll get back to you soon."}
                {status === "error" && "Couldn't send the message. Please try again or email me directly."}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
