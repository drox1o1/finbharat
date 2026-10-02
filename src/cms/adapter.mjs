import sanitizeHtml from 'sanitize-html';
import { decodeHTML } from 'entities';
import { caseFieldDefaults } from './case-studies.mjs';
import { defaultContent } from './defaults.mjs';

export function safeURL(value, { local = true } = {}) {
  if (typeof value !== 'string' || !value) return '';
  if (local && /^\/(?!\/)[^\\\s]*$/.test(value)) return value;
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
}
export const plainText = value => decodeHTML(sanitizeHtml(String(value ?? ''), { allowedTags: [], allowedAttributes: {} })).trim();
export function articleHTML(value) {
  return sanitizeHtml(String(value || ''), {
    allowedTags: ['p', 'br', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'strong', 'em', 'a', 'figure', 'figcaption', 'img', 'hr'],
    allowedAttributes: { a: ['href', 'title'], img: ['src', 'alt', 'width', 'height', 'loading'], ol: ['start'] },
    allowedSchemes: ['https', 'mailto', 'tel'], allowProtocolRelative: false,
    transformTags: {
      img: (_, attributes) => ({ tagName: 'img', attribs: { src: safeURL(attributes.src), alt: attributes.alt || '', loading: 'lazy' } }),
      a: (_, attributes) => ({ tagName: 'a', attribs: { href: attributes.href || '', title: attributes.title || '' } }),
    },
    exclusiveFilter: frame => frame.tag === 'img' && !frame.attribs.src,
  });
}
const locked = new Set(['path', 'template', 'calculator', 'icon', 'visual', 'initials', 'company', 'art']);
export function mergeFields(base, incoming, key = '') {
  if (incoming === undefined || locked.has(key)) return structuredClone(base);
  if (typeof base === 'string') {
    if (typeof incoming !== 'string') throw new Error(`Expected text for ${key}`);
    if (/^(image|portrait|poster|video|captions|source|href|link|linkedin|instagram|android|ios|footerImage|heroPoster|heroVideo)$/.test(key)) return safeURL(incoming);
    if (key === 'body' && incoming.includes('<')) return articleHTML(incoming);
    return plainText(incoming);
  }
  if (typeof base === 'boolean') return incoming === true;
  if (Array.isArray(base)) {
    if (!Array.isArray(incoming) || incoming.length > 100 || (key !== 'faqs' && incoming.length !== base.length)) throw new Error(`Invalid list for ${key}`);
    if (!base.length) return [];
    return incoming.map((item, index) => mergeFields(base[index] ?? base[0], item, key));
  }
  if (base && typeof base === 'object') {
    if (!incoming || typeof incoming !== 'object' || (Array.isArray(incoming) && incoming.length > 0)) throw new Error(`Expected fields for ${key}`);
    if (key === 'copy') return Object.fromEntries(Object.entries(incoming).filter(([, value]) => typeof value === 'string').map(([id, value]) => [id, plainText(value)]));
    return Object.fromEntries(Object.entries(base).map(([name, value]) => [name, mergeFields(value, incoming[name], name)]));
  }
  return base;
}
export function normalizeArticle(post, kind) {
  if (post.status !== 'publish' || post.password || post.content?.protected) return null;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug || '')) throw new Error('Article slug must use lowercase Latin letters, numbers and hyphens.');
  const image = post._embedded?.['wp:featuredmedia']?.[0];
  const fields = post.finbharat || {};
  if (fields.video && (!safeURL(fields.captions) || !plainText(fields.transcript))) throw new Error('Published videos require captions and a transcript.');
  const title = plainText(post.title?.rendered);
  if (!title) throw new Error('Published article needs a title.');
  const categories = post._embedded?.['wp:term']?.flat().map(term => plainText(term.name)) || [];
  return {
    id: post.id, slug: post.slug, title,
    path: `/${kind}/${post.slug}/`,
    excerpt: plainText(post.excerpt?.rendered), html: articleHTML(post.content?.rendered),
    date: post.date_gmt ? `${post.date_gmt}Z` : post.date, modified: post.modified_gmt ? `${post.modified_gmt}Z` : post.modified,
    image: safeURL(image?.source_url), imageAlt: plainText(image?.alt_text), categories,
    author: plainText(post._embedded?.author?.[0]?.name || ''),
    source: safeURL(fields.source, { local: false }),
    mediaType: ['announcement', 'press', 'video'].includes(fields.mediaType) ? fields.mediaType : 'announcement',
    video: safeURL(fields.video), captions: safeURL(fields.captions), transcript: plainText(fields.transcript),
    seo: { title: plainText(fields.seoTitle) || `${title} | Finbharat`, description: plainText(fields.seoDescription) || plainText(post.excerpt?.rendered) || title },
  };
}
export function normalizeCaseStudy(post) {
  const article = normalizeArticle(post, 'case-studies');
  if (!article) return null;
  const fields = post.finbharat || {};
  const number = (value, name, minimum, maximum) => {
    if (value === '' || value === null || value === undefined || !['string', 'number'].includes(typeof value)) throw new Error(`Case study requires ${name}.`);
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < minimum || parsed > maximum) throw new Error(`Invalid case study ${name}.`);
    return parsed;
  };
  const name = plainText(fields.personName);
  const occupation = plainText(fields.occupation), goal = plainText(fields.goal);
  if (!name || !occupation || !goal) throw new Error('Case study needs a persona name, starting point and goal.');
  const examples = {};
  if (fields.fd?.enabled === true) {
    const value = fields.fd;
    const frequency = number(value.frequency, 'FD compounding frequency', 1, 12);
    if (![1, 2, 4, 12].includes(frequency)) throw new Error('Invalid FD compounding frequency.');
    examples.fd = { principal: number(value.principal, 'FD principal', 1, 1e9), rate: number(value.rate, 'FD rate', 0, 30), years: number(value.years, 'FD years', 1, 50), frequency };
  }
  if (fields.sip?.enabled === true) {
    const value = fields.sip;
    examples.sip = { monthly: number(value.monthly, 'SIP contribution', 1, 1e7), rate: number(value.rate, 'SIP return', 0, 30), years: number(value.years, 'SIP years', 1, 50), initial: number(value.initial ?? caseFieldDefaults.sip.initial, 'SIP initial investment', 0, 1e9) };
  }
  const image = article.image || safeURL(fields.portrait);
  if (!image) throw new Error('Case study needs an approved portrait.');
  return { ...article, order: number(fields.listingOrder ?? '1', 'listing order', 1, 10000), image, imageAlt: article.imageAlt || plainText(fields.portraitAlt) || `AI-generated portrait of ${name}, a fictional persona`, profile: { name, age: number(fields.age, 'age', 18, 100), occupation, city: plainText(fields.city), goal }, examples };
}

export async function fetchContent(cmsURL, fetcher = fetch) {
  const origin = new URL(cmsURL);
  if (origin.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(origin.hostname)) throw new Error('CMS_URL must use HTTPS.');
  const api = `${origin.href.replace(/\/$/, '')}/wp-json`;
  const request = async path => {
    const response = await fetcher(`${api}${path}`, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`CMS request failed (${response.status}) for ${path.split('?')[0]}`);
    return { value: await response.json(), headers: response.headers };
  };
  const config = (await request('/finbharat/v1/site')).value;
  if (config.schemaVersion !== 1 || !config.site || !config.pages) throw new Error('Unsupported or incomplete Finbharat CMS schema.');
  const content = structuredClone(defaultContent);
  content.site = mergeFields(content.site, config.site);
  content.scenarios = mergeFields(content.scenarios, config.scenarios);
  for (const [path, page] of Object.entries(content.pages)) {
    const remote = config.pages[path];
    if (!remote || remote.status !== 'publish') {
      if (['legal', 'contact'].includes(page.template)) continue;
      throw new Error(`Required website page is not published: ${path}`);
    }
    if (remote.template !== page.template) throw new Error(`Unexpected template for ${path}`);
    page.fields = mergeFields(page.fields, remote.fields);
    page.seo = mergeFields(page.seo, remote.seo);
    page.approved = remote.approved === true;
  }
  const posts = async (resource, kind) => {
    const result = [];
    let total = 1;
    for (let page = 1; page <= total; page++) {
      const response = await request(`/wp/v2/${resource}?status=publish&per_page=100&page=${page}&_embed=1&orderby=date&order=desc`);
      if (!Array.isArray(response.value)) throw new Error('Expected a CMS article list.');
      total = Number(response.headers.get('x-wp-totalpages') || 1);
      if (!Number.isInteger(total) || total < 0 || total > 100) throw new Error('Invalid CMS pagination.');
      result.push(...response.value.map(post => kind === 'case-studies' ? normalizeCaseStudy(post) : normalizeArticle(post, kind)).filter(Boolean));
    }
    if (new Set(result.map(item => item.slug)).size !== result.length) throw new Error('Duplicate CMS slugs.');
    return result;
  };
  [content.blog, content.media, content.caseStudies] = await Promise.all([posts('posts', 'blog'), posts('finbharat_media', 'media'), posts('finbharat_case', 'case-studies')]);
  content.caseStudies.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return content;
}
export function assertLaunchReady(content, siteURL) {
  const origin = new URL(siteURL || 'https://finbharat.example');
  if (origin.protocol !== 'https:' || /(^|\.)example$/.test(origin.hostname) || origin.hostname === 'localhost') throw new Error('A confirmed HTTPS production SITE_URL is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.site.contact.email) || !/^\+?[\d ()-]{7,25}$/.test(content.site.contact.phone)) throw new Error('Approved public email and phone are required before launch.');
  for (const path of ['/terms/', '/privacy/', '/contact/']) if (!content.pages[path]?.approved || !content.pages[path].fields.body.trim()) throw new Error(`Client approval is required before launch: ${path}`);
  if (content.site.intro.approved && content.site.intro.video && (!content.site.intro.captions || !content.site.intro.transcript)) throw new Error('Approved intro video requires captions and transcript.');
}
