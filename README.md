# Portfolio

All content lives in `data/portfolio.js`. Colours are theme tokens in `app/globals.css`
(dark by default, light under `:root[data-theme="light"]`); the nav's sun/moon button switches them.

## Private visitor analytics

A first-party tracker records a funnel (Landed → Scrolled to Work → Opened a project → Reached Contact →
Reached out) plus sources, projects opened, actions, countries and devices. No cookies for visitors and
no IPs stored; visitors sending Global Privacy Control / Do Not Track aren't tracked; your own visits
aren't counted once you're signed in.

The dashboard is at `/hq`, but anyone without the owner cookie gets the normal 404 page (`proxy.js`).
To open it on the site:

- **Keyboard:** type the Konami code `↑ ↑ ↓ ↓ ← → ← → B A` anywhere on the page.
- **Phone:** tap the `© … Dinh Hieu Nguyen` line in the footer 5 times quickly.

Then enter your passphrase. You stay signed in for 90 days on that browser.

### Setup (Vercel)

1. Vercel project → **Storage** → add **Upstash for Redis** (free tier) and connect it. That sets
   `KV_REST_API_URL` and `KV_REST_API_TOKEN` (`UPSTASH_REDIS_REST_URL` / `_TOKEN` also work).
2. Add `ANALYTICS_PASSWORD`: a passphrase of 12+ characters. Without it the dashboard stays switched off.
   Changing it signs out every browser.
3. Redeploy.

Locally (`npm run dev`) with no Redis variables, events are saved to `.analytics.json` (git-ignored);
put `ANALYTICS_PASSWORD=...` in `.env.local` to sign in.

Tip: share tagged links such as `https://your-site/?ref=cv` or `?ref=linkedin`; they show up under
"Your tagged links".

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
