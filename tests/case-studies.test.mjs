import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCaseStudy, fetchContent } from '../src/cms/adapter.mjs';
import { defaultCaseStudies, caseSeedFields } from '../src/cms/case-studies.mjs';
import { defaultContent } from '../src/cms/defaults.mjs';
import { isProductionBuild } from '../scripts/build-environment.mjs';
import { calculateFD, calculateSIP } from '../src/calculations.mjs';

const post = item => ({ id: item.id, slug: item.slug, status: 'publish', title: { rendered: item.title }, excerpt: { rendered: item.excerpt }, content: { rendered: item.html }, finbharat: caseSeedFields(item) });
test('case study adapter retains editable profile, safe prose and numeric assumptions', () => {
  const data = post(defaultCaseStudies[0]);
  data.finbharat.fd.principal = '300000';
  data.content.rendered += '<script>bad()</script><p onclick="bad()">Safe copy.</p>';
  const item = normalizeCaseStudy(data);
  assert.equal(item.path, '/case-studies/srijan-financial-independence/');
  assert.equal(item.profile.name, 'Srijan'); assert.equal(item.profile.age, 31);
  assert.equal(item.profile.city, 'Hyderabad');
  assert.equal(item.profile.occupation, 'Tech professional');
  assert.equal(item.examples.fd.principal, 300000);
  assert.doesNotMatch(item.html, /<script|onclick/);
  assert.equal(normalizeCaseStudy({ ...data, status: 'draft' }), null);
  assert.equal(normalizeCaseStudy({ ...data, status: 'future' }), null);
  data.finbharat.fd.frequency = '3';
  assert.throws(() => normalizeCaseStudy(data), /compounding frequency/);
  data.finbharat.fd.frequency = '4'; data.finbharat.sip.rate = 'NaN';
  assert.throws(() => normalizeCaseStudy(data), /SIP return/);
  data.finbharat.sip.rate = '8'; data.finbharat.age = '';
  assert.throws(() => normalizeCaseStudy(data), /age/);
});
test('CMS case listings follow editorial order and do not fall back after unpublishing', async () => {
  const config = { schemaVersion: 1, site: defaultContent.site, scenarios: defaultContent.scenarios, pages: Object.fromEntries(Object.entries(defaultContent.pages).map(([path, item]) => [path, { ...item, status: 'publish' }])) };
  let cases = [...defaultCaseStudies].reverse().map(post);
  const fetcher = async url => Response.json(url.endsWith('/finbharat/v1/site') ? config : url.includes('/finbharat_case?') ? cases : []);
  const content = await fetchContent('https://cms.example.test', fetcher);
  assert.deepEqual(content.caseStudies.map(item => item.profile.name), ['Srijan', 'Meera', 'Arjun']);
  cases = []; assert.equal((await fetchContent('https://cms.example.test', fetcher)).caseStudies.length, 0);
  await assert.rejects(fetchContent('https://cms.example.test', async url => url.includes('/finbharat_case?') ? new Response('', { status: 503 }) : fetcher(url)), /503/);
});
test('story estimates agree with independent deposit and monthly cashflow calculations', () => {
  for (const story of defaultCaseStudies) {
    const fd = story.examples.fd, sip = story.examples.sip;
    let deposit = fd.principal;
    for (let quarter = 0; quarter < fd.years * fd.frequency; quarter++) deposit *= 1 + fd.rate / 100 / fd.frequency;
    assert(Math.abs(calculateFD(fd).final - deposit) < 0.001);
    let balance = sip.initial;
    for (let month = 0; month < sip.years * 12; month++) balance = (balance + sip.monthly) * (1 + sip.rate / 1200);
    assert(Math.abs(calculateSIP(sip).final - balance) < 0.001);
  }
});
test('Vercel production gets launch gates while previews remain noindex', () => {
  assert.equal(isProductionBuild({ VERCEL_ENV: 'production' }), true);
  assert.equal(isProductionBuild({ VERCEL_TARGET_ENV: 'production' }), true);
  assert.equal(isProductionBuild({ PRODUCTION_LAUNCH: '1' }), true);
  assert.equal(isProductionBuild({ VERCEL_ENV: 'preview', PRODUCTION_LAUNCH: '0' }), false);
  assert.equal(isProductionBuild({}), false);
});
