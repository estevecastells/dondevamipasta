// Comprueba que catalán, euskera y gallego tienen todos los textos del castellano,
// con las mismas {variables} y los mismos enlaces (es lo que hace `node tools/i18n.mjs check`),
// y que las páginas de cada idioma se generan sin errores.
// Ejecutar: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const run = (script, ...args) => execFileSync(process.execPath, [join(ROOT, script), ...args], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });

test('las traducciones tienen todos los textos', () => {
  try {
    run('tools/i18n.mjs', 'check');
  } catch (e) {
    assert.fail(`Faltan textos o no coinciden:\n${e.stdout}`);
  }
});

test('las páginas /es, /ca, /eu y /gl se generan', () => {
  try {
    run('tools/build-langs.mjs');
  } catch (e) {
    assert.fail(`tools/build-langs.mjs ha fallado:\n${e.stdout}${e.stderr}`);
  }
});
