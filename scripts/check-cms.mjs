import { createHash } from 'node:crypto';
import { fetchContent } from '../src/cms/adapter.mjs';
const url = process.env.CMS_URL;
if (!url) throw new Error('Set CMS_URL to your WordPress origin. For the local demo use http://127.0.0.1:8088.');
const content = await fetchContent(url);
const revision = createHash('sha256').update(JSON.stringify(content)).digest('hex');
console.log(`WordPress connection works: ${Object.keys(content.pages).length} templates, ${content.blog.length} blogs, ${content.media.length} newsroom entries, ${content.caseStudies.length} case studies.`);
console.log(`Published CMS revision: ${revision}`);
for (const item of content.caseStudies) console.log(`Case study: ${item.title} → ${item.path}`);
if (process.env.WEBSITE_URL) {
  const response = await fetch(new URL('/.well-known/finbharat-content.json', process.env.WEBSITE_URL), { signal: AbortSignal.timeout(20000), cache: 'no-store' });
  if (!response.ok) throw new Error(`Website content diagnostic unavailable (${response.status}).`);
  const deployed = await response.json();
  console.log(`Website source: ${deployed.source}; fetched at: ${deployed.fetchedAt}`);
  if (deployed.source !== 'wordpress' || deployed.revision !== revision) {
    process.exitCode = 1;
    console.error('Website does not yet match the published CMS revision. Check the Vercel deployment log, wait for Ready, and retry.');
  } else console.log('Website matches the currently published WordPress content.');
}
