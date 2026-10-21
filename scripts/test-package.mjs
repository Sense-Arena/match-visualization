import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const temp = mkdtempSync(join(tmpdir(), 'sa-mv-package-'));
const npmCli =
  process.platform === 'win32'
    ? join(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js')
    : realpathSync(spawnSync('which', ['npm'], { encoding: 'utf8' }).stdout.trim());

function run(command, args, cwd = temp) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', timeout: 180_000 });
  assert.equal(result.status, 0, `${command} ${args.join(' ')}\n${result.error ?? ''}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
const npm = (args, cwd) => run(process.execPath, [npmCli, ...args], cwd);

try {
  const [pack] = JSON.parse(npm(['pack', '--ignore-scripts', '--json', '--pack-destination', temp], root));
  const files = new Set(pack.files.map(file => file.path));
  for (const path of [
    manifest.main,
    manifest.module,
    manifest.types,
    './dist/index.d.cts',
    manifest.exports['./theme.css'],
  ]) {
    assert(files.has(path.replace(/^\.\//, '')), `Missing packed file: ${path}`);
  }
  assert(![...files].some(file => /(?:^|\/)(?:stories|src|node_modules|storybook-static)\//.test(file)));
  assert(!files.has('dist/stats.html'), 'Analysis report must not be published');
  assert(manifest.sideEffects.includes('**/*.css'), 'CSS must survive tree shaking');
  for (const name of readdirSync(join(root, 'imgs/tennis-courts'))) {
    assert(files.has(`imgs/tennis-courts/${name}`), `Missing packed image: ${name}`);
  }

  writeFileSync(join(temp, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  npm([
    'install',
    '--strict-peer-deps',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--save-exact',
    join(temp, pack.filename),
    `typescript@${manifest.devDependencies.typescript}`,
    `@types/react@${manifest.devDependencies['@types/react']}`,
    `@types/react-dom@${manifest.devDependencies['@types/react-dom']}`,
  ]);

  const consumer = `
import { createElement } from 'react';
import { SettingsCourt, StartType, settingsDefaultValues, saveMSSettings, type MSSavePayload } from '@sensearena/mv';
saveMSSettings({ ...settingsDefaultValues, type: StartType.Serve });
const save = async (_payload: MSSavePayload) => {};
const element = createElement(SettingsCourt, { createMS: save, editMS: save, loading: false, goBack() {} });
void element;
`;
  writeFileSync(join(temp, 'consumer.mts'), consumer);
  writeFileSync(join(temp, 'consumer.cts'), consumer);
  writeFileSync(join(temp, 'index.html'), '<div id="root"></div><script type="module" src="/main.js"></script>');
  writeFileSync(
    join(temp, 'main.js'),
    `
import '@sensearena/ui/theme.css';
import '@sensearena/mv/theme.css';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { SettingsCourt, settingsDefaultValues, saveMSSettings, forwardCourtStep, predefinedCourtSteps } from '@sensearena/mv';
saveMSSettings(settingsDefaultValues);
forwardCourtStep(predefinedCourtSteps[settingsDefaultValues.type][0]);
createRoot(document.getElementById('root')).render(createElement(SettingsCourt, {
  createMS: async () => {}, editMS: async () => {}, goBack() {}, loading: false,
}));
`,
  );
  writeFileSync(join(temp, 'vite.config.mjs'), 'export default {};');
  writeFileSync(
    join(temp, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        strict: true,
        noEmit: true,
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        types: ['react', 'react-dom'],
      },
      include: ['consumer.mts', 'consumer.cts'],
    }),
  );

  writeFileSync(
    join(temp, 'runtime.mjs'),
    `
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import * as esm from '@sensearena/mv';
const require = createRequire(import.meta.url);
const cjs = require('@sensearena/mv');
assert.deepEqual(Object.keys(esm).sort(), Object.keys(cjs).sort(), 'ESM and CJS public exports differ');
assert(require.resolve('@sensearena/mv/theme.css').endsWith('mv.css'));
for (const mv of [esm, cjs]) {
  const { UVector, UwU, CourtItem, calcUnityValues, extractCombinedKey } = mv;
  assert.deepEqual(extractCombinedKey('ball_move__trades-2'), { courtStep: 'ball_move', tradeKey: 'trades-2', tradeOrder: 2 });
  for (const item of Object.values(CourtItem)) {
    const point = { x: 120, y: 350, width: 600, height: 1000, item };
    const unity = calcUnityValues(point);
    const canvas = UwU.convertUVToCanvas(new UVector(unity.x, 0, unity.y), point.height, point.width, item);
    assert(Math.abs(canvas.x - point.x) <= 1 && Math.abs(canvas.y - point.y) <= 1, 'Coordinate conversion changed');
  }
  mv.resetMSState();
  mv.saveMSSettings({ ...mv.settingsDefaultValues, title: 'Package smoke test' });
  mv.forwardCourtStep(mv.predefinedCourtSteps[mv.StartType.Serve][0]);
  assert.equal(mv.$msSettings.getState().settings.title, 'Package smoke test');
  assert.equal(mv.$msSettings.getState().courtStepsHistory.length, 1);
  const html = renderToString(createElement(mv.SettingsCourt, {
    createMS: async () => {}, editMS: async () => {}, goBack() {}, loading: false,
  }));
  assert(html.includes('tennis court surface') && html.includes('Opponent side'), 'Court failed to render');
  mv.backCourtStep();
  assert.equal(mv.$msSettings.getState().courtStepsHistory.length, 0);
  mv.resetMSState();
}
console.log('ESM/CJS imports, public exports, CSS resolution, SSR, coordinates and Effector events passed');
`,
  );

  function check(label) {
    npm(['ls', '--all']);
    run(process.execPath, [join(temp, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.json']);
    console.log(run(process.execPath, ['runtime.mjs']).trim());
    run(process.execPath, [join(root, 'node_modules/vite/bin/vite.js'), 'build', '--config', 'vite.config.mjs']);
    const bundledCss = readdirSync(join(temp, 'dist/assets'))
      .filter(name => name.endsWith('.css'))
      .map(name => readFileSync(join(temp, 'dist/assets', name), 'utf8'))
      .join('\n');
    const selector = readFileSync(join(root, 'dist/mv.css'), 'utf8').match(/\.[_a-zA-Z][\w-]*/)[0];
    assert(bundledCss.includes(selector), 'Consumer build discarded the library stylesheet');
    console.log(`${label}: clean npm install, strict ESM/CJS types and Vite consumer build with CSS passed`);
  }
  check('MUI 9');
  npm([
    'install',
    '--strict-peer-deps',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--save-exact',
    '@mui/material@7.3.9',
  ]);
  check('MUI 7');
  npm(['install', '--strict-peer-deps', '--ignore-scripts', '--no-audit', '--no-fund', '--save-exact', '@mui/material@7.0.0']);
  check('MUI 7 minimum');
  console.log(`Package verified: ${pack.filename}, ${pack.entryCount} files`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
