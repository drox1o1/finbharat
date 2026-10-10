import { createHash } from 'node:crypto';
import { contentMode, isProductionBuild } from './build-environment.mjs';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { fetchContent, assertLaunchReady } from '../src/cms/adapter.mjs';

const production = isProductionBuild();
const deployment = JSON.parse(await readFile(new URL('../content/deployment.json', import.meta.url), 'utf8'));
const mode = contentMode(process.env, deployment.mode);
if (mode === 'wordpress' && !process.env.CMS_URL) throw new Error('WordPress mode requires CMS_URL. Configure a hosted WordPress origin, or use CONTENT_MODE=demo for the saved demo.');
if (mode === 'wordpress' && production) {
  const origin = new URL(process.env.CMS_URL);
  if (origin.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)) throw new Error('Production CMS_URL must be a public HTTPS WordPress origin. Localhost WordPress cannot be reached from Vercel.');
}
const content = mode === 'wordpress' ? await fetchContent(process.env.CMS_URL) : JSON.parse(await readFile(new URL('../content/demo-content.json', import.meta.url), 'utf8'));
if (mode === 'wordpress' && production) assertLaunchReady(content, process.env.SITE_URL);
content.build = { source: mode === 'wordpress' ? 'wordpress' : 'demo-snapshot', mode, fetchedAt: new Date().toISOString(), revision: createHash('sha256').update(JSON.stringify(content)).digest('hex') };
await mkdir('src/generated', { recursive: true });
await writeFile('src/generated/content.tmp', JSON.stringify(content));
await rename('src/generated/content.tmp', 'src/generated/content.json');
console.log(`Content prepared: ${content.build.source}, ${content.blog.length} posts, ${content.media.length} newsroom entries, ${content.caseStudies.length} illustrative case studies.`);
if (mode === 'demo') console.log('Demo deployment: saved published content, no live CMS connection, search indexing disabled.');
