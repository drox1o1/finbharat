import { useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronRight, EyeOff, Fingerprint, Globe2, HeartHandshake, Languages, Menu, MessageCircle, Plus, ShieldCheck, Sparkles, Target, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Card } from './BrandCard';
import { Calculator, calculatorInfo } from './Calculator';
import { defaultContent } from './cms/defaults.mjs';
import { ContentProvider, Copy, useContent, usePageContent } from './cms/Content';
import { ArticlePage, EditorialIndex, HumanStories, InformationPage, IntroVideo, Mission } from './Editorial';
import { AboutPage, FounderProfiles, InclusionPage, MottoBand, ProductGateways, ProductPage } from './Pages';
import { MotionPage } from './MotionPage';
import { MotionDetails, PrinciplesRibbon } from './Interactive';
import { ScrollVideoHero } from './ScrollVideoHero';
import { BharatWord } from './BharatWord';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Wordmark({ light = false }) {
  return <a className={`wordmark ${light ? 'light footer-logo' : ''}`} href="/" aria-label="Finbharat home">{!light && <img className="logo-brand" src="/brand/logo-brand.svg" alt="" width="225.476" height="40" />}<img className="logo-reversed" src={light ? '/brand/logo-footer.svg' : '/brand/logo-reversed.svg'} alt="" width={light ? '287.29' : '225.476'} height={light ? '64' : '40'} /></a>;
}

function Navigation({ home, path }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const items = [['Mutual funds', '/mutual-funds/'], ['Fixed deposits', '/fixed-deposits/'], ['Calculators', home ? '#calculators' : '/#calculators']];
  const discover = [['Inclusion', '/inclusion/'], ['About', '/about/'], ['Blog', '/blog/'], ['Media', '/media/'], ['Contact', '/contact/']];
  const download = home ? '#download' : '/#download';
  useGSAP(() => {
    if (!home) return;
    const syncHeader = () => {
      const hero = document.querySelector('.cinematic-hero');
      if (hero && ref.current) {
        ref.current.classList.toggle('is-scrolled', hero.getBoundingClientRect().bottom <= ref.current.offsetHeight);
      }
    };
    const trigger = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: syncHeader, onRefresh: syncHeader });
    syncHeader();
    return () => trigger.kill();
  }, { scope: ref, dependencies: [home] });
  const close = () => { setOpen(false); ref.current.querySelector('.menu-toggle').focus(); };
  return <header className={`site-header ${home ? 'header-cinematic' : ''}`} ref={ref}>
    <nav className="navigation container" aria-label="Main navigation">
      <Wordmark />
      <div className="desktop-nav">{items.map(([label, href]) => <a key={label} href={href} aria-current={path === href ? 'page' : undefined}>{label}</a>)}<details className="discover-nav" onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary').focus(); } }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }}><summary>Discover <ChevronDown size={14} aria-hidden="true" /></summary><div className="discover-links">{discover.map(([label, href]) => <a key={href} href={href} aria-current={path === href ? 'page' : undefined}>{label}</a>)}</div></details></div>
      <a className="button nav-download" href={download}>Download the app <ArrowUpRight size={16} aria-hidden="true" /></a>
      <button className="menu-toggle icon-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} onKeyDown={event => { if (event.key === 'Escape' && open) close(); }}>{open ? <X /> : <Menu />}</button>
    </nav>
    <div id="mobile-navigation" className="mobile-nav" hidden={!open} onKeyDown={event => { if (event.key === 'Escape') close(); }}>
      {[...items, ...discover].map(([label, href]) => <a key={label} href={href} aria-current={path === href ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</a>)}
      <a href={download} onClick={() => setOpen(false)}>Download the app</a>
    </div>
  </header>;
}

function Hero() {
  const { site } = useContent();
  const page = usePageContent('/');
  return <>
    <ScrollVideoHero>
      <div className="cinematic-content container">
        <p className="eyebrow hero-enter">{site.tagline}</p>
        <BharatWord title={page.heroTitle} prefix={page.heroPrefix} />
        <p className="cinematic-description hero-enter"><Copy id="Hero.cbd35340" fallback="A clearer path to your financial future." /><br /><Copy id="Hero.3f7c2d11" fallback=" Thoughtful tools. Human understanding. Your own way forward." /></p>
        <div className="hero-actions hero-enter"><a className="button button-ivory" href="#explore"><Copy id="Hero.7c8b4495" fallback="Explore Finbharat " /><ArrowUpRight size={18} aria-hidden="true" /></a><a className="button button-glass" href="#calculators"><Copy id="Hero.72e90079" fallback="Try a calculator " /><ArrowRight size={18} aria-hidden="true" /></a></div>
      <IntroVideo /></div>
      <div className="cinematic-bottom container hero-enter"><p><Copy id="Hero.0c50875a" fallback="Different paths." /><br /><span><Copy id="Hero.712f7394" fallback="Shared possibilities." /></span></p><a href="#explore" className="cinematic-scroll"><span><Copy id="Hero.f0f4470e" fallback="Scroll to explore" /></span><span className="scroll-circle"><ChevronDown size={18} aria-hidden="true" /></span></a><p><Copy id="Hero.84c67e2d" fallback="Built around real lives." /><br /><span><Copy id="Hero.fce3509c" fallback="At your pace." /></span></p></div>
    </ScrollVideoHero>
    <div className="language-bar container"><p><Copy id="Hero.ef060e24" fallback="Many lives." /><br /><strong><Copy id="Hero.52c406b3" fallback="One more inclusive future." /></strong></p><div className="language-line" aria-label="A future across languages"><span lang="hi"><Copy id="Hero.ff5a57bd" fallback="नमस्ते" /></span><span lang="ta"><Copy id="Hero.31693f7f" fallback="வணக்கம்" /></span><span lang="te"><Copy id="Hero.90bd9686" fallback="నమస్కారం" /></span><span lang="kn"><Copy id="Hero.51f37bf9" fallback="ನಮಸ್ಕಾರ" /></span><span><Copy id="Hero.9b56d519" fallback="Hello." /></span></div></div>
  </>;
}

function Manifesto() {
  const words = usePageContent('/').manifesto.split(' ');
  return <section className="manifesto container" aria-labelledby="manifesto-heading"><p className="eyebrow"><Copy id="Manifesto.8d93af99" fallback="A simple belief" /></p><h2 id="manifesto-heading">{words.map((word, index) => <span className="manifesto-word" key={word + index}>{word} </span>)}<span className="inline-art"><img src="/art/community.webp" alt="" width="1536" height="1024" loading="lazy" /></span></h2><p><Copy id="Manifesto.87331fa9" fallback="Finbharat is building thoughtful technology for a more inclusive financial future, designed around clarity, trust, and the many ways people across India live, work, save, and grow." /></p></section>;
}

const intentions = [
  { icon: MessageCircle, title: 'Less jargon. More understanding.', copy: 'Make financial concepts easier to understand, with everyday language and a little more context.', className: 'clarity-card', note: 'Clarity is a form of inclusion.' },
  { icon: Target, title: 'Plans that start with you.', copy: 'Explore the possibilities behind your goals. Helpful tools to plan with greater confidence.', className: 'planning-card', href: '#calculators', note: 'Find your starting point' },
  { icon: Languages, title: 'Built for the many Indias.', copy: 'Different languages. Different incomes. Different needs. Design that makes room for real lives.', className: 'language-card', note: 'More ways to belong.' },
  { icon: Sparkles, title: 'Technology with a human purpose.', copy: 'Use AI to make information more helpful and accessible, supporting your decisions without pressure.', className: 'purpose-card', href: '#ai-inclusion', note: 'Meet our approach to AI' },
];
function WhatWeDo() {
  const content = usePageContent('/').intentions;
  return <section id="what-we-do" className="section container"><div className="section-heading"><div><p className="eyebrow"><Copy id="WhatWeDo.868b63b1" fallback="What we are building" /></p><h2><Copy id="WhatWeDo.7e7ee950" fallback="Finance that fits" /><br /><Copy id="WhatWeDo.d249611c" fallback="the life you live." /></h2></div><p><Copy id="WhatWeDo.77da3e9e" fallback="Built for real lives, not idealised user journeys." /><br /><Copy id="WhatWeDo.a094df52" fallback="A little more understanding. A little more agency." /></p></div><div className="intentions-grid grid-flow-dense">{intentions.map(({ icon: Icon, className, href }, index) => { const { title, copy, note } = content[index]; return <Card key={title} className={`intention-card ${className} stack-card`} padding="32px" elevation="none" style={{ background: className === 'language-card' ? 'var(--brand-subtle)' : 'var(--surface)', borderRadius: '20px' }}><div className="card-icon"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /></div><h3>{title}</h3><p>{copy}</p>{className === 'language-card' && <div className="card-languages" aria-hidden="true"><span lang="hi"><Copy id="WhatWeDo.ea5a10db" fallback="अ" /></span><span lang="ta"><Copy id="WhatWeDo.9f1c7914" fallback="அ" /></span><span lang="te"><Copy id="WhatWeDo.ecb2e10b" fallback="అ" /></span><span><Copy id="WhatWeDo.6dcd4ce2" fallback="A" /></span></div>}{className === 'clarity-card' && <div className="clarity-graphic" aria-hidden="true"><span /><span /><span /><span /><span /></div>}{href ? <a className="text-link" href={href}>{note}<ArrowUpRight size={17} aria-hidden="true" /></a> : <span className="card-note">{note}</span>}</Card>; })}</div></section>;
}

function Enables() {
  const pillars = usePageContent('/').pillars;
  const [active, setActive] = useState(0);
  return <section id="enables" className="section enables-section"><div className="container enable-inner"><div className="section-heading"><div><p className="eyebrow"><Copy id="Enables.8cb128c9" fallback="A little more possibility" /></p><h2><Copy id="Enables.f5ae9858" fallback="Technology should" /><br /><Copy id="Enables.507857c8" fallback="widen the circle." /></h2></div><p><Copy id="Enables.aab77ce7" fallback="Not everyone starts from the same place." /><br /><Copy id="Enables.2ec0e53c" fallback="Everyone deserves a way forward." /></p></div><div className="horizontal-accordion">{pillars.map((pillar, index) => <article className={`pillar ${active === index ? 'active' : ''}`} key={pillar.title}><h3><button id={`pillar-button-${index}`} className="pillar-trigger" aria-expanded={active === index} aria-controls={`pillar-panel-${index}`} onClick={() => setActive(active === index ? null : index)}><span>{pillar.title}</span><Plus className="pillar-plus" size={18} aria-hidden="true" /></button></h3><div id={`pillar-panel-${index}`} role="region" aria-labelledby={`pillar-button-${index}`} className="pillar-panel" aria-hidden={active !== index} inert={active !== index} onTransitionEnd={() => ScrollTrigger.refresh()}><div className="pillar-panel-inner"><div className="pillar-copy"><h4>{pillar.headline}</h4><p>{pillar.body}</p></div><figure><img src={pillar.image || `/art/${pillar.art}.webp`} alt={pillar.alt} width="1536" height="1024" loading="lazy" /><figcaption>{pillar.caption}</figcaption></figure></div></div></article>)}</div><p className="interaction-hint"><Copy id="Enables.9a887128" fallback="Choose a principle. Explore what it means." /></p></div></section>;
}

function Calculators() {
  const [type, setType] = useState('sip');
  useGSAP(() => { ScrollTrigger.refresh(); }, { dependencies: [type] });
  return <section id="calculators" className="section calculator-section container"><div className="section-heading"><div><p className="eyebrow"><Copy id="Calculators.3011156c" fallback="Make room for your future" /></p><h2><Copy id="Calculators.78549e7c" fallback="Plan with clarity." /></h2></div><p><Copy id="Calculators.136ba772" fallback="A few numbers. A clearer picture." /><br /><Copy id="Calculators.fd3c0735" fallback="Explore what your next step could look like." /></p></div><div className="calculator-tabs" role="tablist" aria-label="Choose a financial calculator">{Object.entries(calculatorInfo).map(([key, { label, Icon }], index) => <button role="tab" id={`calculator-tab-${key}`} aria-selected={type === key} aria-controls="calculator-panel" tabIndex={type === key ? 0 : -1} key={key} onClick={() => setType(key)} onKeyDown={e => { const keys = Object.keys(calculatorInfo); let next; if (e.key === 'ArrowRight') next = (index + 1) % 3; if (e.key === 'ArrowLeft') next = (index + 2) % 3; if (e.key === 'Home') next = 0; if (e.key === 'End') next = 2; if (next !== undefined) { e.preventDefault(); setType(keys[next]); e.currentTarget.parentNode.children[next].focus(); } }}><Icon size={18} strokeWidth={1.6} aria-hidden="true" />{label}</button>)}</div><div role="tabpanel" id="calculator-panel" aria-labelledby={`calculator-tab-${type}`} tabIndex={0}><h3 className="calculator-seo-title">{calculatorInfo[type].title}</h3><p className="calculator-intro">{calculatorInfo[type].intro}</p><Calculator type={type} key={type} embedded /></div></section>;
}

function AISection() {
  const content = usePageContent('/').aiPrinciples;
  const principles = [['Clear explanations', 'Information you can understand, with limitations made visible.', EyeOff], ['Privacy in mind', 'Respect for people and their personal information.', Fingerprint], ['More ways to understand', 'A direction that considers languages, abilities and everyday contexts.', Globe2], ['People in the driver’s seat', 'Helpful guidance that supports your own decisions.', HeartHandshake]];
  return <section id="ai-inclusion" className="section ai-section"><div className="container ai-layout"><div className="ai-copy"><p className="eyebrow"><Copy id="AISection.3f77a048" fallback="Our direction for AI" /></p><h2><Copy id="AISection.c698f940" fallback="Intelligence" /><br /><Copy id="AISection.82b35893" fallback="that serves" /><br /><span><Copy id="AISection.0bc0ff23" fallback="people." /></span></h2><p><Copy id="AISection.b48bd582" fallback="Technology should make the complicated feel a little clearer. And leave the decisions with you." /></p><p className="ai-limit"><Copy id="AISection.b753e517" fallback="These are our design principles. Specific AI capabilities and availability will be shared when confirmed." /></p></div><div className="ai-principles">{principles.map(([_title, _copy, Icon], index) => { const [title, copy] = content[index]; return <div className="ai-principle" key={title}><Icon size={24} strokeWidth={1.4} aria-hidden="true" /><div><h3>{title}</h3><p>{copy}</p></div><Check size={17} aria-hidden="true" /></div>; })}</div></div></section>;
}

function Gallery() {
  const stories = usePageContent('/').gallery;
  return <section className="section container gallery-section"><div className="gallery-sticky-heading"><p className="eyebrow"><Copy id="Gallery.4c9789fd" fallback="A world of possibilities" /></p><h2><Copy id="Gallery.8c98867f" fallback="Every path has a story." /></h2><p><Copy id="Gallery.cf734417" fallback="Different starting points." /><br /><Copy id="Gallery.63c997fb" fallback="A shared belief in what comes next." /></p><a className="text-link" href="/inclusion/"><Copy id="Gallery.3d863188" fallback="Make room for everyone " /><ArrowUpRight size={18} aria-hidden="true" /></a></div><div className="gallery-grid">{stories.map((item, index) => <article className="gallery-card" key={item.art} style={{ '--stack-index': index }}><a href={item.link} className="gallery-card-link"><div className="image-shell"><img src={item.image || `/art/${item.art}.webp`} alt={item.alt} width="1536" height="1024" loading="lazy" /></div><div className="gallery-caption"><p>{item.caption}</p><h3>{item.title}</h3><p className="gallery-body">{item.body}</p><span className="gallery-cta">{item.cta}<ArrowUpRight size={19} aria-hidden="true" /></span></div></a></article>)}</div></section>;
}

function Founders() {
  return <FounderProfiles summary />;
}

function AppPreview() {
  return <div className="app-preview" aria-label="Illustrative Finbharat app preview"><div className="app-preview-top"><div className="sample-avatar">P</div><div><span>Namaste,</span><strong>Sample profile</strong></div><ShieldCheck size={19} aria-hidden="true" /></div><div className="portfolio-preview"><span>Your money at work</span><strong>₹1,24,800</strong><span className="sample-growth">↗ +₹4,800 · illustrative</span><div className="portfolio-mini"><span>Invested<strong>₹1,20,000</strong></span><span>Returns<strong>+₹4,800</strong></span></div><small>Sample data, not a real portfolio</small></div><div className="app-quick-actions">{[['imgIconChartPie1', 'Mutual funds'], ['imgIcon2', 'Fixed deposits'], ['imgIcon3', 'Goals']].map(([icon, text]) => <div key={text}><span><img src={`/figma/${icon}.svg`} width="24" height="24" alt="" /></span><small>{text}</small></div>)}</div><div className="sample-goal"><span>Your next step</span><strong>A home of your own</strong><p>Room to plan, at your pace.</p><div className="sample-progress"><span /></div></div><div className="app-preview-bottom"><MessageCircle size={18} aria-hidden="true" /> A clearer conversation</div></div>;
}

function Downloads() {
  const { apps } = useContent().site;
  const stores = [['ios', '/badges/app-store.svg', 'Download on the App Store', 'iOS download'], ['android', '/badges/google-play.png', 'Get it on Google Play', 'Android download']];
  return <section id="download" className="section container download-section"><div className="download-panel"><div className="download-copy"><p className="eyebrow"><Copy id="Downloads.f5149be7" fallback="Wherever life happens" /></p><h2><Copy id="Downloads.628055cd" fallback="Take Finbharat" /><br /><Copy id="Downloads.73b78599" fallback="with you." /></h2><p><Copy id="Downloads.cc74f9d0" fallback="Clearer financial decisions should be available wherever life happens." /></p><div className="store-buttons">{stores.map(([key, image, alt, label]) => { const body = <><img src={image} alt={alt} width="150" height="45" /><span>{label}</span></>; return apps[key] ? <a className="store-button" key={key} href={apps[key]}>{body}</a> : <button className="store-button" key={key} disabled aria-describedby="store-status">{body}</button>; })}</div>{(!apps.android || !apps.ios) && <p id="store-status" className="store-status"><Copy id="Downloads.f6f48637" fallback="Official store links and availability are awaiting confirmation." /></p>}</div><div className="preview-stage"><span className="preview-orbit orbit-one" aria-hidden="true" /><span className="preview-orbit orbit-two" aria-hidden="true" /><AppPreview /><span className="preview-label"><Copy id="Downloads.f51219a1" fallback="Illustrative app preview" /></span></div></div></section>;
}

function FAQ() {
  const faqs = usePageContent('/').faqs;
  return <section id="faq" className="section container faq-section"><div><p className="eyebrow"><Copy id="FAQ.b779fb09" fallback="A little more understanding" /></p><h2><Copy id="FAQ.adc23b9d" fallback="Good questions." /><br /><Copy id="FAQ.147b35b1" fallback="Clear answers." /></h2><p><Copy id="FAQ.8b4ef646" fallback="Start here. There is always" /><br /><Copy id="FAQ.eb9d9629" fallback="room to understand a little more." /></p></div><div className="faq-list">{faqs.map(([question, answer]) => <MotionDetails className="faq-item" key={question}><summary>{question}<Plus size={19} aria-hidden="true" /></summary><p>{answer}</p></MotionDetails>)}</div></section>;
}

function Footer() {
  const { site } = useContent();
  return <footer className="site-footer"><div className="footer-landscape"><img src={site.assets.footerImage} alt={site.assets.footerAlt} width="1536" height="1024" loading="lazy" /><div className="container"><p><Copy id="Footer.b85117a5" fallback="Many paths." /><br /><strong><Copy id="Footer.4d7391a2" fallback="One shared possibility." /></strong></p><a className="button button-ivory" href="/inclusion/"><Copy id="Footer.cd5d3686" fallback="A place for everyone " /><ArrowUpRight size={18} aria-hidden="true" /></a></div></div><div className="container"><div className="footer-grid">
    <div className="footer-brand"><Wordmark light /><p><Copy id="Footer.f1936991" fallback="A more understandable and inclusive" /><br /><Copy id="Footer.97523157" fallback="financial future for people across India." /></p><span className="footer-motto">{site.tagline}</span></div>
    <div><h3><Copy id="Footer.7c8b4495" fallback="Explore Finbharat" /></h3><a href="/mutual-funds/"><Copy id="Footer.9a657712" fallback="Mutual funds" /></a><a href="/fixed-deposits/"><Copy id="Footer.ebf6c6b4" fallback="Fixed deposits" /></a><a href="/inclusion/"><Copy id="Footer.ec4d487f" fallback="Inclusion" /></a><a href="/about/"><Copy id="Footer.89d46513" fallback="About & cofounders" /></a><a href="/blog/"><Copy id="Footer.0b9d2b23" fallback="Blog" /></a><a href="/media/"><Copy id="Footer.0c77aeec" fallback="Media" /></a><a href="/#download"><Copy id="Footer.c9e9e7b0" fallback="App downloads" /></a></div>
    <div><h3><Copy id="Footer.23fc4dcc" fallback="Plan with clarity" /></h3><a href="/calculators/fd/"><Copy id="Footer.174ee318" fallback="FD calculator" /></a><a href="/calculators/sip/"><Copy id="Footer.016210da" fallback="Mutual fund / SIP calculator" /></a><a href="/calculators/goal/"><Copy id="Footer.9bac8bc0" fallback="Goal-based calculator" /></a></div>
    <div><h3><Copy id="Footer.925338de" fallback="Stay connected" /></h3><a href="/contact/"><Copy id="Footer.b37456c4" fallback="Contact" /></a><a href="/privacy/"><Copy id="Footer.cf01481f" fallback="Privacy" /></a><a href="/terms/"><Copy id="Footer.a55a275a" fallback="Terms" /></a><a href="/about/#founders"><Copy id="Footer.5583392e" fallback="Cofounders on LinkedIn" /></a></div>
  </div><div className="regulatory-note"><span><Copy id="Footer.73ad74eb" fallback="AMFI ARN " />{site.arn}<Copy id="Footer.1b93795b" fallback=" — " />{site.legalName}</span><span><a href="https://www.sebi.gov.in/" rel="noopener noreferrer"><Copy id="Footer.63f6010d" fallback="SEBI website" /></a><Copy id="Footer.1fdf0d90" fallback=" · " /><a href="/terms/"><Copy id="Footer.0d9f4765" fallback="Website terms and conditions" /></a></span></div><div className="footer-bottom"><span><Copy id="Footer.f8dac957" fallback="© " />{new Date().getFullYear()}<Copy id="Footer.9f760a9a" fallback=" Finbharat. All rights reserved." /></span><span><Copy id="Footer.dfca8a2b" fallback="FinBharat Technology Private Limited" /></span><a href="#main" aria-label="Back to top"><Copy id="Footer.d9c883a9" fallback="Back to top " /><ArrowUpRight size={15} aria-hidden="true" /></a></div></div></footer>;
}

function Home() {
  const ref = useRef(null);
  useGSAP((_context, contextSafe) => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro.from('.hero-line > span', { yPercent: 108, rotate: 2, duration: 0.95, stagger: 0.1 }, 0.12)
        .from('.hero-enter', { y: 16, opacity: 0, duration: 0.65, stagger: 0.07 }, 0.35);
      gsap.to('.cinematic-content', { opacity: 0, ease: 'none', scrollTrigger: { trigger: '.cinematic-hero', start: 'top top', end: '55% top', scrub: true } });
      gsap.fromTo('.manifesto-word', { color: '#4A636B' }, { color: '#172B36', stagger: 0.15, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'bottom 65%', scrub: true } });
      gsap.from('.inline-art', { scale: 0.8, rotate: -8, scrollTrigger: { trigger: '.manifesto', start: 'top 80%', end: 'center 50%', scrub: true } });
    });
    let mounted = true;
    document.fonts.ready.then(contextSafe(() => { if (mounted) ScrollTrigger.refresh(); }));
    return () => { mounted = false; media.revert(); };
  }, { scope: ref });
  return <MotionPage><div ref={ref}><Hero /><ProductGateways /><div className="clarity-chapter"><Manifesto /><WhatWeDo /></div><Mission /><PrinciplesRibbon /><div className="inclusion-chapter"><MottoBand compact /><Enables /></div><Calculators /><AISection /><HumanStories /><Gallery /><Founders /><Downloads /><FAQ /></div></MotionPage>;
}

function AppView({ path }) {
  const content = useContent();
  const article = [...content.blog, ...content.media].find(item => item.path === path);
  const type = Object.entries(calculatorInfo).find(([_key, value]) => value.path === path)?.[0];
  const home = path === '/';
  return <><a className="skip-link" href="#main"><Copy id="AppView.0a4470d6" fallback="Skip to content" /></a><Navigation home={home} path={path} /><main id="main" className="w-full max-w-full overflow-x-hidden" tabIndex={-1}>{home ? <Home /> : path === '/mutual-funds/' ? <ProductPage kind="mutual" /> : path === '/fixed-deposits/' ? <ProductPage kind="fixed" /> : path === '/inclusion/' ? <InclusionPage /> : path === '/about/' ? <AboutPage /> : path === '/blog/' ? <EditorialIndex kind="blog" /> : path === '/media/' ? <EditorialIndex kind="media" /> : article ? <ArticlePage article={article} kind={path.startsWith('/blog/') ? 'blog' : 'media'} /> : type ? <section className="container calculator-page"><a className="back-link" href="/#calculators"><Copy id="AppView.d51553a5" fallback="Finbharat " /><ChevronRight size={14} aria-hidden="true" /><Copy id="AppView.1f7b9715" fallback=" Calculators" /></a><p className="eyebrow"><Copy id="AppView.23fc4dcc" fallback="Plan with clarity" /></p><h1>{calculatorInfo[type].title}</h1><p className="calculator-page-intro">{calculatorInfo[type].intro}</p><div className="calculator-route-links">{Object.entries(calculatorInfo).map(([key, value]) => <a href={value.path} aria-current={key === type ? 'page' : undefined} key={key}>{value.label}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</div><Calculator type={type} /><section className="calculator-explanation"><h2>{type === 'fd' ? 'How does the FD calculator work?' : type === 'sip' ? 'How does the SIP calculator work?' : 'How do you plan for a financial goal?'}</h2><p>{type === 'fd' ? 'Enter your principal amount, annual interest rate, tenure and compounding frequency to estimate your fixed deposit maturity value. The invested amount and interest are shown separately so you can understand the calculation.' : type === 'sip' ? 'Enter a monthly contribution, duration and expected annual return to model a systematic investment plan. Add an optional initial investment to see how a starting balance and regular contributions could work together. Expected return is an assumption and can differ from actual market outcomes.' : 'Start with the cost of your goal today and the time you have. The calculator adjusts that cost for inflation, grows your existing savings at the return assumption you choose, and estimates the monthly investment needed to cover the remaining gap.'}</p><h3><Copy id="AppView.7d64223a" fallback="Use estimates to explore possibilities" /></h3><p><Copy id="AppView.cc4692a7" fallback="Try different assumptions to understand how time, savings and return affect your plan. Consider your circumstances and consult an appropriately qualified adviser before making financial decisions." /></p></section></section> : <InformationPage path={path} />}</main><Footer /></>;
}

export default function App({ path = '/', content = defaultContent }) {
  return <ContentProvider content={content} path={path}><AppView path={path} /></ContentProvider>;
}
