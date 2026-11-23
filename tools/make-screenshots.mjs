// Hace las capturas del README (docs/capturas/*.png) con Chrome sin ventana.
//   node tools/make-screenshots.mjs
// Necesita Google Chrome y python3. Si Chrome está en otra ruta: CHROME=/ruta/al/chrome node tools/make-screenshots.mjs
// Usa «movimiento reducido» para que el ticket salga ya impreso, sin la animación.

import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs', 'capturas');
const PORT = 5197;
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SALARY = 30000; // con 10.000 o más, la web entiende «brutos al año»

const SHOTS = [
  { file: 'portada.png', width: 1280, height: 800, url: '/es', from: '.brand', to: '.hero' },
  { file: 'ticket.png', width: 1280, height: 800, url: `/es?amount=${SALARY}`, from: '#resultado', to: '.ticket-clip', pad: 40 },
  { file: 'ticket-movil.png', width: 390, height: 844, mobile: true, url: `/es?amount=${SALARY}`, from: '.ticket-clip' },
  { file: 'folleto.png', width: 1280, height: 800, url: `/es?amount=${SALARY}`, from: '#folleto', to: '#tags > :nth-child(2)', pad: 40 },
  { file: 'ofertas.png', width: 1280, height: 800, url: `/es?amount=${SALARY}`, from: '#promesas', maxHeight: 1150 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const server = spawn('python3', [join(ROOT, 'tools/serve.py'), String(PORT)], { stdio: 'ignore' });
const profile = mkdtempSync(join(tmpdir(), 'ymipasta-capturas-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  `--user-data-dir=${profile}`, '--remote-debugging-port=0', 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });

async function cleanup() {
  server.kill();
  if (chrome.exitCode === null) {
    const closed = new Promise((r) => chrome.once('exit', r));
    chrome.kill();
    await closed;
  }
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}

try {
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = '';
    chrome.stderr.on('data', (d) => {
      buf += d;
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) resolve(m[1]);
    });
    chrome.on('exit', () => reject(new Error(`No se puede abrir Chrome en ${CHROME}`)));
    setTimeout(() => reject(new Error('Chrome no arranca')), 20000);
  });

  // Protocolo de Chrome (DevTools) a mano, para no instalar nada
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let seq = 0;
  const pending = new Map();
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    const p = pending.get(msg.id);
    if (!p) return;
    pending.delete(msg.id);
    msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const page = (method, params) => send(method, params, sessionId);
  const evaluate = async (expression) => (await page('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value;

  await page('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });

  // Espera a que el servidor responda
  for (let i = 0; i < 50; i++) {
    try { await fetch(`http://127.0.0.1:${PORT}/`); break; } catch { await sleep(200); }
  }

  mkdirSync(OUT, { recursive: true });
  for (const s of SHOTS) {
    await page('Emulation.setDeviceMetricsOverride', { width: s.width, height: s.height, deviceScaleFactor: 2, mobile: !!s.mobile });
    await page('Page.navigate', { url: `http://127.0.0.1:${PORT}${s.url}` });
    await sleep(400);
    await evaluate(`new Promise((r) => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })))`);
    await evaluate('document.fonts.ready.then(() => true)');
    await sleep(900);
    const clip = await evaluate(`(() => {
      const a = document.querySelector(${JSON.stringify(s.from)}).getBoundingClientRect();
      const b = document.querySelector(${JSON.stringify(s.to || s.from)}).getBoundingClientRect();
      const top = Math.min(a.top, b.top) + scrollY;
      const bottom = (${JSON.stringify(!!s.to)} ? b.bottom : Math.max(a.bottom, b.bottom)) + scrollY + ${s.pad || 0};
      return { x: 0, y: top, width: document.documentElement.clientWidth, height: Math.min(bottom - top, ${s.maxHeight || 99999}), scale: 1 };
    })()`);
    const { data } = await page('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
    writeFileSync(join(OUT, s.file), Buffer.from(data, 'base64'));
    console.log(`docs/capturas/${s.file}  ${Math.round(clip.width)} × ${Math.round(clip.height)}`);
  }
  ws.close();
} finally {
  await cleanup();
}
