# LA Space

Website for LA Space event venue — [laspacefin.com](https://laspacefin.com).

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Cloudflare Workers (D1 + R2)

## Features

- Event management
- Image gallery
- Admin dashboard

## Environment Variables

The admin password must be set as a Wrangler secret (not in `wrangler.toml`):

```bash
wrangler secret put ADMIN_PASS
```
