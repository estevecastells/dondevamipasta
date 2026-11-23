// Traducciones de ¿Y mi pasta?
//
//   node tools/i18n.mjs source   → tools/i18n/source-es.json: todos los textos en castellano
//                                  (index.html, i18n/es.js y data.js), con la misma forma que ca.js, eu.js y gl.js
//   node tools/i18n.mjs check    → comprueba que ca.js, eu.js y gl.js tienen todas las claves,
//                                  las mismas {variables}, las mismas etiquetas HTML y los mismos enlaces
//
// Si cambias un texto en castellano, cámbialo también en public/i18n/ca.js, eu.js y gl.js.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUB = join(ROOT, 'public');
const imp = (p) => import(pathToFileURL(join(PUB, p)).href);

const { SPENDING, SPICY, PROMISES, SOURCES } = await imp('data.js');
const ES = (await imp('i18n/es.js')).default;

// ── Textos de index.html con data-i18n y data-i18n-attr ──
function htmlStrings() {
  const html = readFileSync(join(PUB, 'index.html'), 'utf8');
  const out = {};
  const re = /<([a-z0-9]+)\b([^>]*?)\sdata-i18n="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g;
  for (const m of html.matchAll(re)) out[m[3]] = m[5].replace(/\s+/g, ' ').trim();
  for (const m of html.matchAll(/<[a-z0-9]+\b[^>]*\bdata-i18n-attr="([^"]+)"[^>]*>/g)) {
    for (const pair of m[1].split(';')) {
      const [attr, key] = pair.split(':').map((x) => x.trim());
      const val = m[0].match(new RegExp(`\\s${attr}="([^"]*)"`));
      if (val) out[key] = val[1];
    }
  }
  return out;
}

// ── Textos de data.js ──
const only = (o, keys) => Object.fromEntries(keys.filter((k) => o[k] != null).map((k) => [k, o[k]]));

function dataStrings() {
  const spending = Object.fromEntries(SPENDING.map((s) => [s.key, only(s, ['label', 'short'])]));

  const spicy = {};
  for (const s of SPICY) {
    const o = only(s, ['title', 'unit', 'blurb', 'stat']);
    if (s.extra?.text) o.extraText = s.extra.text;
    if (s.byParty) {
      const bp = only(s.byParty, ['title', 'moneyLabel', 'peopleLabel', 'note']);
      bp.rows = Object.fromEntries(s.byParty.rows.map((r) => [r.party, only(r, ['name', 'moneyText', 'detail', 'caveat', 'pctLabel', 'pctText'])]));
      o.byParty = bp;
    }
    spicy[s.key] = o;
  }

  const promises = {
    lede: PROMISES.lede,
    note: PROMISES.note,
    noOffer: PROMISES.noOffer,
    verdicts: Object.fromEntries(Object.entries(PROMISES.verdicts).map(([k, v]) => [k, only(v, ['label', 'rule'])])),
    parties: Object.fromEntries(PROMISES.parties.filter((p) => p.sub).map((p) => [p.key, { sub: p.sub }])),
    items: {},
  };
  for (const item of PROMISES.items) {
    const o = only(item, ['title', 'nowLabel', 'intro']);
    if (item.highlight?.text) o.highlightText = item.highlight.text;
    o.offers = Object.fromEntries(Object.entries(item.offers).map(([k, v]) => [k, only(v, ['what', 'costText', 'why', 'mineLabel'])]));
    promises.items[item.key] = o;
  }

  const sources = {};
  const add = (src) => src && (sources[src.name] = src.name);
  SOURCES.forEach(add);
  SPICY.forEach((s) => add(s.source));
  PROMISES.items.forEach((i) => Object.values(i.offers).forEach((o) => [].concat(o.source || []).forEach(add)));

  return { spending, spicy, promises, sources };
}

const source = () => ({ meta: ES.meta, html: htmlStrings(), ui: ES.ui, data: dataStrings() });

// ── Comprobación ──
const vars = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
const tags = (s) => [...String(s).matchAll(/<\/?([a-z0-9]+)/gi)].map((m) => m[0].toLowerCase()).sort().join(',');
const hrefs = (s) => [...String(s).matchAll(/href="([^"]+)"/g)].map((m) => m[1]).sort().join(',');

function compare(es, tr, path, errors, warnings) {
  if (typeof es === 'string') {
    if (typeof tr !== 'string') return errors.push(`${path}: falta`);
    // Las palabras sueltas de la frase de arriba pueden quedar vacías (en euskera cambia el orden)
    if (!tr.trim() && es.trim() && !/\.(heroPre|heroPost|pagasWord)$/.test(path)) errors.push(`${path}: vacío`);
    if (vars(es) !== vars(tr)) errors.push(`${path}: variables distintas (${vars(es)} ≠ ${vars(tr)})`);
    if (tags(es) !== tags(tr)) warnings.push(`${path}: etiquetas HTML distintas`);
    if (hrefs(es) !== hrefs(tr)) errors.push(`${path}: enlaces distintos`);
    return;
  }
  if (!tr || typeof tr !== 'object') return errors.push(`${path}: falta`);
  for (const k of Object.keys(es)) compare(es[k], tr[k], `${path}.${k}`, errors, warnings);
  for (const k of Object.keys(tr)) if (!(k in es)) warnings.push(`${path}.${k}: sobra (no existe en castellano)`);
}

const cmd = process.argv[2];
if (cmd === 'source') {
  const out = join(ROOT, 'tools/i18n/source-es.json');
  writeFileSync(out, JSON.stringify(source(), null, 2) + '\n');
  console.log('Escrito', out);
} else if (cmd === 'check') {
  const es = source();
  let bad = 0;
  for (const lang of ['ca', 'eu', 'gl']) {
    let tr;
    try {
      tr = (await imp(`i18n/${lang}.js`)).default;
    } catch (e) {
      console.log(`${lang}: no se puede cargar (${e.message})`);
      bad++;
      continue;
    }
    const errors = [];
    const warnings = [];
    compare(es, tr, lang, errors, warnings);
    console.log(`${lang}: ${errors.length} errores, ${warnings.length} avisos`);
    errors.forEach((e) => console.log('  ✗', e));
    warnings.forEach((w) => console.log('  ·', w));
    bad += errors.length;
  }
  process.exit(bad ? 1 : 0);
} else {
  console.log('Uso: node tools/i18n.mjs source | check');
}
