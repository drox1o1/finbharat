import { spawnSync } from 'node:child_process';
import { writeFile, readFile, rm } from 'node:fs/promises';
import assert from 'node:assert/strict';
const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, ...options });
  if (result.status !== 0 || result.stdout.includes('### Error')) throw new Error(result.stdout + result.stderr);
  return result.stdout;
};
const wordpress = mode => run('docker', ['compose', '-p', 'finbharat-cms', '-f', 'wordpress/compose.yml', 'run', '--rm', 'cli', 'wp', 'eval-file', '/opt/finbharat-tests/wordpress-browser-fixture.php', mode]);
const browser = args => run('npx', ['playwright-cli', '-s=finbharat-cms-qa', ...args]);
try {
  console.log(wordpress('create'));
  await writeFile('public/video/local-qa.vtt', 'WEBVTT\n\n00:00.000 --> 00:04.000\nLocal QA decorative landscape.\n');
  run('npm', ['run', 'build'], { env: { ...process.env, CMS_URL: 'http://127.0.0.1:8088', CONTEXT: 'test', PRODUCTION_LAUNCH: '0' } });
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  assert(sitemap.includes('/blog/local-qa-blog/') && sitemap.includes('/media/local-qa-media/'));
  assert(!sitemap.includes('local-qa-draft'));
  browser(['open', 'http://localhost:4173/', '--config=output/playwright/verification-config.json']);
  const result = browser(['run-code', '--filename=tests/cms-browser-checks.js']);
  await writeFile('output/playwright/cms-verification.txt', result);
  console.log(result.split('### Ran Playwright code')[0]);
} finally {
  try { browser(['close']); } catch { /* The browser might not have opened. */ }
  console.log(wordpress('cleanup'));
  await rm('public/video/local-qa.vtt', { force: true });
  run('npm', ['run', 'build'], { env: { ...process.env, CMS_URL: '', CONTEXT: 'test', PRODUCTION_LAUNCH: '0' } });
}
