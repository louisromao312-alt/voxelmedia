#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Stopping any running Next.js processes on port 3000…"
lsof -ti :3000 | xargs kill -9 2>/dev/null || true

echo "→ Removing corrupted caches…"
rm -rf .next node_modules

echo "→ Fresh install…"
npm install

echo "→ Starting dev server (webpack)…"
npm run dev
