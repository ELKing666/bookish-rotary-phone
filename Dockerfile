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
# Cloudflare/Workers output (dist/ + custom server) instead of the standard
# Node/Vinxi output (.output/server/index.mjs + proper CSS/assets for SSR).
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

# Production build (standard TanStack Start / Vinxi node output -> .output/)
RUN bun run build

# Restore original vite.config (for local dev / other deploys)
RUN mv vite.config.ts.bak vite.config.ts || true

# Verify we got the expected Node server entry (not a CF dist build)
RUN if [ ! -f .output/server/index.mjs ]; then \
      echo "ERROR: Build did not produce .output/server/index.mjs"; \
      echo "Contents of .output:"; ls -la .output 2>/dev/null || true; \
      exit 1; \
    fi

# ============================================
# Runtime stage
# ============================================
FROM oven/bun:1 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy the complete build output (includes server bundle + client assets + CSS)
COPY --from=builder /app/.output ./.output

EXPOSE 3000

# Run the standard TanStack Start server entry.
# The sh wrapper makes sure PORT is visible to the process (some frameworks
# read it early). This also helps with correct 0.0.0.0 binding on Railway.
CMD ["sh", "-c", "PORT=${PORT:-3000} bun .output/server/index.mjs"]
