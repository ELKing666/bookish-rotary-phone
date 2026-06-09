# syntax=docker/dockerfile:1

# ============================================
# Build stage - use Bun to honor bun.lock exactly
# ============================================
FROM oven/bun:1 AS builder

WORKDIR /app

# Install all deps (dev + prod) using the bun lockfile
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Temporarily use a clean TanStack Start config for Railway/Node build.
# This avoids the Lovable wrapper + @cloudflare/vite-plugin which forces
# Cloudflare/Workers output instead of the standard Vite 7 / TanStack Start
# Node output (dist/server/server.js + dist/client/ for SSR).
# The standard output is what the TanStack Start server entry and our
# custom error wrapper (src/server.ts) expect.
RUN cp vite.config.ts vite.config.ts.bak || true
RUN cat > vite.config.ts << 'VITECONFIG'
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    viteReact(),
    tsconfigPaths(),
  ],
})
VITECONFIG

# Production build (TanStack Start / Vite 7 output -> dist/)
RUN bun run build

# Restore original vite.config (for local dev / other deploys)
RUN mv vite.config.ts.bak vite.config.ts || true

# Verify we got the expected Vite 7 Node server entry
RUN if [ ! -f dist/server/server.js ]; then \
      echo "ERROR: Build did not produce dist/server/server.js"; \
      echo "Contents of dist:"; ls -la dist 2>/dev/null || true; \
      exit 1; \
    fi

# ============================================
# Runtime stage
# ============================================
FROM oven/bun:1 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy dependency manifests and install production deps only
COPY --from=builder /app/package.json /app/bun.lock ./
RUN bun install --production --frozen-lockfile

# Copy the complete build output (dist/server/ + dist/client/ with assets + CSS)
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Run the standard TanStack Start server entry.
# HOST=0.0.0.0 ensures the server binds to all interfaces (required by Railway).
# PORT is injected by Railway at runtime.
CMD ["sh", "-c", "HOST=0.0.0.0 PORT=${PORT:-3000} bun dist/server/server.js"]
