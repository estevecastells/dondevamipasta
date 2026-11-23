#!/bin/sh
# Genera los iconos PNG (móvil e instalación) a partir de tools/icons/icon-full.svg
set -e
cd "$(dirname "$0")/.."
PROFILE="$(mktemp -d)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --no-first-run --user-data-dir="$PROFILE" \
  --window-size=512,512 --screenshot="$PWD/public/icon-512.png" "file://$PWD/tools/icons/icon-full.svg" >/dev/null 2>&1
rm -rf "$PROFILE"
sips -z 192 192 public/icon-512.png --out public/icon-192.png >/dev/null
sips -z 180 180 public/icon-512.png --out public/apple-touch-icon.png >/dev/null
echo "iconos listos"
