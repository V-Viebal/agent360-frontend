#!/usr/bin/env bash
set -euo pipefail

APP_ID="agent360"
VERSION="1.0.0"
WORK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="${WORK_DIR}/dist"
FRONTEND_DIST="${WORK_DIR}/../dist"

echo "[Nextcloud Packager] Building package for ${APP_ID} v${VERSION}..."

mkdir -p "${DIST_DIR}"
rm -rf "${WORK_DIR}/${APP_ID}/js"/* "${WORK_DIR}/${APP_ID}/css/bundle.css" 2>/dev/null || true

# Copy frontend compiled bundle if exists
if [ -d "${FRONTEND_DIST}/assets" ]; then
  echo "[Nextcloud Packager] Syncing frontend assets from ${FRONTEND_DIST}..."
  mkdir -p "${WORK_DIR}/${APP_ID}/js"
  
  # Find JS and CSS bundles
  JS_FILE=$(ls "${FRONTEND_DIST}/assets"/index-*.js | head -n 1 || true)
  CSS_FILE=$(ls "${FRONTEND_DIST}/assets"/index-*.css | head -n 1 || true)
  
  if [ -n "${JS_FILE}" ]; then
    cp "${JS_FILE}" "${WORK_DIR}/${APP_ID}/js/agent360.js"
    echo "  -> Copied JS to ${APP_ID}/js/agent360.js"
  fi
  
  if [ -n "${CSS_FILE}" ]; then
    cat "${CSS_FILE}" >> "${WORK_DIR}/${APP_ID}/css/agent360.css"
    echo "  -> Appended CSS to ${APP_ID}/css/agent360.css"
  fi
fi

# Create tar.gz archive
ARCHIVE_NAME="${APP_ID}-${VERSION}.tar.gz"
echo "[Nextcloud Packager] Creating archive ${DIST_DIR}/${ARCHIVE_NAME}..."
cd "${WORK_DIR}"
tar -czf "${DIST_DIR}/${ARCHIVE_NAME}" --exclude="*.git*" --exclude="dist" "${APP_ID}"

# Generate SHA256 checksum
cd "${DIST_DIR}"
sha256sum "${ARCHIVE_NAME}" > "${ARCHIVE_NAME}.sha256"

echo "[Nextcloud Packager] Done! Checksum: $(cat "${ARCHIVE_NAME}.sha256")"
