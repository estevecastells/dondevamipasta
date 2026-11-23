// Comprueba que los enlaces a las fuentes siguen funcionando.
//   npm run links
// Falla solo si una página ya no existe (404, 410 o el dominio no responde).
// Muchas webs oficiales bloquean a los programas (403, 429…): esas salen como «sin comprobar».

import { SOURCES, SPICY, PROMISES } from '../public/data.js';

const urls = new Set();
const add = (src) => src?.url && urls.add(src.url);
SOURCES.forEach(add);
SPICY.forEach((s) => add(s.source));
PROMISES.items.forEach((i) => Object.values(i.offers).forEach((o) => [].concat(o.source || []).forEach(add)));
for (const [, url] of JSON.stringify({ SPICY, PROMISES }).matchAll(/href=\\"([^"\\]+)\\"/g)) urls.add(url);

async function check(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (link checker)', Accept: 'text/html,application/pdf,*/*' },
    });
    res.body?.cancel();
    if (res.ok) return { url, state: 'ok', why: res.status };
    if (res.status === 404 || res.status === 410) return { url, state: 'roto', why: res.status };
    return { url, state: 'sin comprobar', why: res.status };
  } catch (e) {
    const code = e.cause?.code || e.name;
    if (code === 'ENOTFOUND') return { url, state: 'roto', why: 'el dominio no existe' };
    return { url, state: 'sin comprobar', why: code };
  } finally {
    clearTimeout(timer);
  }
}

const list = [...urls];
const results = [];
for (let i = 0; i < list.length; i += 6) results.push(...(await Promise.all(list.slice(i, i + 6).map(check))));

const by = (s) => results.filter((r) => r.state === s);
console.log(`${list.length} enlaces: ${by('ok').length} bien, ${by('sin comprobar').length} sin comprobar, ${by('roto').length} rotos\n`);
for (const r of by('sin comprobar')) console.log(`  ? ${r.why}  ${r.url}`);
for (const r of by('roto')) console.log(`  ✗ ${r.why}  ${r.url}`);
process.exit(by('roto').length ? 1 : 0);
