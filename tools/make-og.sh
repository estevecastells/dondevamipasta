#!/bin/sh
# Genera public/og.jpg (1200 × 630, unos 200 KB: WhatsApp no muestra vista previa por encima de ~300 KB)
# a partir de tools/og.html con Chrome sin ventana. Se renderiza a 2x y se reduce para que salga nítida.
set -e
cd "$(dirname "$0")/.."
PORT=5199
python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 1
PROFILE="$(mktemp -d)"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars --no-first-run \
  --user-data-dir="$PROFILE" \
  --window-size=1200,630 --force-device-scale-factor=2 \
  --virtual-time-budget=8000 \
  --screenshot="$PROFILE/og@2x.png" \
  "http://127.0.0.1:$PORT/tools/og.html" >/dev/null 2>&1
sips -z 630 1200 "$PROFILE/og@2x.png" --out "$PROFILE/og.png" >/dev/null
sips -s format jpeg -s formatOptions 86 "$PROFILE/og.png" --out "$PWD/public/og.jpg" >/dev/null
rm -rf "$PROFILE"
echo "public/og.jpg listo ($(wc -c < public/og.jpg | tr -d ' ') bytes)"
echo "Si cambia la imagen, sube el ?v= de og:image en public/index.html para que X y WhatsApp no usen la vieja."
