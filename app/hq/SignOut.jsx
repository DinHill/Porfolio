"use client";

const SignOut = () => {
  const signOut = async () => {
    await fetch("/api/hq", { method: "DELETE" }).catch(() => {});
    window.location.href = "/";
  };
  return (
    <button type="button" className="btn btn--ghost btn--sm" onClick={signOut}>
      Sign out
    </button>
  );
};

export default SignOut;
