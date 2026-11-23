// Idiomas: castellano (base), catalán, euskera y gallego.
// lang.js (en el <head>) ya ha elegido el idioma y lo ha puesto en <html lang>.
// Aquí se carga su archivo, se traducen los datos de data.js y se dan t() y las fechas.

import { SPENDING, SPICY, PROMISES, SOURCES } from './data.js';
import ES from './i18n/es.js';
import { DATES } from './i18n/dates.js';

export const LANGS = ['es', 'ca', 'eu', 'gl'];

const wanted = LANGS.includes(document.documentElement.lang) ? document.documentElement.lang : 'es';
let L = null;
if (wanted !== 'es') {
  try {
    L = (await import(`./i18n/${wanted}.js`)).default;
  } catch (e) {
    console.error('No se ha podido cargar el idioma', wanted, e);
  }
}

// Si falla la carga, la página sigue en castellano entera
export const LANG = L ? wanted : 'es';
document.documentElement.lang = LANG;

const UI = { ...ES.ui, ...(L?.ui || {}) };

// Rellena {clave} con vars; deja la llave si no hay valor
export const fill = (s, vars = {}) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const D = DATES[LANG];

export const dates = {
  month: (d) => D.months[d.getMonth()],
  weekday: (d) => D.weekdays[d.getDay()],
  until: (d) => D.until(d),
  since: (d) => D.since(d),
  // Para las plantillas: {until}, {since}, {Until}, {Since}
  vars: (d, next) => ({ until: D.until(d), since: D.since(next), Until: cap(D.until(d)), Since: cap(D.since(next)) }),
};

export function t(key, vars) {
  const s = UI[key];
  if (s == null) {
    console.warn('i18n: falta el texto', key);
    return key;
  }
  return vars ? fill(s, vars) : s;
}

// ── Textos fijos de index.html ───────────────────────────
// <p data-i18n="clave">…</p>  y  data-i18n-attr="aria-label:clave; placeholder:clave"
export function translatePage() {
  if (!L) return;
  const html = L.html || {};
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const s = html[el.dataset.i18n];
    if (s != null) el.innerHTML = s;
  });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':').map((x) => x.trim());
      if (attr && html[key] != null) el.setAttribute(attr, html[key]);
    });
  });
  if (L.meta?.title) document.title = L.meta.title;
  if (L.meta?.description) document.querySelector('meta[name="description"]')?.setAttribute('content', L.meta.description);
}

// ── Textos de data.js ────────────────────────────────────
function translateData(d) {
  if (!d) return;
  for (const s of SPENDING) Object.assign(s, d.spending?.[s.key]);

  for (const s of SPICY) {
    const o = d.spicy?.[s.key];
    if (!o) continue;
    const { byParty, extraText, ...rest } = o;
    Object.assign(s, rest);
    if (extraText && s.extra) s.extra.text = extraText;
    if (byParty && s.byParty) {
      const { rows, ...bp } = byParty;
      Object.assign(s.byParty, bp);
      for (const row of s.byParty.rows) Object.assign(row, rows?.[row.party]);
    }
  }

  const p = d.promises;
  if (p) {
    for (const k of ['lede', 'note', 'noOffer']) if (p[k]) PROMISES[k] = p[k];
    for (const [k, v] of Object.entries(p.verdicts || {})) Object.assign(PROMISES.verdicts[k], v);
    for (const party of PROMISES.parties) Object.assign(party, p.parties?.[party.key]);
    for (const item of PROMISES.items) {
      const o = p.items?.[item.key];
      if (!o) continue;
      const { offers, highlightText, ...rest } = o;
      Object.assign(item, rest);
      if (highlightText && item.highlight) item.highlight.text = highlightText;
      for (const [party, off] of Object.entries(offers || {})) {
        if (item.offers[party]) Object.assign(item.offers[party], off);
      }
    }
  }

  // Las fuentes se traducen por su nombre en castellano (varias comparten objeto)
  const names = d.sources || {};
  const done = new Set();
  const tr = (src) => {
    if (!src || done.has(src)) return;
    done.add(src);
    if (names[src.name]) src.name = names[src.name];
  };
  SOURCES.forEach(tr);
  SPICY.forEach((s) => tr(s.source));
  PROMISES.items.forEach((i) => Object.values(i.offers).forEach((o) => [].concat(o.source || []).forEach(tr)));
}

translateData(L?.data);
