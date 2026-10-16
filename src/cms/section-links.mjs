const destinations = { products: ['explore', '/mutual-funds/'], calculators: ['calculators', '/calculators/sip/'], ai: ['ai-inclusion', '/inclusion/'], downloads: ['download', '/contact/'], founders: ['founders', '/about/'] };
export function homeSectionHref(content, name, { home = false } = {}) {
  const [anchor, fallback] = destinations[name];
  return content.pages['/'].fields.sections?.[name] === false ? fallback : `${home ? '' : '/'}#${anchor}`;
}
