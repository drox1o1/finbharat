import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { render } from '../.ssr/entry-server.js';
const content = JSON.parse(await readFile('src/generated/content.json', 'utf8'));
const { founders } = content.site;
const configuredOrigin = process.env.SITE_URL;
const origin = configuredOrigin ? new URL(configuredOrigin).origin : 'https://finbharat.example';
const calculatorPages = {
  '/calculators/fd/': ['FD Calculator | Estimate Fixed Deposit Maturity | Finbharat', 'Estimate fixed deposit maturity and interest with your principal, annual rate, tenure and compounding frequency. Free, private and illustrative.'],
  '/calculators/sip/': ['Mutual Fund & SIP Calculator | Plan with Clarity | Finbharat', 'Explore estimated SIP investment value, contributions and growth with monthly investment, expected return, duration and optional initial savings.'],
  '/calculators/goal/': ['Goal-Based Calculator | Inflation & Monthly Investment | Finbharat', 'Estimate your future goal cost and required monthly investment, considering inflation, current savings and user-provided return assumptions.'],

};
const pages = Object.fromEntries(Object.entries(content.pages).map(([path, page]) => [path, [page.seo.title, page.seo.description]]));
for (const [path, metadata] of Object.entries(calculatorPages)) if (path.startsWith('/calculators/')) pages[path] = metadata;
for (const article of [...content.blog, ...content.media]) pages[article.path] = [article.seo.title, article.seo.description];
const articles = [...content.blog, ...content.media];
const serialize = value => JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
const hydration = path => {
  const data = { ...content, blog: content.blog.map(item => ({ ...item, html: item.path === path ? item.html : '' })), media: content.media.map(item => ({ ...item, html: item.path === path ? item.html : '' })) };
  return `<script id="finbharat-content" type="application/json">${serialize(data)}</script>`;
};
const approved = ['/terms/', '/privacy/', '/contact/'].every(path => content.pages[path].approved);
const indexing = Boolean(configuredOrigin && approved && (process.env.CONTEXT === 'production' || process.env.PRODUCTION_LAUNCH === '1'));
const template = await readFile('dist/index.html', 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
for (const [path, [title, description]] of Object.entries(pages)) {
  const url = `${origin}${path}`;
  const product = content.pages[path]?.fields.product;
  const pageFAQs = path === '/' ? content.pages['/'].fields.faqs : product?.faqs;
  const article = articles.find(item => item.path === path);
  const image = article?.image || `${origin}/art/social-preview.jpg`;
  const graph = [
    { '@type': 'Organization', '@id': `${origin}/#organization`, name: 'Finbharat', legalName: content.site.legalName, description: content.site.mission, slogan: content.site.tagline, logo: `${origin}/brand/logo-brand.svg`, founder: founders.map(founder => ({ '@type': 'Person', name: founder.name, jobTitle: founder.role, sameAs: founder.linkedin })), ...(configuredOrigin ? { url: origin } : {}) },
    { '@type': 'WebSite', '@id': `${origin}/#website`, name: 'Finbharat', url: origin, inLanguage: 'en-IN', publisher: { '@id': `${origin}/#organization` } },
    ...(pageFAQs ? [{ '@type': 'FAQPage', mainEntity: pageFAQs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) }] : []),
    ...(article ? [{ '@type': path.startsWith('/blog/') ? 'BlogPosting' : 'Article', headline: article.title, description: article.seo.description, url, datePublished: article.date, dateModified: article.modified, ...(article.image ? { image: article.image } : {}), ...(article.author ? { author: { '@type': 'Person', name: article.author } } : {}), publisher: { '@id': `${origin}/#organization` }, mainEntityOfPage: url, ...(article.source ? { isBasedOn: article.source } : {}) }] : []),
    ...(path === '/about/' ? [{ '@type': 'AboutPage', name: title, url, about: { '@id': `${origin}/#organization` } }] : []),
  ];
  const head = `<title>${escape(title)}</title>
    <meta name="description" content="${escape(description)}" />
    <meta name="robots" content="${indexing ? 'index, follow' : 'noindex, follow'}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${article ? 'article' : 'website'}" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:site_name" content="Finbharat" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${escape(new URL(image, origin).href)}" />
    <meta property="og:image:alt" content="${escape(article?.imageAlt || content.site.tagline)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(description)}" />
    <meta name="twitter:image" content="${escape(new URL(image, origin).href)}" />
    <script type="application/ld+json">${serialize({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
  const html = template.replace('<!--page-head-->', head).replace('<!--page-html-->', render(path, content)).replace('<!--content-snapshot-->', hydration(path));
  const directory = resolve('dist', path.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'index.html'), html);
}
const notFound = template.replace('<!--page-head-->', '<title>Page not found | Finbharat</title><meta name="robots" content="noindex" />').replace('<!--page-html-->', render('/404/', content)).replace('<!--content-snapshot-->', hydration('/404/'));
await writeFile('dist/404.html', notFound);
const robots = `User-agent: *\n${indexing ? 'Allow: /' : 'Disallow: /'}\n\nSitemap: ${origin}/sitemap.xml\n`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(pages).map(path => `<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>`;
await writeFile('dist/robots.txt', robots);
await writeFile('dist/sitemap.xml', sitemap);
console.log(`Prerendered ${Object.keys(pages).length} static pages. ${configuredOrigin ? `Canonical origin: ${origin}` : 'Domain placeholder: set SITE_URL for a production build.'}`);

const llms = `# Finbharat

${content.site.legalName}
Tagline: ${content.site.tagline}
Mission (an ambition): ${content.site.mission}

## Cofounders
${founders.map(founder => `- ${founder.name}: ${founder.role}. ${founder.linkedin}`).join('\n')}

## Website
- /mutual-funds/: educational explanations and an illustrative SIP calculator.
- /fixed-deposits/: deposit explanations and an illustrative FD calculator.
- /calculators/goal/: illustrative education, car and financial freedom planning.
- /blog/: published editorial articles.
- /media/: published announcements, attributed coverage and videos.
- /contact/: official contact details when approved.

Calculators run locally using user-entered assumptions. Results are estimates, not guaranteed outcomes or financial recommendations. The website does not accept investments or open deposits.

Specific AI capabilities, app availability, partnerships and financial outcomes are not asserted by this document.
`;
await writeFile('dist/llms.txt', llms);
