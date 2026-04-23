import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (including those without the VITE_ prefix).
  // Anything without VITE_ stays server-side and is NEVER bundled into the client.
  const env = loadEnv(mode, process.cwd(), '')

  const leegalityBase = env.LEEGALITY_BASE_URL || 'https://sandbox.leegality.com'

  return {
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 5173,
      proxy: {
        // Browser calls /api/leegality/... → proxy forwards to Leegality with the secret token
        // attached server-side. The client never sees X-Auth-Token.
        '/api/leegality': {
          target: leegalityBase,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/leegality/, '/api'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.LEEGALITY_AUTH_TOKEN) {
                proxyReq.setHeader('X-Auth-Token', env.LEEGALITY_AUTH_TOKEN)
              }
            })
          },
        },
      },
    },
  }
})
