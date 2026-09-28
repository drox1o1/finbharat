# Verification

Verified on 28 September 2026 against the production static build.

- `npm run lint`: passed.
- `npm test`: seven formula tests passed. Compound-interest frequencies, zero rates, independent monthly cashflow comparison, goal funding reconciliation, fully funded goals and Indian number formatting checked.
- `npm run build`: eleven prerendered routes produced successfully, including Mutual Funds, Fixed Deposits, Inclusion and About.
- `npm run test:browser`: passed 40 responsive layouts across home, three calculator pages and four new pages at 320, 390, 768, 1024 and 1440 pixels. No horizontal overflow. Exactly one H1 per page. Homepage and product H1s stayed within three lines.
- axe WCAG 2 A/AA and 2.1 AA: zero automated violations on all eleven pages with reduced motion; zero violations on the homepage and four new pages with normal motion after entrances completed.
- Keyboard checks: numeric inputs, sliders, calculator tabs, accordion controls, FAQ and mobile navigation Escape with focus restoration passed.
- Calculator browser checks: FD annual compounding, SIP with zero return and initial savings, goal with zero inflation/return, validation and suppressed invalid results passed.
- Embedded product calculator checks: FD maturity ₹1,21,000 for ₹1,00,000 at 10% for two years compounded annually; SIP zero-return total ₹17,000 from ₹1,000 monthly for one year plus ₹5,000 initially.
- Mutual fund and FD learning panels respond to clicks and keyboard arrows. Rapid tab changes settle on the correct panel without stale animations. Cross-document navigation leads to the correct page and highlights its active navigation item.
- About includes D. Ramanathan and Rakesh K with supplied credentials, roles and exact LinkedIn profile URLs. Portraits are labelled placeholders.
- Live preference change: desktop explanatory pin present under normal motion, removed when reduced motion enabled.
- The four new pages clean up GSAP transforms when reduced motion is enabled during use. View Transition movement is disabled by the same preference.
- No browser console errors during verification.
- All local artwork decoded successfully; original official badges were loaded. Original Figma quick-action SVGs rendered in their intended preview slots.
- Static HTML metadata, canonical tags, social metadata, JSON-LD, robots, sitemap and llms.txt verified.
- Desktop and mobile layouts plus product heroes, learning panels, cofounder profiles, gallery, app download and goal calculator screenshots visually inspected. Noto Sans, warm canvas and surfaces, teal feature panels, lavender accents and the Figma radius family are preserved.

Screenshots and the repeatable browser report are generated in `output/playwright/`. Automated accessibility checks cover detectable issues; manual screen reader and assistive hardware testing has not been performed.

## Publication configuration

Set `SITE_URL` to the confirmed domain before publishing. Default builds use the reserved `.example` domain and disable indexing. Founder portraits, company contact/social information, company privacy/terms and app download details remain marked placeholders. App availability and specific AI capabilities are unverified; no application availability schema is emitted.
