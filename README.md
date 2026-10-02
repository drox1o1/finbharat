# Finbharat web

A responsive, prerendered static React website based on the Finbharat Figma brand system. Optional headless WordPress supplies editorial content at build time. Calculator data stays in the browser; the public website has no accounts or transaction backend.

## Run

```sh
npm install
npm run dev
```

## Verify

```sh
npm run lint
npm test
npm run build
npm run preview
npm run test:browser
```

Browser verification expects the production preview on port 4173 and Chromium matching the Playwright CLI. Install it if needed with `node node_modules/@playwright/cli/node_modules/playwright/cli.js install chromium`. An existing browser can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/absolute/path/to/browser npm run test:browser`. Verification uses the Playwright CLI and writes screenshots and a JSON report to `output/playwright/`.

## Publish

```sh
CMS_URL=https://your-cms-host SITE_URL=https://your-confirmed-domain.in PRODUCTION_LAUNCH=1 npm run build
```

Upload `dist/` to a static host. All thirteen fixed pages and published articles have fully rendered HTML directories and individual metadata. No SPA fallback is required. The default domain is the reserved placeholder `https://finbharat.example`, with indexing disabled until an actual domain, approved legal/contact content and production configuration are supplied. Canonical URLs, sitemap, social metadata and JSON-LD are generated from `SITE_URL`.

## Routes

- `/`
- `/mutual-funds/` — educational content, interactive learning panels and SIP calculator
- `/fixed-deposits/` — educational content, interactive learning panels and FD calculator
- `/inclusion/` — inclusion principles and the Finbharat motto
- `/about/` — purpose and supplied cofounder profiles
- `/calculators/fd/`
- `/calculators/sip/`
- `/calculators/goal/`
- `/privacy/`
- `/terms/`
- `/contact/`
- `/blog/` and `/blog/{slug}/`
- `/media/` and `/media/{slug}/`

## Design provenance

Inspected Figma file `0HqnaaarL8d59MsmeFzyET`, page `352:2` (V2 · Elevated screens), representative screen `359:9055`, and portfolio component `359:9070` before implementation. Used the returned design context and screenshots to confirm the typography, colours, card language, compact actions and spacing. The page-level design-context request was not supported for the canvas; its metadata and page screenshot were available. Reference screenshot: `docs/figma-page.png`.

The source design system's Card component is reused in `src/BrandCard.jsx`, with the latest Figma token aliases. Latest Figma radii and warm surfaces override the older local foundation. Original Figma SVG quick-action icons are saved under `public/figma/` and used in the illustrative app preview with their original geometry. Noto Sans is self-hosted. The website language is English; multilingual greetings signal the inclusion direction and do not imply a translated site or confirmed app language availability.

## Artwork

Original risograph imagery was created with the built-in image generation tool. Final assets are in `public/art/`, optimised to WebP. Prompts and source information are in `docs/artwork.md`. The artwork is an editorial addition requested in the brief, not a claim that it exists in Figma.

## Calculator assumptions

- FD: `P × (1 + r/n)^(n × t)`; nominal annual rate, selectable reinvestment frequency.
- SIP: nominal annual return divided by 12, compounded monthly; contributions occur at the beginning of each month. Optional initial investment grows for the full duration.
- Goal: annual inflation adjusts cost. Current savings grow monthly; the remaining gap is funded using the same beginning-of-month SIP model. An additional one-time amount is an alternative to monthly contributions, not an extra requirement. Progress separates current coverage from projected coverage.
- Zero rates are handled without division by zero. Amounts use Indian grouping and whole rupees. Taxes, fees, withdrawals and variable rates are excluded and disclosed. Return input bounds model non-negative assumptions; actual market returns may be negative.

## Pending company information

The owner supplied D. Ramanathan (CFP CM, cofounder, Managing Director & CEO) and Rakesh K (cofounder, IIMC alumnus), their locations and LinkedIn URLs. These appear on About and the homepage. Biographies use only supplied facts. Owner-supplied portraits of both cofounders appear on the homepage and About page. Company contact details, privacy policy, terms and official app store links remain visibly marked placeholders. App download buttons are disabled, with a nearby availability explanation. Store badges are the original official artwork and do not link to invented listings. No SoftwareApplication schema is emitted because app details and availability are unverified. Add it after verification.

The product pages explain mutual funds and deposits without claiming available Finbharat investment products. Educational sources link directly to SEBI and RBI. This website does not accept investments or open deposits.

## Motion and accessibility

Scoped `useGSAP`, GSAP matchMedia and ScrollTrigger cleanup. Native cross-document View Transitions progressively enhance page changes, with normal navigation as fallback. Entrances, scroll reveals, the growing planning rail, pointer-responsive artwork and short learning-panel click transitions preserve the brand's calm tone. Keyboard learning-tab changes are immediate. Reduced motion removes pinning, scrub effects, image scale, page transitions and movement. The editorial gallery avoids pinning on mobile. Native FAQs, accessible accordion controls, keyboard tabs, labelled numeric controls, sliders, errors, live result announcements and visible focus states.

## Cinematic version

The homepage now uses a full-viewport risograph landscape and centred two-line desktop headline (three lines on mobile). Its transparent navigation becomes an ivory surface on scroll. The hero has exactly two primary actions.

Motion includes masked headline entrances, scroll-linked video, readable ink-colour text scrubbing, a pausable principles ribbon, accordion and FAQ reveals, pointer-responsive product cards, and a simple gallery with fixed images and expanded descriptions. Gallery images remain inside their cards without scaling or stacking. The ribbon pauses offscreen, on hover, when the browser is hidden, and through its pause button.

The artwork, Noto Sans, brand colours, calculator logic and factual company content remain grounded in the existing Figma-based project. See `design-qa.md` for this revision's browser checks and visual comparison.

## Scroll-linked hero video

The owner-supplied `../refs/video1.mp4` is used as the homepage background. `public/video/hero-scroll-from-1s.mp4` is a 1080p, 24fps H.264 derivative with audio removed, fast-start metadata and a keyframe every six frames for responsive forward and reverse seeking. `hero-poster-1s.jpg` matches the source video at 1 second; the derivative is trimmed to start at that same frame.

`ScrollVideoHero.jsx` maps scroll progress directly to the remaining four-second video timeline. Scrolling faster advances frames faster; reversing scroll rewinds; stopping holds the frame. Only one seek is in flight and new input replaces the pending target. Playback completes over 65% of the viewport height. The hero stays in natural document flow without an extended sticky scene. Navigation turns white when the hero bottom passes the header. Hero actions skip directly to their destination.

Reduced motion uses the still poster, does not attach a video source, with no video seeking. Media errors retain the poster. All triggers, frame callbacks and media listeners are cleaned up.

## Editorial refinements

The homepage product cards use image-first layouts. Shared backgrounds and shorter spacing connect the belief section to the product-purpose cards, and the motto to the inclusion accordion. The accordion uses a 280ms grid-height transition and can close completely.

The hero headline is regular Noto Sans, with bold Bharat typed in English, Hindi, Tamil, Telugu and Kannada. Grapheme segmentation preserves compound characters. Offscreen/hidden-tab pausing and a static reduced-motion variant are included. The language pause control was removed at the owner’s request.

Calculator amounts count smoothly to the latest value, with a separate static screen-reader value. Ask Finbharat is a local, deterministic explanation of the entered assumptions, explicitly labelled as not an AI recommendation. Its app CTA links to the existing availability section. Founder images are the owner's original supplied PNGs. The footer uses the existing risograph artwork.

## Client-managed WordPress content

The current website supports a build-time headless WordPress source. Blog and Media routes, fixed website content, structured FAQs, founder profiles, approved links and SEO are editor-managed through the versioned plugin in `wordpress/finbharat-content/`. Layout, motion and calculators remain in React. The site uses authentic Figma logo exports and licensed human imagery with three labelled illustrative scenarios.

- `npm run cms:package` produces the installable plugin at `output/cms/finbharat-content.zip`.
- `CMS_URL=https://your-cms-host npm run build` fetches published content and prerenders all fixed and article routes.
- Set `SITE_URL` to the actual public origin for canonicals. Netlify uses `netlify.toml`.
- With no CMS configured, local development/preview uses the imported editorial defaults and empty Blog/Media states. Production builds require the CMS, approved Contact/Terms/Privacy and a confirmed domain.
- Published content is sanitized and embedded per route for consistent hydration. Build errors never silently substitute stale or default CMS data. Netlify retains the last successful deployment on failure.

See [the administrator and editor handover](docs/cms-setup.md) for hosting setup, roles, scheduled publishing, hook configuration, rollback and pending launch inputs. See [asset provenance](docs/assets-provenance.md) for exact Figma components and photograph licences. Production hosting accounts, live Editor invitations, legal approval and official contact details remain client-owned setup steps. No live WordPress.com or Netlify deployment is claimed by this repository.
