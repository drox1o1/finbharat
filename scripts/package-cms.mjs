import { mkdir, writeFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { defaultContent } from '../src/cms/defaults.mjs';
import copy from '../src/cms/copy-defaults.json' with { type: 'json' };

const seed = structuredClone(defaultContent);
seed.site.copy = copy.site;
for (const [path, fields] of Object.entries(copy.pages)) seed.pages[path].fields.copy = fields;
await writeFile('wordpress/finbharat-content/seed.json', JSON.stringify(seed, null, 2) + '\n');
await writeFile('wordpress/finbharat-content/copy-labels.json', JSON.stringify(copy.labels, null, 2) + '\n');
await mkdir('output/cms', { recursive: true });
await rm('output/cms/finbharat-content.zip', { force: true });
const result = spawnSync('zip', ['-r', '../output/cms/finbharat-content.zip', 'finbharat-content'], { cwd: 'wordpress', encoding: 'utf8' });
if (result.status !== 0) throw new Error(result.stdout + result.stderr);
console.log('WordPress plugin packaged at output/cms/finbharat-content.zip');
