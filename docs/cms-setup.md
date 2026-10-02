# Finbharat: client CMS and publishing

## What is implemented

The frontend remains a static React website. The versioned Finbharat Content plugin provides a WordPress editing dashboard for fixed website pages, global content, blogs, newsroom entries and illustrative case studies. A single build adapter validates and sanitizes the published REST data. The resulting snapshot is used for both server rendering and browser hydration; the browser does not fetch WordPress or receive hook credentials.

The default preview has no invented blog posts or press coverage. Intro playback is hidden until an approved video, captions and transcript are provided. Contact and legal pages are explicitly awaiting client approval. The mission is presented as an ambition. ARN 366696 is owner-supplied and labelled an AMFI distributor identifier, separately from the SEBI website link.

**Live WordPress has not been provisioned. The existing client-owned Vercel project has not been connected to a live CMS or verified by this task.** The implementation has been tested against a disposable local WordPress installation. The client owns the production accounts and subscriptions.

## Administrator setup

1. Create a client-owned WordPress.com site on a plan that permits custom plugins. Confirm the current plan capabilities before purchase: [WordPress.com hosting guidance](https://wordpress.com/support/choose-a-host/).
2. Run `npm ci` and `npm run cms:package` in the website directory. Upload `output/cms/finbharat-content.zip` through Plugins → Add New → Upload. Activate **Finbharat Content**. Activation imports the current copy, structured FAQs, founder details, website asset paths and three labelled fictional case studies without replacing previously imported templates. Terms, Privacy and Contact initially remain drafts.
3. Set WordPress Settings → General → Timezone to Asia/Kolkata, then remove WordPress sample posts. Keep this CMS separate from the public frontend. The plugin marks the CMS theme pages as noindex; the published REST API must remain publicly readable. Do not enable a coming-soon screen or plugin that blocks the API.
4. Create individual **Editor** accounts for client publishers. Reserve **Administrator** accounts for configuration. Editors can publish posts, newsroom entries, case studies, fixed page copy and shared settings, but cannot view or change the Vercel hook. Use the client’s actual email addresses and account invitation flow; no production users are automatically created by this repository.
5. Connect the GitHub repository to the client-owned Vercel account. Build command: `npm run build`; publish directory: `dist`; Node: 22. `vercel.json` sets the static build and filesystem routing with a genuine 404 response. Set Framework Preset to Other and Node.js to 22.x in the project settings. Remove any previous catch-all rewrite to index.html. Set `CMS_URL` to the HTTPS CMS origin and `SITE_URL` to the approved public HTTPS origin in Vercel’s Production and Preview build environments. Enable access to system environment variables. Set `PRODUCTION_LAUNCH=1` in Production only; use 0 or unset in Preview. `VERCEL_ENV=production` and `VERCEL_TARGET_ENV=production` also enforce the launch checks. CMS URL is not an API credential. Do not add a client-side API secret or hook URL.
6. In Vercel Project Settings → Git → Deploy Hooks, create a deploy hook for the production branch (main). In WordPress → Finbharat → Publishing configuration, enter the hook and the public frontend URL. Published-post links will point to the appropriate frontend route; drafts are previewed only inside WordPress. A published link becomes available after its deployment succeeds. The hook URL itself is a secret: keep it only in this Administrator screen; never paste it into frontend environment variables, screenshots or Git. A 2xx response means the deploy request was accepted, not that the build succeeded. See [Vercel deploy hooks](https://vercel.com/docs/deploy-hooks).
7. In Finbharat settings, enter approved public email, phone, address/social links and verified app-store listings. In Website pages, enter approved legal/contact content, SEO metadata, mark it approved and publish those three templates. Production builds fail while these approvals, the CMS URL or a confirmed domain are missing. Preview builds may show pending content and are noindex.
8. Complete the production checks below before routing the public domain or enabling indexing.

## Scheduled publishing and reliable execution

WordPress retains drafts, revisions and scheduled posts. Its scheduling relies on cron execution; a quiet headless CMS cannot depend on visits to its theme pages. On WordPress.com, follow the host’s [WP-Cron guidance](https://developer.wordpress.com/docs/guides/wp-cron-on-wordpress-com/) and enable the host-supported missed-schedule monitor. Alternatively configure an administrator-owned managed scheduler to request the CMS `/wp-cron.php?doing_wp_cron` endpoint every five minutes, if the host allows it. Keep scheduler credentials in that service, never this website. Use only one agreed scheduler and verify it runs on the actual hosting plan.

For the disposable local installation, run `wp cron event run --due-now` via the CLI service. Before client handover, schedule a real test draft a few minutes ahead, stop browsing the CMS, and confirm it publishes and requests a Vercel build. Record the observed publication and deployment times. Local tests verify WordPress’s scheduled event registration and publication callback; they do not certify a production scheduler that has not been configured.

## Editor workflow

### Website copy, FAQs and shared settings

- Open **Website pages** and choose the imported template. Expand the labelled content groups, edit copy, images or FAQs, and Update. FAQ rows can be added or removed. Do not create replacement fixed templates or change their routes.
- Open **Finbharat** for the tagline, mission, founder profiles, approved contacts/links, shared labels and the three illustrative scenarios. Save shared content when ready: these settings are immediately published content, not drafts. They do not have WordPress post revisions; take a backup before a major shared-settings change.
- Typography, page layout, motion, navigation structure and calculator formulas remain controlled by the frontend. The content adapter preserves the fixed template and field types.
- Imported image paths beginning with `/` refer to the frontend’s bundled assets. To replace one, upload an asset you have permission to use in the WordPress Media Library, add descriptive alt text where the template provides it, and select its HTTPS URL. WordPress media privacy must allow the public website to load it. Caption/video hosts must support anonymous CORS requests for the player’s caption track; WebVTT is supported by the WordPress media library.

### Blogs

Use **Posts → Add New**. Add title, an ASCII lowercase/hyphen slug, excerpt, article body, featured image with meaningful alt text, categories and publication date. Supported body blocks: paragraphs, headings (start at H2), lists, quotations, images, links and separators. Avoid a second H1. Fill the Finbharat SEO title and description; blank fields use the article title and excerpt. Preview/review the draft in WordPress, then Publish or Schedule. Actual public preview appears after deployment; no frontend draft-preview service is included.

Articles appear at `/blog/your-slug/`. Do not change a published slug without planning an appropriate Vercel redirect. Removing, trashing or returning a published post to draft requests a rebuild and removes its article route from the next successful deployment and sitemap. Categories filter the listing; longer lists paginate.

### Case studies

Use **Case studies** in the dashboard. Three fictional stories are imported once: Srijan (31, Hyderabad tech professional), Meera (42, Chennai homemaker), and Arjun (42, Bengaluru auto driver). Edit the title, excerpt and article body in the normal WordPress editor. Open the **Meta Boxes** pane if it is collapsed (keyboard: focus Meta Boxes and press Enter). In **Finbharat website content**, edit the name, age, occupation, city, goal, portrait/alt text, listing order and optional FD/SIP assumptions. A lower listing order appears first; Srijan starts at 1. Fill SEO title/description or use the title/excerpt fallback. Preview and revisions are available in WordPress. Publish, schedule, trash or return to draft as you would a blog.

Use an original AI-generated portrait for these fictional personas. A selected featured image overrides the bundled portrait path. The frontend always identifies the story as fictional/illustrative in plain copy. Generated-image provenance remains in the portrait alt text and asset documentation; no image badge is shown. The fictional-story disclosure is not an editable marketing claim. Do not invent client testimonials or achieved investment outcomes. Published pages appear at `/case-studies/your-slug/` and in the sitemap; the first three published entries also appear on Home.

Enable each numeric example only when you want it displayed. FD: deposit amount, annual rate assumption, years and frequency (1 yearly, 2 half-yearly, 4 quarterly, 12 monthly). SIP: monthly contribution, annual return assumption, years and optional initial investment. When you change an assumption, update any corresponding numbers written in the article prose too; prose is editorial content, not an automatic formula. These are **sample assumptions**, not actual offers or a combined portfolio forecast. Calculator formulas are shared with the public tools and cannot be changed from WordPress. Invalid assumptions fail the build with an actionable message. Case drafts and scheduled entries are excluded until published; an empty published list displays an honest empty state.

### Newsroom

Use **Newsroom → Add New**. Choose Company announcement, Press coverage or Video. Enter the same editorial fields as a blog. Add the original HTTPS source URL for press coverage. Add an approved video URL, captions and transcript for speech. The site attributes the original source; do not imply endorsements or invent coverage. Entries appear at `/media/your-slug/`.

### Intro video

In shared settings → Intro, add the approved demonstration video, optional poster, English WebVTT captions, transcript and accurate title. Mark Approved only after review. The trigger remains absent unless all required fields are present. The dialog supports keyboard controls, Close, Escape and focus return; it does not autoplay. The supplied landscape background clip is not an approved introduction. “A more natural conversation about wealth” remains provisional. “India’s first” requires substantiation before publication.

### Legal and Contact

Edit the imported Terms, Privacy and Contact templates, their SEO and approval checkboxes. Publish only approved text. Contact uses approved `mailto:` and `tel:` links; there is no lead-collection form or CRM in this release. Do not use placeholders for a production launch.

## Rebuilds, failures and rollback

Published changes, scheduled publication, unpublishing, deletion and attachment updates request a rebuild. Draft-only edits do not publish articles. Multiple changes in one WordPress request are combined into one hook request. Failed hook requests retry up to three times through WordPress cron. Administrators can see the last request status in Publishing configuration; **“Build requested” does not mean deployment succeeded**. Confirm Vercel’s deployment logs and public URL.

A configured CMS fetch failure or invalid content fails the build before replacing the content snapshot. Vercel promotes only a successful build, preserving the previous deployed site after a failed build. Fix the content/configuration and rebuild; use Vercel’s deployment rollback if needed. Missing required non-legal templates deliberately fails the build. Unpublishing legal/contact content fails a production build; arrange an approved replacement rather than relying on a draft placeholder. Previously public article content remains on the last deployment until the next successful build. Reverting a page/post revision requires an Update and another successful deployment.

The hook is stored server-side as a non-autoload WordPress option, available only to administrators. Rotate it in Vercel and replace it in WordPress if exposed. Keep WordPress, plugins and the frontend dependencies maintained; retain host backups. The public content endpoints contain published editorial data only, not hooks or draft posts. The adapter removes scripts, embedded iframes, event attributes and unsupported markup. Root-relative internal links point to the frontend; use those links rather than CMS theme URLs in article bodies.

## See whether the CMS is working

The local demo is at **http://localhost:8088/wp-admin/** and the website at **http://localhost:4173/**. Use `local-editor` / `local-development-editor` on this disposable local installation only. Administrator configuration uses the local credentials below. These accounts do not exist on a production WordPress site.

1. Start the local CMS and preview using the commands below. In another terminal run `npm run cms:watch`. This watches only local WordPress, builds published changes and leaves the previous preview intact on a failed fetch/build.
2. Open Case studies → Srijan. Change his excerpt or the FD deposit amount, then Update. The watcher polls every eight seconds and reports when the preview is rebuilt. Refresh `/case-studies/srijan-financial-independence/` and check both the copy and calculated number. This local polling replaces a deploy hook only for the demo.
3. Check `http://localhost:4173/.well-known/finbharat-content.json`. `source` must be `wordpress`; the timestamp and revision identify the content snapshot actually deployed. This public diagnostic contains counts and a digest, no hook or CMS credential.
4. For a stronger check, run `CMS_URL=http://127.0.0.1:8088 WEBSITE_URL=http://localhost:4173 npm run cms:check`. It fetches the current published CMS data and compares its digest with the website. Exit code 0 means a matching revision; a mismatch indicates a pending/failed deployment or wrong configuration. Omit `WEBSITE_URL` to test only the CMS connection.

On the hosted site, use the actual HTTPS WordPress and Vercel URLs in the same check. After editing, check **Vercel → Deployments → Ready**, then compare the public page and diagnostic. Save as draft and confirm it does not appear. Publish an entry, confirm its route, then unpublish it and confirm it returns 404 after the next successful deployment. Test failures and scheduling in Preview before production. A successful local check does not certify an unconfigured live host.

WordPress runs separately from Vercel: use a plugin-enabled WordPress.com plan or another managed WordPress host. Vercel serves this static React frontend, not the PHP WordPress dashboard. The publishing flow is **WordPress → server-side deploy hook → Vercel build fetches published REST data → successful deployment → website**. No Next.js migration is needed.

## Local verification

Requires Docker and the bundled browser or `npx playwright-cli install-browser`.

```sh
npm ci
npm run cms:package
docker compose -p finbharat-cms -f wordpress/compose.yml up -d wordpress
docker compose -p finbharat-cms -f wordpress/compose.yml run --rm cli wp core install --url=http://localhost:8088 --title='Finbharat local CMS' --admin_user=local-admin --admin_password=local-development-admin --admin_email=local@example.test
docker compose -p finbharat-cms -f wordpress/compose.yml run --rm cli wp rewrite structure '/%postname%/'
docker compose -p finbharat-cms -f wordpress/compose.yml run --rm cli wp plugin activate finbharat-content
docker compose -p finbharat-cms -f wordpress/compose.yml run --rm cli wp user create local-editor local-editor@example.test --role=editor --user_pass=local-development-editor
docker compose -p finbharat-cms -f wordpress/compose.yml run --rm cli wp eval-file /opt/finbharat-tests/wordpress-integration.php
CMS_URL=http://127.0.0.1:8088 npm run build
npm run lint
npm test
npm run preview -- --port 4173 --strictPort
# In another terminal:
npm run test:browser
npm run test:cms-browser
```

`test:cms-browser` temporarily creates clearly labelled local blog/newsroom/homepage/FAQ/legal and video-dialog fixtures, verifies the static build and browser, then restores the CMS and rebuilds the empty editorial preview. It requires the running preview and the browser configuration produced by `test:browser`.

The passwords in this local example are disposable development values. Never use them on a public host. An installed local database does not need `core install` or another user creation. Delete WordPress-generated Hello World/sample posts if present. Stop the local services with `docker compose -p finbharat-cms -f wordpress/compose.yml down`; omit `-v` to retain local data.

## Production handover checklist

- Client owns both hosting accounts; Editor invitations accepted; Administrator access limited.
- Correct CMS/public URLs configured, sample posts removed, backups enabled.
- Approved legal pages, official email/phone and actual domain supplied. ARN details confirmed by the client; its display is not a SEBI approval claim.
- Edit/publish one blog, newsroom entry, case study (including a numeric assumption), homepage field, FAQ and legal page without code changes. Confirm public HTML after the deployment. Remove test content afterward.
- Test drafts, scheduling without CMS visits, unpublishing and content-fetch/build failures on a preview environment; confirm the last successful deploy stays live on failure.
- Verify direct article URLs, 404 HTTP responses, sitemap/canonicals, internal links, safe body markup, mobile layouts, keyboard navigation, captions/dialog controls, reduced motion and calculators.
- Review the human-photo licences, AI persona disclosures and final intro wording. No fake testimonials, performance promises or unsupported “first” claims.
- CRM, transactions and campaign templates are intentionally outside this release. Add future services through separate modules; do not put transaction credentials in the public content snapshot.
