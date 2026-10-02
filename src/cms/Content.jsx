import { createContext, useContext } from 'react';
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
