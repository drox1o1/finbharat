import { defaultCaseStudies } from './case-studies.mjs';
import { faqs, pillars } from '../content.mjs';
import { founders, productContent } from '../page-content.mjs';

export const tagline = 'Building wealth, Strengthening Bharat';
export const mission = 'To democratize wealth creation for the next 100 million Indians by making financial participation simple, accessible and inclusive.';
const seo = (title, description) => ({ title, description });
const mutual = structuredClone(productContent.mutual);
mutual.faqs.splice(3, 0,
  ['Does a SIP guarantee a profit?', 'No. A SIP is a contribution method. The fund remains subject to market risk, and the value of your investment can fall.'],
  ['What costs should I understand?', 'Read the scheme documents for the expense ratio, any exit load, and applicable taxes. Costs and tax treatment can affect what you receive.'],
  ['How do I choose a time horizon?', 'Start with when you may need the money, your circumstances and your comfort with changes in value. A calculator does not assess suitability or recommend a fund.'],
  ['How does the SIP calculator estimate returns?', 'It assumes a constant annual return divided into monthly growth, with contributions at the beginning of each month. Actual markets do not follow a constant return, and tax, fees and withdrawals are excluded.']);
mutual.image = '/art/milestones.webp';
const fixed = structuredClone(productContent.fixed);
fixed.image = '/art/pathways.webp';
fixed.headline = ['Fixed deposits.', 'See what you could earn.'];
fixed.introduction = 'Choose your deposit amount and tenure. Enter an interest-rate assumption. See your estimated interest and maturity amount, clearly separated.';
fixed.heading = 'Your amount. Your timeline. Your estimate.';
fixed.explanation = 'An FD holds your deposit for a chosen period under the institution’s terms. Compare the rate, interest payout, compounding and withdrawal conditions before deciding. The calculator below shows how these assumptions affect your estimate.';
fixed.concepts[0].title = 'Choose the amount and the time.';
fixed.concepts[0].body = 'Enter your principal, annual interest rate and tenure. The estimate shows your original deposit plus calculated interest, so you can see what each assumption changes.';
fixed.calculatorHeading = 'See your deposit and estimated interest.';
fixed.calculatorCopy = 'Adjust the amount, rate and tenure to explore your maturity estimate. Sample rates are assumptions, not deposit offers. Taxes, fees and early withdrawal penalties are excluded.';

export const defaultContent = {
  schemaVersion: 1,
  site: {
    tagline, mission,
    missionEyebrow: 'Our mission', missionHeading: ['More people.', 'More possibility.'], missionNote: 'Our ambition for the future. Built around clarity, access and the agency to choose.', missionLinkLabel: 'The purpose behind Finbharat',
    scenariosEyebrow: 'Built around real lives', scenariosHeading: ['Different lives.', 'A place to begin.'], scenariosIntroduction: ['Three illustrative scenarios.', 'Your circumstances make your plan your own.'], scenariosNote: 'Illustrative situations, not customer stories or financial recommendations. Photographs do not imply endorsement by the people depicted.',
    legalName: 'Finbharat Technology Private Limited', arn: '366696',
    contact: { email: '', phone: '', address: '', linkedin: '', instagram: '' },
    apps: { android: '', ios: '' },
    intro: { title: 'A more natural conversation about wealth', video: '', poster: '', captions: '', transcript: '', approved: false },
    assets: { heroPoster: '/video/hero-poster-1s.jpg', heroVideo: '/video/hero-scroll-from-1s.mp4', footerImage: '/art/pathways.webp', footerAlt: 'An illustrated winding path through teal hills toward a shared horizon' },
    founders: founders.map((item, index) => ({ ...item, portrait: index === 0 ? '/founders/d-ramanathan.png' : '/founders/rakesh-k.png' })),
    copy: {},
  },
  pages: {
    '/': { template: 'home', title: 'Home', seo: seo('Finbharat | Building wealth, Strengthening Bharat', 'Understand mutual funds, explore fixed deposits and plan with illustrative calculators. Thoughtful technology for a more inclusive financial future.'), fields: {
      heroTitle: 'Wealth Simplified.', heroPrefix: 'For everyone in',
      manifesto: 'Finance becomes powerful when it becomes clear.',
      faqs, pillars: pillars.map(pillar => ({ ...pillar, image: `/art/${pillar.art}.webp` })),
      intentions: [
        { title: 'Less jargon. More understanding.', copy: 'Make financial concepts easier to understand, with everyday language and a little more context.', note: 'Clarity is a form of inclusion.' },
        { title: 'Plans that start with you.', copy: 'Explore the possibilities behind your goals. Helpful tools to plan with greater confidence.', note: 'Find your starting point' },
        { title: 'Built for the many Indias.', copy: 'Different languages. Different incomes. Different needs. Design that makes room for real lives.', note: 'More ways to belong.' },
        { title: 'Technology with a human purpose.', copy: 'Use AI to make information more helpful and accessible, supporting your decisions without pressure.', note: 'Meet our approach to AI' },
      ],
      aiPrinciples: [
        ['Clear explanations', 'Information you can understand, with limitations made visible.'],
        ['Privacy in mind', 'Respect for people and their personal information.'],
        ['More ways to understand', 'A direction that considers languages, abilities and everyday contexts.'],
        ['People in the driver’s seat', 'Helpful guidance that supports your own decisions.'],
      ],
      gallery: [
        { art: 'community', image: '/art/community.webp', title: 'Connected, we go further.', caption: 'A wider circle of possibility.', body: 'Different languages, abilities and experiences deserve thoughtful design. Our principles begin with making financial information easier to understand.', alt: pillars[1].alt, link: '/inclusion/', cta: 'Our inclusion principles' },
        { art: 'milestones', image: '/art/milestones.webp', title: 'Small steps. Meaningful milestones.', caption: 'A future shaped around your goals.', body: 'Give a future plan some room today. Explore how time, inflation and regular contributions could shape the amount you need to save.', alt: pillars[2].alt, link: '/calculators/goal/', cta: 'Plan a goal' },
        { art: 'pathways', image: '/art/pathways.webp', title: 'There is more than one way.', caption: 'Space for the life you want to live.', body: 'Your priorities can change, and your financial journey can too. Meet the people and the purpose behind a more human approach to wealth.', alt: pillars[0].alt, link: '/about/', cta: 'The belief behind Finbharat' },
      ],
      copy: {},
    } },
    '/mutual-funds/': { template: 'mutual', title: 'Mutual funds', seo: seo('Mutual Funds & SIP Calculator | Finbharat', 'Understand mutual fund basics, SIP contributions, costs and investment risks. Explore an illustrative SIP calculator with your own assumptions.'), fields: { product: mutual, copy: {} } },
    '/fixed-deposits/': { template: 'fixed', title: 'Fixed deposits', seo: seo('Fixed Deposits & FD Calculator | Finbharat', 'See how deposit amount, tenure, rate and compounding affect estimated interest and maturity. Explore an illustrative FD calculator.'), fields: { product: fixed, copy: {} } },
    '/about/': { template: 'about', title: 'About', seo: seo('About Finbharat | Our mission and cofounders', 'Meet D. Ramanathan and Rakesh K, cofounders of Finbharat. Learn about our ambition to make wealth creation simple, accessible and inclusive.'), fields: { values: [ ['Clarity', 'Explain the complicated. Make assumptions visible. Help people understand the choices in front of them.'], ['Trust', 'Respect privacy, communicate limitations, and keep people in control of their decisions.'], ['Inclusion', 'Design for different languages, income levels, abilities, access needs and levels of digital confidence.'] ], copy: {} } },
    '/inclusion/': { template: 'inclusion', title: 'Inclusion', seo: seo('Inclusion | Wealth for everyone in Bharat | Finbharat', 'Explore Finbharat’s inclusion principles across languages, incomes, abilities and digital confidence, with illustrative everyday planning scenarios.'), fields: { commitments: [ ['Different languages. Equal respect.', 'Clear communication starts with recognising the languages and contexts people feel at home in.'], ['Every income. Every starting point.', 'Financial understanding should be useful across different incomes and experiences, including those often left out.'], ['More ways to take part.', 'Consider different abilities, access needs and levels of digital confidence from the beginning.'], ['Agency, without pressure.', 'Make the assumptions clear. Explain the limitations. Give people space to make their own decisions.'] ], copy: {} } },
    '/case-studies/': { template: 'case-studies', title: 'Case studies', seo: seo('Illustrative planning stories | Finbharat', 'Meet three fictional planning personas. Explore financial independence, family goals and variable income with transparent FD and SIP estimates.'), fields: { eyebrow: 'Everyday lives. Thoughtful plans.', heading: 'Your life. Your way forward.', introduction: 'Different starting points. Different priorities. Explore how three fictional people might think about saving and investing.', homeHeading: ['Real questions.', 'Illustrative stories.'], homeIntroduction: 'Meet Srijan, Meera and Arjun. Three fictional lives, and a little more clarity about what comes next.', emptyTitle: 'More stories are on their way.', emptyCopy: 'Explore our calculators while new illustrative planning stories are prepared.', copy: {} } },
    '/blog/': { template: 'blog', title: 'Blog', seo: seo('Finbharat Blog | A little more understanding', 'Explore financial explanations and perspectives from Finbharat, designed to make wealth and planning easier to understand.'), fields: { heading: 'A little more understanding.', introduction: 'Clear explanations. Thoughtful perspectives. More room to make your own decisions.', emptyTitle: 'Good conversations take thought.', emptyCopy: 'Our first articles are on their way. In the meantime, explore the basics or try a calculator.', copy: {} } },
    '/media/': { template: 'media', title: 'Media', seo: seo('Finbharat Newsroom | Announcements, coverage and videos', 'Company announcements, original-source press coverage and approved videos from Finbharat.'), fields: { heading: 'The conversation, beyond us.', introduction: 'Company news, perspectives in the press, and conversations worth sharing.', emptyTitle: 'Our newsroom is taking shape.', emptyCopy: 'Announcements, press coverage and videos will appear here when published. For enquiries, visit Contact.', copy: {} } },
    '/contact/': { template: 'contact', title: 'Contact', approved: false, seo: seo('Contact Finbharat | Start a conversation', 'Find official Finbharat contact information. Public contact details are awaiting client approval.'), fields: { heading: 'A conversation starts with a hello.', body: 'Our public contact details are awaiting approval. Please check back for the official ways to reach Finbharat.', copy: {} } },
    '/terms/': { template: 'legal', title: 'Terms and conditions', approved: false, seo: seo('Website terms and conditions | Finbharat', 'Read Finbharat website terms and conditions. The official terms are awaiting client approval.'), fields: { heading: 'Clear expectations matter.', body: '<p>Official website terms and conditions are awaiting approval. Calculator results are illustrative and not financial advice. Actual returns, rates, taxes and outcomes may vary.</p>', copy: {} } },
    '/privacy/': { template: 'legal', title: 'Privacy', approved: false, seo: seo('Privacy information | Finbharat', 'Read Finbharat website privacy information. The official privacy policy is awaiting client approval.'), fields: { heading: 'A clear view of your information.', body: '<p>Official privacy content is awaiting approval. Calculator values are processed locally in your browser and are not submitted to a backend by this website.</p>', copy: {} } },
  },
  scenarios: [
    { audience: 'A salaried professional', title: 'A good income. A plan with purpose.', body: 'An upper middle income professional may be balancing family priorities, a future purchase and longer-term financial freedom. Start by separating goals and exploring the time available for each.', cue: 'Give each goal its own starting point.', image: '/people/professional.webp', alt: 'A man seated in a contemporary office', credit: 'Amirul Islam', source: 'https://www.pexels.com/photo/portrait-of-a-young-south-asian-businessman-37556617/', href: '/calculators/goal/', action: 'Explore a goal' },
    { audience: 'A homemaker', title: 'For the family. And for yourself.', body: 'A homemaker may want a clearer view of family savings alongside personal ambitions. Explore an education goal, understand the assumptions, and make room for decisions that remain your own.', cue: 'Understanding belongs to every decision-maker.', image: '/people/homemaker.webp', alt: 'A woman using a notebook and laptop at home', credit: 'Artem Podrez', source: 'https://www.pexels.com/photo/indian-female-student-near-laptop-and-notebook-at-table-6392977/', href: '/calculators/goal/', action: 'Plan an education goal' },
    { audience: 'A gig worker', title: 'Different months. A direction of your own.', body: 'A gig worker or freelancer may have income that changes from month to month. Try different contribution amounts to explore a plan that considers everyday needs and longer-term goals.', cue: 'Start with what fits your circumstances.', image: '/people/gig-worker.webp', alt: 'A man working on a laptop at home', credit: 'Ketut Subiyanto', source: 'https://www.pexels.com/photo/unrecognizable-indian-man-using-laptop-while-working-at-home-4307853/', href: '/calculators/sip/', action: 'Explore regular contributions' },
  ],
  blog: [], media: [], caseStudies: defaultCaseStudies,
};
