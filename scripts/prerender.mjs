import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { render } from '../.ssr/entry-server.js';
import { faqs } from '../src/content.mjs';
import { founders, productContent } from '../src/page-content.mjs';

const configuredOrigin = process.env.SITE_URL;
const origin = configuredOrigin ? new URL(configuredOrigin).origin : 'https://finbharat.example';
const pages = {
  '/': ['Finbharat | Keeping Wealth Simple. For Everyone in Bharat.', 'Understand mutual funds, explore fixed deposits and plan with illustrative calculators. Finbharat is building toward a clearer, more inclusive financial future for Bharat.'],
  '/mutual-funds/': ['Mutual Funds & SIP Calculator | Understand and Plan | Finbharat', 'Understand mutual fund basics, SIP contributions and investment risks. Explore an illustrative SIP calculator with your own assumptions.'],
  '/fixed-deposits/': ['Fixed Deposits & FD Calculator | Plan with Clarity | Finbharat', 'Understand fixed deposit rates, tenure, compounding and withdrawal terms. Calculate illustrative maturity value and interest with your assumptions.'],
  '/inclusion/': ['Inclusion | Wealth for Everyone in Bharat | Finbharat', 'Explore Finbharat’s inclusion principles across languages, incomes, abilities and digital confidence. Keeping wealth simple, for everyone in Bharat.'],
  '/about/': ['About Finbharat | Cofounders D. Ramanathan & Rakesh K', 'Meet D. Ramanathan and Rakesh K, cofounders of FinBharat Technology Private Limited. Learn about our purpose: keeping wealth simple for everyone in Bharat.'],
  '/calculators/fd/': ['FD Calculator | Estimate Fixed Deposit Maturity | Finbharat', 'Estimate fixed deposit maturity and interest with your principal, annual rate, tenure and compounding frequency. Free, private and illustrative.'],
  '/calculators/sip/': ['Mutual Fund & SIP Calculator | Plan with Clarity | Finbharat', 'Explore estimated SIP investment value, contributions and growth with monthly investment, expected return, duration and optional initial savings.'],
  '/calculators/goal/': ['Goal-Based Calculator | Inflation & Monthly Investment | Finbharat', 'Estimate your future goal cost and required monthly investment, considering inflation, current savings and user-provided return assumptions.'],
  '/privacy/': ['Privacy Information | Finbharat', 'Learn how the static Finbharat website handles calculator inputs. Official company privacy information is awaiting confirmation.'],
  '/terms/': ['Terms Information | Finbharat', 'Read the illustrative calculator limitations and the status of official company terms for Finbharat.'],
  '/contact/': ['Contact & Social Information | Finbharat', 'Official Finbharat contact and social details will be added when confirmed. See the current placeholder status.'],
};
const template = await readFile('dist/index.html', 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
for (const [path, [title, description]] of Object.entries(pages)) {
  const url = `${origin}${path}`;
  const product = Object.values(productContent).find(item => item.path === path);
  const pageFAQs = path === '/' ? faqs : product?.faqs;
  const graph = [
    { '@type': 'Organization', '@id': `${origin}/#organization`, name: 'Finbharat', legalName: 'FinBharat Technology Private Limited', description: 'Keeping wealth simple. For everyone in Bharat. Building thoughtful technology for a more understandable and inclusive financial future.', founder: founders.map(founder => ({ '@type': 'Person', name: founder.name, jobTitle: founder.role, sameAs: founder.linkedin })), ...(configuredOrigin ? { url: origin } : {}) },
    { '@type': 'WebSite', '@id': `${origin}/#website`, name: 'Finbharat', url: origin, inLanguage: 'en-IN', publisher: { '@id': `${origin}/#organization` } },
    ...(pageFAQs ? [{ '@type': 'FAQPage', mainEntity: pageFAQs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) }] : []),
    ...(path === '/about/' ? [{ '@type': 'AboutPage', name: title, url, about: { '@id': `${origin}/#organization` } }] : []),
  ];
  const head = `<title>${escape(title)}</title>
    <meta name="description" content="${escape(description)}" />
    <meta name="robots" content="${configuredOrigin ? 'index, follow' : 'noindex, follow'}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:site_name" content="Finbharat" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${origin}/art/social-preview.jpg" />
    <meta property="og:image:alt" content="Finbharat: a more human way to move through money" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(description)}" />
    <meta name="twitter:image" content="${origin}/art/social-preview.jpg" />
    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')}</script>`;
  const html = template.replace('<!--page-head-->', head).replace('<!--page-html-->', render(path));
  const directory = resolve('dist', path.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'index.html'), html);
}
const notFound = template.replace('<!--page-head-->', '<title>Page not found | Finbharat</title><meta name="robots" content="noindex" />').replace('<!--page-html-->', render('/404/'));
await writeFile('dist/404.html', notFound);
const robots = `User-agent: *\n${configuredOrigin ? 'Allow: /' : 'Disallow: /'}\n\nSitemap: ${origin}/sitemap.xml\n`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(pages).map(path => `<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>`;
await writeFile('dist/robots.txt', robots);
await writeFile('dist/sitemap.xml', sitemap);
console.log(`Prerendered ${Object.keys(pages).length} static pages. ${configuredOrigin ? `Canonical origin: ${origin}` : 'Domain placeholder: set SITE_URL for a production build.'}`);
