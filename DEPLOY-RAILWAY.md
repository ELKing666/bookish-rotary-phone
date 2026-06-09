# Deploy Snug Logic (TanStack Start) to Railway

This project was prepared for easy deployment on Railway.

## What was added / changed

- `Dockerfile` — Reliable multi-stage build (Bun for `bun.lock` accuracy during build + Node runtime)
- `railway.json` — Tells Railway to use the Dockerfile + sets restart/healthcheck policy
- `.dockerignore` — Small, fast, secure Docker context
- `.env.example` — Documented environment variables (Supabase)
- `package.json` — Added `"start"` script for `node .output/server/index.mjs`
- `.gitignore` — Now properly ignores `.env*`

The original project used a Lovable + TanStack Start + Cloudflare (wrangler) setup. The added files make it first-class for Railway's Node/Docker environment.

## 1. Fastest deploy (GitHub + Railway)

1. Put the `snug-logic-patch-main` folder (or its contents) into a GitHub repository and push.
2. Go to https://railway.app/new
3. Choose **Deploy from GitHub repo** and select your repo.
4. Railway detects the `Dockerfile` automatically and starts building.
5. After the first deploy succeeds:
   - Go to your service → **Variables** tab
   - Add the Supabase variables from `.env.example` (use the real values from your Supabase project — the anon key is public but still put it here)
6. In **Settings → Networking**, click **Generate Domain** to get a public URL.
7. (Optional) Add a custom domain.

Future pushes to the branch will auto-deploy.

## 2. Deploy with Railway CLI (from your machine)

```powershell
# one-time
# winget install railway  or see https://docs.railway.app/guides/cli

railway login
cd snug-logic-patch-main
railway init          # create/select a project
railway up            # build + deploy from local (uses Dockerfile)
```

Then set variables in the dashboard (or `railway variables set KEY=val`).

## 3. Required Environment Variables (Railway Variables tab)

From `.env.example`:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Only the `VITE_*` ones are exposed to the browser. The others are server-only.

## 4. Local production test (after you have bun or node)

```bash
# install (bun recommended because of bun.lock)
bun install
# or npm install (will work)

bun run build
bun run start
# or
PORT=3000 npm start
```

Open http://localhost:3000

## 5. Notes / Troubleshooting

- **Port**: The container CMD forces `PORT=${PORT:-3000}`. Railway always injects its own `PORT`. TanStack Start (Vinxi/Nitro) respects `process.env.PORT`.
- **Disk / build size**: The Dockerfile uses a small Alpine runtime. If you see issues, check that large images under `public/` and `src/assets/` are optimized (they are already committed).
- **Supabase**: The migrations in `supabase/migrations/` should already be applied to your Supabase project (`tbldfnchfnhaaqyuxyss` or your own). Use the Supabase CLI or dashboard SQL editor if you need to re-apply.
- **No contact form**: Per the included patch, all CTAs redirect to WhatsApp (+213 770 764 200).
- **Alternative without Docker**: Delete/rename `Dockerfile` and `railway.json`. Railway's Nixpacks will detect the `bun.lock` + `start` script and build a Node service. The Dockerfile route is more predictable because of the original Cloudflare-oriented config.

## Useful Railway links

- https://docs.railway.app/guides/tanstack-start
- https://tanstack.com/start/latest/docs/framework/react/guide/hosting#railway--official-partner

Push, set your Supabase keys, and you should be live!
