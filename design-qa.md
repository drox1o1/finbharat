# Cinematic Finbharat revision

final result: passed

## Source and intended change

Source visual truth: `output/cinematic/before.png`, the existing Figma-based website, plus the user's explicit request for one full-screen, centred hero version with richer scroll and click interactions. The existing Noto Sans, brand colours, original risograph assets and 8/16/20/24px UI radius family are the foundation. The new full-bleed composition and gallery stack are intentional changes, not a pixel-for-pixel clone.

Implementation: `output/cinematic/after-matched.png`, `output/cinematic/after-wide.png`, `output/cinematic/after-mobile.png`, `output/cinematic/gallery-final.png`.

Source raster: 1075 × 853. The matched implementation was captured at a requested 1090 × 853 browser viewport with a 1075px document client width (scrollbar excluded). Wider desktop and mobile states were also inspected. Browser screenshot chrome/crop can differ from the CSS viewport; this review compares the page content, not the browser frame. No image stretching or raster substitution was used in the website.

## Required surfaces

- Typography: Noto Sans remains loaded. The hero has two desktop lines and three mobile lines. Its 1152px maximum width prevents a narrow text column. Small action labels remain readable; there is one H1 per route checked.
- Layout: the hero fills the viewport, with a deliberate minimum height on short screens. Its copy and two actions are centred. The four intention cards fill their grid. Spacious sections and the gallery stack establish the requested editorial rhythm.
- Colour: warm canvas and ivory surfaces continue below the hero. Deep teal supports the full-screen artwork. The lightest possible hero background through its wash provides 5.42:1 text contrast; standard teal actions provide 9.44:1. Text scrubbing retains readable colours.
- Imagery: the original pathway, community and milestone risographs are reused. The hero uses cover cropping; mobile keeps the winding path visible. No decorative image was approximated with new SVG or CSS artwork.
- Content: the motto, supplied cofounder details, links and illustrative calculator language remain. No product availability, testimonials or partner claims were added.

## Comparison and fixes

The source and updated desktop screenshots were opened together for comparison. The change from an editorial split to a centred full-screen composition is requested. The same wordmark, font, artwork and brand family visibly connect both versions.

1. Initial gallery inspection showed that tall image cards could place a caption below the visible viewport while sticky. Fixed by bounding desktop image height to 44svh, restricting pinning to sufficiently tall screens, and preserving a natural flow on smaller screens. `gallery-final.png` shows the complete front card, caption and action. At the inspected viewport the card measured about 564px inside an 853px viewport.
2. Mobile hero inspection exposed a missing space where the desktop line break was hidden. Added an explicit text space; `after-mobile.png` shows the corrected sentence.
3. Keyboard focus can raise a gallery card above overlapping neighbours, restore its image visibility, and expose its action. Reduced-motion styles remove sticky stacking entirely.

No actionable P0/P1/P2 visual findings remain. Focused inspection covered hero actions, mobile navigation, calculator controls, accordion content and the full gallery caption. Portrait placeholders and pending app links are retained from the factual-content requirements.

## Verification

- Production build succeeds and prerenders all eleven routes. ESLint passes. All seven calculator formula tests pass.
- In-app browser: homepage checked at requested widths 320, 390, 768, 1024 and 1440px. No horizontal overflow; two/three headline lines. Desktop gallery pin is removed on mobile resize.
- Mutual Funds, Fixed Deposits, Inclusion and About checked at 390 and 1440px. No horizontal overflow; one H1; Noto Sans.
- Main journey: hero calculator action, calculator tabs and FD inputs produce ₹1,21,000 for ₹1,00,000 at 10% over two years compounded annually.
- Mobile menu opens and Escape closes it. Rapid accordion changes settle on the selected item. FAQ opens with the correct answer. Ribbon pause/play controls work.
- Pinned gallery and its overlapping cards inspected while scrolling; captions and links are visible after the sizing fix.
- Browser console: no application errors observed in the checked states.
- Reduced-motion media conditions and cleanup were reviewed in code. This revision did not rerun the earlier CLI axe suite or emulate the OS motion preference through the in-app browser. Previous revision's automated results remain in `docs/verification.md` and are not claimed as a fresh scan.

## Remaining polish

None required for this version. Actual founder portraits and verified store URLs still depend on supplied assets and information.

## Scroll-video revision — 28 September 2026

- User-supplied video replaces the hero artwork background; Noto Sans, centred copy and readable teal overlay are preserved.
- Desktop 1440×900: video loaded with duration 5 seconds. At scroll offsets 585px and 945px, video times were 2.302083s and 3.718750s; reversing returned to 2.302083s. These match the direct mapping over the 1260px scroll span. The frame stayed at 3.718750s while idle. Video remains paused (seeking only).
- Explore Finbharat reached the next section at 120px below the viewport top, with video at its final frame (4.958333s).
- Mobile 390×844: centred three-line heading, visible actions, no horizontal overflow. Scroll advanced video to 2.124700s while hero remained at top 0. Poster and video share the same responsive crop.
- No browser errors or warnings observed. Lint and eleven-route production build passed.
- Reduced-motion source loading and sticky removal were reviewed in code; OS preference emulation was not run.
- Screenshot: `output/video/hero-scroll-preview.png`.

### Short-scroll correction

The current version supersedes the 240svh sticky scene above. Both video and poster start at the source 1-second frame. The remaining 4 seconds map to 65vh of scroll, with no extra pinning. At 1440×900, one 585px scroll reached 3.958333s in the trimmed clip; navigation remained transparent with 315px of hero remaining. At 900px scroll the hero bottom reached 0 and the navigation was white. No console errors or warnings observed. Lint and production build passed. Screenshot: `output/video/hero-start-1s.png`.

## Review-comment refinements — 28 September 2026

All eleven supplied review comments are addressed:

- Inclusion accordion is now vertical, with an interruptible 280ms open/close transition and no image entrance effects. Clicking an open panel closes it. Inactive content is inert and hidden from assistive technology.
- Gallery images remain fixed within ordinary cards; scaling, fading, stacking and pinning are removed. Each card has an explanatory paragraph.
- Calculator result cards include the rate/time assumptions, a compact Ask Finbharat disclosure, and an app-availability CTA. Explanations are derived locally from inputs and do not imply a live AI service.
- The motto and inclusion section share a continuous subtle teal background. The belief statement and following purpose cards share a warm surface, a divider and closer spacing.
- Product gateway images sit above their content.
- Hero typography uses regular Noto Sans and bold Bharat, rotating by grapheme through English, Hindi, Tamil, Telugu and Kannada. The heading has a stable accessible name. Motion pauses offscreen, on hidden tabs or through its control; reduced motion remains static.
- Calculator number transitions preserve the currently displayed amount on interruption; assistive technology receives only the final amount.
- Footer includes a risograph landscape and inclusion CTA. The hero overlay is a transparent gradient with stronger contrast around text.
- Both supplied founder portraits are used in the homepage and About cards.

Verification: ESLint passes without warnings; all seven calculator tests pass; the production build prerenders eleven pages. In-app browser inspection covered desktop 1135px and mobile 390px/320px widths, with no horizontal overflow in checked states. Accordion open/close, language pause, Ask Finbharat disclosure and counter updates were exercised. At ₹6,000 monthly, the SIP estimate settled to ₹12,39,312; changing to ₹7,000 started from that previous amount and settled to ₹14,45,864. Both founder images loaded at their original 1122px width on Home and About. Console inspection returned no errors or warnings. Reduced-motion paths were reviewed in code; no fresh automated axe or OS preference emulation was performed.

Screenshots: `output/refinements/hero.png`, `mobile.png`, `founders.png`, `footer.png`.

## Latest visual and motion corrections

Headline changed to “Wealth Simplified.” The rotating Bharat word now has a lavender contrast box, no trailing full stop and no pause button, as requested. Transparent-header hover/focus text stays ivory. Hero copy fades with scroll, with full visibility restored while keyboard focus is inside it. The inclusion divider is removed. Both founder portraits use grayscale with a subtle brand-teal CSS tint, preserving original files.

Shared scroll reveals now use 18px upward motion and opacity over 600ms with ease-in-out, once per element. Nested reveal containers are excluded; keyboard focus finishes the reveal immediately. Reduced-motion conditions bypass these animations. Browser checks at 1135px and 390px confirmed the highlight layout and no horizontal overflow; hero opacity reached 0.5448 after a quarter-screen scroll. A product card changed from opacity 0 before entry to 1 with no remaining transform after entry. The inclusion border computed to 0px. Founder images computed to grayscale(1) with #114C5A tint. No console errors/warnings observed. Lint and eleven-route build passed. Screenshots: `output/refinements/hero-highlight.png` and `founders-tinted.png`.

## Contrast and portrait correction

Removed the lavender bounding box from the rotating Bharat word; it is now bold ivory text. Increased the gradient opacity to at least 66% deep teal, with extra depth behind the heading and supporting copy, and added a restrained text shadow. The video remains visible behind the gradient.

Removed the teal tint from founder portraits. Desktop portraits begin in grayscale and reveal the original supplied colour over 280ms when the profile is hovered or its LinkedIn link receives keyboard focus. Touch screens display colour directly. Reduced motion inherits the global immediate-transition setting.

Verification: desktop and mobile hero checked with no horizontal overflow. Bharat computed to transparent background and #FFFEFA text. Keyboard focus on Ramanathan’s link produced grayscale(0), while the unfocused second portrait remained grayscale(1). Hover uses the same filter endpoint through a pointer-capability media query. Console inspection returned no errors or warnings. Lint and production build passed. Screenshot: `output/refinements/hero-contrast.png`.

## Typewriter spacing correction

The reserved language area is left-aligned, so every word begins immediately after the normal space following “in”. Added a narrow ivory cursor that follows the visible text with a reusable 120ms GSAP tween, stays solid during typing/deletion, and gently blinks during the completed-word hold. Typing uses 135ms per grapheme, deletion 75ms, and a short pause before the next language. Compound characters remain intact through Intl.Segmenter. The headline keeps its reserved width to prevent recentering while typing. Cursor blinking pauses offscreen or on hidden tabs and is removed for reduced motion.

In-app browser checks confirmed that the text left edge exactly equals the reserved area's left edge on desktop (656.671875px) and mobile (136.75px); no horizontal overflow. The desktop cursor followed the text with about 4px spacing. No errors or warnings observed. ESLint and eleven-route production build passed.
