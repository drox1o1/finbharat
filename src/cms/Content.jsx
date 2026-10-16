import { createContext, useContext } from 'react';
import { homeSectionHref } from './section-links.mjs';
import { defaultContent } from './defaults.mjs';

const ContentContext = createContext({ content: defaultContent, path: '/' });
export function ContentProvider({ content, path, children }) {
  return <ContentContext.Provider value={{ content, path }}>{children}</ContentContext.Provider>;
}
export function useContent() { return useContext(ContentContext).content; }
export function usePageContent(path) {
  const context = useContext(ContentContext);
  return context.content.pages[path || context.path]?.fields || {};
}
// Stable editorial slots are plain text, never executable HTML.
export function Copy({ id, fallback }) {
  const { content, path } = useContext(ContentContext);
  const value = content.pages[path]?.fields.copy?.[id] ?? content.site.copy?.[id];
  if (value === undefined) return fallback;
  return `${/^\s/.test(fallback) ? ' ' : ''}${value.trim()}${/\s$/.test(fallback) ? ' ' : ''}`;
}

// Hiding a section omits its DOM, images and player rather than leaving blank space.
export function ContentSection({ name, children }) {
  const fields = usePageContent();
  return fields.sections?.[name] === false ? null : children;
}

export function HomeSectionLink({ section, home = false, ...props }) {
  const content = useContent();
  if (section === 'downloads' && content.pages['/'].fields.sections?.downloads === false) return null;
  return <a {...props} href={homeSectionHref(content, section, { home })} />;
}
