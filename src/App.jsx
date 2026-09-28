import { useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronRight, EyeOff, Fingerprint, Globe2, HeartHandshake, Languages, Menu, MessageCircle, Plus, ShieldCheck, Sparkles, Target, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Card } from './BrandCard';
import { Calculator, calculatorInfo } from './Calculator';
import { faqs, pillars } from './content.mjs';
import { AboutPage, FounderProfiles, InclusionPage, MottoBand, ProductGateways, ProductPage } from './Pages';
import { MotionPage } from './MotionPage';
import { MotionDetails, PrinciplesRibbon } from './Interactive';
import { ScrollVideoHero } from './ScrollVideoHero';
import { BharatWord } from './BharatWord';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Wordmark({ light = false }) {
  return <a className={`wordmark ${light ? 'light' : ''}`} href="/" aria-label="Finbharat home">finbharat<span className="wordmark-dot" aria-hidden="true" /></a>;
}

function Navigation({ home, path }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const items = [['Mutual funds', '/mutual-funds/'], ['Fixed deposits', '/fixed-deposits/'], ['Inclusion', '/inclusion/'], ['About', '/about/'], ['Calculators', home ? '#calculators' : '/#calculators']];
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
      <div className="desktop-nav">{items.map(([label, href]) => <a key={label} href={href} aria-current={path === href ? 'page' : undefined}>{label}</a>)}</div>
      <a className="button nav-download" href={download}>Download the app <ArrowUpRight size={16} aria-hidden="true" /></a>
      <button className="menu-toggle icon-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} onKeyDown={event => { if (event.key === 'Escape' && open) close(); }}>{open ? <X /> : <Menu />}</button>
    </nav>
    <div id="mobile-navigation" className="mobile-nav" hidden={!open} onKeyDown={event => { if (event.key === 'Escape') close(); }}>
      {items.map(([label, href]) => <a key={label} href={href} aria-current={path === href ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</a>)}
      <a href={download} onClick={() => setOpen(false)}>Download the app</a>
    </div>
  </header>;
}

function Hero() {
  return <>
    <ScrollVideoHero>
      <div className="cinematic-content container">
        <p className="eyebrow hero-enter">Built for the way Bharat moves.</p>
        <BharatWord />
        <p className="cinematic-description hero-enter">A clearer path to your financial future.<br /> Thoughtful tools. Human understanding. Your own way forward.</p>
        <div className="hero-actions hero-enter"><a className="button button-ivory" href="#explore">Explore Finbharat <ArrowUpRight size={18} aria-hidden="true" /></a><a className="button button-glass" href="#calculators">Try a calculator <ArrowRight size={18} aria-hidden="true" /></a></div>
      </div>
      <div className="cinematic-bottom container hero-enter"><p>Different paths.<br /><span>Shared possibilities.</span></p><a href="#explore" className="cinematic-scroll"><span>Scroll to explore</span><span className="scroll-circle"><ChevronDown size={18} aria-hidden="true" /></span></a><p>Built around real lives.<br /><span>At your pace.</span></p></div>
    </ScrollVideoHero>
    <div className="language-bar container"><p>Many lives.<br /><strong>One more inclusive future.</strong></p><div className="language-line" aria-label="A future across languages"><span lang="hi">नमस्ते</span><span lang="ta">வணக்கம்</span><span lang="te">నమస్కారం</span><span lang="kn">ನಮಸ್ಕಾರ</span><span>Hello.</span></div></div>
  </>;
}

function Manifesto() {
  const words = 'Finance becomes powerful when it becomes clear.'.split(' ');
  return <section className="manifesto container" aria-labelledby="manifesto-heading"><p className="eyebrow">A simple belief</p><h2 id="manifesto-heading">{words.map((word, index) => <span className="manifesto-word" key={word + index}>{word} </span>)}<span className="inline-art"><img src="/art/community.webp" alt="" width="1536" height="1024" loading="lazy" /></span></h2><p>Finbharat is building thoughtful technology for a more inclusive financial future, designed around clarity, trust, and the many ways people across India live, work, save, and grow.</p></section>;
}

const intentions = [
  { icon: MessageCircle, title: 'Less jargon. More understanding.', copy: 'Make financial concepts easier to understand, with everyday language and a little more context.', className: 'clarity-card', note: 'Clarity is a form of inclusion.' },
  { icon: Target, title: 'Plans that start with you.', copy: 'Explore the possibilities behind your goals. Helpful tools to plan with greater confidence.', className: 'planning-card', href: '#calculators', note: 'Find your starting point' },
  { icon: Languages, title: 'Built for the many Indias.', copy: 'Different languages. Different incomes. Different needs. Design that makes room for real lives.', className: 'language-card', note: 'More ways to belong.' },
  { icon: Sparkles, title: 'Technology with a human purpose.', copy: 'Use AI to make information more helpful and accessible, supporting your decisions without pressure.', className: 'purpose-card', href: '#ai-inclusion', note: 'Meet our approach to AI' },
];
function WhatWeDo() {
  return <section id="what-we-do" className="section container"><div className="section-heading"><div><p className="eyebrow">What we are building</p><h2>Finance that fits<br />the life you live.</h2></div><p>Built for real lives, not idealised user journeys.<br />A little more understanding. A little more agency.</p></div><div className="intentions-grid grid-flow-dense">{intentions.map(({ icon: Icon, title, copy, className, href, note }) => <Card key={title} className={`intention-card ${className} stack-card`} padding="32px" elevation="none" style={{ background: className === 'language-card' ? 'var(--brand-subtle)' : 'var(--surface)', borderRadius: '20px' }}><div className="card-icon"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /></div><h3>{title}</h3><p>{copy}</p>{className === 'language-card' && <div className="card-languages" aria-hidden="true"><span lang="hi">अ</span><span lang="ta">அ</span><span lang="te">అ</span><span>A</span></div>}{className === 'clarity-card' && <div className="clarity-graphic" aria-hidden="true"><span /><span /><span /><span /><span /></div>}{href ? <a className="text-link" href={href}>{note}<ArrowUpRight size={17} aria-hidden="true" /></a> : <span className="card-note">{note}</span>}</Card>)}</div></section>;
}

function Enables() {
  const [active, setActive] = useState(0);
  return <section id="enables" className="section enables-section"><div className="container enable-inner"><div className="section-heading"><div><p className="eyebrow">A little more possibility</p><h2>Technology should<br />widen the circle.</h2></div><p>Not everyone starts from the same place.<br />Everyone deserves a way forward.</p></div><div className="horizontal-accordion">{pillars.map((pillar, index) => <article className={`pillar ${active === index ? 'active' : ''}`} key={pillar.title}><h3><button id={`pillar-button-${index}`} className="pillar-trigger" aria-expanded={active === index} aria-controls={`pillar-panel-${index}`} onClick={() => setActive(active === index ? null : index)}><span>{pillar.title}</span><Plus className="pillar-plus" size={18} aria-hidden="true" /></button></h3><div id={`pillar-panel-${index}`} role="region" aria-labelledby={`pillar-button-${index}`} className="pillar-panel" aria-hidden={active !== index} inert={active !== index} onTransitionEnd={() => ScrollTrigger.refresh()}><div className="pillar-panel-inner"><div className="pillar-copy"><h4>{pillar.headline}</h4><p>{pillar.body}</p></div><figure><img src={`/art/${pillar.art}.webp`} alt={pillar.alt} width="1536" height="1024" loading="lazy" /><figcaption>{pillar.caption}</figcaption></figure></div></div></article>)}</div><p className="interaction-hint">Choose a principle. Explore what it means.</p></div></section>;
}

function Calculators() {
  const [type, setType] = useState('sip');
  useGSAP(() => { ScrollTrigger.refresh(); }, { dependencies: [type] });
  return <section id="calculators" className="section calculator-section container"><div className="section-heading"><div><p className="eyebrow">Make room for your future</p><h2>Plan with clarity.</h2></div><p>A few numbers. A clearer picture.<br />Explore what your next step could look like.</p></div><div className="calculator-tabs" role="tablist" aria-label="Choose a financial calculator">{Object.entries(calculatorInfo).map(([key, { label, Icon }], index) => <button role="tab" id={`calculator-tab-${key}`} aria-selected={type === key} aria-controls="calculator-panel" tabIndex={type === key ? 0 : -1} key={key} onClick={() => setType(key)} onKeyDown={e => { const keys = Object.keys(calculatorInfo); let next; if (e.key === 'ArrowRight') next = (index + 1) % 3; if (e.key === 'ArrowLeft') next = (index + 2) % 3; if (e.key === 'Home') next = 0; if (e.key === 'End') next = 2; if (next !== undefined) { e.preventDefault(); setType(keys[next]); e.currentTarget.parentNode.children[next].focus(); } }}><Icon size={18} strokeWidth={1.6} aria-hidden="true" />{label}</button>)}</div><div role="tabpanel" id="calculator-panel" aria-labelledby={`calculator-tab-${type}`} tabIndex={0}><h3 className="calculator-seo-title">{calculatorInfo[type].title}</h3><p className="calculator-intro">{calculatorInfo[type].intro}</p><Calculator type={type} key={type} embedded /></div></section>;
}

function AISection() {
  const principles = [['Clear explanations', 'Information you can understand, with limitations made visible.', EyeOff], ['Privacy in mind', 'Respect for people and their personal information.', Fingerprint], ['More ways to understand', 'A direction that considers languages, abilities and everyday contexts.', Globe2], ['People in the driver’s seat', 'Helpful guidance that supports your own decisions.', HeartHandshake]];
  return <section id="ai-inclusion" className="section ai-section"><div className="container ai-layout"><div className="ai-copy"><p className="eyebrow">Our direction for AI</p><h2>Intelligence<br />that serves<br /><span>people.</span></h2><p>Technology should make the complicated feel a little clearer. And leave the decisions with you.</p><p className="ai-limit">These are our design principles. Specific AI capabilities and availability will be shared when confirmed.</p></div><div className="ai-principles">{principles.map(([title, copy, Icon]) => <div className="ai-principle" key={title}><Icon size={24} strokeWidth={1.4} aria-hidden="true" /><div><h3>{title}</h3><p>{copy}</p></div><Check size={17} aria-hidden="true" /></div>)}</div></div></section>;
}

function Gallery() {
  const stories = [
    { art: 'community', title: 'Connected, we go further.', caption: 'A wider circle of possibility.', body: 'Different languages, abilities and experiences deserve thoughtful design. Our principles begin with making financial information easier to understand.', alt: pillars[1].alt, link: '/inclusion/', cta: 'Our inclusion principles' },
    { art: 'milestones', title: 'Small steps. Meaningful milestones.', caption: 'A future shaped around your goals.', body: 'Give a future plan some room today. Explore how time, inflation and regular contributions could shape the amount you need to save.', alt: pillars[2].alt, link: '/calculators/goal/', cta: 'Plan a goal' },
    { art: 'pathways', title: 'There is more than one way.', caption: 'Space for the life you want to live.', body: 'Your priorities can change, and your financial journey can too. Meet the people and the purpose behind a more human approach to wealth.', alt: pillars[0].alt, link: '/about/', cta: 'The belief behind Finbharat' },
  ];
  return <section className="section container gallery-section"><div className="gallery-sticky-heading"><p className="eyebrow">A world of possibilities</p><h2>Every path has a story.</h2><p>Different starting points.<br />A shared belief in what comes next.</p><a className="text-link" href="/inclusion/">Make room for everyone <ArrowUpRight size={18} aria-hidden="true" /></a></div><div className="gallery-grid">{stories.map((item, index) => <article className="gallery-card" key={item.art} style={{ '--stack-index': index }}><a href={item.link} className="gallery-card-link"><div className="image-shell"><img src={`/art/${item.art}.webp`} alt={item.alt} width="1536" height="1024" loading="lazy" /></div><div className="gallery-caption"><p>{item.caption}</p><h3>{item.title}</h3><p className="gallery-body">{item.body}</p><span className="gallery-cta">{item.cta}<ArrowUpRight size={19} aria-hidden="true" /></span></div></a></article>)}</div></section>;
}

function Founders() {
  return <FounderProfiles summary />;
}

function AppPreview() {
  return <div className="app-preview" aria-label="Illustrative Finbharat app preview"><div className="app-preview-top"><div className="sample-avatar">P</div><div><span>Namaste,</span><strong>Sample profile</strong></div><ShieldCheck size={19} aria-hidden="true" /></div><div className="portfolio-preview"><span>Your money at work</span><strong>₹1,24,800</strong><span className="sample-growth">↗ +₹4,800 · illustrative</span><div className="portfolio-mini"><span>Invested<strong>₹1,20,000</strong></span><span>Returns<strong>+₹4,800</strong></span></div><small>Sample data, not a real portfolio</small></div><div className="app-quick-actions">{[['imgIconChartPie1', 'Mutual funds'], ['imgIcon2', 'Fixed deposits'], ['imgIcon3', 'Goals']].map(([icon, text]) => <div key={text}><span><img src={`/figma/${icon}.svg`} width="24" height="24" alt="" /></span><small>{text}</small></div>)}</div><div className="sample-goal"><span>Your next step</span><strong>A home of your own</strong><p>Room to plan, at your pace.</p><div className="sample-progress"><span /></div></div><div className="app-preview-bottom"><MessageCircle size={18} aria-hidden="true" /> A clearer conversation</div></div>;
}

function Downloads() {
  return <section id="download" className="section container download-section"><div className="download-panel"><div className="download-copy"><p className="eyebrow">Wherever life happens</p><h2>Take Finbharat<br />with you.</h2><p>Clearer financial decisions should be available wherever life happens.</p><div className="store-buttons"><button className="store-button" disabled aria-describedby="store-status"><img src="/badges/app-store.svg" alt="Download on the App Store" width="150" height="45" /><span>iOS download</span></button><button className="store-button" disabled aria-describedby="store-status"><img src="/badges/google-play.png" alt="Get it on Google Play" width="150" height="58" /><span>Android download</span></button></div><p id="store-status" className="store-status">Official store links and availability are awaiting confirmation.</p><details className="store-placeholders"><summary>Store link placeholders</summary><p>[Google Play Store URL]</p><p>[Apple App Store URL]</p></details></div><div className="preview-stage"><span className="preview-orbit orbit-one" aria-hidden="true" /><span className="preview-orbit orbit-two" aria-hidden="true" /><AppPreview /><span className="preview-label">Illustrative app preview</span></div></div></section>;
}

function FAQ() {
  return <section id="faq" className="section container faq-section"><div><p className="eyebrow">A little more understanding</p><h2>Good questions.<br />Clear answers.</h2><p>Start here. There is always<br />room to understand a little more.</p></div><div className="faq-list">{faqs.map(([question, answer]) => <MotionDetails className="faq-item" key={question}><summary>{question}<Plus size={19} aria-hidden="true" /></summary><p>{answer}</p></MotionDetails>)}</div></section>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-landscape"><img src="/art/pathways.webp" alt="An illustrated winding path through teal hills toward a shared horizon" width="1536" height="1024" loading="lazy" /><div className="container"><p>Many paths.<br /><strong>One shared possibility.</strong></p><a className="button button-ivory" href="/inclusion/">A place for everyone <ArrowUpRight size={18} aria-hidden="true" /></a></div></div><div className="container"><div className="footer-grid">
    <div className="footer-brand"><Wordmark light /><p>A more understandable and inclusive<br />financial future for people across India.</p><span className="footer-motto">Keeping wealth simple. For everyone in Bharat.</span></div>
    <div><h3>Explore Finbharat</h3><a href="/mutual-funds/">Mutual funds</a><a href="/fixed-deposits/">Fixed deposits</a><a href="/inclusion/">Inclusion</a><a href="/about/">About &amp; cofounders</a><a href="/#download">App downloads</a></div>
    <div><h3>Plan with clarity</h3><a href="/calculators/fd/">FD calculator</a><a href="/calculators/sip/">Mutual fund / SIP calculator</a><a href="/calculators/goal/">Goal-based calculator</a></div>
    <div><h3>Stay connected</h3><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/about/#founders">Cofounders on LinkedIn</a></div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} Finbharat. All rights reserved.</span><span>FinBharat Technology Private Limited</span><a href="#main" aria-label="Back to top">Back to top <ArrowUpRight size={15} aria-hidden="true" /></a></div></div></footer>;
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
  return <MotionPage><div ref={ref}><Hero /><ProductGateways /><div className="clarity-chapter"><Manifesto /><WhatWeDo /></div><PrinciplesRibbon /><div className="inclusion-chapter"><MottoBand compact /><Enables /></div><Calculators /><AISection /><Gallery /><Founders /><Downloads /><FAQ /></div></MotionPage>;
}

const pageCopy = {
  '/privacy/': ['Privacy', 'A clear view of your information.', 'The financial calculators on this website run locally in your browser. The calculator values are not submitted to a backend, and this static site does not implement analytics or account creation. This site has no company privacy policy supplied yet. It should not be read as the policy for a future Finbharat app.', '[Verified Privacy Policy]', 'The official company privacy policy will be added when supplied.'],
  '/terms/': ['Terms', 'Clear expectations matter.', 'The calculators are illustrative tools, not financial advice or offers of financial products. They use the assumptions you enter and do not account for all real-world factors. Actual returns, rates, taxes and outcomes may vary. Official company terms have not been supplied.', '[Verified Terms of Use]', 'Company terms and any applicable app terms will be added when verified.'],
  '/contact/': ['Contact', 'A conversation starts with a hello.', 'Verified contact and social details have not been supplied. The placeholders below will be replaced with official information when available.', '[Contact Email]', '[Contact Details]'],
};
function InformationPage({ path }) {
  const [label, heading, body, placeholder, ending] = pageCopy[path] || ['Page not found', 'Let’s find your way back.', 'This page does not exist. Explore Finbharat or try one of the calculators.', '', ''];
  return <section className="container information-page"><p className="eyebrow">{label}</p><h1>{heading}</h1><p>{body}</p>{placeholder && <div className="information-placeholder"><h2>{placeholder}</h2><p>{ending}</p></div>}{path === '/contact/' && <div id="social" className="information-placeholder"><h2>Social links</h2><p>[LinkedIn URL]</p><p>[Instagram URL]</p><p>[Social Profile URLs]</p></div>}<a className="button" href="/">Explore Finbharat <ArrowRight size={18} aria-hidden="true" /></a></section>;
}

export default function App({ path = '/' }) {
  const type = Object.entries(calculatorInfo).find(([_key, value]) => value.path === path)?.[0];
  const home = path === '/';
  return <><a className="skip-link" href="#main">Skip to content</a><Navigation home={home} path={path} /><main id="main" className="w-full max-w-full overflow-x-hidden" tabIndex={-1}>{home ? <Home /> : path === '/mutual-funds/' ? <ProductPage kind="mutual" /> : path === '/fixed-deposits/' ? <ProductPage kind="fixed" /> : path === '/inclusion/' ? <InclusionPage /> : path === '/about/' ? <AboutPage /> : type ? <section className="container calculator-page"><a className="back-link" href="/#calculators">Finbharat <ChevronRight size={14} aria-hidden="true" /> Calculators</a><p className="eyebrow">Plan with clarity</p><h1>{calculatorInfo[type].title}</h1><p className="calculator-page-intro">{calculatorInfo[type].intro}</p><div className="calculator-route-links">{Object.entries(calculatorInfo).map(([key, value]) => <a href={value.path} aria-current={key === type ? 'page' : undefined} key={key}>{value.label}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</div><Calculator type={type} /><section className="calculator-explanation"><h2>{type === 'fd' ? 'How does the FD calculator work?' : type === 'sip' ? 'How does the SIP calculator work?' : 'How do you plan for a financial goal?'}</h2><p>{type === 'fd' ? 'Enter your principal amount, annual interest rate, tenure and compounding frequency to estimate your fixed deposit maturity value. The invested amount and interest are shown separately so you can understand the calculation.' : type === 'sip' ? 'Enter a monthly contribution, duration and expected annual return to model a systematic investment plan. Add an optional initial investment to see how a starting balance and regular contributions could work together. Expected return is an assumption and can differ from actual market outcomes.' : 'Start with the cost of your goal today and the time you have. The calculator adjusts that cost for inflation, grows your existing savings at the return assumption you choose, and estimates the monthly investment needed to cover the remaining gap.'}</p><h3>Use estimates to explore possibilities</h3><p>Try different assumptions to understand how time, savings and return affect your plan. Consider your circumstances and consult an appropriately qualified adviser before making financial decisions.</p></section></section> : <InformationPage path={path} />}</main><Footer /></>;
}
