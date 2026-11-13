# Portfolio

Personal portfolio site for Syed M. Mursalin, built with Next.js, TypeScript, GSAP and a custom WebGL shader.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

## Where things live

- `app/page.tsx` — all page content and copy
- `app/globals.css` — styling
- `components/Liquid.tsx` — the liquid chrome form (raymarched fragment shader)
- `components/Experience.tsx` — smooth scrolling and scroll animations
- `components/Demo.tsx` — the "ask your tools" demo (sample data)
- `components/Flow.tsx` — the scroll-drawn workflow diagram
- `lib/contact.ts` — contact settings (email, LinkedIn, Facebook, WhatsApp)
- `lib/site.ts` — the public address and base path
- `lib/icons.ts` — tool logos for the marquee

## Deploying

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. The workflow sets the two variables below from the Pages settings, so a custom domain needs no code change.

## Building for a sub-path

The build is a static export. When the site is served from a sub-path, such as `username.github.io/Portfolio`, set both variables for the build:

```bash
NEXT_PUBLIC_BASE_PATH=/Portfolio NEXT_PUBLIC_SITE_URL=https://username.github.io/Portfolio npm run build
```

At a domain root, leave `NEXT_PUBLIC_BASE_PATH` unset and set only `NEXT_PUBLIC_SITE_URL`.

## WhatsApp

Set `whatsapp` in `lib/contact.ts` to your number in international format, digits only. Until then the contact buttons read "Message me" and open LinkedIn.
