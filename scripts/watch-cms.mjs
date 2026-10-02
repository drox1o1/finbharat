import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { cp, access, rm } from 'node:fs/promises';
import { fetchContent } from '../src/cms/adapter.mjs';

const cmsURL = process.env.CMS_URL || 'http://127.0.0.1:8088';
if (!['localhost', '127.0.0.1'].includes(new URL(cmsURL).hostname)) throw new Error('cms:watch is for the local WordPress demo. Use a Vercel deploy hook for the hosted CMS.');
let previous = '', child, timer, stopped = false;
const env = { ...process.env, CMS_URL: cmsURL, VERCEL_ENV: 'development', VERCEL_TARGET_ENV: 'development', CONTEXT: 'development', PRODUCTION_LAUNCH: '0' };
const backup = 'output/cms/last-preview';
async function rebuild() {
  await rm(backup, { recursive: true, force: true });
  const hasPreview = await access('dist/index.html').then(() => true, () => false);
  if (hasPreview) await cp('dist', backup, { recursive: true });
  const success = await new Promise(resolve => {
  child = spawn('npm', ['run', 'build'], { stdio: 'inherit', env });
  child.once('error', () => resolve(false));
  child.once('exit', code => { child = undefined; resolve(code === 0); });
  });
  if (!success && hasPreview) {
    await rm('dist', { recursive: true, force: true });
    await cp(backup, 'dist', { recursive: true });
    console.error('Build failed. Restored the previous local preview.');
  }
  await rm(backup, { recursive: true, force: true });
  return success;
}
async function poll() {
  try {
    const content = await fetchContent(cmsURL);
    const revision = createHash('sha256').update(JSON.stringify(content)).digest('hex');
    if (revision !== previous) {
      console.log('Published local CMS content changed. Building the preview…');
      if (await rebuild()) { previous = revision; console.log('Preview updated. Refresh http://localhost:4173/'); }
    }
  } catch (error) { console.error(`Local CMS unavailable: ${error.message}. Keeping the previous preview.`); }
  if (!stopped) timer = setTimeout(poll, 8000);
}
function stop() { stopped = true; clearTimeout(timer); child?.kill('SIGTERM'); }
process.on('SIGINT', stop); process.on('SIGTERM', stop);
console.log('Watching published content in the local WordPress dashboard. This does not deploy to Vercel.');
await poll();
