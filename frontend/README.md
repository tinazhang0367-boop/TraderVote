# Tradervote Frontend (v2)

Nuxt 3 SSR + ISR + i18n (EN/TH/VI/ID) + Pinia.

## Quick start

```bash
cd tradervote-v2/frontend
npm install
npm run dev          # http://localhost:3000
npm run build        # production
npm run generate     # SSG for static deploy
npm run typecheck
```

## Stack

- **Nuxt 3** (Vue 3 + TypeScript strict)
- **@nuxtjs/i18n** — 4 languages with auto-hreflang
- **@pinia/nuxt** — state
- **UnoCSS / CSS variables** — design tokens in `assets/css/tokens.css`
- **ISR** — broker detail 6h, top 24h, promotions 6h, blog 24h

## Routes

| Route | Page | Render |
|---|---|---|
| `/` | Home | ISR 1h |
| `/brokers` | All brokers + filters | ISR 1h |
| `/brokers/[slug]` | Broker detail | ISR 6h |
| `/top` | Top 10 ranking | ISR 24h |
| `/promotions` | Active promos | ISR 6h |
| `/blog` | Blog index | ISR 1h |
| `/blog/[slug]` | Article | ISR 24h |
| `/api/**` | BFF (Nitro) | runtime |

Locale prefix strategy: `/en/...`, `/th/...`, `/vi/...`, `/id/...`.

## Connecting to legacy backend

The BFF in `server/api/` proxies to the legacy ThinkPHP backend (set `NUXT_BACKEND_BASE_URL`). In dev mode (NODE_ENV != production), mock data is returned so the frontend is fully runnable without the backend.

## Deployment

- Frontend → Cloudflare Pages (recommended) or Node SSR
- Backend → keep existing VPS (GoDaddy)
- AI workers → call `POST /api/revalidate` with shared secret to trigger ISR refresh

## File map

```
frontend/
├── app.vue                  # root
├── nuxt.config.ts           # config (i18n, ISR, modules)
├── package.json
├── tsconfig.json
├── assets/css/              # design tokens + base
├── components/              # BrokerCard, TrustScore, ReviewList, ...
├── composables/             # useFormatDate
├── i18n/locales/            # en/th/vi/id.json
├── layouts/default.vue
├── pages/                   # index, brokers/, top, promotions, blog/
├── server/api/              # BFF endpoints
├── stores/                  # Pinia stores
├── types/                   # shared TS types
└── utils/                   # trust-score helpers
```
