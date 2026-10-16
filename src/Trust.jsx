import { ArrowUpRight, BadgeCheck, LockKeyhole, ShieldCheck } from 'lucide-react';
import { HomeSectionLink, useContent } from './cms/Content';
import { approvedSecurityClaim } from './security-claim.mjs';

const publications = [
  { label: 'The Hindu Businessline', sourceLabel: 'The Hindu Businessline', logo: '/press/businessline-logo.png', width: 520, height: 70 },
  { label: 'SMEStreet', sourceLabel: 'SMEStreet', logo: '/press/smestreet-logo.png', width: 435, height: 326 },
];

export function TrustSection() {
  const { site, media } = useContent();
  const { trust } = site;
  const security = approvedSecurityClaim(trust);
  const coverage = publications.flatMap(publication => {
    const article = media.find(item => item.mediaType === 'press' && item.sourceLabel === publication.sourceLabel && item.source);
    return article ? [{ ...publication, href: article.source }] : [];
  });
  return <section id="trust" className="section container trust-section" aria-labelledby="trust-heading">
    <div className="trust-heading scroll-reveal"><p className="eyebrow">{trust.eyebrow}</p><h2 id="trust-heading">{trust.heading}</h2><p>{trust.introduction}</p></div>
    <div className="trust-grid">
      <article className="trust-item scroll-reveal"><span className="trust-icon"><LockKeyhole aria-hidden="true" /></span><h3>{security ? trust.securityTitle : trust.privacyTitle}</h3><p>{security ? trust.securityDescription : trust.privacyDescription}</p><a href={security ? trust.source : '/privacy/'}>{security ? 'Security details' : 'Privacy information'}<ArrowUpRight size={16} aria-hidden="true" /></a></article>
      <article className="trust-item scroll-reveal"><span className="trust-icon"><BadgeCheck aria-hidden="true" /></span><h3>AMFI ARN {site.arn}</h3><p>{site.legalName}<br />{trust.registrationDescription}</p><a href="https://www.amfiindia.com/investor/become-mf-distributor?zoneName=HowtoInvestInMF">Understand AMFI registration<ArrowUpRight size={16} aria-hidden="true" /></a></article>
      <article className="trust-item scroll-reveal"><span className="trust-icon"><ShieldCheck aria-hidden="true" /></span><h3>{trust.clarityTitle}</h3><p>{trust.clarityDescription}</p><HomeSectionLink section="calculators" >Explore the calculators<ArrowUpRight size={16} aria-hidden="true" /></HomeSectionLink></article>
    </div>
    {coverage.length > 0 && <div className="press-strip scroll-reveal"><div><p className="eyebrow">{trust.pressHeading}</p><p>{trust.pressDescription}</p></div><div className="press-logos">{coverage.map(publication => <a key={publication.label} href={publication.href} target="_blank" rel="noopener noreferrer" aria-label={`Read Finbharat coverage in ${publication.label} (opens in a new tab)`}><img src={publication.logo} alt={publication.label} width={publication.width} height={publication.height} loading="lazy" /></a>)}</div></div>}
  </section>;
}

export function FooterTrust() {
  const { site } = useContent();
  const security = approvedSecurityClaim(site.trust);
  return <div className="footer-trust" aria-label="Planning and registration information"><span><LockKeyhole size={17} aria-hidden="true" />{security ? site.trust.securityTitle : site.trust.privacyTitle}</span><span><ShieldCheck size={17} aria-hidden="true" />{site.trust.clarityTitle}</span><span><BadgeCheck size={17} aria-hidden="true" />AMFI ARN {site.arn}</span></div>;
}
