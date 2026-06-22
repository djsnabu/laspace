# Laspace

Tapahtumasivusto — [laspacefin.com](https://laspacefin.com) / [laspaceevents.fi](https://laspaceevents.fi)

## Arkkitehtuuri

```
Next.js 15 (App Router) → OpenNext → Cloudflare Worker → D1 + R2
```

| Kerros | Teknologia |
|--------|-----------|
| Frontend | Next.js 15 + React 18 + Tailwind CSS 3 |
| Admin | React SPA (app/admin) + Bearer-auth |
| API | Next.js Route Handlers (app/api/) |
| Tietokanta | Cloudflare D1 (`laspace-events`) |
| Tiedostot | Cloudflare R2 (`laspace-images`) |
| Deploy | @opennextjs/cloudflare → Cloudflare Worker |
| Sähköposti | Brevo (ent. Sendinblue) |
| Domainit | laspacefin.com, laspaceevents.fi (Cloudflare) |

## Kehitys

```bash
cd ~/Projects/laspace
npm install
npm run dev          # http://localhost:3000
```

## Build & Deploy

```bash
npm run build        # Next.js build → .next/
npx @opennextjs/cloudflare build   # → .open-next/worker.js
npm run deploy       # build + deploy Cloudflare Worker
```

Deploy vie n. 20-30 sekuntia. Worker päivittyy atomisesti.

## Ympäristömuuttujat / Secrets

Nämä asetetaan Cloudflare Worker secreteinä (`npx wrangler secret put`), EI kovakoodattuina:

| Secret | Kuvaus |
|--------|--------|
| `ADMIN_PASS` | Admin-paneelin salasana (Bearer-auth) |
| `BREVO_API_KEY` | Brevo API-avain uutiskirjeelle ja contact syncille |

`BREVO_LIST_ID` on asetettu `wrangler.toml` → `[vars]` (ei salainen).

## Domainit

Molemmat toimivat samalla workerilla:

- `laspacefin.com` (nykyinen, siirtyy pois)
- `www.laspacefin.com`
- `laspaceevents.fi` (uusi, odottaa DNS-propagaatiota)
- `www.laspaceevents.fi`

DNS: Cloudflare → Domainhotelli (`.fi`). Nimipalvelimet: `david.ns.cloudflare.com`, `magnolia.ns.cloudflare.com`.

## Admin

Pääsy: `https://laspacefin.com/admin`

- Kirjautuminen: Bearer-token `ADMIN_PASS`-secretiä vasten
- Tapahtumien CRUD (D1)
- Kuvien upload (R2)
- Yhteydenottoviestit

## API

| Polku | Metodi | Auth | Kuvaus |
|-------|--------|------|--------|
| `/api/events` | GET | Ei | Julkiset tapahtumat |
| `/api/events` | POST | Bearer | Lisää tapahtuma |
| `/api/events` | PUT | Bearer | Päivitä tapahtuma |
| `/api/events` | DELETE | Bearer | Poista tapahtuma |
| `/api/auth` | POST | Ei | Kirjautuminen |
| `/api/contact` | POST | Ei | Yhteydenotto |
| `/api/contact` | GET | Bearer | Listaa viestit |
| `/api/newsletter` | POST | Ei | Uutiskirjeen tilaus (Brevo) |
| `/api/upload` | POST | Bearer | Kuvan upload (R2) |

## Salasanan vaihto

```bash
cd ~/Projects/laspace
npx wrangler secret put ADMIN_PASS
```

Ei vaadi buildia/deployta — secret päivittyy heti.

## Huomioita

- `.wrangler/`, `.next/`, `.open-next/`, `next-env.d.ts` eivät kuulu repoon
- **Deploy OVERWRITEAA kaikki worker-reitit** — varmista `wrangler.toml`:ssa kaikki domainit. Jos unohdat domainin, se putoaa pois ja sivusto "palautuu ajassa" (vanha Pages-deploy aktivoituu).
- Jos `CLOUDFLARE_API_TOKEN` on asetettu ympäristössä, se ohittaa OAuthin. Vanhentunut token aiheuttaa "Invalid access token" -virheen. Korjaus: `unset CLOUDFLARE_API_TOKEN`
- Admin-paneeli on React SPA ilman frameworkia (app/admin/page.tsx) — ei Next.js-serverikomponentteja adminissa
- Workerissa on web-pohjainen konsoli: `npx wrangler tail` (live-lokit)

## Cloudflare-kirjautuminen

```bash
# OAuth (suositeltu, avaa selaimen)
cd ~/Projects/laspace
unset CLOUDFLARE_API_TOKEN
npx wrangler login

# Tai API-tokenilla
export CLOUDFLARE_API_TOKEN=cfut_...
```

## D1-tietokanta

**Tietokanta:** `laspace-events` (id: `9a86a176-b94e-4c04-9d4b-1ebbb0050b8d`)

```sql
-- events-taulu
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  date TEXT NOT NULL,           -- YYYY-MM-DD
  date_label TEXT,              -- esim. "Pe 25.6."
  venue TEXT NOT NULL,
  description TEXT,
  ticket_url TEXT,
  ticket2_url TEXT,           -- Biletti.fi linkki
  image_url TEXT,
  color TEXT DEFAULT 'purple',  -- 'purple' | 'blue'
  visible INTEGER DEFAULT 1,   -- 0 = piilotettu
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- contacts-taulu (yhteydenotot lomakkeesta)
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Suora SQL-konsoli: `npx wrangler d1 execute laspace-events --command="SELECT * FROM events;"`

## Sähköpostit (Brevo / Sendinblue)

- **API-avain:** Wrangler secret `BREVO_API_KEY`
- **Lista-ID:** 2 (newsletter-tilaajat)
- Contact form lähettää automaattisesti Brevoon
- Newsletter-tilaus → Brevo-lista 2

## Sähköpostit (Cloudflare Email Routing)

- `info@laspaceevents.fi` → `ganzemutabazi@outlook.com`
- Aktivoidaan kun DNS propagoituu (zone status: active)

## Asiakas

- **Yritys:** Laspace / Ganze Mutabazi
- **Sähköposti:** ganzemutabazi@outlook.com
- **Some:** @laspaceevents (IG), Laspaceevents (FB)
- **Lipunmyynti:** kide.app
