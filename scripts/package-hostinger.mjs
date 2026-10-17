import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

// Package application source for hPanel's Web App file upload, not File Manager.
// Keep the WordPress installation and private editorial access files separate.
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const directory = resolve('output/hostinger');
const staging = resolve(directory, 'app-source');
const archive = resolve(directory, `Finbharat-Hostinger-App-${date}.zip`);
await rm(staging, { recursive: true, force: true });
await mkdir(staging, { recursive: true });
const roots = new Set(['package.json', 'package-lock.json', 'index.html', 'vite.config.js', 'eslint.config.js', '.gitignore', '.env.example', 'README.md', 'vercel.json', 'netlify.toml']);
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
for (const file of files) {
  if (!roots.has(file) && !/^(src|public|content|scripts|tests|docs)\//.test(file) && !file.startsWith('wordpress/finbharat-content/')) continue;
  if (/^(src\/generated|output|node_modules|dist|\.ssr)\//.test(file)) continue;
  if (/(^|\/)(\.env(?:\..*)?|.*\.private\..*|client-demo-access\.json|client-demo-login\.md)$/.test(file) && file !== '.env.example') throw new Error(`Private file rejected: ${file}`);
  const destination = resolve(staging, file);
  await mkdir(dirname(destination), { recursive: true });
  await cp(file, destination);
}
await cp('docs/hostinger-upload.md', resolve(staging, 'HOSTINGER-SETUP.md'));
await cp('docs/hostinger-upload.md', resolve(directory, 'HOSTINGER-SETUP.md'));
await rm(archive, { force: true });
execFileSync('zip', ['-q', '-r', archive, '.'], { cwd: staging });
execFileSync('unzip', ['-tq', archive]);
const bytes = await readFile(archive);
if (bytes.length >= 50_000_000) throw new Error('Source archive exceeds the Hostinger 50 MB upload limit.');
const entries = execFileSync('unzip', ['-Z1', archive], { encoding: 'utf8' }).split('\n');
if (!entries.includes('package.json') || !entries.includes('package-lock.json') || !entries.includes('index.html')) throw new Error('The source archive must have package.json, package-lock.json and index.html at its root.');
if (entries.some(file => /^(node_modules|dist|\.ssr|\.git|output|src\/generated)\//.test(file))) throw new Error('Generated or private directory found in archive.');
const snapshot = JSON.parse(await readFile('content/demo-content.json', 'utf8'));
const manifest = { filename: archive.split('/').at(-1), packagedAt: new Date().toISOString(), bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), contentMode: 'demo', wordpressConnected: false, contactEmail: snapshot.site.contact.email, founders: snapshot.site.founders.map(({ name, linkedin }) => ({ name, linkedin })), build: 'npm run build', output: 'dist', node: '22.x', excluded: ['credentials', 'WordPress core and database', 'node_modules', 'build output', 'Git history'] };
await writeFile(`${archive}.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Hostinger application ZIP: ${archive} (${(bytes.length / 1e6).toFixed(1)} MB)`);
console.log('Upload using Web App → Upload your website files. Content is a saved snapshot until a permanent WordPress CMS is configured.');
