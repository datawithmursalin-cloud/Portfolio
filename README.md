# Portfolio

Personal portfolio site for Syed Mursalin, built with Next.js, TypeScript, GSAP and a custom WebGL shader.

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
- `lib/contact.ts` — contact settings

## WhatsApp

Set `whatsapp` in `lib/contact.ts` to your number in international format, digits only. Until then the contact buttons read "Message me" and open LinkedIn.
