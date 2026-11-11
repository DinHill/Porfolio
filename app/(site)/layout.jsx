import Nav from "@/components/Nav";
import Effects from "@/components/Effects";
import Tracker from "@/components/Tracker";
import SecretDoor from "@/components/SecretDoor";

// Chrome for the public portfolio. The private dashboard (app/hq) sits outside this group.
export default function SiteLayout({ children }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Effects />
      <Nav />
      <main id="main">{children}</main>
      <Tracker />
      <SecretDoor />
    </>
  );
}
