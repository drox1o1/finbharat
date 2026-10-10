import { access, readdir, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { fetchContent } from '../src/cms/adapter.mjs';

if (!process.env.CMS_URL) throw new Error('Set CMS_URL to the local WordPress origin to export published demo content.');
const content = await fetchContent(process.env.CMS_URL);
const files = await readdir('public', { recursive: true, withFileTypes: true });
const assets = files.filter(entry => entry.isFile()).map(entry => resolve(entry.parentPath, entry.name));
const loopbackURL = /https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?[^\s"'<>]*/g;
function rewrite(value) {
  if (typeof value === 'string') return value.replace(loopbackURL, match => {
    const filename = basename(decodeURIComponent(new URL(match).pathname));
    const matches = assets.filter(path => basename(path) === filename);
    if (matches.length !== 1) throw new Error(`Bundle the public asset for ${filename} before exporting. Expected one matching file in public/.`);
    return '/' + matches[0].slice(resolve('public').length + 1).replaceAll('\\', '/');
  });
  if (Array.isArray(value)) return value.map(rewrite);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, rewrite(item)]));
  return value;
}
const snapshot = rewrite(content);
// A demo uses bundled files or public HTTPS media, never local WordPress uploads.
async function verifyAssets(value) {
  if (typeof value === 'string') {
    for (const match of value.matchAll(/(?:src=["']|^)(\/(?:art|badges|brand|editorial|people|press|founders|video|case-studies)\/[^\s"'<>]+)/g)) { if (/\.[a-z0-9]{2,5}$/i.test(match[1])) await access(resolve('public', match[1].slice(1))); }
  } else if (value && typeof value === 'object') await Promise.all(Object.values(value).map(verifyAssets));
}
await verifyAssets(snapshot);
await writeFile('content/demo-content.json', JSON.stringify(snapshot, null, 2) + '\n');
console.log(`Demo snapshot exported: ${snapshot.blog.length} blogs, ${snapshot.media.length} coverage entries, ${snapshot.caseStudies.length} case studies. Review and commit the public snapshot to update Vercel.`);
