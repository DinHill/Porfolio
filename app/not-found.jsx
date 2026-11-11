// Site-wide 404, in the site's own theme. Also what strangers see at the hidden /hq dashboard (see proxy.js).
export const metadata = { title: "404 · Page not found" };

export default function NotFound() {
  return (
    <main className="lost">
      <p className="lost__code">404</p>
      <h1>This level doesn&apos;t exist.</h1>
      <p className="lost__text">The page you&apos;re looking for isn&apos;t here.</p>
      <a className="btn btn--primary" href="/">Back to the portfolio</a>
    </main>
  );
}
