import { useId, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Clock3, Globe2, HeartHandshake, Landmark, Languages, Layers3, MapPin, Repeat2, ShieldCheck, Target, TrendingUp } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Calculator, calculatorInfo } from './Calculator';
import { MotionPage } from './MotionPage';
import { MotionDetails } from './Interactive';
import { founders, motto, productContent } from './page-content.mjs';
import { pillars } from './content.mjs';

export function ProductGateways() {
  return <section id="explore" className="section container product-gateways" aria-labelledby="gateway-heading">
    <div className="section-heading scroll-reveal"><div><p className="eyebrow">Two starting points. Your own way forward.</p><h2 id="gateway-heading">Understand more.<br />Move with purpose.</h2></div><p>Explore the basics. Try your numbers.<br />Make a considered next step.</p></div>
    <div className="gateway-grid grid-flow-dense">
      {Object.entries(productContent).map(([key, product]) => <a href={product.path} key={key} className={`gateway-card scroll-reveal ${key === 'fixed' ? 'gateway-fixed' : ''}`}><div className="gateway-copy"><div className="gateway-top">{key === 'mutual' ? <TrendingUp size={24} aria-hidden="true" /> : <Landmark size={24} aria-hidden="true" />}<span className="gateway-arrow"><ArrowUpRight size={24} aria-hidden="true" /></span></div><h3>{product.name}</h3><p>{key === 'mutual' ? 'A longer view. A little more understanding. Explore investing and plan with our SIP calculator.' : 'Clear terms. Thoughtful planning. Understand deposits and explore your maturity estimate.'}</p><span className="gateway-cta">Explore {product.name.toLowerCase()} <ArrowRight size={16} aria-hidden="true" /></span></div><div className="gateway-art"><img src={`/art/${product.art}.webp`} alt="" width="1536" height="1024" loading="lazy" /></div></a>)}
    </div>
  </section>;
}

export function MottoBand({ compact = false }) {
  return <section className={`motto-band ${compact ? 'compact' : ''}`}><div className="container scroll-reveal"><p className="eyebrow">Our motto. Our direction.</p><h2>Keeping wealth simple.<br /><span>For everyone in Bharat.</span></h2><p>Clarity is not a privilege. It is where inclusion begins.</p><div className="motto-signature"><span>Finbharat</span><span>Built around people.</span></div></div></section>;
}

export function FounderProfiles({ summary = false }) {
  return <section id="founders" className="section container founder-profiles" aria-labelledby="founder-heading"><div className="section-heading scroll-reveal"><div><p className="eyebrow">The people behind the purpose</p><h2 id="founder-heading">A shared belief.<br />A human ambition.</h2></div>{summary ? <a className="text-link" href="/about/">Meet the cofounders <ArrowUpRight size={18} aria-hidden="true" /></a> : <p>The cofounders of<br />FinBharat Technology Private Limited.</p>}</div><div className="founder-grid grid-flow-dense">{founders.map((founder, index) => <article className={`founder-profile scroll-reveal ${index === 1 ? 'founder-profile-lavender' : ''}`} key={founder.name}><div className="founder-visual"><img src={index === 0 ? '/founders/d-ramanathan.png' : '/founders/rakesh-k.png'} alt={`${founder.name}, co-founder of Finbharat`} width="1122" height="1402" loading="lazy" /></div><div className="founder-profile-copy"><div className="founder-name-line"><h3>{founder.name}</h3><span>{founder.credential}</span></div><p className="founder-title">{founder.role}</p>{!summary && <p className="founder-biography">{founder.biography}</p>}<p className="founder-location"><MapPin size={14} aria-hidden="true" />{founder.location}</p><a className="text-link" href={founder.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${founder.name} on LinkedIn`}>Connect on LinkedIn <ArrowUpRight size={17} aria-hidden="true" /></a></div></article>)}</div></section>;
}

const conceptIcons = { repeat: Repeat2, layers: Layers3, shield: ShieldCheck, clock: Clock3 };
function LearningTabs({ concepts }) {
  const [active, setActive] = useState(0);
  const [animate, setAnimate] = useState(false);
  const scope = useRef(null);
  const prefix = useId();
  useGSAP(() => {
    ScrollTrigger.refresh();
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from('.learning-panel:not([hidden]) .learning-panel-content', { opacity: 0, y: 8, duration: 0.24, ease: 'power3.out' });
  }, { scope, dependencies: [active, animate], revertOnUpdate: true });
  const choose = (index, animated) => { setAnimate(animated); setActive(index); };
  return <div ref={scope} className="learning-tabs scroll-reveal"><div className="learning-tablist" role="tablist" aria-label="Explore the essentials">{concepts.map((concept, index) => {
    const Icon = conceptIcons[concept.icon];
    return <button key={concept.label} role="tab" id={`${prefix}-tab-${index}`} aria-controls={`${prefix}-panel-${index}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={event => choose(index, event.detail > 0)} onKeyDown={event => { let next; if (event.key === 'ArrowRight') next = (index + 1) % concepts.length; if (event.key === 'ArrowLeft') next = (index + concepts.length - 1) % concepts.length; if (event.key === 'Home') next = 0; if (event.key === 'End') next = concepts.length - 1; if (next !== undefined) { event.preventDefault(); choose(next, false); event.currentTarget.parentElement.children[next].focus(); } }}><Icon size={20} aria-hidden="true" /><span>{concept.label}</span><ArrowUpRight size={16} aria-hidden="true" /></button>;
  })}</div>{concepts.map((concept, index) => <div key={concept.label} role="tabpanel" id={`${prefix}-panel-${index}`} aria-labelledby={`${prefix}-tab-${index}`} className="learning-panel" hidden={active !== index} tabIndex={0}><div className="learning-panel-content"><div className="learning-copy"><h3>{concept.title}</h3><p>{concept.body}</p><div className="learning-takeaway"><ShieldCheck size={18} aria-hidden="true" /><p>{concept.point}</p></div></div><div className={`concept-art ${concept.visual}`} aria-hidden="true"><span /><span /><span /><span /><span /><span /></div></div></div>)}</div>;
}

function PlanningSteps({ steps }) {
  const icons = [Target, Layers3, TrendingUp, Check];
  return <section className="section planning-steps"><div className="container"><div className="section-heading scroll-reveal"><div><p className="eyebrow">A considered way forward</p><h2>Start with understanding.<br />Then take your next step.</h2></div><p>More context. Less pressure.<br />A decision that stays yours.</p></div><div className="planning-step-grid"><div className="story-rail" aria-hidden="true" />{steps.map(([title, copy], index) => { const Icon = icons[index]; return <article className="planning-step scroll-reveal" key={title}><div className="planning-step-icon"><Icon size={23} aria-hidden="true" /></div><h3>{title}</h3><p>{copy}</p></article>; })}</div></div></section>;
}

function PageFAQ({ questions }) {
  return <section className="section container faq-section page-faq"><div className="scroll-reveal"><p className="eyebrow">Questions are a good place to start</p><h2>Understand a<br />little more.</h2></div><div className="faq-list scroll-reveal">{questions.map(([question, answer]) => <MotionDetails className="faq-item" key={question}><summary>{question}<ChevronDown size={18} aria-hidden="true" /></summary><p>{answer}</p></MotionDetails>)}</div></section>;
}

export function ProductPage({ kind }) {
  const product = productContent[kind];
  return <MotionPage className={`product-page product-${kind}`}>
    <section className="container product-hero"><div className="product-hero-copy"><a className="breadcrumb page-enter" href="/">Finbharat <ArrowUpRight size={13} aria-hidden="true" /></a><p className="eyebrow page-enter">{product.name} · Plan with understanding</p><h1 className="page-enter">{product.headline[0]}<br /><span>{product.headline[1]}</span></h1><p className="product-intro page-enter">{product.introduction}</p><div className="hero-actions page-enter"><a className="button" href="#product-calculator">Try the {kind === 'mutual' ? 'SIP' : 'FD'} calculator <ArrowUpRight size={18} aria-hidden="true" /></a><a className="button button-outline" href="#understand">Understand the basics <ChevronDown size={18} aria-hidden="true" /></a></div><p className="product-hero-note page-enter">{kind === 'mutual' ? 'Market-linked investments. Informed decisions.' : 'Read the terms. Explore the estimate.'}</p></div><figure className="product-hero-art page-enter"><div className="page-image"><img src={`/art/${product.art}.webp`} alt={kind === 'mutual' ? pillars[2].alt : pillars[0].alt} width="1536" height="1024" fetchPriority="high" /></div><figcaption>{product.caption}<ArrowUpRight size={19} aria-hidden="true" /></figcaption></figure></section>
    <section id="understand" className="section container product-understand"><div className="section-heading scroll-reveal"><div><p className="eyebrow">Knowledge before the next step</p><h2>{product.heading}</h2></div><p>{product.explanation} <a className="source-link" href={product.source} target="_blank" rel="noopener noreferrer">{product.sourceLabel}<ArrowUpRight size={12} aria-hidden="true" /></a></p></div><LearningTabs concepts={product.concepts} />{kind === 'mutual' && <p className="product-risk-note">Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.</p>}</section>
    <PlanningSteps steps={product.steps} />
    <section id="product-calculator" className="section container product-calculator"><div className="section-heading scroll-reveal"><div><p className="eyebrow">Plan with clarity</p><h2>{product.calculatorHeading}</h2></div><p>{product.calculatorCopy}</p></div><h3 className="calculator-seo-title">{calculatorInfo[product.calculator].title}</h3><p className="calculator-intro">Your assumptions. An illustrative estimate. No account needed.</p><Calculator type={product.calculator} embedded /></section>
    <MottoBand compact /><PageFAQ questions={product.faqs} /><section className="container next-page scroll-reveal"><div><p className="eyebrow">Keep exploring</p><h2>{kind === 'mutual' ? 'Understand fixed deposits.' : 'Understand mutual funds.'}</h2></div><a className="button" href={kind === 'mutual' ? '/fixed-deposits/' : '/mutual-funds/'}>Explore {kind === 'mutual' ? 'fixed deposits' : 'mutual funds'} <ArrowUpRight size={18} aria-hidden="true" /></a></section>
  </MotionPage>;
}

export function InclusionPage() {
  const commitments = [
    [Languages, 'Different languages. Equal respect.', 'Clear communication starts with recognising the languages and contexts people feel at home in.'],
    [HeartHandshake, 'Every income. Every starting point.', 'Financial understanding should be useful across different incomes and experiences, including those often left out.'],
    [Globe2, 'More ways to take part.', 'Consider different abilities, access needs and levels of digital confidence from the beginning.'],
    [ShieldCheck, 'Agency, without pressure.', 'Make the assumptions clear. Explain the limitations. Give people space to make their own decisions.'],
  ];
  return <MotionPage className="inclusion-page"><section className="container inclusion-hero"><div><p className="eyebrow page-enter">Inclusion is the foundation</p><h1 className="page-enter">Wealth belongs<br />to <span>everyone.</span></h1><p className="page-enter">Bharat is many languages, many lives, and many starting points. Our ambition is simple: make financial understanding more accessible to all of them.</p><a className="button page-enter" href="#inclusion-principles">See what guides us <ArrowUpRight size={18} aria-hidden="true" /></a></div><figure className="inclusion-art page-enter page-image"><img src="/art/community.webp" alt={pillars[1].alt} width="1536" height="1024" fetchPriority="high" /></figure></section><MottoBand /><section id="inclusion-principles" className="section container"><div className="section-heading scroll-reveal"><div><p className="eyebrow">Designed for the many Indias</p><h2>Real lives.<br />A wider circle.</h2></div><p>Inclusion is a practice.<br />These are the principles we are building around.</p></div><div className="inclusion-grid grid-flow-dense">{commitments.map(([Icon, title, copy]) => <article className="inclusion-commitment scroll-reveal" key={title}><Icon size={28} strokeWidth={1.4} aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></article>)}</div></section><section className="inclusion-promise section"><div className="container"><p className="eyebrow scroll-reveal">Intelligence that serves people</p><h2 className="scroll-reveal">More helpful.<br />More understandable.<br /><span>Always human-led.</span></h2><div className="inclusion-promise-bottom scroll-reveal"><p>Our AI direction considers language, privacy, clarity and accessibility. It should support human decisions and be transparent about its limitations. Specific capabilities will be shared when confirmed.</p><a className="text-link" href="/#ai-inclusion">Explore our AI direction <ArrowUpRight size={18} aria-hidden="true" /></a></div></div></section><ProductGateways /><section className="container next-page scroll-reveal"><div><p className="eyebrow">People behind the purpose</p><h2>A shared belief in Bharat.</h2></div><a className="button" href="/about/">Meet our cofounders <ArrowUpRight size={18} aria-hidden="true" /></a></section></MotionPage>;
}

export function AboutPage() {
  return <MotionPage className="about-page"><section className="container about-hero"><p className="eyebrow page-enter">About Finbharat</p><h1 className="page-enter">Big belief.<br /><span>Human ambition.</span></h1><div className="about-introduction page-enter"><p>FinBharat Technology Private Limited is building toward a more understandable and inclusive financial future for people across India.</p><p>{motto} That is the belief behind the technology, and the reason we start with clarity, trust and real lives.</p></div><div className="about-hero-footer page-enter"><span>Purpose before complexity.</span><a className="text-link" href="#founders">Meet the cofounders <ChevronDown size={17} aria-hidden="true" /></a></div></section><FounderProfiles /><MottoBand /><section className="section container about-values"><div className="section-heading scroll-reveal"><div><p className="eyebrow">What we are here to build</p><h2>More understanding.<br />More possibility.</h2></div><p>Thoughtful technology.<br />A responsible direction.</p></div><div className="about-value-grid grid-flow-dense">{[['Clarity', 'Explain the complicated. Make assumptions visible. Help people understand the choices in front of them.'], ['Trust', 'Respect privacy, communicate limitations, and keep people in control of their decisions.'], ['Inclusion', 'Design for different languages, income levels, abilities, access needs and levels of digital confidence.']].map(([title, body]) => <article className="scroll-reveal" key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></section><section className="container next-page scroll-reveal"><div><p className="eyebrow">Our purpose, in practice</p><h2>Make room for everyone.</h2></div><a className="button" href="/inclusion/">Explore our inclusion principles <ArrowUpRight size={18} aria-hidden="true" /></a></section></MotionPage>;
}
