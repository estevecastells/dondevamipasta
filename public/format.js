// Formato de números (1.234,56), el mismo en castellano, catalán, euskera y gallego,
// sin depender de Intl, que en es-ES no agrupa los números de cuatro cifras.

export function num(n, dec = 2) {
  const neg = n < 0;
  const [i, d] = Math.abs(n).toFixed(dec).split('.');
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (neg ? '-' : '') + int + (dec > 0 ? ',' + d : '');
}

export const eur = (n, dec = 2) => `${num(n, dec)} €`;

// Euros sin céntimos cuando la cifra es grande, con céntimos cuando es pequeña
export const eurSmart = (n) => (Math.abs(n) >= 100 ? eur(n, 0) : eur(n, 2));

// Parte entera y céntimos por separado, para las etiquetas de precio
export function priceParts(n) {
  const [i, d] = num(n, 2).split(',');
  return { int: i, cents: d };
}

// Acepta "1.800", "1800", "1,800.50", "30.000,00", "30k", "2.000 €"
export function parseAmount(raw) {
  let s = String(raw).trim().toLowerCase().replace(/€|\s|euros?/g, '');
  let mult = 1;
  if (s.endsWith('k')) {
    mult = 1000;
    s = s.slice(0, -1);
  }
  if (!s) return NaN;
  const hasDot = s.includes('.');
  const hasComma = s.includes(',');
  if (hasDot && hasComma) {
    s = s.lastIndexOf(',') > s.lastIndexOf('.') ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  } else if (hasComma) {
    s = /^\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, '') : s.replace(',', '.');
  } else if (hasDot) {
    if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  }
  if (!/^\d*\.?\d*$/.test(s)) return NaN;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n * mult : NaN;
}

// Los meses y días de la semana, en cada idioma, están en i18n/dates.js
export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
