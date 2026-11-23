// Genera una página por idioma a partir de public/index.html:
//   public/es.html → dondevamipasta.com/es
//   public/ca.html → dondevamipasta.com/ca
//   public/eu.html → dondevamipasta.com/eu
//   public/gl.html → dondevamipasta.com/gl
// (Cloudflare sirve ca.html en /ca.) Cada una lleva ya traducidos los textos fijos, el título,
// la descripción y las etiquetas para compartir, así que WhatsApp, X y Google la ven en su idioma.
//
// Se ejecuta sola antes de `wrangler deploy` y `wrangler dev` (ver wrangler.jsonc).
// No edites los .html generados: edita index.html y las traducciones de public/i18n/.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUB = join(ROOT, 'public');
const SITE = 'https://dondevamipasta.com';
const LOCALES = { es: 'es_ES', ca: 'ca_ES', eu: 'eu_ES', gl: 'gl_ES' };

const index = readFileSync(join(PUB, 'index.html'), 'utf8');
const ES = (await import(pathToFileURL(join(PUB, 'i18n/es.js')).href)).default;

const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Cambia el content="" de una etiqueta <meta>/<link> localizada por su atributo
function setMeta(html, selectorAttr, selectorValue, valueAttr, value) {
  const re = new RegExp(`(<(?:meta|link)\\b[^>]*\\b${selectorAttr}="${selectorValue}"[^>]*\\b${valueAttr}=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`No encuentro ${selectorAttr}="${selectorValue}" en index.html`);
  return html.replace(re, `$1${attr(value)}$2`);
}

for (const [lang, locale] of Object.entries(LOCALES)) {
  const L = lang === 'es' ? { meta: ES.meta, html: {} } : (await import(pathToFileURL(join(PUB, `i18n/${lang}.js`)).href)).default;
  const url = `${SITE}/${lang}`;
  let html = index;

  html = html.replace('<!doctype html>', `<!doctype html>\n<!-- Generado por tools/build-langs.mjs a partir de index.html. No lo edites a mano. -->`);
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);

  // Textos fijos: <x data-i18n="clave">…</x> y data-i18n-attr="aria-label:clave"
  html = html.replace(/<([a-z0-9]+)\b([^>]*?)\sdata-i18n="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g, (m, tag, a1, key, a2, inner) =>
    L.html[key] != null ? `<${tag}${a1} data-i18n="${key}"${a2}>${L.html[key]}</${tag}>` : m,
  );
  html = html.replace(/<[a-z0-9]+\b[^>]*\bdata-i18n-attr="([^"]+)"[^>]*>/g, (tagHtml, pairs) => {
    let out = tagHtml;
    for (const pair of pairs.split(';')) {
      const [a, key] = pair.split(':').map((x) => x.trim());
      if (L.html[key] != null) out = out.replace(new RegExp(`(\\s${a}=")[^"]*(")`), `$1${attr(L.html[key])}$2`);
    }
    return out;
  });

  // Las palabras que se tocan en la frase de arriba (app.js las vuelve a poner al cargar)
  if (L.ui) {
    const pick = (id, text) => {
      const re = new RegExp(`(<button\\b[^>]*\\bid="${id}"[^>]*>)[^<]*(</button>)`);
      if (!re.test(html)) throw new Error(`No encuentro #${id} en index.html`);
      html = html.replace(re, `$1${text}$2`);
    };
    pick('kind', L.ui.kindNet);
    pick('period', L.ui.perMonth);
    pick('pagas', L.ui.pagas.replace('{n}', '14'));
  }

  // Título, descripción y vista previa al compartir
  const { title, description } = L.meta;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = setMeta(html, 'name', 'description', 'content', description);
  html = setMeta(html, 'rel', 'canonical', 'href', url);
  html = setMeta(html, 'property', 'og:url', 'content', url);
  html = setMeta(html, 'property', 'og:locale', 'content', locale);
  html = setMeta(html, 'property', 'og:title', 'content', title);
  html = setMeta(html, 'property', 'og:description', 'content', description);
  html = setMeta(html, 'name', 'twitter:title', 'content', title);
  html = setMeta(html, 'name', 'twitter:description', 'content', description);
  html = html.replace('"url": "https://dondevamipasta.com/"', `"url": "${url}"`).replace('"inLanguage": "es-ES"', `"inLanguage": "${lang}-ES"`);

  writeFileSync(join(PUB, `${lang}.html`), html);
  console.log(`public/${lang}.html → ${url}`);
}
