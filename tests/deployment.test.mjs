import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { contentMode } from '../scripts/build-environment.mjs';

test('explicit demo mode is separate from final launch and never masks a configured CMS failure', () => {
  assert.equal(contentMode({ VERCEL_ENV: 'production' }, 'demo'), 'demo');
  assert.equal(contentMode({ CMS_URL: 'https://cms.example.test' }, 'demo'), 'wordpress');
  assert.equal(contentMode({ PRODUCTION_LAUNCH: '1' }, 'demo'), 'wordpress');
  assert.throws(() => contentMode({ CONTENT_MODE: 'demo', PRODUCTION_LAUNCH: '1' }, 'demo'), /Final launch/);
  assert.throws(() => contentMode({ CONTENT_MODE: 'typo' }, 'demo'), /CONTENT_MODE/);
});

test('a clean Vercel production environment can prepare the portable demo while hosted CMS launch remains gated', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'finbharat-deployment-'));
  const env = { ...process.env, CMS_URL: '', CONTENT_MODE: '', SITE_URL: '', PRODUCTION_LAUNCH: '0', VERCEL_ENV: 'production', VERCEL_TARGET_ENV: 'production' };
  try {
    const run = extra => spawnSync(process.execPath, [resolve('scripts/prepare-content.mjs')], { cwd: directory, env: { ...env, ...extra }, encoding: 'utf8' });
    const demo = run({});
    assert.equal(demo.status, 0, demo.stderr);
    const saved = await readFile(join(directory, 'src/generated/content.json'), 'utf8');
    const content = JSON.parse(saved);
    assert.equal(content.build.source, 'demo-snapshot');
    assert.equal(content.blog.length, 2);
    assert.equal(content.media.length, 2);
    assert.equal(content.caseStudies.length, 3);
    assert.doesNotMatch(saved, /https?:\/\/(localhost|127\.0\.0\.1)/);
    for (const options of [{ CONTENT_MODE: 'wordpress' }, { PRODUCTION_LAUNCH: '1' }, { CMS_URL: 'http://localhost:8088' }]) {
      const failed = run(options);
      assert.notEqual(failed.status, 0);
      assert.equal(await readFile(join(directory, 'src/generated/content.json'), 'utf8'), saved);
    }
  } finally { await rm(directory, { recursive: true, force: true }); }
});
