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
- Deploy OVERWRITEAA kaikki worker-reitit — varmista `wrangler.toml`:ssa kaikki domainit
- Jos `CLOUDFLARE_API_TOKEN` on asetettu ympäristössä, se ohittaa OAuthin. Vanhentunut token aiheuttaa "Invalid access token" -virheen. Korjaus: `unset CLOUDFLARE_API_TOKEN`
- Admin-paneeli on React SPA ilman frameworkia (app/admin/page.tsx) — ei Next.js-serverikomponentteja adminissa
