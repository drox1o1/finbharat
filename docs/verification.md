# Verification

## Client CMS expansion — 2 October 2026

- Lint and build pass; thirteen fixed pages are prerendered, plus every published article.
- Fourteen Node tests pass: seven independent calculator/formula checks and seven content, sanitizer, pagination, publication filtering, production approval and failed-fetch checks. The failed-fetch test preserves a prior content snapshot and deployment fixture.
- Real local WordPress integration passes: Editor permissions without administrator access; homepage, FAQ and legal edits; blog publish/unpublish; future-post scheduling and publication callback; post/page revisions; newsroom source fields; publication-triggered hook dispatch; retry on a simulated failed hook; draft and hook-secret exclusion. Hook requests are intercepted test requests, not actual Netlify deployments.
- Browser baseline: 40 responsive layouts (320–1440px), 13 automated WCAG scans, 10 calculator/navigation/motion interaction groups; zero detected violations and no application console errors. Normal-motion scans wait for entrance/reveal transitions to finish. The mobile hero remains three visual lines; line-count checks subtract the designed line padding.
- Published-CMS fixtures: 15 additional responsive article/list/legal layouts and 15 WCAG scans; direct blog/newsroom routes, homepage/FAQ/legal edits, article metadata/schema, source attribution and root-relative links verified. Draft fixture is excluded from the sitemap.
- Intro-dialog fixture: initial focus, forward keyboard containment, Escape, close button, focus return, paused playback, captions and native controls verified. All fixture articles, page edits and intro approval are restored afterward. The default preview has no intro trigger or invented editorial entries.
- Discover dropdown remains readable over the hero, including hovered links; automated contrast checks pass with it open.
- Missing article URL returns HTTP 404 with the branded not-found page in the static preview. Netlify uses the same generated `404.html` without a successful SPA fallback.
- PHP syntax check passes; installable plugin ZIP contains only the plugin, editor assets and imported seed/labels.
- Original Figma logo geometry, Noto Sans, warm surfaces and brand colours retained. Hero, human-photo cards, Blog empty state and footer visually inspected. Photograph permissions and source credits documented in `assets-provenance.md`.

Production WordPress.com/Netlify connections, real client invitations, managed cron execution, publication latency and failed-deployment retention on the client host still require the actual accounts. Approved legal/contact content and the production domain remain pending; production builds enforce these requirements. No live deployment has been claimed. Automated checks do not replace manual screen-reader or assistive-device testing. See `cms-setup.md` for handover and launch checks.

## Earlier foundation verification

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
- About includes D. Ramanathan and Rakesh K with supplied credentials, roles and exact LinkedIn profile URLs. Portraits were placeholders at this earlier verification. Supplied portraits are now used.
- Live preference change: earlier desktop explanatory pin removed when reduced motion enabled; the current simplified accordion has no pinning.
- The four new pages clean up GSAP transforms when reduced motion is enabled during use. View Transition movement is disabled by the same preference.
- No browser console errors during verification.
- All local artwork decoded successfully; original official badges were loaded. Original Figma quick-action SVGs rendered in their intended preview slots.
- Static HTML metadata, canonical tags, social metadata, JSON-LD, robots, sitemap and llms.txt verified.
- Desktop and mobile layouts plus product heroes, learning panels, cofounder profiles, gallery, app download and goal calculator screenshots visually inspected. Noto Sans, warm canvas and surfaces, teal feature panels, lavender accents and the Figma radius family are preserved.

Screenshots and the repeatable browser report are generated in `output/playwright/`. Automated accessibility checks cover detectable issues; manual screen reader and assistive hardware testing has not been performed.

## Publication configuration

Set `SITE_URL` to the confirmed domain before publishing. Default builds use the reserved `.example` domain and disable indexing. Founder portraits, company contact/social information, company privacy/terms and app download details remain marked placeholders. App availability and specific AI capabilities are unverified; no application availability schema is emitted.

## Case studies and Vercel CMS expansion — 2 October 2026

- Added three original AI portraits and explicitly fictional stories: Srijan (31, financial independence), Meera (36, personal/family goals), Arjun (28, variable income). Each has a direct prerendered page and transparent FD/SIP examples. Homepage and Discover/footer navigation include case studies. Calculator formulas remain shared with the existing tools.
- `npm run lint`, `npm test` (18 tests), and a WordPress-sourced `npm run build` passed. Seventeen static routes were generated with canonical URLs, metadata and sitemap entries. Missing case paths returned HTTP 404 locally.
- Browser checks passed 60 responsive layouts (320/390/768/1024/1440), 17 WCAG A/AA accessibility scans and 10 existing calculator/motion/interaction groups. No website console errors. Case index/detail screenshots were inspected at desktop and mobile widths. Noto Sans, original Figma logo and established warm/teal palette are retained.
- Local WordPress integration verified Editor permissions, case field editing, publication/unpublishing, draft exclusion, revisions, existing scheduled publication behaviour, Vercel hook acceptance and retries, and no secret in the public REST response. Fake hook requests were intercepted; no live Vercel hook was called.
- CMS-to-browser verification passed 21 responsive/accessibility layouts. A local Editor changed Srijan's excerpt and FD principal to INR 300,000 through WordPress REST, then the build rendered both the copy and recalculated maturity value. Existing blog, newsroom, homepage, FAQ, legal and video-dialog checks passed. All fixtures were removed.
- Actual dashboard editing was checked as local-editor: expanded Meta Boxes, opened the FD fields, changed Srijan's principal from INR 200,000 to INR 250,000, clicked Save, and verified the updated website amount. `cms:watch` rebuilt without a code edit; `cms:check` confirmed matching published/deployed revision digests. The original INR 200,000 value was restored through the dashboard.
- The local dashboard, preview on 4173 and CMS watcher remain available. Public diagnostic source is WordPress. Blog and Media remain empty; case stories remain fictional; pending legal/contact content and hidden unapproved intro are preserved.
- `vercel.json`, Vercel production environment checks and server-side deploy-hook support are implemented. Live routing, actual deploy hooks, hosted scheduling and production publication have not been tested because the live WordPress site has not yet been created and Vercel project access/URLs were not supplied. Approved contact/legal content and domain remain launch prerequisites.

## Revised case profiles and portraits — 2 October 2026

- Revised Srijan to a 31-year-old Hyderabad tech professional, Meera to a 42-year-old Chennai homemaker, and Arjun to a 42-year-old Bengaluru auto driver. Added an editable City field and revised narratives and illustrative FD/SIP assumptions. Existing case slugs are preserved.
- Recreated all three portraits and replaced the bundled images with optimized WebP assets. Removed visible AI image badges; fictional-story disclosures, accurate alt text and provenance documentation remain. Removed the dark background behind the cinematic header logo without changing the authentic logo artwork or focus styling.
- All three local WordPress entries were updated through the Editor REST API. The local CMS watcher rebuilt seventeen static routes successfully. `cms:check` confirmed that the website matches the published WordPress revision. Local Editor credentials were verified.
- Lint and all eighteen Node tests passed. Browser checks passed sixty responsive layouts, seventeen accessibility scans and ten interaction groups, with no console errors. Additional checks confirmed a transparent header wordmark at 688px, all three mobile portrait/detail pages loading without horizontal overflow, and no image badges. Desktop and mobile case listings and the auto-driver detail screenshot were visually inspected.
- Live WordPress/Vercel setup remains pending; these publishing checks used the local demonstration CMS.

## Sample journal articles — 2 October 2026

- Wrote two original sample articles: mutual fund overlap, SIP loss and goal timelines; FD laddering, maturity arithmetic, withdrawal terms, insurance aggregation, tax and purchasing power. Hypothetical examples and sample-review status are explicit. Official SEBI, AMFI, RBI, DICGC and Income Tax sources are linked in the content. No product rates, fund recommendations or customer outcomes are claimed.
- Generated two original editorial cover photographs, optimized to 1400px WebP and imported as real WordPress featured-image attachments. Both posts are locally published under their topic categories with excerpts and SEO descriptions. Versioned source copies and an explicitly localhost-only importer preserve existing editorial edits and do not seed production sites.
- Fixed local featured-image handling: HTTP media is allowed only for the configured loopback CMS and matching port, including localhost/127.0.0.1 aliases; hosted media still requires HTTPS. Added a test rejecting other hosts, ports, credentials and production HTTP media. ESLint ignores generated output, including temporary preview backups created by the CMS watcher.
- Lint and nineteen Node tests passed. A WordPress-sourced build generated nineteen static pages. `cms:check` confirmed two blog posts and a matching CMS/website content revision.
- Twelve responsive checks passed for the blog index and both direct article URLs at 320, 390, 768 and 1440px. Exactly one H1, all expected cover images loaded with alt text, no horizontal overflow, and article structured data were verified. Three automated WCAG A/AA scans had zero detected violations. Both category filters and All passed. Desktop/mobile screenshots were visually inspected.
- Both articles appear in the sitemap and prerendered SEO descriptions. Internal article links resolve, and a missing article URL returns HTTP 404. This is the local demonstration; no live WordPress or Vercel publication has been claimed.

## Third-fold case studies and footer — 7 October 2026

- Homepage order is now hero (including its language strip), Mutual Fund/FD gateways, then the three case studies. The existing scroll reveals and reduced-motion behavior are retained.
- Replaced the case section's “Illustrative” headings and detail labels with conversational copy. The imagined nature of the people and the assumptions behind their sample numbers remain clear. Revised the three story openings, case-page SEO and empty state, and WordPress case-study editor labels.
- Footer uses the untouched reversed Figma wordmark with “Building wealth, Strengthening Bharat” as a readable HTML subheading directly beneath it. The subheading uses the existing CMS global tagline field.
- Applied targeted copy updates to the local WordPress case page and stories without overwriting other editor changes. Regenerated the installable plugin seed and ZIP; existing hosted CMS content must be updated through its dashboard, since installing a new seed preserves existing entries.
- Lint, all 19 Node tests, PHP syntax check and WordPress-backed build passed. Nineteen static pages were generated; CMS revision matching passed.
- Browser review passed 20 responsive layouts across Home, Case Studies and all three story pages (320/390/768/1440px). Six automated WCAG scans found no violations. Verified direct routes, one H1 per page, no horizontal overflow, third-section order, footer subheading and absence of the old wording in case content. Normal-motion reveals and keyboard story navigation passed with no browser errors. Desktop case cards and desktop/mobile footer screenshots were visually inspected.
- Direct Vercel publication could not be performed: the installed CLI reports an invalid saved token. No Vercel project is linked locally. A live deployment is not claimed; the existing GitHub repository is the code publishing destination. Hosted WordPress, confirmed domain and approved contact/legal content remain required for a production launch.

## Supplied media coverage and introduction video — 9 October 2026

- Added the supplied Businessline (17 September) and SMEStreet (30 September) coverage, with exact original headlines, short attributed summaries, publication dates, original article photographs and publisher links. Press cards open the original publication in a new tab; direct summary routes have metadata, canonical URLs and sitemap entries. The CMS uploader is not presented as the original reporter.
- Homepage now has hero, introduction video area, case studies, then product gateways. Created an original 16:9 thumbnail with the built-in image-generation tool; the video area remains a labelled coming-soon placeholder until an approved video and transcript are supplied.
- Added support for unlisted YouTube watch/share links. The privacy-enhanced YouTube iframe is created only after a click and removed on close. Direct video files retain captions, transcript and native controls. No real product demonstration or YouTube video is asserted to exist yet.
- WordPress plugin 1.3.0 imports coverage once without overwriting existing entries, adds publication/image attribution fields and preserves global content while adding intro fields. Repeated activation retained exactly two coverage entries. Both original photographs and the generated thumbnail are in the local Media Library; featured images are assigned to the coverage entries.
- A read-only check with the client Editor account confirmed intro URL, thumbnail, transcript and approval controls, plus newsroom publication, source and attribution fields. Local Media Library thumbnails are accepted only from the configured loopback CMS origin; remote/production images require HTTPS.
- Lint, PHP syntax check, 23 Node tests and the WordPress-backed build passed. Twenty-one static routes generated. Published/deployed CMS revisions match.
- Browser review passed 16 layouts across Home, Media and both coverage summary pages at 320/390/768/1440px, with eight automated WCAG scans and no application errors. Verified photograph decoding, attribution, original-source links, homepage section order and absence of an inactive watch button or pre-click YouTube request. Desktop/mobile thumbnail and media screenshots were visually inspected.
- Local dialog fixtures verified YouTube URL handling using an intercepted embed request, and actual native playback using the decorative background clip solely for QA. Initial focus, Tab containment, Escape, close, focus restoration, iframe removal/native pause and two mobile dialog accessibility scans passed. All temporary CMS options, captions and approved-video fixtures were restored; the final build shows the placeholder. Actual playback of the future unlisted introduction video remains to be checked when supplied.
- No live deployment is claimed. The existing production domain, Vercel login and hosted WordPress setup remain outside these local verification results.

## Trust section and publisher logos — 9 October 2026

- Added a homepage trust section after product gateways, preserving video as second fold and case studies as third. Includes private browser planning, the owner-supplied AMFI ARN 366696, visible calculator assumptions and an icon row in the footer.
- Authentic Businessline and SMEStreet mastheads link to the supplied press features. These are clearly labelled press coverage, separately from registration and security information. No bank partnerships, regulator endorsements, encryption standards or certifications are asserted.
- Prepared CMS security wording with an approval/evidence gate. “Bank-Grade Security” remains unpublished because security evidence has not been supplied. Local WordPress options are also unapproved.
- Lint, 24 Node tests, PHP syntax and the WordPress-backed build passed; 21 static routes generated and CMS revisions match. Browser checks at 320/390/768/1440px passed without overflow or application errors; both logos decoded. Two targeted accessibility scans passed with zero violations. Desktop, mobile and footer screenshots were visually inspected.

## Homepage order and prelaunch app messaging — 10 October 2026

- Moved Mutual funds / Fixed deposits before case studies. Intro video remains after the hero. Moved the entire trust section, including the press strip, immediately after cofounders.
- Added “Coming soon on the App Store” and “Coming soon on Google Play” to the disabled store controls. Updated the shared homepage CMS availability message and packaged seed content. Store links remain absent until supplied.
- Lint and WordPress-backed build passed; 21 static routes generated. CMS revision check passed. Browser verification at 320/390/1440px confirmed the requested section order, disabled coming-soon controls and no horizontal overflow. Desktop and mobile screenshots were visually inspected.

## Vercel prelaunch build repair — 10 October 2026

- Reproduced the cause from the supplied log: production environment detection required CMS_URL before building. Vercel’s production Git branch was being treated as final launch even though hosted WordPress is not configured. Installation warnings were not the terminating error.
- Added an explicit, versioned demo deployment mode and a portable snapshot of the published local WordPress content. It preserves both blogs, both coverage entries and all three case studies. Local upload images were rewritten to matching bundled assets. Added an export command for future reviewed snapshot updates.
- WordPress mode retains production CMS/domain/legal/contact checks, rejects loopback CMS origins in production and never falls back after fetch failures. PRODUCTION_LAUNCH=1 cannot use demo content. Demo mode remains noindex regardless of Vercel’s environment name.
- Lint and 26 Node tests passed. A full build with VERCEL_ENV=production and VERCEL_TARGET_ENV=production, no CMS_URL and no launch flag succeeded with 21 static routes. Verified noindex metadata, robots Disallow and no loopback URLs in the saved snapshot. Four browser routes loaded; article/press photos decoded with no local WordPress requests.
- Vercel connector inspection and the explicitly scoped CLI fallback denied access to the project account. GitHub status confirmed the previous 5f22b6c deployment failed. No cloud success is asserted by these local results.

## Supplied FAQ and legal documents — 13 October 2026

- Imported all substantive paragraphs from both supplied DOCX files; verified normalized text against the originals. Omitted blank revision-date label and formatting-only separators.
- FAQ: 94 questions in 15 expandable topics. Terms and Privacy split into separate existing routes; commission table retained with accessible column headers.
- Added homepage, product-page and footer links to `/faq/`.
- Lint, 28 unit tests and production build passed; 22 routes prerendered.
- Browser checks at desktop and 390px mobile width: FAQ topics expand, Enter toggles the focused summary, Terms and Privacy render, commission values match the source, no horizontal page overflow or console errors.
- WordPress Studio hosted demo updated in place, preserving other client content. No full snapshot overwrite. FAQ rich-text fields and public legal-page approval verified.
- Vercel remains in committed demo-snapshot mode; the supplied pages are also included in that snapshot.

## Founder portrait and editor controls 16 October 2026

- Replaced Rakesh’s Home/About portrait with the supplied red-polo photograph, optimized without retouching. Editable focus, alt text and bounded zoom handle portrait framing.
- Introduction visibility is false in the CMS and deployment snapshot. Hidden markup and player are omitted; enabling the switch restores the retained content.
- Plugin 1.4.0 adds per-page optional-section switches, remaining main asset/logo fields, image selection previews, navigation labels and product-card descriptions. Header and hero calculator links use standalone routes when the embedded section is hidden.
- Lint, 29 tests and build passed; 22 routes prerendered. SSR fixtures verified hiding optional sections, retaining standalone calculators and suppressing hidden video embeds. Unsafe image URLs and invalid portrait crop/zoom values are rejected.
- Hosted CMS plugin update and supplied-photo Media Library upload verified. A temporary case-study visibility change was saved, fetched through the production adapter and rendered without the section, then restored. Intro remains hidden.
- Client control map: `docs/editor-controls.md`. Vercel remains in saved-snapshot mode; automatic publishing still requires permanent CMS hosting and its deployment hook.
