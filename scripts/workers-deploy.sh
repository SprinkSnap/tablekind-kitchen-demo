#!/usr/bin/env bash
# Cloudflare Workers Builds entrypoint for Harbour & Pine Home.
# Dashboard Deploy command must be: npm run deploy
# (or: bash scripts/workers-deploy.sh)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f wrangler.jsonc ]]; then
  echo "error: wrangler.jsonc not found in $ROOT" >&2
  echo "Check Workers Builds → Root directory is the repository root." >&2
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "→ Installing dependencies (npm ci)"
  npm ci
fi

echo "→ Building Astro (writes dist/client + Worker entry)"
npm run build

if [[ ! -d dist/client ]]; then
  echo "error: dist/client missing after build" >&2
  exit 1
fi

ENV_FLAG="${1:---env=}"
echo "→ Deploying with wrangler ${ENV_FLAG}"
# Prefer local project wrangler so package.json version is used.
npx --no-install wrangler deploy "$ENV_FLAG"

echo "→ Applying D1 migrations"
npm run db:remote

echo "✓ Deploy complete"
