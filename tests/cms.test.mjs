import test from 'node:test';
import assert from 'node:assert/strict';
import { assertLaunchReady, articleHTML, fetchContent, mergeFields, normalizeArticle, safeURL } from '../src/cms/adapter.mjs';
import { defaultContent } from '../src/cms/defaults.mjs';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const post = (slug, status = 'publish') => ({ id: slug, slug, status, date_gmt: '2026-10-02T05:00:00', modified_gmt: '2026-10-02T05:00:00', title: { rendered: 'A clear &amp; useful title' }, excerpt: { rendered: '<p>Brief explanation.</p>' }, content: { rendered: '<h2>Start here</h2><p>Helpful content.</p>' }, _embedded: { author: [{ name: 'Editorial test author' }], 'wp:term': [[{ name: 'Understanding' }]] } });
const config = () => ({ schemaVersion: 1, site: structuredClone(defaultContent.site), scenarios: structuredClone(defaultContent.scenarios), pages: Object.fromEntries(Object.entries(defaultContent.pages).map(([path, page]) => [path, { ...structuredClone(page), status: 'publish' }])) });

test('article content keeps editorial blocks and removes executable content', () => {
  const html = articleHTML('<h1>Duplicate heading</h1><h2>Heading</h2><script>alert(1)</script><p onclick="bad()">Text <a href="javascript:bad()">link</a></p><iframe src="https://example.test"></iframe><img src="https://example.test/photo.jpg" onerror="bad()" alt="Portrait"><img src="//example.test/bad.jpg"><a href="https://example.test" style="color:red">Source</a>');
  assert.match(html, /<h2>Heading<\/h2>/);
  assert.match(html, /https:\/\/example.test\/photo.jpg/);
  assert.doesNotMatch(html, /<script|onclick|onerror|javascript:|<iframe|<h1|style=|src="\/\//);
});
test('only published unprotected articles produce safe individual routes', () => {
  assert.equal(normalizeArticle(post('draft', 'draft'), 'blog'), null);
  assert.equal(normalizeArticle(post('scheduled', 'future'), 'blog'), null);
  assert.equal(normalizeArticle({ ...post('protected'), content: { protected: true, rendered: '' } }, 'blog'), null);
  assert.throws(() => normalizeArticle(post('../escape'), 'blog'), /slug/);
  assert.equal(normalizeArticle(post('clear-title'), 'blog').path, '/blog/clear-title/');
  assert.equal(normalizeArticle(post('clear-title'), 'blog').title, 'A clear & useful title');
  assert.equal(normalizeArticle({ ...post('entities'), title: { rendered: 'India&#8217;s wealth &amp; clarity' } }, 'blog').title, 'India’s wealth & clarity');
  assert.throws(() => normalizeArticle({ ...post('video'), finbharat: { video: '/video/test.mp4' } }, 'media'), /captions/);
});
test('safe media URLs and protected template choices', () => {
  assert.equal(safeURL('javascript:alert(1)'), '');
  assert.equal(safeURL('//bad.test/photo'), '');
  assert.equal(safeURL('https://media.example.test/photo.jpg'), 'https://media.example.test/photo.jpg');
  assert.equal(safeURL('/people/professional.webp'), '/people/professional.webp');
  const fields = mergeFields(defaultContent.pages['/fixed-deposits/'].fields, { product: { calculator: 'bad', path: '/bad/', introduction: 'Updated explanation' } });
  assert.equal(fields.product.calculator, 'fd');
  assert.equal(fields.product.path, '/fixed-deposits/');
  assert.equal(fields.product.introduction, 'Updated explanation');
  assert.throws(() => mergeFields(defaultContent.scenarios, [], 'scenarios'), /Invalid list/);
});
test('adapter reads all published REST pages and excludes unpublished posts', async () => {
  const setup = config();
  setup.pages['/'].fields.heroTitle = 'A revised homepage.';
  setup.pages['/mutual-funds/'].fields.product.faqs.push(['An editorial test?', 'An updated answer.']);
  const calls = [];
  const fetcher = async url => {
    calls.push(url);
    if (url.endsWith('/finbharat/v1/site')) return Response.json(setup);
    if (url.includes('/finbharat_case?')) return Response.json([]);
    if (url.includes('/finbharat_media?')) return Response.json([post('announcement')]);
    return Response.json(url.includes('page=2&') ? [post('second'), post('hidden', 'draft')] : [post('first')], { headers: { 'x-wp-totalpages': '2' } });
  };
  const content = await fetchContent('https://cms.example.test', fetcher);
  assert.equal(content.pages['/'].fields.heroTitle, 'A revised homepage.');
  assert.equal(content.pages['/mutual-funds/'].fields.product.faqs.at(-1)[0], 'An editorial test?');
  assert.deepEqual(content.blog.map(item => item.slug), ['first', 'second']);
  assert.equal(content.media[0].path, '/media/announcement/');
  assert(calls.every(url => !url.includes('password') && !url.includes('token')));
});
test('missing templates and CMS HTTP errors fail instead of replacing published content', async () => {
  const setup = config(); delete setup.pages['/'];
  await assert.rejects(fetchContent('https://cms.example.test', async () => Response.json(setup)), /not published/);
  await assert.rejects(fetchContent('https://cms.example.test', async () => new Response('', { status: 503 })), /503/);
});
test('production gate requires a real origin and approved contact and legal content', () => {
  const content = structuredClone(defaultContent);
  assert.throws(() => assertLaunchReady(content), /SITE_URL/);
  assert.throws(() => assertLaunchReady(content, 'https://www.finbharat.in'), /email and phone/);
  content.site.contact.email = 'editor@example.test'; content.site.contact.phone = '+91 99999 00000';
  assert.throws(() => assertLaunchReady(content, 'https://www.finbharat.in'), /approval/);
  for (const path of ['/terms/', '/privacy/', '/contact/']) content.pages[path].approved = true;
  assert.doesNotThrow(() => assertLaunchReady(content, 'https://www.finbharat.in'));
  content.site.intro.approved = true; content.site.intro.video = '/video/test.mp4';
  assert.throws(() => assertLaunchReady(content, 'https://www.finbharat.in'), /captions/);
});
test('failed prepare does not overwrite the last content snapshot or static deployment', async () => {
  const before = 'Previous successful content snapshot';
  const html = 'Previous successful deployment';
  const directory = await mkdtemp(join(tmpdir(), 'finbharat-cms-test-'));
  try {
    await mkdir(join(directory, 'src/generated'), { recursive: true });
    await mkdir(join(directory, 'dist'));
    await writeFile(join(directory, 'src/generated/content.json'), before);
    await writeFile(join(directory, 'dist/index.html'), html);
    const result = spawnSync(process.execPath, [resolve('scripts/prepare-content.mjs')], { cwd: directory, env: { ...process.env, CMS_URL: 'http://127.0.0.1:1', PRODUCTION_LAUNCH: '0', CONTEXT: 'test' }, encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.equal(await readFile(join(directory, 'src/generated/content.json'), 'utf8'), before);
    assert.equal(await readFile(join(directory, 'dist/index.html'), 'utf8'), html);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
