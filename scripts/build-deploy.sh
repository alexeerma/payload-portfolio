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

# Copy packages that Next.js standalone sometimes misses
for pkg in @swc/helpers; do
  if [ -d "node_modules/$pkg" ]; then
    mkdir -p "$DEPLOY_DIR/node_modules/$pkg"
    cp -r "node_modules/$pkg/." "$DEPLOY_DIR/node_modules/$pkg/"
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
