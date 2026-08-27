#!/usr/bin/env bash
set -euo pipefail

TARGET_PORT="8303"
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${DIR}"

echo ">> Checking SHA256 integrity..."
sha256sum -c SHA256SUMS

echo ">> Loading Docker image..."
if [ -f group3-standalone-image.tar.gz ]; then
  if command -v pigz &>/dev/null; then
    pigz -dc group3-standalone-image.tar.gz | docker load
  else
    gzip -dc group3-standalone-image.tar.gz | docker load
  fi
fi

echo ">> Starting container..."
docker compose down || true
docker compose up -d

echo ">> Waiting for container healthcheck..."
sleep 3
docker compose ps

echo ">> Verifying HTTP endpoint..."
if curl -fsS "http://127.0.0.1:${TARGET_PORT}/group3/" > /dev/null; then
  echo "✅ Local check OK (http://127.0.0.1:${TARGET_PORT}/group3/)"
else
  echo "❌ Local check failed"
fi

if curl -fsS "http://${TARGET_HOST}:${TARGET_PORT}/group3/" > /dev/null; then
  echo "✅ Tailscale check OK (http://${TARGET_HOST}:${TARGET_PORT}/group3/)"
else
  echo "⚠️  Tailscale interface check failed (check firewall/listening IP)"
fi

echo "🎉 Deployment complete!"
