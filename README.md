# Swarna Bank — Gold Loan Branch Demo

A Vite + React demo of a branch-assisted gold loan journey that runs three
Leegality workflows (**Valuation Certificate**, **KFS**, **Loan Agreement**)
end-to-end in the sandbox environment, per the language picked at the start
of the flow.

Supported languages: **English, Hindi, Bengali, Odia, Gujarati, Marathi,
Kannada, Malayalam, Telugu, Punjabi, Tamil** — 11 workflows per document type.

## Running locally

```bash
# 1. Install deps
npm install

# 2. Create .env from template and fill with your Leegality sandbox credentials
cp .env.example .env
#   LEEGALITY_AUTH_TOKEN=<from Dashboard → Settings → API>
#   LEEGALITY_PRIVATE_SALT=<from Dashboard → Settings → API>

# 3. Start the dev server
npm run dev
# → http://127.0.0.1:5173
```

## Architecture

### Token security (dev)

The Leegality auth token **never reaches the browser**. `vite.config.js`
registers a dev-server middleware that proxies browser calls on
`/api/leegality/*` to `https://sandbox.leegality.com/api/*` and injects
the `X-Auth-Token` header server-side (read from `.env`, which is
gitignored). The client bundle has no knowledge of the token.

### Per-language workflows

Each Leegality template (Valuation / KFS / Loan Agreement) has its own
`profileId` and field list per language. These are stored in:

- `src/constants/leegalityWorkflows.js` — Valuation (11 workflows)
- `src/constants/leegalityKfsWorkflows.js` — KFS (11 workflows)
- `src/constants/leegalityLaWorkflows.js` — Loan Agreement (11 workflows)

`useLeegalityValuation`, `useLeegalityKFS`, `useLeegalityAgreement` pick
the right one based on the language code in `LangCtx`.

### Signing UX

Each eSign button:

1. Opens a popup synchronously inside the click handler (user gesture,
   bypassing popup blockers) with a "Preparing…" placeholder.
2. Fires `POST /v3.0/sign/request` through the Vite proxy in the
   background.
3. Navigates the popup to the returned `signUrl` (validated via
   `assertLeegalitySignUrl` — only `*.leegality.com` hosts over https are
   accepted).
4. Advances the wizard to the next screen immediately — no blocking
   modal.

### Field population

KFS and Loan Agreement templates receive real customer
Name / Email / Mobile from the form, plus demo loan facts
(₹1,50,000, 12 months, 12.8% APR, 80g gold, etc.) resolved by
pattern-matching on field names (see `src/constants/leegalityFieldValues.js`).
All template fields are marked `required: false`, so unmatched fields
are safely sent empty.

## ⚠️ Deployment caveats

**The Vite proxy is dev-only.** A production `vite build` produces static
files and has no server-side proxy — the `/api/leegality/*` paths will
404 on any static host (Netlify, Cloudflare Pages, GH Pages, etc.).

Before deploying to production you must add a real backend for the
Leegality proxy. Options:

- **Vercel / Netlify Function / Cloudflare Worker**: port the proxy
  logic from `vite.config.js` into a server function at `/api/leegality/*`.
- **Express / Fastify server**: run a small Node service that does the
  same header injection + forwarding.
- **Nginx / reverse proxy**: fine too, as long as the token is injected
  from the server-side env, never the client.

Other deployment notes:

- Set `LEEGALITY_BASE_URL=https://app1.leegality.com` in production
  (currently defaults to sandbox).
- Never ship a `.env` to a public repo. `.gitignore` already blocks this.
- The browser console logs are gated on `import.meta.env.DEV`, so they
  are tree-shaken out of production builds.

## File layout

```
src/
├── App.jsx                       # wizard + chrome routing
├── constants/
│   ├── leegalityWorkflows.js     # per-lang valuation workflows
│   ├── leegalityKfsWorkflows.js  # per-lang KFS workflows
│   ├── leegalityLaWorkflows.js   # per-lang loan-agreement workflows
│   ├── leegalityFieldValues.js   # resolver: field name → demo value
│   └── subScreens.js             # flow config (15 steps)
├── context/                      # LangCtx, FormCtx
├── hooks/useLeegality.js         # 3 eSign hooks + status poller + URL validator
└── subscreens/                   # per-step screens
```

## License

Illustrative demo only. Not for production use.
