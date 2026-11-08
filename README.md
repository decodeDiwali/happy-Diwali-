# Diwali Magic — Guided React 3D Website

A premium, mobile-first Diwali greeting experience built with React, Vite and Three.js.

## Guided visitor journey
1. The visitor is instructed to tap the diya (or the clear action button) to light it.
2. A second instruction invites them to trigger the fireworks.
3. The final personalized-free greeting appears, with WhatsApp sharing and copy-link actions.

## Features
- Animated 3D golden diya, flame flicker and floating light particles
- Canvas fireworks after the second step
- No sender or recipient name fields
- Guided instructions at every step
- WhatsApp share message and copyable website link
- Original synthesized ambient tones using Web Audio; user starts audio manually
- Responsive mobile layout and reduced-motion CSS support

## Run locally
Requires Node.js 18+.

```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

Deploy the `dist` folder to Netlify, Vercel, or another static host. WhatsApp sharing works best once the site is deployed to a public HTTPS URL.

## Notes
- Sound starts only after the visitor taps the sound button, due to browser autoplay rules.
- Three.js needs WebGL; the greeting interface remains usable without it.
