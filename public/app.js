import { SPENDING, SPENDING_TOTAL, SPENDING_YEAR, SPICY, SOURCES, SITE, PROMISES } from './data.js';
import { LANG, t, fill, dates, translatePage } from './i18n.js';
import { fromGross, grossFromNet, liberationDate, setRegime } from './tax.js';
import { num, eur, eurSmart, priceParts, parseAmount, capitalize } from './format.js';
import { renderShareImage } from './share.js';

// En euskera, el IRPF foral de Araba, Bizkaia y Gipuzkoa (por idioma: no preguntamos dónde vive cada uno)
if (LANG === 'eu') setRegime('foral');

const $ = (sel) => document.querySelector(sel);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const els = {
  form: $('#form'),
  amount: $('#amount'),
  kind: $('#kind'),
  period: $('#period'),
  pagas: $('#pagas'),
  pagasWrap: $('#pagasWrap'),
  hint: $('#hint'),
  result: $('#resultado'),
  flyer: $('#folleto'),
  promisesSec: $('#promesas'),
  promises: $('#promises'),
  promisesLede: $('#promisesLede'),
  promisesNote: $('#promisesNote'),
  legend: $('#legend'),
  totalPrice: $('#totalPrice'),
  totalUnit: $('#totalUnit'),
  parts: $('#parts'),
  optEmployer: $('#optEmployer'),
  optIndirect: $('#optIndirect'),
  calMonth: $('#calMonth'),
  calDay: $('#calDay'),
  calWeekday: $('#calWeekday'),
  calText: $('#calText'),
  ticket: $('#ticket'),
  tags: $('#tags'),
  sources: $('#sources'),
  btnImage: $('#btnImage'),
  btnX: $('#btnX'),
  btnCopy: $('#btnCopy'),
  shareNote: $('#shareNote'),
  sheet: $('#sheet'),
  sheetTitle: $('#sheetTitle'),
  sheetBody: $('#sheetBody'),
};

const state = {
  kind: 'neto',
  period: 'mes',
  pagas: 14,
  periodTouched: false,
  kindTouched: false,
  printed: false,
  last: null, // último cálculo
};

// La flecha a boli ya explica que se puede editar; aquí solo van los avisos
const DEFAULT_HINT = '';

// ── Entrada ──────────────────────────────────────────────

// El campo mide exactamente lo que ocupa el número, para que la frase no tenga huecos
const mirror = document.createElement('span');
mirror.setAttribute('aria-hidden', 'true');
mirror.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;left:-9999px;top:0';
document.body.appendChild(mirror);

// Si una palabra no cabe en la pantalla (en euskera «14 ordainsaritan» es larga),
// la frase entera baja de tamaño lo justo. En castellano no pasa.
const sentence = $('#frase');
function sizeInput() {
  sentence.style.removeProperty('font-size');
  measureInput();
  const over = sentence.scrollWidth / sentence.clientWidth;
  if (over > 1.001) {
    sentence.style.setProperty('font-size', `${Math.floor(parseFloat(getComputedStyle(sentence).fontSize) / over)}px`);
    measureInput();
  }
  placeTapHint();
}

function measureInput() {
  const cs = getComputedStyle(els.amount);
  // (el atajo "font" sale vacío cuando font-stretch es un porcentaje)
  mirror.style.fontFamily = cs.fontFamily;
  mirror.style.fontSize = cs.fontSize;
  mirror.style.fontWeight = cs.fontWeight;
  mirror.style.fontStretch = cs.fontStretch;
  mirror.style.letterSpacing = cs.letterSpacing;
  mirror.style.fontVariantNumeric = cs.fontVariantNumeric;
  mirror.textContent = els.amount.value || els.amount.placeholder;
  els.amount.style.width = `${Math.ceil(mirror.getBoundingClientRect().width) + 6}px`;
}

// La flecha "clic para editar" va al lado del importe si cabe; si no, debajo de la frase
const sideHint = document.querySelector('.tap-hint--side');
function placeTapHint() {
  els.form.classList.remove('hint-below');
  const field = els.amount.closest('.field').getBoundingClientRect();
  const next = els.kind.getBoundingClientRect();
  // Si "netos/brutos" sigue en la misma línea que el importe, la flecha lo taparía
  const sameLine = next.top < field.bottom - 4 && next.left > field.left;
  const tooWide = sideHint.getBoundingClientRect().right > document.documentElement.clientWidth - 12;
  if (sameLine || tooWide) els.form.classList.add('hint-below');
}
document.fonts?.ready.then(sizeInput);
// En el móvil, «resize» salta cada vez que la barra del navegador se esconde al hacer scroll;
// solo hay que volver a medir si cambia el ancho
let lastWidth = document.documentElement.clientWidth;
window.addEventListener('resize', () => {
  const w = document.documentElement.clientWidth;
  if (w === lastWidth) return;
  lastWidth = w;
  sizeInput();
});

function setPick(btn, value, label) {
  btn.dataset.value = value;
  btn.textContent = label;
}

function syncPicks() {
  setPick(els.kind, state.kind, t(state.kind === 'neto' ? 'kindNet' : 'kindGross'));
  setPick(els.period, state.period, t(state.period === 'mes' ? 'perMonth' : 'perYear'));
  setPick(els.pagas, String(state.pagas), t('pagas', { n: state.pagas }));
  els.pagasWrap.hidden = state.period !== 'mes';
  sizeInput();
}

function setHint(html, warn = false) {
  els.hint.innerHTML = html;
  els.hint.classList.toggle('hint--warn', warn);
}

function autoDetect(n) {
  // Si el usuario no ha elegido periodo, lo deducimos del importe
  if (!Number.isFinite(n) || n <= 0) {
    setHint(DEFAULT_HINT);
    return;
  }
  const looksYearly = n >= 10000;
  if (!state.periodTouched) {
    // Quien da la cifra anual suele dar el bruto del contrato; quien da la mensual, lo que cobra
    state.period = looksYearly ? 'ano' : 'mes';
    if (!state.kindTouched) state.kind = looksYearly ? 'bruto' : 'neto';
    syncPicks();
    const gross = state.kind === 'bruto';
    setHint(t(looksYearly ? (gross ? 'hintYearGross' : 'hintYearNet') : gross ? 'hintMonthGross' : 'hintMonthNet'));
    return;
  }
  if (state.period === 'ano' && n < 6000) {
    setHint(t('warnYear'), true);
  } else if (state.period === 'mes' && n > 15000) {
    setHint(t('warnMonth'), true);
  } else {
    setHint(DEFAULT_HINT);
  }
}

function annualGross() {
  const n = parseAmount(els.amount.value);
  if (!(n > 0)) return null;
  const periods = state.period === 'mes' ? state.pagas : 1;
  const annual = n * periods;
  if (annual < 1000 || annual > 20000000) return null;
  return state.kind === 'bruto' ? annual : grossFromNet(annual);
}

// ── Cálculo ──────────────────────────────────────────────

function compute() {
  const gross = annualGross();
  if (gross == null) return null;
  const opts = { employer: els.optEmployer.checked, indirect: els.optIndirect.checked };
  const r = fromGross(gross, opts);
  const all = fromGross(gross, { employer: true, indirect: true });
  const lines = SPENDING.map((s) => ({ ...s, amount: (r.total * s.m) / SPENDING_TOTAL })).sort((a, b) => b.amount - a.amount);
  const spicy = SPICY.map((s) => ({
    ...s,
    amount: s.perCapita != null ? s.perCapita : (r.total * s.m) / SPENDING_TOTAL,
  }));
  const date = liberationDate(r.effective);
  return { ...r, opts, all, lines, spicy, date };
}

// ── Ventana de información ───────────────────────────────
// Las explicaciones largas no van en la página (en el móvil ocupaban demasiado):
// cada botón con data-info abre la ventana con su título y su texto.

const INFO = new Map();

function infoButton(key, content, label, cls = '') {
  INFO.set(key, content);
  return `<button type="button" class="info-btn ${cls}" data-info="${key}" aria-haspopup="dialog">${label}</button>`;
}

// Botón redondo con una «i», para poner al lado de un nombre
function infoDot(key, content, name) {
  INFO.set(key, content);
  return `<button type="button" class="info-dot" data-info="${key}" aria-haspopup="dialog" aria-label="${t('infoAbout', { name })}"><span aria-hidden="true">i</span></button>`;
}

function openInfo(key) {
  const c = INFO.get(key);
  if (!c) return;
  els.sheetTitle.innerHTML = c.title;
  els.sheetBody.innerHTML = c.body;
  els.sheetBody.scrollTop = 0;
  if (!els.sheet.open) els.sheet.showModal();
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-info]');
  if (b) openInfo(b.dataset.info);
});
// Se cierra con el botón, con Escape (lo hace el navegador) o tocando fuera
els.sheet.addEventListener('click', (e) => {
  if (e.target === els.sheet || e.target.closest('[data-close]')) els.sheet.close();
});

const sourceLinks = (list) =>
  [].concat(list || []).map((sr) => `<a href="${sr.url}" target="_blank" rel="noopener">${sr.name}</a>`).join(', ');

// ── Pintar resultado ─────────────────────────────────────

function priceHTML(n) {
  // Menos de un céntimo: enseñamos las milésimas en vez de redondear a 0,00
  if (n > 0 && n < 0.01) {
    const d = n.toFixed(4).split('.')[1].replace(/0+$/, '');
    return `<span class="int">0</span><span class="cents">,${d} €</span>`;
  }
  const { int, cents } = priceParts(n);
  return `<span class="int">${int}</span><span class="cents">,${cents} €</span>`;
}

function renderSide(r) {
  els.totalPrice.innerHTML = priceHTML(r.total);
  els.totalUnit.textContent = t('totalUnit', { month: eur(r.total / 12, 0) });

  const p = r.all.parts;
  const rows = [
    { key: 'irpf', name: t('partIrpf'), amount: p.irpf, on: true, note: t('partIrpfNote') },
    { key: 'ssWorker', name: t('partSsWorker'), amount: p.ssWorker, on: true, note: t('partSsWorkerNote') },
    { key: 'ssEmployer', name: t('partSsEmployer'), amount: p.ssEmployer, on: r.opts.employer, note: t('partSsEmployerNote') },
    { key: 'indirect', name: t('partIndirect'), amount: p.indirect, on: r.opts.indirect, note: t('partIndirectNote') },
  ];
  // La nota se lee con la «i»
  els.parts.innerHTML = rows
    .map(
      (x) => `<li class="${x.on ? '' : 'is-off'}">
        <span class="p-name">${x.name}${infoDot(`part-${x.key}`, { title: x.name, body: `<p>${x.note}</p>` }, x.name)}</span>
        <span class="p-amount">${eur(x.amount)}</span>
      </li>`,
    )
    .join('');

  const d = r.date;
  const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  els.calMonth.textContent = capitalize(dates.month(d));
  els.calDay.textContent = d.getDate();
  els.calWeekday.textContent = dates.weekday(d);
  const per100 = Math.round(r.effective * 100);
  els.calText.innerHTML = `${t('calText', dates.vars(d, next))} ${t(r.opts.employer ? 'calShareCost' : 'calShareEarn', { per100 })}`;
}

const PEN_PATH = 'M6,24 C8,8 110,3 220,4 C280,5 297,13 295,23 C292,35 205,39 125,38 C45,37 3,33 7,19 C10,11 36,7 66,6';

function renderTicket(r) {
  const now = new Date();
  const stamp = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const nTicket = `${SITE.year}-${String(Math.round(r.gross) % 100000).padStart(5, '0')}`;
  const p = r.parts;

  const row = (label, value, cls = '', extra = '') =>
    `<div class="t-row ${cls}"><span class="t-label">${label}</span><span class="t-dots"></span><span class="t-val">${value}</span>${extra}</div>`;

  const contrib = [
    row(t('tIrpf'), num(p.irpf)),
    row(t('tSsWorker'), num(p.ssWorker)),
    r.opts.employer ? row(t('tSsEmployer'), num(p.ssEmployer)) : '',
    r.opts.indirect ? row(t('tIndirect'), num(p.indirect)) : '',
  ].join('');

  const spend = r.lines
    .map((l) => {
      const label = `<span class="t-emoji" aria-hidden="true">${l.emoji}</span>${l.short}`;
      if (l.key === 'intereses') {
        const pen = `<span class="boli boli--circle" aria-hidden="true"><svg viewBox="0 0 300 42" preserveAspectRatio="none"><path pathLength="100" d="${PEN_PATH}"/></svg></span><span class="boli boli--note" aria-hidden="true">${t('penNote')}</span>`;
        return row(label, num(l.amount), 't-row--marked', pen);
      }
      return row(label, num(l.amount));
    })
    .join('');

  els.ticket.innerHTML = `
    <header class="t-head">
      <p class="t-logo">¿Y MI PASTA?</p>
      <p>${t('tCaja')}</p>
      <p class="t-muted">${t('tTicket', { n: nTicket })}</p>
      <p class="t-muted">${stamp}</p>
    </header>
    <hr class="t-rule">
    <p class="t-sec">${t('tYouPut')}</p>
    ${contrib}
    <hr class="t-rule">
    ${row(t('tTotal'), eur(r.total), 't-row--total')}
    <hr class="t-rule t-rule--double">
    <p class="t-sec">${t('tSpentOn')}</p>
    ${spend}
    <hr class="t-rule">
    ${row(t('tTotal'), eur(r.total), 't-row--total')}
    <hr class="t-rule t-rule--double">
    <p class="t-center t-big">${t('tNoRefunds')}</p>
    <p class="t-center">${t('tComeBack')}</p>
    <canvas class="barcode" width="300" height="54" aria-hidden="true"></canvas>
    <p class="t-center t-small">${r.opts.indirect ? `${t('tVatNote')} ` : ''}${t('tFoot', { year: SPENDING_YEAR })}</p>
  `;
  drawBarcode(els.ticket.querySelector('.barcode'), Math.round(r.gross));
}

function drawBarcode(canvas, seed) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = getComputedStyle(els.ticket).color;
  let x = 0;
  let s = seed || 12345;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  while (x < canvas.width) {
    const w = 1 + Math.floor(rand() * 4);
    if (rand() > 0.42) ctx.fillRect(x, 0, w, canvas.height);
    x += w + 1;
  }
}

// Tabla por partido dentro de una etiqueta del folleto (corrupción)
function byPartyHTML(bp, key) {
  const logo = (k) => PROMISES.parties.find((p) => p.key === k);
  const maxPct = Math.max(...bp.rows.map((r) => r.pct || 0), 1);
  const rows = bp.rows
    .map((row) => {
      const p = logo(row.party);
      const img = p ? `<img src="${p.logo}" alt="" width="${p.w}" height="${p.h}">` : '';
      const pct = row.pct == null
        ? `<span class="bp__na">${row.pctText || t('bpNoData')}</span>`
        : `<span class="bp__bar" data-w="${((row.pct / maxPct) * 100).toFixed(1)}"></span><span class="bp__pct">${row.pctLabel || t('pct', { n: num(row.pct, 1) })}</span>${row.detail ? `<span class="bp__detail">${row.detail}</span>` : ''}${row.caveat ? `<span class="bp__caveat">${row.caveat}</span>` : ''}`;
      return `<tr>
        <th scope="row"><span class="bp__party">${img}${row.name || row.party}</span></th>
        <td class="bp__money" data-label="${bp.moneyLabel}">${row.moneyText}</td>
        <td class="bp__people" data-label="${bp.peopleLabel}">${pct}</td>
      </tr>`;
    })
    .join('');
  return `<div class="bp">
    <p class="bp__title">${bp.title}</p>
    <table class="bp__table">
      <thead><tr><th scope="col">${t('bpParty')}</th><th scope="col">${bp.moneyLabel}</th><th scope="col">${bp.peopleLabel}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${infoButton(`bp-${key}`, { title: bp.title, body: `<p>${bp.note}</p>` }, t('bpMore'), 'bp__more')}
  </div>`;
}

function renderTags(r) {
  const m = (k) => SPENDING.find((x) => x.key === k).m;
  const tag = (k) => SPICY.find((x) => x.key === k).m;
  const ctx = {
    timesCasaReal: Math.round(tag('igualdad') / tag('casareal')),
    interestPer10Edu: Math.round((m('intereses') / m('educacion')) * 10),
    pensionShare: Math.round(((m('jubilacion') + m('viudedad')) / SPENDING_TOTAL) * 100),
  };
  const big = new Set(['pensiones', 'igualdad', 'corrupcion', 'intereses', 'marruecos']);
  els.tags.innerHTML = r.spicy
    .map((s) => {
      const capita = s.perCapita != null;
      const cls = ['tag', big.has(s.key) ? 'tag--big' : '', capita ? 'tag--capita' : '', s.estimate ? 'tag--estimate' : ''].join(' ');
      const unit = s.unit || t(capita ? 'unitPerResident' : s.estimate ? 'unitEstimate' : 'unitDefault');
      const sticker = s.estimate ? `<span class="sticker" aria-hidden="true">${t('sticker')}</span>` : '';
      const stat = fill(s.stat, ctx);
      const src = `${t('source')} ${sourceLinks(s.source)}`;
      // La explicación y la fuente se leen en la ventana
      const more = infoButton(
        `tag-${s.key}`,
        { title: `<span aria-hidden="true">${s.emoji}</span> ${s.title}`, body: `<p>${s.blurb}</p><p class="sheet__stat">${stat}</p><p class="sheet__src">${src}</p>` },
        t('moreInfo'),
        'tag__more',
      );
      return `<article class="${cls}">
        ${sticker}
        <h3 class="tag__name"><span aria-hidden="true">${s.emoji}</span>${s.title}</h3>
        <p class="tag__price">${priceHTML(s.amount)}</p>
        <p class="tag__unit">${unit}</p>
        ${s.extra ? `<p class="tag__extra"><b>+${eurSmart((r.total * s.extra.m) / SPENDING_TOTAL)}</b> ${s.extra.text}</p>` : ''}
        ${s.byParty ? byPartyHTML(s.byParty, s.key) : ''}
        <div class="tag__foot">
          <p class="tag__stat">${stat}</p>
          ${more}
        </div>
      </article>`;
    })
    .join('');
  els.tags.querySelectorAll('.bp__bar').forEach((b) => b.style.setProperty('--w', `${b.dataset.w}%`));
}

// ── Ofertas de campaña ───────────────────────────────────

const stampHTML = (v) => `<span class="stamp stamp--${v}">${PROMISES.verdicts[v].label}</span>`;

function renderPromisesStatic() {
  els.promisesLede.innerHTML = PROMISES.lede;
  els.promisesNote.innerHTML = PROMISES.note;
  const legend = Object.entries(PROMISES.verdicts)
    .map(([v, d]) => `<li>${stampHTML(v)}<p>${d.rule}</p></li>`)
    .join('');
  els.legend.innerHTML = legend;
  // La leyenda de sellos y la nota de criterio van en la ventana (botón en index.html)
  INFO.set('legend', { title: t('legendTitle'), body: `<ul class="legend legend--sheet">${legend}</ul><p class="sheet__note">${PROMISES.note}</p>` });
}

// Lo que pones hoy en esa partida: una línea del ticket o una parte de lo que pagas
function promiseNow(item, r) {
  if (item.part) return r.parts[item.part];
  const keys = [].concat(item.line || []);
  return r.lines.filter((l) => keys.includes(l.key)).reduce((a, l) => a + l.amount, 0);
}

function renderPromises(r) {
  els.promises.innerHTML = PROMISES.items
    .map((item) => {
      const now = promiseNow(item, r);
      const parties = PROMISES.parties
        .map((party) => {
          const o = item.offers[party.key];
          const sub = party.sub ? `<small>${party.sub}</small>` : '';
          const name = `<p class="party__name"><img class="party__logo" src="${party.logo}" alt="" width="${party.w}" height="${party.h}"><span>${party.name}${sub}</span></p>`;
          if (!o) {
            return `<li class="party party--none">${name}<p class="party__what">${PROMISES.noOffer}</p></li>`;
          }
          let money = '';
          if (o.cost > 0) {
            const mine = (r.total * o.cost) / SPENDING_TOTAL;
            money = `<p class="party__cost">${o.costText}</p>
              <p class="party__mine"><b>${eurSmart(mine)}</b>${o.mineLabel || t('mineLabel')}</p>`;
          } else if (o.costText) {
            money = `<p class="party__cost">${o.costText}</p>`;
          }
          const src = sourceLinks(o.source);
          const srcLabel = [].concat(o.source || []).length > 1 ? t('sources') : t('source');
          const why = {
            title: `<span aria-hidden="true">${item.emoji}</span> ${item.title}`,
            body: `<div class="sheet__party">${name}${stampHTML(o.verdict)}</div>
              <p class="sheet__note">${PROMISES.verdicts[o.verdict].rule}</p>
              ${o.costText ? `<p class="sheet__stat">${o.costText}</p>` : ''}
              <p>${o.why}</p>${src ? `<p class="sheet__src">${srcLabel} ${src}</p>` : ''}`,
          };
          return `<li class="party">
            ${name}
            <p class="party__what">${o.what}</p>
            ${money}
            ${stampHTML(o.verdict)}
            ${infoButton(`why-${item.key}-${party.key}`, why, t('why'), 'party__why')}
          </li>`;
        })
        .join('');
      return `<article class="offer">
        <header class="offer__head">
          <div>
            <h3 class="offer__title"><span aria-hidden="true">${item.emoji}</span>${item.title}</h3>
            <p class="offer__now">${t('nowLine', { label: item.nowLabel, amount: eurSmart(now) })}</p>
            ${item.highlight ? `<p class="offer__hl">${t('hlLine', { text: item.highlight.text, amount: eurSmart((r.total * item.highlight.cost) / SPENDING_TOTAL) })}</p>` : ''}
          </div>
          <p class="offer__intro">${item.intro}</p>
        </header>
        <ul class="offer__parties">${parties}</ul>
      </article>`;
    })
    .join('');
}

function render(r, { animate }) {
  state.last = r;
  els.result.hidden = false;
  els.flyer.hidden = false;
  els.promisesSec.hidden = false;
  renderSide(r);
  renderTicket(r);
  renderTags(r);
  renderPromises(r);
  if (animate) printTicket();
  else drawPen(false);
}

// ── Impresión del ticket ─────────────────────────────────

let printAnim = null;

function printTicket() {
  const t = els.ticket;
  if (printAnim) printAnim.cancel();
  if (reduceMotion || !t.animate) {
    drawPen(false);
    return;
  }
  const h = t.offsetHeight;
  const duration = Math.min(2800, Math.max(1100, h * 1.5));
  printAnim = t.animate([{ transform: 'translateY(-100%)' }, { transform: 'translateY(0)' }], {
    duration,
    easing: `steps(${Math.max(12, Math.round(h / 18))}, end)`,
    fill: 'backwards',
  });
  printAnim.onfinish = () => {
    printAnim = null;
    drawPen(true);
  };
}

function drawPen(animated) {
  const circle = els.ticket.querySelector('.boli--circle');
  const note = els.ticket.querySelector('.boli--note');
  if (!circle) return;
  if (!animated) {
    circle.style.transition = 'none';
    note.style.transition = 'none';
    circle.querySelector('path').style.transition = 'none';
  }
  requestAnimationFrame(() => {
    circle.classList.add('is-drawn');
    note.classList.add('is-drawn');
  });
}

// ── Compartir ────────────────────────────────────────────

// En catalán, euskera y gallego se comparte la página de ese idioma: dondevamipasta.com/ca
function siteUrl() {
  const path = LANG === 'es' ? '' : `/${LANG}`;
  if (SITE.url) return SITE.url + path;
  const { protocol, host } = window.location;
  if (!/^https?:$/.test(protocol)) return '';
  return `${protocol}//${host}${path || '/'}`;
}

// Longitud aproximada según X: los emojis y caracteres anchos cuentan doble
function xLength(s) {
  let n = 0;
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp === 0xfe0f || cp === 0x200d || (cp >= 0x1f3fb && cp <= 0x1f3ff)) continue;
    n += cp >= 0x1100 ? 2 : 1;
  }
  return n;
}

function shareText(r) {
  const by = Object.fromEntries(r.lines.map((l) => [l.key, l.amount]));
  const sp = Object.fromEntries(r.spicy.map((s) => [s.key, s.amount]));
  const first = t('shareFirst', { total: eur(r.total, 0) });
  const last = t('shareLast', { until: dates.until(r.date) });
  // Por orden de preferencia; entran mientras quepan en un post con enlace
  const optional = [
    t('shareInterest', { v: eurSmart(by.intereses) }),
    t('shareMarruecos', { v: eurSmart(sp.marruecos) }),
    t('shareCasaReal', { v: eur(sp.casareal) }),
    t('sharePensions', { v: eurSmart(by.jubilacion) }),
    t('shareIgualdad', { v: eurSmart(sp.igualdad) }),
  ];
  const lines = [first];
  for (const line of optional) {
    if (xLength([...lines, line, last].join('\n')) <= 252) lines.push(line);
  }
  lines.push(last);
  return lines.join('\n');
}

function note(msg) {
  els.shareNote.textContent = msg;
}

async function onImage() {
  const r = state.last;
  if (!r) return;
  els.btnImage.disabled = true;
  note(t('imgPreparing'));
  try {
    const blob = await renderShareImage(r, siteUrl());
    const file = new File([blob], `${t('imgFile')}.png`, { type: 'image/png' });
    const text = shareText(r);
    if (navigator.canShare && navigator.canShare({ files: [file] }) && matchMedia('(pointer: coarse)').matches) {
      try {
        await navigator.share({ files: [file], text });
        note('');
      } catch (e) {
        if (e.name !== 'AbortError') throw e;
        note('');
      }
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      note(t('imgSaved'));
    }
  } catch (e) {
    console.error(e);
    note(t('imgError'));
  } finally {
    els.btnImage.disabled = false;
  }
}

function onX() {
  const r = state.last;
  if (!r) return;
  const url = siteUrl();
  const params = new URLSearchParams({ text: shareText(r) });
  if (url) params.set('url', url);
  window.open(`https://x.com/intent/post?${params}`, '_blank', 'noopener');
}

async function onCopy() {
  const r = state.last;
  if (!r) return;
  const url = siteUrl();
  try {
    await navigator.clipboard.writeText(shareText(r) + (url ? `\n${url}` : ''));
    note(t('copied'));
  } catch {
    note(t('copyError'));
  }
}

// ── Eventos ──────────────────────────────────────────────

let typingTimer = null;

function update({ animate = false, fromTyping = false } = {}) {
  const r = compute();
  if (!r) return false;
  const shouldAnimate = animate || (!state.printed && fromTyping);
  render(r, { animate: shouldAnimate });
  state.printed = true;
  return true;
}

els.amount.addEventListener('input', () => {
  sizeInput();
  autoDetect(parseAmount(els.amount.value));
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => update({ fromTyping: true }), state.printed ? 250 : 900);
});

els.amount.addEventListener('blur', () => {
  const n = parseAmount(els.amount.value);
  if (n > 0) {
    els.amount.value = num(n, n % 1 ? 2 : 0);
    sizeInput();
  }
});

els.kind.addEventListener('click', () => {
  state.kind = state.kind === 'neto' ? 'bruto' : 'neto';
  state.kindTouched = true;
  syncPicks();
  update();
});

els.period.addEventListener('click', () => {
  state.period = state.period === 'mes' ? 'ano' : 'mes';
  state.periodTouched = true;
  syncPicks();
  autoDetect(parseAmount(els.amount.value));
  update();
});

els.pagas.addEventListener('click', () => {
  state.pagas = state.pagas === 14 ? 12 : 14;
  syncPicks();
  update();
});

els.hint.addEventListener('click', (e) => {
  const fix = e.target.closest('[data-fix]');
  if (!fix) return;
  state.period = fix.dataset.fix;
  syncPicks();
  setHint(DEFAULT_HINT);
  update();
});

[els.optEmployer, els.optIndirect].forEach((el) => el.addEventListener('change', () => update()));

els.form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearTimeout(typingTimer);
  if (!update({ animate: true })) {
    setHint(t('emptyAmount'), true);
    els.amount.focus();
    return;
  }
  // Se cierra el teclado antes de bajar al ticket, si no el scroll acaba a medias
  if (document.activeElement === els.amount) els.amount.blur();
  els.result.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
});

els.btnImage.addEventListener('click', onImage);
els.btnX.addEventListener('click', onX);
els.btnCopy.addEventListener('click', onCopy);

// Selector de idioma: la elección se guarda en este navegador
document.querySelectorAll('.langs a[data-lang]').forEach((a) => {
  if (a.dataset.lang === LANG) a.setAttribute('aria-current', 'true');
  a.addEventListener('click', () => {
    try {
      localStorage.setItem('lang', a.dataset.lang);
    } catch {}
  });
});

translatePage();
document.documentElement.classList.remove('i18n-wait');

els.sources.innerHTML = SOURCES.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.name}</a></li>`).join('');
renderPromisesStatic();

// El enlace «Fuentes y cálculo» de arriba abre la letra pequeña
function openFinePrint() {
  if (location.hash === '#letra-pequena') $('#fineDetails').open = true;
}
window.addEventListener('hashchange', openFinePrint);
$('.brand__fine').addEventListener('click', () => { $('#fineDetails').open = true; });
openFinePrint();

syncPicks();
sizeInput();

// Si alguien pulsa «Imprimir» antes de que cargue el JS, el formulario recarga con ?amount=1800:
// se recoge el importe y se imprime el ticket igual.
const sent = new URLSearchParams(location.search).get('amount');
if (sent) {
  history.replaceState(null, '', location.pathname + location.hash);
  const n = parseAmount(sent);
  els.amount.value = n > 0 ? num(n, n % 1 ? 2 : 0) : sent;
  sizeInput();
  autoDetect(n);
  if (update({ animate: true })) els.result.scrollIntoView({ block: 'start' });
}
