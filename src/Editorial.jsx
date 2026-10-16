import { useId, useRef, useState } from 'react';
import { introVideoReady, youtubeVideoId } from './intro-video.mjs';
import { ArrowRight, ArrowUpRight, BookOpen, ChevronDown, Mail, Phone, Play, X } from 'lucide-react';
import { HomeSectionLink, useContent, usePageContent } from './cms/Content';
import { MotionPage } from './MotionPage';

export function IntroVideo({ children, className = 'intro-trigger' }) {
  const { intro } = useContent().site;
  const dialog = useRef(null);
  const trigger = useRef(null);
  const player = useRef(null);
  const [opened, setOpened] = useState(false);
  const titleId = useId();
  const youtubeId = youtubeVideoId(intro.video);
  if (!introVideoReady(intro)) return null;
  const close = () => dialog.current.close();
  const keepFocus = event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.current.querySelectorAll('button, a[href], video[controls], iframe, summary, [tabindex="0"]')].filter(element => element.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  return <><button ref={trigger} className={className} aria-label={`Watch the introduction: ${intro.title}`} onClick={() => { setOpened(true); dialog.current.showModal(); }}>{children || <><span className="intro-play"><Play size={15} aria-hidden="true" /></span>Watch the introduction</>}</button><dialog ref={dialog} className="intro-dialog" aria-labelledby={titleId} onKeyDown={keepFocus} onClose={() => { player.current?.pause(); setOpened(false); trigger.current?.focus(); }} onClick={event => { if (event.target === dialog.current) { const rect = dialog.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}><div className="intro-dialog-heading"><h2 id={titleId}>{intro.title}</h2><button autoFocus className="icon-button" aria-label="Close introduction" onClick={close}><X aria-hidden="true" /></button></div>{youtubeId ? opened && <iframe className="intro-youtube" title={intro.title} src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0&cc_load_policy=1`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : <video ref={player} controls playsInline preload="none" poster={intro.poster || undefined} crossOrigin="anonymous">{opened && <source src={intro.video} />}<track kind="captions" src={intro.captions} srcLang="en" label="English" default /></video>}<details className="intro-transcript"><summary>Read the video transcript <ChevronDown size={16} aria-hidden="true" /></summary><p>{intro.transcript}</p></details></dialog></>;
}

export function IntroVideoSection() {
  const { intro } = useContent().site;
  const ready = introVideoReady(intro);
  if (intro.visible !== true) return null;
  const thumbnail = <><img src={intro.poster || '/video/intro-conversation-thumbnail.webp'} alt={intro.posterAlt} width="1600" height="900" loading="lazy" /><span className="intro-thumbnail-play" aria-hidden="true"><Play size={28} fill="currentColor" /></span><span className="intro-thumbnail-label">{ready ? 'Watch the introduction' : intro.placeholderLabel}</span></>;
  return <section id="introduction" className="container section intro-section" aria-labelledby="intro-section-title"><div className="intro-section-copy scroll-reveal"><p className="eyebrow">{intro.eyebrow}</p><h2 id="intro-section-title">{intro.title}</h2><p>{intro.description}</p><span className="intro-section-note">{ready ? 'A short introduction. At your pace.' : 'A first look at Finbharat. Coming soon.'}</span></div><div className="intro-section-media scroll-reveal">{ready ? <IntroVideo className="intro-video-thumbnail">{thumbnail}</IntroVideo> : <figure className="intro-video-thumbnail is-pending">{thumbnail}</figure>}</div></section>;
}

export function Mission() {
  const site = useContent().site;
  return <section className="mission-section section"><div className="container mission-layout scroll-reveal"><div><p className="eyebrow">{site.missionEyebrow}</p><h2>{site.missionHeading[0]}<br />{site.missionHeading[1]}</h2></div><div><p className="mission-statement">{site.mission}</p><p className="mission-note">{site.missionNote}</p><a className="text-link" href="/about/">{site.missionLinkLabel} <ArrowUpRight size={18} aria-hidden="true" /></a></div></div></section>;
}

export function HumanStories() {
  const { scenarios, site } = useContent();
  return <section id="real-lives" className="section container human-stories"><div className="section-heading scroll-reveal"><div><p className="eyebrow">{site.scenariosEyebrow}</p><h2>{site.scenariosHeading[0]}<br />{site.scenariosHeading[1]}</h2></div><p>{site.scenariosIntroduction[0]}<br />{site.scenariosIntroduction[1]}</p></div><div className="human-grid grid-flow-dense">{scenarios.map(story => <article className="human-card scroll-reveal" key={story.audience}><figure><img src={story.image} alt={story.alt} width="800" height="900" loading="lazy" /><figcaption>{story.audience}</figcaption></figure><div className="human-card-copy"><h3>{story.title}</h3><p>{story.body}</p><p className="human-cue">{story.cue}</p><a className="text-link" href={story.href}>{story.action}<ArrowUpRight size={17} aria-hidden="true" /></a>{story.source && <a className="photo-credit" href={story.source}>Photograph: {story.credit}</a>}</div></article>)}</div><p className="scenario-note">{site.scenariosNote}</p></section>;
}

function ArticleCard({ item, kind }) {
  const coverage = kind === 'media' && item.mediaType === 'press' && item.source;
  return <article className="editorial-card scroll-reveal"><a href={coverage ? item.source : item.path} target={coverage ? '_blank' : undefined} rel={coverage ? 'noopener noreferrer' : undefined}>{item.image ? <div className="editorial-card-image"><img src={item.image} alt={item.imageAlt} width="900" height="600" loading="lazy" /></div> : <div className="editorial-card-art" aria-hidden="true"><BookOpen size={44} strokeWidth={1} /></div>}<div className="editorial-card-copy"><p className="eyebrow">{kind === 'media' ? item.sourceLabel || ({ announcement: 'Company news', press: 'In the press', video: 'Video' }[item.mediaType]) : item.categories[0] || 'Perspective'}</p><h2>{item.title}</h2><p>{item.excerpt}</p>{item.imageCredit && <p className="editorial-image-credit">{item.imageCredit}</p>}<div className="editorial-card-bottom"><time dateTime={item.date}>{formatDate(item.date)}</time><span>{coverage ? 'Read coverage' : 'Read more'} <ArrowUpRight size={19} aria-hidden="true" /></span></div>{coverage && <span className="sr-only">Opens the original publication in a new tab.</span>}</div></a></article>;
}

const formatDate = value => { const date = new Date(value); return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(date); };
export function EditorialIndex({ kind }) {
  const content = useContent();
  const fields = usePageContent();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('All');
  const items = content[kind];
  const categories = kind === 'blog' ? [...new Set(items.flatMap(item => item.categories))] : [];
  const selected = category === 'All' ? items : items.filter(item => item.categories.includes(category));
  const total = Math.ceil(selected.length / 9);
  const list = useRef(null);
  return <MotionPage className="editorial-page"><section className="container editorial-hero"><p className="eyebrow page-enter">{kind === 'blog' ? 'The Finbharat journal' : 'The Finbharat newsroom'}</p><h1 className="page-enter">{fields.heading}</h1><p className="page-enter">{fields.introduction}</p></section><section className="container editorial-list section" ref={list} aria-label={kind === 'blog' ? 'Articles' : 'Newsroom entries'}>{categories.length > 1 && <div className="editorial-filters" aria-label="Filter articles">{['All', ...categories].map(name => <button className="button button-outline" aria-pressed={category === name} key={name} onClick={() => { setCategory(name); setPage(1); }}>{name}</button>)}</div>}{selected.length ? <><div className={`editorial-grid grid-flow-dense ${kind === 'media' ? 'newsroom-grid' : ''}`}>{selected.slice((page - 1) * 9, page * 9).map(item => <ArticleCard key={item.id} item={item} kind={kind} />)}</div>{total > 1 && <nav className="editorial-pagination" aria-label="Article pagination"><button className="button button-outline" disabled={page === 1} onClick={() => { setPage(page - 1); list.current.scrollIntoView({ block: 'start' }); }}>Previous</button><span role="status">Page {page} of {total}</span><button className="button" disabled={page === total} onClick={() => { setPage(page + 1); list.current.scrollIntoView({ block: 'start' }); }}>Next</button></nav>}</> : <div className="editorial-empty scroll-reveal"><div className="empty-symbol" aria-hidden="true"><BookOpen size={38} strokeWidth={1.2} /></div><p className="eyebrow">A little space for what comes next</p><h2>{fields.emptyTitle}</h2><p>{fields.emptyCopy}</p><a className="button" href={kind === 'blog' ? '/mutual-funds/' : '/contact/'}>{kind === 'blog' ? 'Understand mutual funds' : 'Contact Finbharat'}<ArrowUpRight size={18} aria-hidden="true" /></a></div>}</section></MotionPage>;
}

export function ArticlePage({ article, kind }) {
  return <MotionPage className="article-page"><article><header className="container article-heading"><a className="breadcrumb page-enter" href={`/${kind}/`}>Back to {kind === 'blog' ? 'the journal' : 'the newsroom'}<ArrowUpRight size={14} aria-hidden="true" /></a><p className="eyebrow page-enter">{kind === 'blog' ? article.categories.join(' · ') || 'Perspective' : { announcement: 'Company news', press: 'In the press', video: 'Video' }[article.mediaType]}{kind === 'media' && article.sourceLabel && ` · ${article.sourceLabel}`}</p><h1 className="page-enter">{article.title}</h1><p className="article-deck page-enter">{article.excerpt}</p><div className="article-byline page-enter"><time dateTime={article.date}>{formatDate(article.date)}</time>{article.author && <span>By {article.author}</span>}</div></header>{article.image && <figure className={`container article-feature ${kind === 'media' && article.mediaType === 'press' ? 'press-feature' : ''}`}><img src={article.image} alt={article.imageAlt} width="1400" height="900" fetchPriority="high" />{article.imageCredit && <figcaption>{article.imageCredit}</figcaption>}</figure>}<div className="article-body container"><div className="prose" dangerouslySetInnerHTML={{ __html: article.html }} />{article.video && <section className="article-video"><h2>Watch the conversation</h2><video controls playsInline preload="metadata" crossOrigin="anonymous"><source src={article.video} />{article.captions && <track kind="captions" src={article.captions} srcLang="en" label="English" default />}</video>{article.transcript && <details><summary>Read the transcript</summary><p>{article.transcript}</p></details>}</section>}{article.source && <p className="article-source">Original source: <a href={article.source}>Read the original {article.sourceLabel || 'publication'} <ArrowUpRight size={15} aria-hidden="true" /></a></p>}<div className="article-end"><p>More understanding. Your own decisions.</p><HomeSectionLink section="calculators" className="text-link" >Explore our illustrative calculators <ArrowRight size={17} aria-hidden="true" /></HomeSectionLink></div></div></article></MotionPage>;
}

export function FAQPage() {
  const { fields } = useContent().pages['/faq/'];
  return <MotionPage><section className="container information-page help-page"><p className="eyebrow page-enter">Frequently asked questions</p><h1 className="page-enter">{fields.heading}</h1><p className="page-enter">{fields.introduction}</p><div className="help-topics">{fields.groups.map((group, index) => <details className="help-topic" key={group.title}><summary><span className="help-topic-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h2>{group.title}</h2><ChevronDown size={20} aria-hidden="true" /></summary><div className="prose" dangerouslySetInnerHTML={{ __html: group.body }} /></details>)}</div><a className="text-link" href="/contact/">Still need a hand? Contact us <ArrowUpRight size={18} aria-hidden="true" /></a></section></MotionPage>;
}

export function InformationPage({ path }) {
  const content = useContent();
  const page = content.pages[path];
  const contact = content.site.contact;
  if (!page) return <section className="container information-page"><p className="eyebrow">Page not found</p><h1>Let’s find your way back.</h1><p>This page does not exist. Explore Finbharat or try one of the calculators.</p><a className="button" href="/">Explore Finbharat <ArrowRight size={18} aria-hidden="true" /></a></section>;
  return <MotionPage><section className="container information-page"><p className="eyebrow page-enter">{page.title}</p><h1 className="page-enter">{page.fields.heading}</h1>{page.template === 'legal' ? <div className="prose page-enter" dangerouslySetInnerHTML={{ __html: page.fields.body }} /> : <p className="page-enter">{page.fields.body}</p>}{!page.approved && <p className="approval-note">Official {page.template === 'contact' ? 'contact details' : 'legal content'} pending client approval.</p>}{page.template === 'contact' && <div className="contact-links">{contact.email && <a className="contact-link" href={`mailto:${contact.email}`}><Mail aria-hidden="true" /><span>Email us<strong>{contact.email}</strong></span><ArrowUpRight aria-hidden="true" /></a>}{contact.phone && <a className="contact-link" href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}><Phone aria-hidden="true" /><span>Call us<strong>{contact.phone}</strong></span><ArrowUpRight aria-hidden="true" /></a>}{contact.address && <p>{contact.address}</p>}{contact.linkedin && <a className="text-link" href={contact.linkedin}>Finbharat on LinkedIn <ArrowUpRight size={17} aria-hidden="true" /></a>}{contact.instagram && <a className="text-link" href={contact.instagram}>Finbharat on Instagram <ArrowUpRight size={17} aria-hidden="true" /></a>}</div>}<a className="button button-outline" href="/">Explore Finbharat <ArrowRight size={18} aria-hidden="true" /></a></section></MotionPage>;
}
