// Privacy notice, linked from the footer. Sits outside the (site) group, so it has no tracker:
// reading the privacy page is never counted. Keep it in sync with lib/analytics/*.
import ThemeToggle from "@/components/ThemeToggle";
import PrivacyChoice from "@/components/PrivacyChoice";
import { profile } from "@/data/portfolio";

const UPDATED = "11 November 2026";

export const metadata = {
  title: `Privacy · ${profile.name}`,
  description: "What this portfolio records about visits, and how to opt out.",
};

export default function Privacy() {
  return (
    <div className="legal">
      <header className="wrap legal__top">
        <a href="/" className="legal__back">← Back to the portfolio</a>
        <ThemeToggle />
      </header>

      <main className="wrap legal__body">
        <span className="eyebrow"><i /><b>Privacy</b> Last updated {UPDATED}</span>
        <h1>Privacy</h1>
        <p className="legal__lead">
          This site counts visits anonymously so I can see which projects people find interesting. There are no
          cookies, no ads and no third-party trackers, and I can&apos;t tell who you are.
        </p>

        <PrivacyChoice />

        <h2>What&apos;s recorded when you visit</h2>
        <ul>
          <li>When you visited, and whether you&apos;ve been here before.</li>
          <li>
            The site that linked you here (for example linkedin.com), or the tag on a link I shared (for example
            <code>?ref=cv</code>).
          </li>
          <li>
            Your approximate location: country and city, estimated from your network by the host. The city is often the
            internet provider&apos;s nearest hub rather than where you are. Your IP address itself is not stored.
          </li>
          <li>Device type, browser and operating system, for example &quot;Desktop · Chrome · Windows&quot;.</li>
          <li>
            Which sections you scrolled to, which projects you opened, and which links or buttons you used to get in touch
            (email, CV, LinkedIn, GitHub, game and video links).
          </li>
        </ul>

        <h2>What isn&apos;t</h2>
        <ul>
          <li>Your IP address, name or email address, unless you send me a message.</li>
          <li>Anything you type, your mouse movements, or what you do on other sites.</li>
          <li>Cookies or cross-site tracking. Nothing is sold, or shared for advertising.</li>
        </ul>

        <h2>How it works</h2>
        <p>
          A random ID kept in your browser tab (<code>sessionStorage</code>, removed when you close the tab) is sent with
          each event so the actions of one visit stay together. It isn&apos;t linked to you and is new every visit. A
          &quot;visited before&quot; flag and your light/dark theme choice stay in your browser&apos;s{" "}
          <code>localStorage</code>; only the yes/no of &quot;visited before&quot; is sent.
        </p>
        <p>
          Visit records are stored in a database (Upstash Redis) through Vercel, only I can view them, and they are
          deleted automatically after about 13 months.
        </p>

        <h2>Contact form</h2>
        <p>
          If you send a message, your name, email address and message go through{" "}
          <a href="https://www.emailjs.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">EmailJS</a>{" "}
          to my inbox. I only use them to reply to you.
        </p>

        <h2>Other services</h2>
        <ul>
          <li>
            The site is hosted on{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel</a>.
            Like any host, it handles your IP address to deliver pages and may keep short-lived server logs.
          </li>
          <li>Fonts are served from this site, so your browser makes no requests to Google for them.</li>
          <li>
            Project videos, when shown, are embedded from YouTube&apos;s privacy-enhanced mode (youtube-nocookie.com).
            Links to LinkedIn, GitHub or Roblox open those sites under their own privacy policies.
          </li>
        </ul>

        <h2>Your choices</h2>
        <ul>
          <li>
            If your browser sends Global Privacy Control or Do Not Track, nothing is recorded at all.
          </li>
          <li>You can turn counting off for this browser with the button above.</li>
          <li>Clearing this site&apos;s data in your browser removes everything it saved locally.</li>
          <li>
            Questions, or want a message you sent deleted? Email me at{" "}
            <a href={`mailto:${profile.email}`}>{profile.email}</a>. Visits aren&apos;t linked to names, so I usually
            can&apos;t tell which visit was yours.
          </li>
        </ul>
      </main>
    </div>
  );
}
