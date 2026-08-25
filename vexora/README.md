# Vexora — VPS landing page

Static Next.js (App Router) site for Vexora, a VPS hosting brand. Built with
React + Tailwind CSS v4, exported as static HTML/CSS/JS — no server, no admin
panel, no database.

## Structure
- `app/page.tsx` — assembles all sections
- `app/components/` — Hero (with the canvas node-map signature element), Nav,
  TrustBar, Plans, Specs, Locations, Contact, Footer
- `app/globals.css` — design tokens (colors, fonts) and animation styles

## Before you launch
- Edit the placeholder contact details in `app/components/Contact.tsx`
  (email, phone, office address, support hours are marked `EDIT:`).
- The contact form has no backend yet — wire it to something like Formspree,
  a Vercel serverless function, or your own API before relying on it.
- Trust-bar logos, pricing, specs, and region list in `Plans.tsx`,
  `Specs.tsx`, and `Locations.tsx` are placeholder content — swap in real
  numbers.

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
```

## Build (static export)
```bash
npm run build       # outputs static site to /out
```

## Deploy to Vercel
1. Push this repo to GitHub.
2. In Vercel: **New Project → Import** your GitHub repo.
3. Framework preset: Next.js (Vercel auto-detects `output: "export"` and
   serves the static build — no extra config needed).
4. Deploy. Every push to `main` redeploys automatically.
