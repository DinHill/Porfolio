"use client";

import { useEffect, useRef, useState } from "react";

// The hidden way into the analytics dashboard (/hq):
//   - keyboard: the Konami code  ↑ ↑ ↓ ↓ ← → ← → B A
//   - touch:    tap the "©" line in the footer 5 times within 3 seconds
// Already signed in -> straight to /hq. Otherwise a passphrase prompt opens.
const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
const TAPS = 5;

const MESSAGES = {
  401: "Wrong passphrase.",
  429: "Too many tries. Wait 15 minutes.",
  404: "Not set up yet: add ANALYTICS_PASSWORD (12+ characters) to the environment.",
};

const SecretDoor = () => {
  const dialogRef = useRef(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const open = async () => {
      const res = await fetch("/api/hq", { cache: "no-store" }).catch(() => null);
      if (res?.status === 204) {
        window.location.href = "/hq";
        return;
      }
      setError("");
      if (!dialogRef.current.open) dialogRef.current.showModal();
    };

    let progress = 0;
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea, [contenteditable]")) return;
      const key = e.key.toLowerCase();
      progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        open();
      }
    };

    let taps = [];
    const onTap = (e) => {
      if (!e.target.closest?.("[data-secret]")) return;
      const now = Date.now();
      taps = [...taps.filter((t) => now - t < 3000), now];
      if (taps.length >= TAPS) {
        taps = [];
        open();
      }
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onTap);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onTap);
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const passphrase = new FormData(e.currentTarget).get("passphrase");
    const res = await fetch("/api/hq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passphrase }),
    }).catch(() => null);
    if (res?.status === 204) {
      window.location.href = "/hq";
      return;
    }
    setBusy(false);
    setError(MESSAGES[res?.status] ?? "Couldn't reach the server.");
  };

  return (
    <dialog ref={dialogRef} className="door" aria-labelledby="door-title" onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}>
      <form className="door__form" onSubmit={submit}>
        <p className="door__eyebrow">&gt; cheat console</p>
        <h2 id="door-title">Player 1, enter passphrase</h2>
        <input
          name="passphrase"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          aria-label="Passphrase"
          required
          autoFocus
        />
        <p className="door__error" role="status">{error}</p>
        <div className="door__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => dialogRef.current.close()}>Cancel</button>
          <button className="btn btn--primary btn--sm" disabled={busy}>{busy ? "Checking…" : "Enter"}</button>
        </div>
      </form>
    </dialog>
  );
};

export default SecretDoor;
