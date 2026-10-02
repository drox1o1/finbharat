import { createHash } from 'node:crypto';
import { isProductionBuild } from './build-environment.mjs';
import { mkdir, writeFile, rename } from 'node:fs/promises';
import { defaultContent } from '../src/cms/defaults.mjs';
import { fetchContent, assertLaunchReady } from '../src/cms/adapter.mjs';
import copy from '../src/cms/copy-defaults.json' with { type: 'json' };

const production = isProductionBuild();
if (production && !process.env.CMS_URL) throw new Error('Production requires CMS_URL. Configure the client-owned WordPress dashboard first.');
const content = process.env.CMS_URL ? await fetchContent(process.env.CMS_URL) : structuredClone(defaultContent);
if (!process.env.CMS_URL) {
  content.site.copy = copy.site;
  for (const [path, fields] of Object.entries(copy.pages)) content.pages[path].fields.copy = fields;
}
if (production) assertLaunchReady(content, process.env.SITE_URL);
content.build = { source: process.env.CMS_URL ? 'wordpress' : 'local', fetchedAt: new Date().toISOString(), revision: createHash('sha256').update(JSON.stringify(content)).digest('hex') };
await mkdir('src/generated', { recursive: true });
await writeFile('src/generated/content.tmp', JSON.stringify(content));
await rename('src/generated/content.tmp', 'src/generated/content.json');
console.log(`Content prepared: ${process.env.CMS_URL ? 'WordPress' : 'local editorial defaults'}, ${content.blog.length} posts, ${content.media.length} newsroom entries, ${content.caseStudies.length} illustrative case studies.`);
