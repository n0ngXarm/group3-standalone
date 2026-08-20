#!/usr/bin/env bash
# ==============================================================================
# Group 3 Standalone - Packaging Script for nongserver1 (100.83.235.78)
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DIST_DIR="${ROOT_DIR}/dist-nongserver1"
TARGET_HOST="100.83.235.78"
TARGET_PORT="8303"
IMAGE_TAG="group3-standalone:$(date +%Y%m%d)"
COMPRESS_CMD="pigz -c"

if ! command -v pigz &>/dev/null; then
  COMPRESS_CMD="gzip -c"
fi

echo "=========================================================="
echo "📦 Preparing deployment package for nongserver1 (${TARGET_HOST})"
echo "=========================================================="

mkdir -p "${DIST_DIR}"

# 1. Build latest docker image
echo "🔨 1. Building Docker image: ${IMAGE_TAG}..."
docker build -t "${IMAGE_TAG}" -t "group3-standalone:latest" \
  --build-arg VITE_GROUP_ID="3" \
  --build-arg VITE_BASE_PATH="/group3" \
  "${ROOT_DIR}/source"

# 2. Export & compress Docker image
IMAGE_TAR_GZ="${DIST_DIR}/group3-standalone-image.tar.gz"
echo "🗜️  2. Exporting and compressing Docker image to ${IMAGE_TAR_GZ}..."
docker save "${IMAGE_TAG}" | ${COMPRESS_CMD} > "${IMAGE_TAR_GZ}"

# 3. Generate tailored compose.yaml for nongserver1
COMPOSE_DEST="${DIST_DIR}/compose.yaml"
echo "📝 3. Generating compose.yaml for nongserver1..."
cat <<EOF > "${COMPOSE_DEST}"
services:
  group3-standalone:
    image: ${IMAGE_TAG}
    container_name: group3-standalone-dev
    ports:
      - "127.0.0.1:${TARGET_PORT}:80"
      - "${TARGET_HOST}:${TARGET_PORT}:80"
    restart: unless-stopped
    stop_grace_period: 10s
    mem_limit: 256m
    cpus: 0.50
    read_only: true
    security_opt:
      - no-new-privileges:true
    tmpfs:
      - /var/cache/nginx
      - /var/run
      - /tmp
EOF

# 4. Generate deployment runner script for nongserver1
DEPLOY_SCRIPT="${DIST_DIR}/deploy.sh"
echo "📝 4. Generating remote deploy.sh..."
cat <<'EOF' > "${DEPLOY_SCRIPT}"
#!/usr/bin/env bash
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
EOF
chmod +x "${DEPLOY_SCRIPT}"

# 5. Checksums
echo "🔒 5. Computing checksums..."
(
  cd "${DIST_DIR}"
  sha256sum group3-standalone-image.tar.gz compose.yaml deploy.sh > SHA256SUMS
)

# 6. Bundle archive
BUNDLE_TAR="${ROOT_DIR}/group3-standalone-nongserver1.tar.gz"
echo "📦 6. Creating single transfer bundle: ${BUNDLE_TAR}..."
tar -czf "${BUNDLE_TAR}" -C "${ROOT_DIR}" dist-nongserver1

echo "=========================================================="
echo "✅ Packaging complete! Ready for transfer."
echo "Bundle location: ${BUNDLE_TAR}"
echo "Size: $(du -h "${BUNDLE_TAR}" | cut -f1)"
echo "=========================================================="
echo "Transfer command example:"
echo "  scp ${BUNDLE_TAR} pisitpong@${TARGET_HOST}:~/"
echo "  ssh pisitpong@${TARGET_HOST} 'tar -xzf group3-standalone-nongserver1.tar.gz && cd dist-nongserver1 && ./deploy.sh'"
echo "=========================================================="
