// ¿Y mi pasta? · Cálculo de impuestos de un asalariado en 2026
// Caso tipo: contrato indefinido, régimen general, una sola persona,
// sin hijos, menor de 65 años, sin otras rentas. Escala autonómica
// supletoria (igual a la estatal). Cada CCAA tiene la suya: la diferencia
// suele ser de unos cientos de euros al año. En euskera, IRPF foral vasco.

export const P = {
  year: 2026,
  ss: {
    // Orden PJC/297/2026: base máxima 5.101,20 €/mes
    baseMaxMonthly: 5101.2,
    // Trabajador: contingencias comunes 4,70 + desempleo 1,55 + formación 0,10 + MEI 0,15
    worker: 4.7 + 1.55 + 0.1 + 0.15, // 6,50 %
    // Empresa: CC 23,60 + desempleo 5,50 + FOGASA 0,20 + formación 0,60 + MEI 0,75
    // + accidentes de trabajo (varía según actividad; usamos 1,50 % como valor típico)
    employer: 23.6 + 5.5 + 0.2 + 0.6 + 0.75 + 1.5, // 32,15 %
    // Cuota de solidaridad 2026 sobre lo que supera la base máxima
    solidarity: [
      { upTo: 1.1, rate: 1.15 },
      { upTo: 1.5, rate: 1.25 },
      { upTo: Infinity, rate: 1.46 },
    ],
    // Se reparte como las contingencias comunes: 4,70 / 28,30 a cargo del trabajador
    solidarityWorkerShare: 4.7 / 28.3,
  },
  irpf: {
    otrosGastos: 2000,
    // Reducción por rendimientos del trabajo (art. 20 LIRPF), sobre el rendimiento
    // neto previo (íntegros menos cotizaciones, antes de los 2.000 € de otros gastos)
    red: { full: 7302, t1: 14852, t2: 17673.52, t3: 19747.5, k1: 1.75, mid: 2364.34, k2: 1.14 },
    minimoPersonal: 5550,
    // Escala estatal + autonómica supletoria
    scale: [
      [12450, 19],
      [20200, 24],
      [35200, 30],
      [60000, 37],
      [300000, 45],
      [Infinity, 47],
    ],
    // Deducción para rentas bajas 2026: 590,89 € hasta el SMI (17.094 €),
    // baja 0,20 € por cada euro de más y desaparece en 20.048,45 €
    smi: { threshold: 17094, max: 590.89, k: 0.2 },
  },
  // IRPF foral de Araba, Bizkaia y Gipuzkoa en 2026 (igual en los tres territorios).
  // Se usa en la versión en euskera (setRegime('foral')): no preguntamos dónde vive cada uno.
  // Escala deflactada un 2 %: NF 7/2025 Bizkaia, art. 49; NF 21/2025 Álava; NF 6/2025 Gipuzkoa.
  irpfForal: {
    // Bonificación por rendimientos del trabajo (art. 23), sobre íntegros menos cotizaciones
    bonif: { full: 8000, t1: 14800, t2: 23000, k: 0.6098, min: 3000 },
    scale: [
      [18080, 23],
      [36160, 28],
      [54240, 35],
      [77450, 40],
      [107260, 45],
      [142960, 46],
      [208390, 47],
      [Infinity, 49],
    ],
    // Minoración general de cuota (art. 77); la cuota no puede quedar negativa
    minoracion: 1615,
    // Con solo rendimientos del trabajo de hasta 20.000 € íntegros no hay obligación de
    // declarar (art. 102) y la retención de 2026 es del 0 %: en la práctica no se paga IRPF
    noDeclara: 20000,
  },
  // IVA e impuestos especiales: estimación. Suponemos que gastas entre el 95 %
  // (sueldos netos de hasta 15.000 €) y el 65 % (80.000 € o más) de tu sueldo
  // neto, y que el ~10 % de lo que gastas son impuestos indirectos.
  indirect: { rate: 0.1, cHigh: 0.95, cLow: 0.65, nLow: 15000, nHigh: 80000 },
};

const round2 = (x) => Math.round(x * 100) / 100;

function scaleTax(base, scale) {
  let tax = 0;
  let prev = 0;
  for (const [limit, rate] of scale) {
    if (base <= prev) break;
    tax += (Math.min(base, limit) - prev) * (rate / 100);
    prev = limit;
  }
  return tax;
}

function solidarityTotal(excess, cap) {
  // excess: euros por encima de la base máxima anual
  let left = excess;
  let prevFactor = 1;
  let total = 0;
  for (const { upTo, rate } of P.ss.solidarity) {
    const span = upTo === Infinity ? Infinity : (upTo - prevFactor) * cap;
    const part = Math.min(left, span);
    total += part * (rate / 100);
    left -= part;
    prevFactor = upTo;
    if (left <= 0) break;
  }
  return total;
}

export function socialSecurity(gross) {
  const cap = P.ss.baseMaxMonthly * 12;
  const base = Math.min(gross, cap);
  const excess = Math.max(0, gross - cap);
  const sol = solidarityTotal(excess, cap);
  const solWorker = sol * P.ss.solidarityWorkerShare;
  return {
    worker: base * (P.ss.worker / 100) + solWorker,
    employer: base * (P.ss.employer / 100) + (sol - solWorker),
  };
}

// Régimen común (todas las comunidades salvo País Vasco y Navarra) o foral vasco
let regime = 'comun';
export function setRegime(r) {
  regime = r === 'foral' ? 'foral' : 'comun';
}

function irpfForal(gross, ssWorker) {
  const r = P.irpfForal;
  const d = Math.max(0, gross - ssWorker);
  let bonif = r.bonif.min;
  if (d <= r.bonif.t1) bonif = r.bonif.full;
  else if (d <= r.bonif.t2) bonif = r.bonif.full - r.bonif.k * (d - r.bonif.t1);
  const base = Math.max(0, d - bonif);
  const cuotaIntegra = Math.max(0, scaleTax(base, r.scale) - r.minoracion);
  return { base, cuotaIntegra, cuota: gross <= r.noDeclara ? 0 : cuotaIntegra };
}

export function irpf(gross, ssWorker) {
  if (regime === 'foral') return irpfForal(gross, ssWorker);
  const r = P.irpf;
  const previo = Math.max(0, gross - ssWorker);
  let red = 0;
  if (previo <= r.red.t1) red = r.red.full;
  else if (previo <= r.red.t2) red = r.red.full - r.red.k1 * (previo - r.red.t1);
  else if (previo <= r.red.t3) red = r.red.mid - r.red.k2 * (previo - r.red.t2);
  const otros = Math.min(r.otrosGastos, previo);
  const base = Math.max(0, previo - otros - red);
  const cuota = Math.max(0, scaleTax(base, r.scale) - scaleTax(Math.min(base, r.minimoPersonal), r.scale));
  let ded = 0;
  if (gross <= r.smi.threshold) ded = r.smi.max;
  else ded = Math.max(0, r.smi.max - r.smi.k * (gross - r.smi.threshold));
  return { base, cuotaIntegra: cuota, deduccionSMI: Math.min(ded, cuota), cuota: Math.max(0, cuota - ded) };
}

export function consumptionShare(net) {
  const { cHigh, cLow, nLow, nHigh } = P.indirect;
  if (net <= nLow) return cHigh;
  if (net >= nHigh) return cLow;
  return cHigh - ((net - nLow) / (nHigh - nLow)) * (cHigh - cLow);
}

// Todo el cálculo a partir del bruto anual
export function fromGross(gross, opts = {}) {
  const { employer = true, indirect = true } = opts;
  const ss = socialSecurity(gross);
  const ir = irpf(gross, ss.worker);
  const net = gross - ss.worker - ir.cuota;
  const ind = net * consumptionShare(net) * P.indirect.rate;
  const parts = {
    irpf: round2(ir.cuota),
    ssWorker: round2(ss.worker),
    ssEmployer: employer ? round2(ss.employer) : 0,
    indirect: indirect ? round2(ind) : 0,
  };
  const total = parts.irpf + parts.ssWorker + parts.ssEmployer + parts.indirect;
  // Lo que cuestas: bruto + lo que paga tu empresa (si lo contamos)
  const laborCost = gross + parts.ssEmployer;
  return {
    gross,
    net: round2(net),
    parts,
    total: round2(total),
    laborCost: round2(laborCost),
    effective: laborCost > 0 ? total / laborCost : 0,
    irpfDetail: ir,
  };
}

// Del neto anual al bruto anual (búsqueda binaria)
export function grossFromNet(netAnnual) {
  let lo = 0;
  let hi = Math.max(10000, netAnnual * 3);
  // En el foral, al pasar de 20.000 € brutos el IRPF salta de 0 a unos 1.400 €.
  // Si el neto cabe por debajo de ese salto, esa es la respuesta.
  if (regime === 'foral') {
    const cliff = P.irpfForal.noDeclara;
    if (fromGross(cliff).net >= netAnnual) hi = cliff;
    else lo = cliff + 0.01;
  }
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (fromGross(mid).net < netAnnual) lo = mid;
    else hi = mid;
  }
  return round2((lo + hi) / 2);
}

// Día del año en que dejas de trabajar para pagar impuestos
export function liberationDate(effective, year = P.year) {
  const days = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
  const n = Math.min(days, Math.max(1, Math.round(effective * days)));
  return new Date(year, 0, n);
}
