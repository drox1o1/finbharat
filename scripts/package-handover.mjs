import { createHash } from 'node:crypto';
import { access, cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { caseSeedFields } from '../src/cms/case-studies.mjs';
import { fetchContent } from '../src/cms/adapter.mjs';

const root = resolve('.');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
if (git('status', '--porcelain')) throw new Error('Commit the complete handover source before packaging.');
const commit = git('rev-parse', 'HEAD');
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const releaseName = `Finbharat-Client-Handover-${date}`;
const destination = resolve('output/handover', releaseName);
const archive = resolve('output/handover', `${releaseName}.zip`);
await rm(destination, { recursive: true, force: true });
await mkdir(join(destination, 'website'), { recursive: true });
const files = git('ls-files', '-z').split('\0').filter(Boolean);
if (!files.length) throw new Error('No versioned source files.');
for (const file of files) {
  if (/(^|\/)(node_modules|output|\.git|\.vercel)(\/|$)/.test(file) || /(^|\/)\.env(\.|$)/.test(file) && file !== '.env.example') throw new Error(`Unexpected private source file: ${file}`);
  const target = join(destination, 'website', file);
  await mkdir(dirname(target), { recursive: true });
  await cp(join(root, file), target);
}
await cp('dist', join(destination, 'website/dist'), { recursive: true });
await mkdir(join(destination, 'cms'), { recursive: true });
await cp('output/cms/finbharat-content.zip', join(destination, 'cms/finbharat-content.zip'));
await cp('scripts/import-handover.php', join(destination, 'cms/import-content.php'));
let content = JSON.parse(await readFile('content/demo-content.json', 'utf8'));
let contentSource = 'committed-demo-snapshot';
if (process.env.HANDOVER_CMS_URL) {
  const cacheKey = Date.now();
  content = await fetchContent(process.env.HANDOVER_CMS_URL, url => fetch(`${url}${url.includes('?') ? '&' : '?'}handover=${cacheKey}`));
  contentSource = 'published-wordpress-export';
}
const publicFiles = await readdir('public', { recursive: true, withFileTypes: true });
const assets = publicFiles.filter(item => item.isFile()).map(item => resolve(item.parentPath, item.name));
const cmsHost = process.env.HANDOVER_CMS_URL ? new URL(process.env.HANDOVER_CMS_URL).hostname : '';
function portable(value) {
  if (typeof value === 'string') return value.replace(/https?:\/\/[^\s"'<>]+/g, url => {
    const parsed = new URL(url);
    if (![cmsHost, 'localhost', '127.0.0.1'].includes(parsed.hostname) || !parsed.pathname.includes('/wp-content/uploads/')) return url;
    const matches = assets.filter(path => basename(path) === basename(decodeURIComponent(parsed.pathname)));
    if (matches.length !== 1) throw new Error(`Bundle uploaded media before handover: ${basename(parsed.pathname)}`);
    return '/' + matches[0].slice(resolve('public').length + 1).replaceAll('\\', '/');
  });
  if (Array.isArray(value)) return value.map(portable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, portable(item)]));
  return value;
}
content = portable(content);
delete content.build;
for (const item of content.caseStudies) item.fields = caseSeedFields(item);
for (const article of [...content.blog, ...content.media, ...content.caseStudies]) if (article.image) await access(join(root, 'public', article.image));
await writeFile(join(destination, 'cms/content.json'), JSON.stringify(content, null, 2) + '\n');
await cp('docs/handover/HANDOVER.md', join(destination, 'HANDOVER.md'));
await cp('docs/handover/START-HERE.html', join(destination, 'START-HERE.html'));
await mkdir(join(destination, 'reference-documents'), { recursive: true });
for (const name of ['FAQ-Finbharat.docx', 'TC -FINBHARAT.docx', 'founder2.jpeg']) {
  let source = resolve('..', name);
  try { await access(source); } catch { source = resolve('..', 'reference-documents', name); }
  await cp(source, join(destination, 'reference-documents', name));
}
const notices = ['Finbharat third party notices', '', 'Dependency versions and licences are recorded below. Full project assets and usage records are in website/docs/assets-provenance.md and website/docs/artwork.md.', ''];
const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
for (const [path, item] of Object.entries(lock.packages)) {
  if (!path || item.dev) continue;
  notices.push(`${path.replace(/^node_modules\//, '')} ${item.version || ''}: ${typeof item.license === 'string' ? item.license : 'See package licence'}`);
  let entries;
  try { entries = await readdir(path); } catch { continue; }
  for (const name of entries.filter(name => /^(licen[sc]e|copying|ofl)(\.|$)/i.test(name))) {
    const target = join(destination, 'licenses', path.replace(/^node_modules\//, ''), name);
    await mkdir(dirname(target), { recursive: true }); await cp(join(path, name), target);
  }
}
await writeFile(join(destination, 'THIRD-PARTY-NOTICES.txt'), notices.join('\n') + '\n');
const release = { project: 'Finbharat', packagedAt: new Date().toISOString(), timezone: 'Asia/Kolkata', sourceCommit: commit, repository: 'https://github.com/drox1o1/finbharat', branch: git('branch', '--show-current'), deploymentMode: 'demo', contentSource, contentCounts: { pages: Object.keys(content.pages).length, blogs: content.blog.length, media: content.media.length, caseStudies: content.caseStudies.length, faqTopics: content.pages['/faq/'].fields.groups.length }, exclusions: ['credentials', 'account tokens', 'deploy hooks', 'database user records', 'revision history', 'dependency caches', 'Git history'], checks: ['npm run lint', 'npm test', 'npm run build', 'fresh WordPress import and content round trip; see website/docs/handover/verification.json'] };
await writeFile(join(destination, 'RELEASE.json'), JSON.stringify(release, null, 2) + '\n');
const packaged = await readdir(destination, { recursive: true, withFileTypes: true });
const sums = [];
for (const item of packaged.filter(item => item.isFile())) {
  const path = join(item.parentPath, item.name); const relative = path.slice(destination.length + 1).replaceAll('\\', '/');
  if (/(^|\/)(\.env(?:\.local)?|wp-config\.php|.*\.private\..*|client-demo-access\.json|client-demo-login\.md|\.DS_Store)$/.test(relative)) throw new Error(`Private file in package: ${relative}`);
  sums.push(`${createHash('sha256').update(await readFile(path)).digest('hex')}  ${relative}`);
}
await writeFile(join(destination, 'SHA256SUMS.txt'), sums.sort().join('\n') + '\n');
await rm(archive, { force: true });
execFileSync('zip', ['-q', '-r', archive, releaseName], { cwd: dirname(destination) });
execFileSync('unzip', ['-tq', archive]);
await writeFile(`${archive}.sha256`, `${createHash('sha256').update(await readFile(archive)).digest('hex')}  ${basename(archive)}\n`);
console.log(`Client handover: ${archive}`);
console.log(`Source ${commit.slice(0, 7)}; ${sums.length} files; ${release.contentCounts.blogs} blogs, ${release.contentCounts.media} media entries, ${release.contentCounts.caseStudies} cases.`);
