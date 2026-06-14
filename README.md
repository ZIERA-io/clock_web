# Tempus

A configurable clock that runs in the browser. Set up the look you want — colors, fonts, face style, logo — and share it as a URL. The link encodes the entire config, so whoever opens it sees exactly what you put together. No accounts, no servers required.

## Features

- Analog and digital modes
- Five analog face styles: classic, minimal, modern, retro, sport
- Six individually adjustable color slots (background, face, ticks, hands, accent, text)
- Logo support: text/emoji, image URL, or file upload
- Share any setup as a self-contained URL — no account needed
- Custom short links like `/a/your-name` when Supabase is connected
- Full-screen mode, timezone picker, 24h toggle, date and seconds display, font selection

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Building

```bash
npm run build
```

Static output lands in `dist/`.

## Custom links (optional)

Sharing works via URL hash by default — self-contained but gets long when images are uploaded. To enable short paths like `/a/studio`, point the app at a Supabase project:

```env
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The required SQL schema is in `.env.example`.

## Deployment

`vercel.json` covers SPA routing for `/a/*` paths. From the project root:

```bash
npx vercel --prod
```

## Stack

Vite · React 18 · TypeScript · Supabase (optional)

---

[한국어](README.ko.md) · [日本語](README.ja.md)
