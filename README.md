<div align="center">

# 🕐 Tableclock

**A customizable clock built for displays, TV walls, and office screens.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-tableclock.io-000?style=for-the-badge&logo=vercel)](https://tableclock.io)
&nbsp;
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ZIERA-io/Tableclock)

![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white)

</div>

---

Design your clock, share it as a link. No app, no account, no fuss — everything lives in the URL.

Connect Supabase to get short links like `tableclock.io/studio` and server-hosted logo uploads.

---

## Features

### 🕰️ Clock
| | |
|---|---|
| **Modes** | Analog and digital |
| **Analog styles** | Classic · Minimal · Modern · Retro · Sport |
| **Clock size** | 40–130% adjustable |
| **Time options** | Timezone, 24h mode, seconds, date display |

### 🎨 Appearance
| | |
|---|---|
| **Themes** | 12 presets ready to use |
| **Colors** | 6 slots — background, face, ticks, hands, accent, text |
| **Logo** | Text/emoji, image URL, or file upload |
| **Digital fonts** | 9 choices |

### 🔗 Sharing
- All settings encode into a URL hash — works with zero backend
- Short links (`tableclock.io/your-name`) when Supabase is connected
- Uploaded logos stored in Supabase Storage, served by URL

### 🌐 UI & Language
- Korean · English · Japanese · Chinese
- Controls auto-fade after 3 seconds of inactivity

### 📺 Built for TV & Displays
- **Wake Lock API** — screen stays on, no screensaver needed
- **Native Fullscreen API** — one button to fill any display
- Clean idle state — the clock is the only thing on screen

---

## Getting Started

```bash
git clone https://github.com/ZIERA-io/Tableclock.git
cd Tableclock
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and click anywhere on the clock to open settings.

```bash
npm run build   # output → dist/
```

---

## Short Links (Optional)

Without Supabase, sharing works fine via URL hash. Connect Supabase when you want short links and server-stored logos.

**1. Create a project** at [supabase.com](https://supabase.com)

**2. Create `.env`:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**3. Run the SQL schema** in the Supabase SQL Editor (see [`.env.example`](.env.example))

**4. Create a `logos` storage bucket** — Public, INSERT policy `true`

Once connected:
- Type a name in **Link Name** (e.g. `studio`)
- Click **Save** → link becomes `https://tableclock.io/studio`
- Duplicate names are rejected; anonymous links cannot be edited later

---

## Deployment

```bash
npx vercel --prod
```

`vercel.json` handles SPA routing for short links. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your Vercel project environment variables.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vite · React 18 · TypeScript |
| Clock rendering | SVG + `requestAnimationFrame` (60 fps, no React re-renders) |
| Backend (optional) | Supabase (Postgres + Storage) |
| Hosting | Vercel |
| Analytics | Vercel Analytics |

---

## Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Hael-o">
        <img src="https://avatars.githubusercontent.com/Hael-o?v=4" width="80px" alt="Hael-o" style="border-radius:50%"/><br/>
        <sub><b>Hael-o</b></sub>
      </a><br/>
      Frontend
    </td>
    <td align="center">
      <a href="https://github.com/sera03">
        <img src="https://avatars.githubusercontent.com/sera03?v=4" width="80px" alt="sera03" style="border-radius:50%"/><br/>
        <sub><b>sera03</b></sub>
      </a><br/>
      Backend
    </td>
    <td align="center">
      <a href="https://github.com/Dev-minu">
        <img src="https://avatars.githubusercontent.com/Dev-minu?v=4" width="80px" alt="Dev-minu" style="border-radius:50%"/><br/>
        <sub><b>Dev-minu</b></sub>
      </a><br/>
      Design & Direction
    </td>
  </tr>
</table>

---

[한국어](README.ko.md) · [日本語](README.ja.md)
