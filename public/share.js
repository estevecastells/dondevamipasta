// Imagen para compartir (1080 × 1350, formato vertical de X e Instagram)
import { SITE } from './data.js';
import { t, dates } from './i18n.js';
import { num, eur, priceParts, capitalize } from './format.js';

const C = {
  amarillo: '#ffe11a',
  rojo: '#e30613',
  negro: '#000000',
  papel: '#fbfbf8',
  termica: '#34322f',
  boli: '#1b3fd1',
};

const W = 1080;
const H = 1350;
const M = 64;

async function loadFonts() {
  const specs = [
    '900 100px Archivo',
    'extra-condensed 900 100px Archivo',
    'expanded 900 40px Archivo',
    '700 30px Archivo',
    '800 30px Archivo',
    '400 24px "Azeret Mono"',
    '800 24px "Azeret Mono"',
    '40px "Nanum Pen Script"',
  ];
  await Promise.all(specs.map((s) => document.fonts.load(s).catch(() => {})));
  await document.fonts.ready;
}

function setFont(ctx, { w = 400, size, family = 'Archivo', stretch = 'normal' }) {
  const fam = family === 'Archivo' ? 'Archivo, system-ui, sans-serif' : family;
  ctx.font = `${stretch === 'normal' ? '' : stretch + ' '}${w} ${size}px ${fam}`;
  if ('fontStretch' in ctx) ctx.fontStretch = stretch;
}

function wrap(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function fit(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxWidth) t = t.slice(0, -1);
  return t + '…';
}

// Precio estilo etiqueta: parte entera grande y céntimos en superíndice
function drawPrice(ctx, n, x, y, size, color, align = 'left') {
  const { int, cents } =
    n > 0 && n < 0.01 ? { int: '0', cents: n.toFixed(4).split('.')[1].replace(/0+$/, '') } : priceParts(n);
  setFont(ctx, { w: 900, size, stretch: 'extra-condensed' });
  const wInt = ctx.measureText(int).width;
  setFont(ctx, { w: 900, size: size * 0.42, stretch: 'extra-condensed' });
  const cTxt = `,${cents} €`;
  const wC = ctx.measureText(cTxt).width;
  const total = wInt + wC + size * 0.03;
  const x0 = align === 'right' ? x - total : x;
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  setFont(ctx, { w: 900, size, stretch: 'extra-condensed' });
  ctx.fillText(int, x0, y);
  setFont(ctx, { w: 900, size: size * 0.42, stretch: 'extra-condensed' });
  ctx.fillText(cTxt, x0 + wInt + size * 0.03, y - size * 0.42);
  return total;
}

function drawCalendar(ctx, d, x, y) {
  const w = 190;
  const h = 228;
  ctx.fillStyle = C.negro;
  ctx.fillRect(x + 8, y + 8, w, h); // sombra dura
  ctx.fillStyle = '#fff';
  ctx.fillRect(x, y, w, h);
  ctx.lineWidth = 3;
  ctx.strokeStyle = C.negro;
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = C.rojo;
  ctx.fillRect(x + 1.5, y + 1.5, w - 3, 50);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  setFont(ctx, { w: 800, size: 28 });
  ctx.fillText(capitalize(dates.month(d)), x + w / 2, y + 37);
  ctx.fillStyle = C.negro;
  setFont(ctx, { w: 900, size: 132, stretch: 'extra-condensed' });
  ctx.fillText(String(d.getDate()), x + w / 2, y + 176);
  setFont(ctx, { w: 400, size: 24 });
  ctx.fillText(dates.weekday(d), x + w / 2, y + 210);
  // anillas
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(x + 35 + i * 30, y - 2, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.textAlign = 'left';
}

function drawReceipt(ctx, r, x, y, w) {
  const lineH = 36;
  const pad = 30;
  const top = r.lines.slice(0, 9);
  const rest = r.lines.length - top.length;
  const noteGap = 58;
  const hasInterest = top.some((l) => l.key === 'intereses');
  const h = 150 + top.length * lineH + 46 + 120 + (hasInterest ? noteGap : 0);
  const edge = 10;

  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate((-2 * Math.PI) / 180);
  ctx.translate(-w / 2, -h / 2);

  // papel con borde dentado abajo
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.28)';
  ctx.shadowBlur = 34;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = C.papel;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, h - edge);
  const tooth = 20;
  for (let tx = w; tx > 0; tx -= tooth) {
    ctx.lineTo(tx - tooth / 2, h);
    ctx.lineTo(Math.max(0, tx - tooth), h - edge);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = C.termica;
  ctx.strokeStyle = C.termica;
  ctx.textAlign = 'center';
  setFont(ctx, { w: 800, size: 32, family: '"Azeret Mono", monospace' });
  ctx.fillText('¿Y MI PASTA?', w / 2, 58);
  setFont(ctx, { w: 400, size: 20, family: '"Azeret Mono", monospace' });
  ctx.fillText(t('tCaja'), w / 2, 88);

  const dashed = (yy) => {
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pad, yy);
    ctx.lineTo(w - pad, yy);
    ctx.stroke();
    ctx.restore();
  };
  dashed(110);

  ctx.textAlign = 'left';
  setFont(ctx, { w: 800, size: 20, family: '"Azeret Mono", monospace' });
  ctx.fillText(t('imgSpentOn'), pad, 142);

  let yy = 142 + lineH;
  setFont(ctx, { w: 400, size: 19, family: '"Azeret Mono", monospace' });
  let interestY = null;
  for (const l of top) {
    const val = num(l.amount);
    const vw = ctx.measureText(val).width;
    const label = fit(ctx, l.short, w - pad * 2 - vw - 30);
    const lw = ctx.measureText(label).width;
    ctx.fillText(label, pad, yy);
    ctx.textAlign = 'right';
    ctx.fillText(val, w - pad, yy);
    ctx.textAlign = 'left';
    // puntos guía
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.setLineDash([2, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pad + lw + 8, yy - 5);
    ctx.lineTo(w - pad - vw - 8, yy - 5);
    ctx.stroke();
    ctx.restore();
    if (l.key === 'intereses') {
      interestY = yy;
      yy += noteGap;
    }
    yy += lineH;
  }
  if (rest > 0) {
    ctx.globalAlpha = 0.7;
    ctx.fillText(t('imgMore', { n: rest }), pad, yy);
    ctx.globalAlpha = 1;
    yy += lineH;
  }
  dashed(yy - 14);
  yy += 22;
  setFont(ctx, { w: 800, size: 26, family: '"Azeret Mono", monospace' });
  ctx.fillText(t('tTotal'), pad, yy);
  ctx.textAlign = 'right';
  ctx.fillText(eur(r.total), w - pad, yy);
  ctx.textAlign = 'center';
  setFont(ctx, { w: 400, size: 18, family: '"Azeret Mono", monospace' });
  ctx.fillText(t('tNoRefunds'), w / 2, yy + 48);

  // círculo de boli en "Intereses de la deuda"
  if (interestY != null) {
    ctx.save();
    ctx.strokeStyle = C.boli;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    const cx = w / 2;
    const cy = interestY - 7;
    const rx = w / 2 - 12;
    const ry = 24;
    ctx.beginPath();
    for (let t = 0; t <= Math.PI * 2.12; t += 0.04) {
      const wobble = 1 + 0.03 * Math.sin(t * 3);
      const px = cx + Math.cos(t + 0.35) * rx * wobble;
      const py = cy + Math.sin(t + 0.35) * ry * (1 + t * 0.02);
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.fillStyle = C.boli;
    ctx.translate(w - 24, interestY + 54);
    ctx.rotate((-2.5 * Math.PI) / 180);
    ctx.textAlign = 'right';
    setFont(ctx, { w: 400, size: 44, family: '"Nanum Pen Script", cursive' });
    ctx.fillText(t('penNote'), 0, 0);
    ctx.restore();
  }

  ctx.restore();
  return h;
}

function drawSpicyRow(ctx, label, emoji, amount, x, y, w, prefix = '') {
  const h = 72;
  ctx.fillStyle = '#fff';
  ctx.fillRect(x, y, w, h);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = C.negro;
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = C.negro;
  ctx.textAlign = 'left';
  setFont(ctx, { w: 700, size: 25 });
  const priceW = 170;
  const lines = wrap(ctx, `${emoji} ${label}`, w - priceW - 30);
  const ly = lines.length > 1 ? y + 31 : y + 45;
  lines.slice(0, 2).forEach((t, i) => ctx.fillText(t, x + 16, ly + i * 28));
  if (prefix) {
    setFont(ctx, { w: 700, size: 18 });
    ctx.textAlign = 'right';
    ctx.fillText(prefix, x + w - 16, y + 22);
  }
  drawPrice(ctx, amount, x + w - 16, y + h - 12, prefix ? 46 : 54, C.rojo, 'right');
}

export async function renderShareImage(r, url) {
  await loadFonts();
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = C.amarillo;
  ctx.fillRect(0, 0, W, H);

  // Cabecera
  ctx.fillStyle = C.negro;
  ctx.textBaseline = 'alphabetic';
  setFont(ctx, { w: 900, size: 40, stretch: 'expanded' });
  ctx.fillText('¿Y mi pasta?', M, 96);

  setFont(ctx, { w: 800, size: 64, stretch: 'semi-expanded' });
  ctx.fillText(t('imgYouPut'), M, 206);
  drawPrice(ctx, r.total, M - 4, 418, 236, C.rojo);
  setFont(ctx, { w: 700, size: 36, stretch: 'semi-expanded' });
  ctx.fillStyle = C.negro;
  ctx.fillText(t('imgInTaxes'), M, 482);

  // Columna izquierda
  const colW = 420;
  drawCalendar(ctx, r.date, M, 566);
  ctx.fillStyle = C.negro;
  setFont(ctx, { w: 800, size: 34 });
  const libLines = wrap(ctx, t('imgWorkUntil', { until: dates.until(r.date) }), colW - 230);
  libLines.forEach((t, i) => ctx.fillText(t, M + 222, 640 + i * 42));

  const sp = Object.fromEntries(r.spicy.map((s) => [s.key, s]));
  const rows = [
    [t('imgRowCorrupcion'), '✉️', sp.corrupcion.amount, t('imgUpTo')],
    [t('imgRowMarruecos'), '🛂', sp.marruecos.amount],
    [t('imgRowCasaReal'), '👑', sp.casareal.amount],
    [t('imgRowIgualdad'), '♀️', sp.igualdad.amount],
    [t('imgRowLgtbi'), '🏳️‍🌈', sp.lgtbi.amount],
  ];
  rows.forEach(([label, emoji, amount, prefix], i) => {
    drawSpicyRow(ctx, label, emoji, amount, M, 828 + i * 84, colW, prefix);
  });

  // Ticket a la derecha
  drawReceipt(ctx, r, 536, 530, 480);

  // Pie
  ctx.fillStyle = C.negro;
  ctx.textAlign = 'left';
  setFont(ctx, { w: 800, size: 34 });
  const shown = (url || SITE.url || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  ctx.fillText(shown ? t('imgCta', { url: shown }) : t('imgCtaNoUrl'), M, H - 72);
  setFont(ctx, { w: 400, size: 21 });
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.fillText(t('imgData'), M, H - 36);

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/png'));
}
