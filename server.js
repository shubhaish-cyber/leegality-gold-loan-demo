/**
 * Production server.
 *
 * Dual purpose:
 *   1. Serves the built static SPA from ./dist
 *   2. Proxies /api/leegality/* → Leegality API with X-Auth-Token injected
 *      server-side (never reaches the browser bundle).
 *
 * Env (configure via Replit Secrets for production deploys):
 *   LEEGALITY_AUTH_TOKEN   (required)
 *   LEEGALITY_PRIVATE_SALT (optional, only needed if you add webhooks)
 *   LEEGALITY_BASE_URL     (default: https://sandbox.leegality.com)
 *   PORT                   (Replit sets this automatically)
 */
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // Replit / Cloud Run / most PaaS need 0.0.0.0

const LEEGALITY_AUTH_TOKEN = process.env.LEEGALITY_AUTH_TOKEN;
const LEEGALITY_BASE_URL =
  process.env.LEEGALITY_BASE_URL || "https://sandbox.leegality.com";

if (!LEEGALITY_AUTH_TOKEN) {
  console.warn(
    "[server] ⚠️ LEEGALITY_AUTH_TOKEN is not set. /api/leegality/* calls will fail auth." +
      " Set it in your Replit Secrets (or .env locally) and restart."
  );
}

const app = express();
app.disable("x-powered-by");

// --- Leegality proxy ---
// Browser hits /api/leegality/v3.0/sign/request → this middleware rewrites to
// /api/v3.0/sign/request and forwards to https://<base>/api/... with the
// secret token attached in a header the client never sees.
app.use(
  "/api/leegality",
  createProxyMiddleware({
    target: LEEGALITY_BASE_URL,
    changeOrigin: true,
    secure: true,
    // Express strips the "/api/leegality" mount prefix before this middleware
    // sees the URL, so req.url is already "/v3.0/sign/request" etc. We just
    // need to prepend "/api/" so the upstream call hits Leegality's API.
    pathRewrite: { "^/": "/api/" },
    on: {
      proxyReq: (proxyReq) => {
        if (LEEGALITY_AUTH_TOKEN) {
          proxyReq.setHeader("X-Auth-Token", LEEGALITY_AUTH_TOKEN);
        }
      },
      error: (err, _req, res) => {
        console.error("[server] proxy error:", err.message);
        if (res && !res.headersSent) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              status: 0,
              messages: [
                { code: "proxy.error", message: "Upstream proxy failed" },
              ],
            })
          );
        }
      },
    },
  })
);

// --- Health check ---
app.get("/healthz", (_req, res) => {
  res.json({
    ok: true,
    leegalityConfigured: Boolean(LEEGALITY_AUTH_TOKEN),
    leegalityBase: LEEGALITY_BASE_URL,
  });
});

// --- Static SPA ---
const distDir = path.join(__dirname, "dist");
app.use(
  express.static(distDir, {
    // HTML should revalidate every load; hashed assets can cache forever.
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      } else if (/\.(js|css|svg|png|jpg|jpeg|webp|woff2?)$/.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  })
);

// SPA fallback — any unmatched GET that isn't the API returns index.html so
// client-side routing can take over.
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`[server] Listening on http://${HOST}:${PORT}`);
  console.log(`[server] Proxying /api/leegality → ${LEEGALITY_BASE_URL}/api`);
});
