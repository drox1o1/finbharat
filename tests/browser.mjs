import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const cliRequire = createRequire(new URL('../node_modules/@playwright/cli/package.json', import.meta.url));
const { chromium } = cliRequire('playwright-core');

await mkdir('output/playwright', { recursive: true });
const config = 'output/playwright/verification-config.json';
await writeFile(config, JSON.stringify({ browser: { browserName: 'chromium', launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || chromium.executablePath(), headless: true }, contextOptions: { viewport: { width: 1440, height: 1000 } } } }));
const run = args => {
  const result = spawnSync('npx', ['playwright-cli', '-s=finbharat-verification', ...args], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  if (result.status !== 0 || result.stdout.includes('### Error')) throw new Error(result.stdout + result.stderr);
  return result.stdout;
};
try {
  run(['open', 'http://localhost:4173/', `--config=${config}`]);
  const output = run(['run-code', '--filename=tests/browser-checks.js']);
  const json = output.split('### Result\n')[1]?.split('\n### ')[0]?.trim();
  if (!json) throw new Error(output);
  const report = JSON.parse(json);
  await writeFile('output/playwright/verification.json', JSON.stringify(report, null, 2));
  console.log(`Passed ${report.responsive.length} responsive layouts, ${report.accessibility.length} accessibility scans, ${report.interactions.length} interaction groups. No console errors.`);
} finally { run(['close']); }
