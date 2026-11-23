// Comprueba que public/data.js es coherente: que las cuentas cuadran, que cada cifra
// tiene su fuente y que los textos dicen lo mismo que los números, en los cuatro idiomas.
// Ejecutar: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { SPENDING, SPENDING_TOTAL, SPICY, SOURCES, PROMISES } from '../public/data.js';
import { fromGross } from '../public/tax.js';
import ca from '../public/i18n/ca.js';
import eu from '../public/i18n/eu.js';
import gl from '../public/i18n/gl.js';

const PUB = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const APP = readFileSync(join(PUB, 'app.js'), 'utf8');
const TRANSLATIONS = { ca, eu, gl };

// Primera cifra en millones de un texto: «unos 9.100 M€» → 9100, «110,4 M€» → 110.4
function firstMillions(text) {
  const m = String(text).match(/(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?\s*M€/);
  if (!m) return null;
  return Number(m[1].replace(/\./g, '') + (m[2] ? '.' + m[2] : ''));
}

// El texto redondea («unos 9.100 M€» para 9.121): se admite un 2 % de diferencia
function assertSameFigure(text, value, where) {
  const n = firstMillions(text);
  if (n == null) return;
  const diff = Math.abs(n - value) / value;
  assert.ok(diff <= 0.02, `${where}: el texto dice ${n} M€ pero la cifra es ${value} M€ («${text}»)`);
}

function assertUrl(url, where) {
  let u;
  assert.doesNotThrow(() => (u = new URL(url)), `${where}: «${url}» no es una dirección válida`);
  assert.ok(u.protocol === 'https:' || u.protocol === 'http:', `${where}: «${url}» no empieza por https://`);
}

function assertSource(src, where) {
  assert.ok(src && typeof src.name === 'string' && src.name.trim(), `${where}: falta el nombre de la fuente`);
  assertUrl(src.url, where);
}

const unique = (list, where) => {
  const seen = new Set();
  for (const x of list) {
    assert.ok(!seen.has(x), `${where}: «${x}» está repetido`);
    seen.add(x);
  }
};

// ── 1. El reparto del ticket ─────────────────────────────────────────────────

test('el reparto del ticket suma el gasto total', () => {
  const sum = SPENDING.reduce((a, x) => a + x.m, 0);
  assert.equal(Math.round(sum), SPENDING_TOTAL, `Las líneas suman ${sum} M€ y el total dice ${SPENDING_TOTAL} M€`);
});

test('cada línea del ticket está completa', () => {
  unique(SPENDING.map((x) => x.key), 'SPENDING');
  for (const s of SPENDING) {
    const where = `SPENDING «${s.key}»`;
    assert.ok(Number.isFinite(s.m) && s.m > 0, `${where}: la cifra tiene que ser un número mayor que 0`);
    for (const f of ['emoji', 'label', 'short']) assert.ok(s[f]?.trim(), `${where}: falta «${f}»`);
    assert.match(s.cofog, /^GF\d{2,4}(\+GF\d{2,4})*$/, `${where}: el código COFOG «${s.cofog}» no tiene buen formato`);
  }
});

test('ningún código COFOG se cuenta dos veces', () => {
  unique(SPENDING.flatMap((s) => s.cofog.split('+')), 'Códigos COFOG');
});

// ── 2. Las partidas del folleto ──────────────────────────────────────────────

test('cada partida del folleto tiene cifra y fuente', () => {
  unique(SPICY.map((x) => x.key), 'SPICY');
  for (const s of SPICY) {
    const where = `SPICY «${s.key}»`;
    const value = s.m ?? s.perCapita;
    assert.ok(Number.isFinite(value) && value > 0, `${where}: necesita «m» (M€) o «perCapita» (€ por residente)`);
    if (s.m != null) assert.ok(s.m <= SPENDING_TOTAL, `${where}: ${s.m} M€ es más que todo el gasto público`);
    for (const f of ['emoji', 'title', 'blurb', 'stat']) assert.ok(s[f]?.trim(), `${where}: falta «${f}»`);
    assertSource(s.source, where);
  }
});

// Solo las que salen de la misma tabla de Eurostat que el ticket. La ayuda al desarrollo
// («cooperacion») usa la cifra de Exteriores con las reglas de la OCDE y es mayor a propósito.
test('las partidas sacadas de Eurostat tienen la misma cifra que su línea del ticket', () => {
  const line = Object.fromEntries(SPENDING.map((s) => [s.key, s.m]));
  for (const s of SPICY) {
    if (s.m == null || !(s.key in line) || !s.source.url.includes('gov_10a_exp')) continue;
    assert.equal(s.m, line[s.key], `«${s.key}» vale ${s.m} M€ en el folleto y ${line[s.key]} M€ en el ticket`);
  }
});

test('el texto de cada partida dice la misma cifra, en los cuatro idiomas', () => {
  for (const s of SPICY) {
    if (s.m == null) continue;
    assertSameFigure(s.stat, s.m, `SPICY «${s.key}» (es)`);
    for (const [lang, tr] of Object.entries(TRANSLATIONS)) {
      assertSameFigure(tr.data?.spicy?.[s.key]?.stat, s.m, `SPICY «${s.key}» (${lang})`);
    }
  }
});

test('las {variables} de los textos las calcula app.js', () => {
  for (const s of SPICY) {
    for (const [, v] of String(s.stat).matchAll(/\{(\w+)\}/g)) {
      assert.match(APP, new RegExp(`\\b${v}:`), `SPICY «${s.key}»: app.js no calcula {${v}}`);
    }
  }
});

test('la tabla de corrupción por partido es coherente', () => {
  const parties = new Set(PROMISES.parties.map((p) => p.key));
  for (const s of SPICY.filter((x) => x.byParty)) {
    const rows = s.byParty.rows;
    unique(rows.map((r) => r.party), `«${s.key}» por partido`);
    for (const r of rows) {
      assert.ok(parties.has(r.party), `«${s.key}»: el partido «${r.party}» no está en PROMISES.parties`);
      assert.ok(r.pct >= 0 && r.pct <= 100, `«${s.key}» ${r.party}: el porcentaje ${r.pct} no está entre 0 y 100`);
    }
    const total = rows.reduce((a, r) => a + r.pct, 0);
    assert.ok(total <= 100, `«${s.key}»: los porcentajes suman ${total} %, más de 100`);
  }
});

// ── 3. Las fuentes ───────────────────────────────────────────────────────────

test('las fuentes de «La letra pequeña» son válidas y no se repiten', () => {
  SOURCES.forEach((src, i) => assertSource(src, `SOURCES[${i}]`));
  unique(SOURCES.map((s) => s.name), 'Nombres en SOURCES');
  unique(SOURCES.map((s) => s.url), 'Direcciones en SOURCES');
});

test('los enlaces dentro de los textos son válidos', () => {
  const html = JSON.stringify({ SPICY, PROMISES });
  for (const [, url] of html.matchAll(/href=\\?"([^"\\]+)\\?"/g)) assertUrl(url, 'Enlace en un texto');
});

// ── 4. Las ofertas de campaña ────────────────────────────────────────────────

test('cada partido tiene su logo', () => {
  unique(PROMISES.parties.map((p) => p.key), 'PROMISES.parties');
  for (const p of PROMISES.parties) {
    assert.ok(existsSync(join(PUB, p.logo)), `Falta el logo de ${p.key}: public/${p.logo}`);
    assert.ok(p.w > 0 && p.h > 0, `El logo de ${p.key} necesita ancho y alto`);
  }
});

test('cada oferta tiene un sello válido, sus fuentes y, si tiene coste, el texto dice lo mismo', () => {
  const parties = new Set(PROMISES.parties.map((p) => p.key));
  const verdicts = new Set(Object.keys(PROMISES.verdicts));
  const lines = new Set(SPENDING.map((s) => s.key));
  const parts = new Set(Object.keys(fromGross(30000).parts));
  unique(PROMISES.items.map((i) => i.key), 'PROMISES.items');

  for (const item of PROMISES.items) {
    const where = `Oferta «${item.key}»`;
    for (const f of ['emoji', 'title', 'nowLabel', 'intro']) assert.ok(item[f]?.trim(), `${where}: falta «${f}»`);
    // Con qué parte del ticket se compara: una línea del reparto o una parte de los impuestos
    assert.ok(item.line || item.part, `${where}: necesita «line» o «part»`);
    for (const l of [].concat(item.line || [])) assert.ok(lines.has(l), `${where}: «${l}» no es una línea del ticket`);
    if (item.part) assert.ok(parts.has(item.part), `${where}: «${item.part}» no es una parte de los impuestos`);
    if (item.highlight) {
      assert.ok(item.highlight.cost > 0, `${where}: el coste destacado tiene que ser mayor que 0`);
      assertSameFigure(item.highlight.text, item.highlight.cost, `${where}, destacado (es)`);
    }

    for (const [party, o] of Object.entries(item.offers)) {
      const w = `${where}, ${party}`;
      assert.ok(parties.has(party), `${w}: «${party}» no está en PROMISES.parties`);
      assert.ok(verdicts.has(o.verdict), `${w}: el sello «${o.verdict}» no existe (${[...verdicts].join(', ')})`);
      for (const f of ['what', 'why']) assert.ok(o[f]?.trim(), `${w}: falta «${f}»`);
      const sources = [].concat(o.source || []);
      assert.ok(sources.length > 0, `${w}: necesita al menos una fuente`);
      sources.forEach((src, i) => assertSource(src, `${w}, fuente ${i + 1}`));
      if (o.cost != null) {
        assert.ok(Number.isFinite(o.cost) && o.cost > 0, `${w}: el coste tiene que ser un número mayor que 0`);
        assertSameFigure(o.costText, o.cost, `${w} (es)`);
        for (const [lang, tr] of Object.entries(TRANSLATIONS)) {
          assertSameFigure(tr.data?.promises?.items?.[item.key]?.offers?.[party]?.costText, o.cost, `${w} (${lang})`);
        }
      }
    }
  }
});
