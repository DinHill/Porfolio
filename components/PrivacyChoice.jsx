"use client";

import { useEffect, useState } from "react";
import { browserOptedOut, setUserOptOut, userOptedOut } from "@/lib/analytics/client";

// Shows whether this browser's visits are counted, with a switch to opt out (saved in localStorage)
export default function PrivacyChoice() {
  const [state, setState] = useState(null); // "browser" | "off" | "on", read after mount

  useEffect(() => {
    setState(browserOptedOut() ? "browser" : userOptedOut() ? "off" : "on");
  }, []);

  const toggle = () => {
    const off = state === "on";
    if (setUserOptOut(off)) setState(off ? "off" : "on");
  };

  if (state === null) return <div className="privacy-choice" aria-hidden="true" />;

  return (
    <div className="privacy-choice" role="status">
      {state === "browser" ? (
        <p>
          <b>Your visits aren&apos;t counted.</b> Your browser sends a &quot;do not track&quot; signal (Global Privacy
          Control or Do Not Track), so this site doesn&apos;t record anything.
        </p>
      ) : (
        <>
          <p>
            {state === "on" ? (
              <><b>Your visits are counted anonymously</b> on this browser.</>
            ) : (
              <><b>You&apos;ve opted out.</b> Visits from this browser aren&apos;t counted.</>
            )}
          </p>
          <button type="button" className="btn btn--ghost btn--sm" onClick={toggle}>
            {state === "on" ? "Don't count my visits" : "Count my visits again"}
          </button>
        </>
      )}
    </div>
  );
}
