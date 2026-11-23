// Comprueba public/tax.js con cifras oficiales publicadas.
// Si cambias una escala o un tipo, estos casos tienen que seguir saliendo.
// Ejecutar: npm test

import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { fromGross, grossFromNet, setRegime, liberationDate } from '../public/tax.js';

const close = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: sale ${a}, se esperaba ${b}`);

afterEach(() => setRegime('comun'));

test('SMI de 2026 (17.094 €): la cuota es 590,89 € y la deducción la deja en 0 (Hacienda)', () => {
  const r = fromGross(17094);
  close(r.irpfDetail.cuotaIntegra, 590.89, 0.01, 'Cuota antes de la deducción');
  close(r.irpfDetail.deduccionSMI, 590.89, 0.01, 'Deducción para rentas bajas');
  assert.equal(r.parts.irpf, 0);
});

test('la deducción para rentas bajas desaparece en 20.048,45 €', () => {
  close(fromGross(20048.45).irpfDetail.deduccionSMI, 0, 0.01, 'Deducción en 20.048,45 €');
  assert.equal(fromGross(25000).irpfDetail.deduccionSMI, 0);
});

test('cotización: 6,50 % del trabajador y 32,15 % de la empresa por debajo de la base máxima', () => {
  const r = fromGross(30000);
  close(r.parts.ssWorker, 1950, 0.01, 'Cotización del trabajador');
  close(r.parts.ssEmployer, 9645, 0.01, 'Cotización de la empresa');
});

test('por encima de la base máxima (5.101,20 € al mes) solo se suma la cuota de solidaridad', () => {
  const cap = 5101.2 * 12;
  const atCap = fromGross(cap).parts.ssWorker;
  close(atCap, cap * 0.065, 0.01, 'Cotización en la base máxima');
  const above = fromGross(cap + 10000).parts.ssWorker - atCap;
  assert.ok(above > 0 && above < 10000 * 0.01, `10.000 € por encima de la base máxima suman ${above} € de cotización`);
});

test('IRPF foral vasco: 30.000 € brutos → 4.495 € (tabla de retenciones de 2026)', () => {
  setRegime('foral');
  close(fromGross(30000).parts.irpf, 4495, 1, 'IRPF foral con 30.000 €');
});

test('IRPF foral vasco: hasta 20.000 € no se paga', () => {
  setRegime('foral');
  assert.equal(fromGross(20000).parts.irpf, 0);
  assert.ok(fromGross(20001).parts.irpf > 0);
});

test('más sueldo bruto siempre deja más neto (régimen común)', () => {
  let prev = -1;
  for (let g = 0; g <= 250000; g += 250) {
    const net = fromGross(g).net;
    assert.ok(net >= prev, `Con ${g} € brutos el neto (${net} €) baja respecto a ${g - 250} €`);
    prev = net;
  }
});

test('ningún impuesto sale negativo', () => {
  for (const regime of ['comun', 'foral']) {
    setRegime(regime);
    for (let g = 0; g <= 400000; g += 1000) {
      for (const [k, v] of Object.entries(fromGross(g).parts)) assert.ok(v >= 0, `${regime}, ${g} €: ${k} = ${v}`);
    }
  }
});

test('del neto al bruto y vuelta da lo mismo', () => {
  for (const regime of ['comun', 'foral']) {
    setRegime(regime);
    for (const g of [12000, 17094, 21000, 30000, 45000, 70000, 150000]) {
      const net = fromGross(g).net;
      close(fromGross(grossFromNet(net)).net, net, 0.05, `${regime}: neto de ${g} € brutos`);
    }
  }
});

test('el día de liberación cae dentro de 2026', () => {
  for (const eff of [0, 0.2, 0.45, 1]) {
    assert.equal(liberationDate(eff).getFullYear(), 2026);
  }
});
