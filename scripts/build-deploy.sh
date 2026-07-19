#!/usr/bin/env bash
set -e

DEPLOY_DIR=".deploy"
STANDALONE=".next/standalone"

echo "→ Building..."
pnpm build

echo "→ Assembling deployment package..."
rm -rf "$DEPLOY_DIR"
cp -r "$STANDALONE" "$DEPLOY_DIR"

# Static assets and public files must be copied in manually with standalone
cp -r .next/static "$DEPLOY_DIR/.next/static"
cp -r public "$DEPLOY_DIR/public"

# PM2 config goes in the root of the deployed folder
cp pm2.config.js "$DEPLOY_DIR/pm2.config.js"

# Include migrations so Payload can run them on first start
if [ -d "migrations" ]; then
  cp -r migrations "$DEPLOY_DIR/migrations"
fi

# Copy packages that Next.js standalone sometimes misses
# (libsql ships native bindings the file tracer cannot follow; the platform
# package for the Linux server is @libsql/linux-x64-gnu)
for pkg in @swc/helpers libsql @libsql/client @libsql/core @libsql/hrana-client @libsql/isomorphic-fetch @libsql/isomorphic-ws @libsql/linux-x64-gnu @neon-rs/load detect-libc; do
  if [ -d "node_modules/$pkg" ] || [ -d "node_modules/.pnpm/node_modules/$pkg" ]; then
    src="node_modules/$pkg"
    [ -d "$src" ] || src="node_modules/.pnpm/node_modules/$pkg"
    mkdir -p "$DEPLOY_DIR/node_modules/$pkg"
    cp -rL "$src/." "$DEPLOY_DIR/node_modules/$pkg/"
  fi
done

echo "→ Creating archive..."
tar -czf deploy.tar.gz -C "$DEPLOY_DIR" .

echo ""
echo "✓ Done. Upload deploy.tar.gz to your Zone.ee server."
echo ""
echo "On the server, run:"
echo "  mkdir -p ~/app ~/data/media"
echo "  tar -xzf deploy.tar.gz -C ~/app"
echo "  # Edit ~/app/.env with your production values"
echo "  # Then configure PM2 in My Zone control panel:"
echo "  #   Script path: /home/USERNAME/app/server.js"
echo "  #   Max memory:  512 MB"
