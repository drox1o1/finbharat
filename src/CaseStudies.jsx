import { ArrowRight, ArrowUpRight, Landmark, TrendingUp } from 'lucide-react';
import { useContent } from './cms/Content';
import { MotionPage } from './MotionPage';
import { calculateFD, calculateSIP, formatINR } from './calculations.mjs';
import './case-studies.css';

function Disclosure({ compact = false }) {
  return <p className={compact ? 'case-disclosure compact' : 'case-disclosure'}>Fictional, illustrative {compact ? 'story' : 'stories'}. {compact ? 'No customer outcome is claimed.' : 'These are planning examples, not customer experiences or financial recommendations.'}</p>;
}

function StoryCard({ story, level = 3 }) {
  const Heading = level === 2 ? 'h2' : 'h3';
  return <article className="case-card scroll-reveal"><a href={story.path} className="case-card-link"><figure><img src={story.image} alt={story.imageAlt} width="900" height="1125" loading="lazy" /></figure><div className="case-card-copy"><p className="eyebrow">{story.profile.goal}</p><Heading>{story.title}</Heading><p>{story.excerpt}</p><div className="case-card-bottom"><span>{story.profile.occupation}{story.profile.city && <><br />{story.profile.city}</>}</span><ArrowUpRight size={20} aria-hidden="true" /></div><span className="case-card-action">Explore the planning story <span className="sr-only">of {story.profile.name}</span></span></div></a></article>;
}

function Stories({ home }) {
  const content = useContent();
  const fields = content.pages['/case-studies/'].fields;
  const items = home ? content.caseStudies.slice(0, 3) : content.caseStudies;
  return <section id={home ? 'planning-stories' : undefined} className={`container section case-stories ${home ? '' : 'case-index'}`}><div className="section-heading scroll-reveal"><div><p className="eyebrow">{fields.eyebrow}</p>{home ? <h2>{fields.homeHeading[0]}<br />{fields.homeHeading[1]}</h2> : <h1>{fields.heading}</h1>}</div><div className="case-section-intro"><p>{home ? fields.homeIntroduction : fields.introduction}</p>{home && <a className="text-link" href="/case-studies/">All planning stories <ArrowUpRight size={18} aria-hidden="true" /></a>}</div></div><Disclosure />{items.length ? <div className="case-grid">{items.map(story => <StoryCard key={story.slug} story={story} level={home ? 3 : 2} />)}</div> : <div className="editorial-empty"><h2>{fields.emptyTitle}</h2><p>{fields.emptyCopy}</p><a className="button" href="/calculators/goal/">Explore a goal <ArrowRight size={18} aria-hidden="true" /></a></div>}</section>;
}
export function CaseStudiesSection() { return <Stories home />; }
export function CaseStudiesIndex() { return <MotionPage><Stories /></MotionPage>; }

function Estimate({ kind, values }) {
  const fd = kind === 'fd';
  const result = fd ? calculateFD(values) : calculateSIP(values);
  const title = fd ? 'A defined timeline.' : 'A longer view.';
  const frequency = { 1: 'Yearly', 2: 'Half-yearly', 4: 'Quarterly', 12: 'Monthly' };
  return <section className={`case-estimate ${fd ? 'fd-example' : 'sip-example'} scroll-reveal`} aria-label={fd ? 'Illustrative FD example' : 'Illustrative SIP example'}><div className="case-estimate-top"><p className="eyebrow">{fd ? 'Fixed deposit example' : 'Mutual fund / SIP example'}</p>{fd ? <Landmark size={23} aria-hidden="true" /> : <TrendingUp size={23} aria-hidden="true" />}</div><h3>{title}</h3><dl className="case-assumptions">{fd ? <div><dt>Deposit amount</dt><dd>{formatINR(values.principal)}</dd></div> : <><div><dt>Monthly contribution</dt><dd>{formatINR(values.monthly)}</dd></div>{values.initial > 0 && <div><dt>Initial investment</dt><dd>{formatINR(values.initial)}</dd></div>}</>}<div><dt>Time horizon</dt><dd>{values.years} {values.years === 1 ? 'year' : 'years'}</dd></div><div><dt>Assumed annual {fd ? 'rate' : 'return'}</dt><dd>{values.rate}%</dd></div>{fd && <div><dt>Compounding</dt><dd>{frequency[values.frequency]}</dd></div>}</dl><div className="case-estimated-value"><p>Estimated {fd ? 'maturity' : 'future'} value</p><output>{formatINR(result.final)}</output></div><dl className="case-breakdown"><div><dt>{fd ? 'Original deposit' : 'Total contributions'}</dt><dd>{formatINR(result.invested)}</dd></div><div><dt>Estimated {fd ? 'interest' : 'growth'}</dt><dd>{formatINR(result.growth)}</dd></div></dl><p className="case-estimate-note">{fd ? 'Sample rate, not a deposit offer. Check actual institution and withdrawal terms.' : 'Constant return assumed; actual returns fluctuate and may be negative. Contributions assumed at the start of each month.'}</p><a className="text-link" href={`/calculators/${kind}/`}>Try your own assumptions <ArrowRight size={17} aria-hidden="true" /></a></section>;
}

export function CaseStudyPage({ story }) {
  const others = useContent().caseStudies.filter(item => item.slug !== story.slug).slice(0, 2);
  return <MotionPage className="case-detail"><article><header className="container case-hero"><div className="case-hero-copy"><a className="breadcrumb page-enter" href="/case-studies/">All planning stories <ArrowRight size={15} aria-hidden="true" /></a><p className="eyebrow page-enter">{story.profile.goal}</p><h1 className="page-enter">{story.title}</h1><p className="case-deck page-enter">{story.excerpt}</p><dl className="case-profile page-enter"><div><dt>Age</dt><dd>{story.profile.age}</dd></div><div><dt>Starting point</dt><dd>{story.profile.occupation}</dd></div>{story.profile.city && <div><dt>City</dt><dd>{story.profile.city}</dd></div>}</dl><Disclosure compact /></div><figure className="case-hero-image page-enter"><img src={story.image} alt={story.imageAlt} width="900" height="1125" fetchPriority="high" /></figure></header><div className="container case-narrative"><div className="prose" dangerouslySetInnerHTML={{ __html: story.html }} /></div><section className="container case-numbers section" aria-labelledby="case-numbers-heading"><div className="section-heading scroll-reveal"><div><p className="eyebrow">Make the assumptions visible</p><h2 id="case-numbers-heading">What could the numbers look like?</h2></div><p>Separate examples, with separate timelines.<br />Calculated using Finbharat’s FD and SIP tools.</p></div><div className="case-estimates">{story.examples.fd && <Estimate kind="fd" values={story.examples.fd} />}{story.examples.sip && <Estimate kind="sip" values={story.examples.sip} />}</div><p className="case-disclosure">Illustrative estimates only. Taxes, fees, inflation and early withdrawals are excluded. These examples are not a combined portfolio forecast or proof that a goal is funded. Consider your circumstances and appropriate professional advice.</p><a className="button button-outline" href="/calculators/goal/">Explore your goal <ArrowUpRight size={18} aria-hidden="true" /></a></section></article>{others.length > 0 && <section className="container section case-related"><div className="section-heading scroll-reveal"><div><p className="eyebrow">More starting points</p><h2>A different life. A different question.</h2></div></div><div className="case-grid">{others.map(item => <StoryCard key={item.slug} story={item} />)}</div></section>}</MotionPage>;
}
