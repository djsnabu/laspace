# LASPACE TODO — 2026-05-29 aamu

## Tausta
- Projekti: ~/Projects/laspace (Next.js 15 + Cloudflare Workers)
- Cloudflare API toimi eilen 503 — nyt ylhäällä ✅
- Edellinen `cfut_Q6c...`-token on **vanhentunut** ❌

## Tila 29.5.

### ✅ Valmista
- Sivusto on koodattu ja deployattu kerran onnistuneesti (22.5.)
- wrangler.toml:ssa on laspacefin.com-reitit — deploy julkaistu version `b0d46b63`
- Koodista on poistettu laspacefin.com-viittaukset
- `BREVO_API_KEY`-secret on asetettu

### ❌ Tekemättä (vaatii manuaalisia toimia)

#### 1. Cloudflare API-token — UUSI TARPEELLINEN ⚠️
Edellinen token on vanhentunut. 1Password "Cloudflare API" -itemissä on vain vanhentuneita Pages-tokeneita. Tarvitaan uusi API-token:
- **Mene**: https://dash.cloudflare.com/profile/api-tokens
- **Luo uusi token** (tai päivitä vanha) näillä permisioilla:
  - Account: Workers Scripts → Edit
  - Zone (laspacefin.com): Workers Routes → Edit
  - Zone (laspaceevents.com): Workers Routes → Edit
  - Zone (laspaceevents.com): Email Routing → Read/Edit
- **Tallenna token** 1Passwordiin (Cloudflare API -itemiin uutena kenttänä `api_token_workers`)
- Aja sitten: `export CLOUDFLARE_API_TOKEN="<uusi_token>" && cd ~/Projects/laspace && npm run deploy`

#### 2. ADMIN_PASS secret
`echo "laspace2026" | npx wrangler secret put ADMIN_PASS` (vaatii tokenin)

#### 3. Domain migraatio laspacefin.com → laspaceevents.com
- Lisää laspaceevents.com Cloudflareen
- Päivitä DNS (CNAME workerille)
- Päivitä wrangler.toml-reitit
- Lisää `zone_name = "laspaceevents.com"` r2/d1-määrityksiin

#### 4. Email Routing
- info@laspaceevents.com → forward nabil.samari@gmail.com

#### 5. Deploy
`npm run deploy` (uuden tokenin kanssa)

#### 6. Poista vanha laspacefin.com (valinnainen)
