# Finbharat: complete Hostinger implementation guide

Website, WordPress CMS, publishing and client handover · 17 October 2026

## 1. The setup in plain language

Finbharat has two connected parts. The React website presents the design, calculators and content to visitors. WordPress provides the dashboard where the client edits content. Both can live in the same client-owned Hostinger account, as two separate websites.

During review, use two different Hostinger temporary addresses: one for the public-facing website and one for WordPress. Later, assign the approved main domain to the frontend and a CMS subdomain to WordPress. `finbharat.org` and `cms.finbharat.org` are examples in this guide; the final website domain still needs client confirmation.

The content flow is:

```text
Editor updates WordPress → Publish / Update
                     ↓
Operator requests a website rebuild
                     ↓
Build fetches published WordPress content through its REST API
                     ↓
Content is validated and article HTML is sanitized
                     ↓
React generates HTML pages, assets, metadata and sitemap
                     ↓
Successful deployment becomes visible to visitors
```

Calculators run in the visitor's browser. This release does not create investment accounts, accept transactions or connect a CRM. WordPress does not replace the React design with a WordPress theme.

## 2. Current status and the delivery files

The source and upload packages are prepared. Hostinger installation and account-specific connectivity have not been verified by us. Registering a connector in Codex does not install WordPress or deploy a website.

| Item | Current state |
| --- | --- |
| Contact | `contact@finbharat.org`, approved and linked on Contact |
| Rakesh LinkedIn | `https://www.linkedin.com/in/rakeshkgogetter/` |
| D. Ramanathan LinkedIn | `https://www.linkedin.com/in/d-ramanathan-cfp-cm-791b151b/` |
| Rakesh portrait | Supplied red-polo photograph on Home and About |
| Introduction video | Hidden; its WordPress visibility control is retained |
| App stores | Coming soon; no active download destinations supplied |
| Saved editorial snapshot | 12 fixed templates, 2 sample blogs, 2 press entries, 3 fictional case studies and 15 FAQ topics |
| Website verification | 29 automated tests passed; 22 routes built; upload source built independently |
| WordPress-to-Hostinger automatic publishing | Additional integration work required |

Use the correct file for each job:

| File | Where it goes |
| --- | --- |
| `Finbharat-Hostinger-App-2026-10-17.zip` | Hostinger Web App source upload screen |
| `finbharat-content.zip` | WordPress → Plugins → Add New → Upload Plugin |
| `Finbharat-Client-Handover-2026-10-17.zip` | Extract on the developer's computer; contains source, import files, assets and references |
| This implementation guide | Share with the client and the person configuring hosting |

The full handover ZIP is an archive for the recipient to unpack. It is not the application upload ZIP. The plugin ZIP contains our editing controls; it does not contain WordPress core or a database. Uploading any of these files does not create the `contact@finbharat.org` mailbox; the client or email administrator must configure that separately.

## 3. Before starting

Confirm the Hostinger plan supports a React/Vite Web App and has capacity for a second WordPress website. Business Web and Cloud plans support Node.js Web Apps; availability should be checked in the actual account. [Hostinger plan and application guidance](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).

Record the following in the client's private handover notes:

- Hosting account owner and the person with collaborator access.
- Frontend website name and assigned HTTPS temporary URL.
- WordPress website name and assigned HTTPS temporary URL.
- Final domain owner, DNS provider and nominated primary hostname.
- GitHub repository ownership and who approves source changes.
- Administrator, client Editor and deployment operator responsibilities.
- Backup location and recovery owner.

Hostinger, domain registration and GitHub access should be client-owned or formally transferred. Passwords, deployment tokens and backup databases belong in private account storage; they are excluded from the public source and delivery archives.

## 4. Upload the frontend to a temporary domain

In hPanel, create a Web App, choose file upload, select the Finbharat application ZIP and use a temporary domain. Confirm these settings before deploying:

| Setting | Value |
| --- | --- |
| Application type | Frontend application, Vite / React |
| Project root | Archive root, `.` |
| Node version | 22.x |
| Package manager | npm |
| Install command, if shown | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Server entry file | None; this is a static frontend |

Start with these environment values:

```text
CONTENT_MODE=demo
SITE_URL=https://YOUR-FRONTEND-TEMPORARY-DOMAIN
PRODUCTION_LAUNCH=0
```

Replace the example URL with the actual assigned address. If it is assigned after the first deployment, set `SITE_URL` and rebuild. Leave `CMS_URL` unset in this phase. These build settings belong in hPanel, not in a JavaScript file. The project does not automatically load a local `.env` file for its Node content preparation step.

The demo mode uses the committed content snapshot. It works even before WordPress exists, and remains excluded from search indexing. Confirm deployment success in the dashboard. [Hostinger Web App upload instructions](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).

Check Home, About, Contact, the three calculators, Blog, Media, FAQ and a direct case-study URL. Open a nonexistent URL and confirm an actual 404. The prerendered pages must remain available on direct navigation and refresh; a blanket rewrite of every URL to the homepage would be incorrect for this project. `vercel.json` does not configure Hostinger routing.

## 5. Create the WordPress website

Create a second website in the same hosting account and choose WordPress. Enter the client's administrator email and a new password, select a blank WordPress site, and choose another temporary domain. Once installation finishes, open WP Admin. [Hostinger WordPress installation steps](https://www.hostinger.com/support/6640339-how-to-add-a-wordpress-website-in-hostinger/).

Configure WordPress before importing content:

- Confirm HTTPS works for the CMS and its Media Library URLs.
- Use a current host-supported WordPress and PHP release compatible with the plugin. Its minimum requirements are WordPress 6.4 and PHP 8.1.
- Set Settings → General → Timezone to Kolkata / Asia/Kolkata.
- Save readable permalinks in Settings → Permalinks, then test `/wp-json/`.
- Create individual Editor accounts for client publishers. Keep Administrator access with the configuration owner.
- Keep the published REST endpoints accessible to anonymous readers. A site-wide password or coming-soon tool that blocks the API will prevent frontend builds.
- Remove the default sample post and page after confirming they are only the fresh installation's samples.

Use the second website's WP Admin dashboard for all subsequent CMS steps. The visitor-facing website remains the first Web App.

## 6. Install the Finbharat plugin and import the full content

In WordPress → Plugins → Add New → Upload Plugin, select `finbharat-content.zip`, install it and activate **Finbharat Content**. The dashboard should now include **Website pages**, **Case studies**, **Newsroom** and **Finbharat**. Blogs use the standard **Posts** menu.

Activation seeds baseline templates and selected entries. The full current snapshot and featured images are restored with the supplied importer. This is a one-time developer or hosting-support task; there is no dashboard button in this release for importing the handover JSON.

Extract the full client handover ZIP. Its relevant paths are:

```text
cms/finbharat-content.zip
cms/content.json
cms/import-content.php
website/public/
```

Upload `cms/` and `website/public/` into a private handover directory on the WordPress hosting account, outside `public_html`. Use the actual private path supplied by hPanel; `/PRIVATE/HANDOVER` below is a placeholder, not a literal folder to assume exists.

Connect through SSH to the WordPress hosting account, enter the WordPress installation directory, and check WP-CLI:

```sh
wp core is-installed
wp plugin status finbharat-content
```

Preview the importer first:

```sh
wp eval-file /PRIVATE/HANDOVER/cms/import-content.php /PRIVATE/HANDOVER/cms/content.json /PRIVATE/HANDOVER/website/public preview
```

Review the Create / Update / Preserve list. On a fresh installation, run:

```sh
wp eval-file /PRIVATE/HANDOVER/cms/import-content.php /PRIVATE/HANDOVER/cms/content.json /PRIVATE/HANDOVER/website/public import
```

`import` preserves already edited entries on reruns. `replace` overwrites matching records and should only be used following an explicit restore decision and backup. The importer does not remove unrelated content or restore old users, revisions or deleted items. Hostinger documents WordPress management through SSH; if SSH or WP-CLI is unavailable on this account, request the hosting/development operator to perform the import. [Hostinger SSH guidance](https://www.hostinger.com/support/5822386-common-ssh-commands-at-hostinger/).

Expected imported content: 12 fixed templates, 2 sample blogs, 2 attributed media entries, 3 case studies, 15 FAQ topics, supplied Terms and Privacy, approved Contact, global copy and founder details. Featured images are copied into the new Media Library. Decorative images with `/art/`, `/brand/` and similar paths remain part of the React asset bundle; the dashboard can replace them with uploaded media.

Confirm all 12 required templates are published, including the approval checkboxes for Contact, Terms and Privacy. Verify `contact@finbharat.org`, both founder URLs, the new Rakesh photograph and the hidden intro setting. Confirm sample articles are acceptable for the client's demonstration; they still need editorial review for final publication.

## 7. Connect WordPress to the website on temporary domains

First test these CMS endpoints in a browser or an HTTP client:

```text
https://YOUR-CMS-TEMPORARY-DOMAIN/wp-json/finbharat/v1/site
https://YOUR-CMS-TEMPORARY-DOMAIN/wp-json/wp/v2/posts?status=publish&_embed=1
https://YOUR-CMS-TEMPORARY-DOMAIN/wp-json/wp/v2/finbharat_media?status=publish&_embed=1
https://YOUR-CMS-TEMPORARY-DOMAIN/wp-json/wp/v2/finbharat_case?status=publish&_embed=1
```

They should return JSON rather than a login page, a security challenge or an HTML error. The Finbharat configuration must have `schemaVersion: 1`, a `site` object and the published `pages` object. No administrator password is required to read published content.

In the frontend Web App environment, change to:

```text
CONTENT_MODE=wordpress
CMS_URL=https://YOUR-CMS-TEMPORARY-DOMAIN
SITE_URL=https://YOUR-FRONTEND-TEMPORARY-DOMAIN
PRODUCTION_LAUNCH=0
```

Use the CMS origin, without `/wp-admin/` or `/wp-json/`. Save the values and request a new build through Settings & Redeploy. Preview on temporary domains remains noindex. Hostinger's dashboard provides environment-variable and redeployment controls. [Hostinger application management](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).

The deployment log should now say `Content prepared: wordpress`. Open the frontend diagnostic URL:

```text
https://YOUR-FRONTEND-TEMPORARY-DOMAIN/.well-known/finbharat-content.json
```

Its `source` must be `wordpress`, with a current `fetchedAt` timestamp. This confirms the build fetched the CMS, rather than continuing to use the saved demo snapshot.

From a developer's local source folder, the stronger comparison is:

```sh
CMS_URL=https://YOUR-CMS-TEMPORARY-DOMAIN WEBSITE_URL=https://YOUR-FRONTEND-TEMPORARY-DOMAIN npm run cms:check
```

The command validates the adapter and compares the published CMS revision against the deployed revision. The script still refers to Vercel in one troubleshooting sentence; use the Hostinger deployment log for this setup. If recent changes are cached, purge the affected cache and retry after the build has finished.

## 8. Publishing on Hostinger: what works now

**Manual publication is the immediately available workflow.** WordPress mode fetches new content on each build; it does not fetch fresh CMS content every time a visitor opens a page.

1. The Editor writes or changes an entry in WordPress and publishes or updates it.
2. The deployment operator opens the frontend's hPanel dashboard and requests a rebuild/redeploy of the existing source.
3. The build reads current published WordPress content and regenerates affected routes and listings.
4. The operator checks the successful deployment and opens the changed public page.

When the website is already in WordPress mode, an editorial edit does not require a new source ZIP: a fresh content-fetching build is enough. A source/design change requires an updated ZIP or a connected GitHub deployment. A process restart alone is not a content rebuild.

The existing WordPress **Publishing configuration** accepts Vercel and Netlify deploy-hook URLs. It does not currently accept or trigger Hostinger. Leave the hook blank for a Hostinger-only installation. The public frontend URL setting can still point published-entry links at the right frontend origin. A hook left over from the earlier Vercel demo would target that old deployment, so review it during migration.

GitHub integration can deploy code changes, but publishing a WordPress post does not push a Git commit. Connecting GitHub alone therefore does not complete CMS automation. Do not treat “saved in WordPress” as “visible on the website”; the content revision changes only after the successful rebuild.

## 9. Automatic publishing: remaining implementation work

This stage needs a developer. It is a defined follow-up integration, not a feature that is activated by uploading the current ZIP.

The intended implementation is:

1. Confirm the supported Hostinger rebuild/deployment mechanism for the actual account and Web App. Record its requirements and verify a test deployment before integrating it.
2. Extend the plugin's publishing settings with a Hostinger target. Use a host-supported authenticated build trigger, or a small server-side publishing bridge if the host requires an API token.
3. If using a bridge, authenticate WordPress requests with a server-side secret, verify signatures and freshness, restrict the target application, and reject untrusted requests. Keep Hostinger tokens on that bridge or in the deployment service's secret store.
4. Combine rapid editor saves into a single queued build. Prevent overlapping publication jobs; retry bounded transient failures and record a useful status for administrators.
5. Trigger on published-page and shared-settings updates, post publication, scheduled publication, unpublishing, deletion and relevant media changes. Draft-only article edits should not make draft material public.
6. Report “build requested”, “build running”, “deployed” and “failed” distinctly. A successful trigger response only means the request was accepted.
7. Verify that a failed CMS fetch or build preserves the last good public deployment, and document the actual restoration procedure available in this plan.

Completion requires a WordPress edit to appear on the public website without an operator opening hPanel or uploading files. Test one blog, media entry, case study, homepage field, FAQ and legal-page edit, then scheduling and unpublishing. Record the observed delay and where the client sees failure status. Client handover should explicitly state whether this automation is completed or whether manual rebuilds remain the agreed process.

## 10. The client's content editing guide

| Content | WordPress location | Editing notes |
| --- | --- | --- |
| Tagline and mission | Finbharat → Site | Shared content publishes when saved |
| Contact email | Finbharat → Site → Contact | Use `contact@finbharat.org`; Contact page copy is a separate field |
| Founders | Finbharat → Site → Founders | Names, roles, biographies, LinkedIn, portrait, alt text, framing |
| Homepage and product copy | Website pages → existing template | Edit the labelled content groups; preserve fixed routes |
| Hide case studies or other optional sections | Page → Section visibility | Home and Inclusion have independent switches |
| Introduction video | Finbharat → Site → Intro | Keep Show introduction video unchecked for this release |
| Main logo and decorative images | Finbharat → Site → Assets | Select approved Media Library images |
| Blog | Posts | Title, slug, excerpt, body, featured image, categories, date and SEO |
| Press coverage and announcements | Newsroom | Add original source URL and publication attribution |
| Case studies | Case studies | Story, profile, portrait, order and sample FD/SIP assumptions |
| FAQ, Terms, Privacy and Contact copy | Website pages → corresponding template | Review wording, approval checkbox and published status |

For a blog, add title, a lowercase hyphenated slug, an excerpt, body headings starting at H2, categories and a featured image with alt text. Review SEO title and description, then publish or schedule. The public route is `/blog/slug/`. Avoid changing a live slug until a redirect is planned.

Case studies are fictional planning stories, not testimonials. Their narratives, images and numeric assumptions are editable; the financial formulas and fictional-story disclosures remain controlled by code. Changing an example amount does not rewrite the article prose automatically. Review corresponding numbers written in the story.

A featured image controls blog, newsroom and case-study covers. Use meaningful image descriptions. Founder framing supports focus such as `50% 10%` and zoom from `1` to `2.5`. Uploaded media needs a public HTTPS URL. Video, image and media changes become visible after the selected publishing workflow finishes.

The CMS controls content within the established templates. Section order, new templates, new navigation destinations, typography, responsive layouts, animation, calculator formulas, validation and protected disclosures require source-code changes. The website includes no lead form or CRM in this release.

If the introduction returns later, enable its visibility, add an approved video and transcript, and provide captions: reviewed YouTube captions for an unlisted YouTube link, or a WebVTT captions file for a direct video. Keep provisional claims such as “India's first” unpublished unless substantiated.

## 11. Scheduled publication, backups and access

WordPress scheduling needs reliable cron execution even when nobody visits the CMS. Ask the hosting operator to configure a supported scheduler for the correct WordPress installation, normally every five minutes. Verify the actual WP-CLI path and PHP environment if using a command-based job. A sample command is:

```sh
wp --path=/ACTUAL/WORDPRESS/ROOT cron event run --due-now
```

This is a command template, not a ready-to-paste hPanel cron entry. The operator must supply verified absolute executable and installation paths. If replacing traffic-driven WP-Cron, set `DISABLE_WP_CRON` only after confirming the external scheduler runs. Avoid multiple competing scheduler setups.

Schedule a test article a few minutes ahead, stop visiting WordPress, and verify it becomes published. Then verify the separate website build: a scheduler publishes in WordPress; it does not itself rebuild the frontend. Until automation is installed, the operator still requests that rebuild.

Back up the WordPress database and uploads, plus plugin versions and configuration, before imports, migrations or major updates. Keep website source, lockfile and a verified release ZIP. A frontend rollback restores pages; a CMS restore restores editable content and media. They are separate recovery operations.

Give editors their own logins and demonstrate password recovery. Hostinger collaborator access and WordPress Editor access are separate permissions. Configuration secrets and administrator accounts should be accessible to the client's nominated owner.

## 12. Move to the client's final domain

Before making DNS changes, record existing records, the email provider, MX records and SPF/DKIM/DMARC. Preserve the client's email setup while connecting web hosting. Confirm whether the public address uses the apex domain or `www`, then use one canonical version consistently.

Assign the approved domain to the existing frontend Web App through **Connect domain** and follow the DNS instructions for its actual provider. Assign the chosen CMS subdomain to the existing WordPress site using its supported temporary-domain connection flow. Test HTTPS on both. [Frontend custom-domain connection](https://www.hostinger.com/support/how-to-connect-a-custom-domain-to-a-node-js-application/), [temporary-to-custom domain guidance](https://www.hostinger.com/support/10085905-how-to-connect-a-preferred-domain-name-instead-of-a-temporary-one-at-hostinger/).

Back up WordPress first. Verify its Home/Site URL, uploads and saved internal links use the final CMS hostname. Where the hosting migration leaves old absolute URLs behind, a developer should perform a serialization-aware search/replace after a dry run. Do not replace hostnames directly in an SQL file. Verify the REST API and media again before rebuilding the frontend.

In the frontend environment, set:

```text
CONTENT_MODE=wordpress
CMS_URL=https://YOUR-FINAL-CMS-DOMAIN
SITE_URL=https://YOUR-FINAL-PUBLIC-DOMAIN
PRODUCTION_LAUNCH=1
```

The current final-launch gate requires a real HTTPS public origin, approved/published Terms, Privacy and Contact, and valid public email and telephone details. The email is supplied; no telephone has been supplied yet. Obtain an approved number, or have a developer implement and verify an explicitly approved email-only launch policy. Do not invent a number or remove checks silently.

Update WordPress's public frontend link setting and any publishing bridge. Rebuild so generated canonical URLs, sitemap, social metadata and page links use the final hostname. Check indexing is enabled only on the final frontend; the CMS theme and preview deployments should stay noindex. Remove references to the temporary Studio CMS and temporary media URLs from the final build. Keep stable article slugs and add redirects for intentionally changed public URLs.

## 13. Verification and sign-off

Use a test environment for failure and rollback checks. Record the observed result, reviewer and date for each item; a prepared package is not evidence of a live Hostinger deployment.

| Check | Acceptance result |
| --- | --- |
| Frontend | Home and direct article URLs show the actual Finbharat content |
| Contact and founders | Email opens the mail client; both LinkedIn links match the approved profiles |
| Calculators | FD, SIP and all three goal choices accept input and update estimates |
| CMS connection | Diagnostic reports `wordpress`; `cms:check` matches the deployed revision |
| Editorial publishing | Blog, media, case study, homepage, FAQ and legal edits appear after the agreed process |
| Drafts and scheduling | Drafts stay private; scheduled publication and subsequent rebuild are verified |
| Unpublishing | Removed articles leave listings and sitemap; old routes return 404 after rebuild |
| Images | New CMS images and Rakesh's portrait load over HTTPS on mobile and desktop |
| Section controls | Intro stays hidden; Home and Inclusion visibility changes behave independently |
| Accessibility | Keyboard navigation, focus, reduced motion and readable mobile layouts work |
| Domain and SEO | Final canonical, sitemap, social images, robots and 404 status are correct |
| Failure and recovery | Failed fetch/build does not replace the last good deployment; recovery is demonstrated |
| Ownership | Client can access hosting, WordPress, GitHub, DNS and backups through their own accounts |

## 14. Troubleshooting

| Symptom | What to check |
| --- | --- |
| Build asks for `CMS_URL` | WordPress mode is enabled before the CMS origin was configured; use demo mode only for the intentional saved preview |
| CMS endpoint returns HTML / 401 / 403 | Verify the origin, plugin activation, permalinks, HTTPS and API-blocking access controls |
| Required page is not published | Open Website pages and publish the matching fixed template; do not create a duplicate route |
| Blog image is missing | Verify featured image, HTTPS source, alt text and media URL after domain migration |
| WordPress edit is absent | Confirm the app is in WordPress mode, request a fresh build, check deployment logs and compare revisions |
| No `Restart` button | A static Vite frontend has no persistent server; request a build/redeploy instead |
| Only homepage works | Verify directory index serving and direct routes on Hostinger; review catch-all routing |
| Missing URL returns 200 | Configure genuine 404 handling for generated `404.html` and retest |
| Scheduled item never publishes | Verify timezone and the correct WordPress cron job, then the frontend rebuild trigger |
| Hostinger hook is rejected by plugin | Current hook validation supports Vercel/Netlify only; use manual redeploy until the Hostinger integration is implemented |
| Launch build asks for contact or domain approval | Complete the listed configuration; preview mode and final-launch mode have different gates |

## 15. Client handover and operator commands

Deliver the full handover ZIP, the Hostinger app ZIP, the plugin ZIP and this guide. Confirm hosting/domain ownership, named editor accounts, who deploys, where backups live, how to request help and whether publication is manual or automated. Demonstrate a real content change on the actual review site, followed by a successful publication.

The latest source repository is `https://github.com/drox1o1/finbharat`, branch `main`. Keep future frontend changes versioned there or transfer to the client's agreed repository. Account ownership and billing should be transferred through provider permissions rather than by sharing personal logins.

Developer commands, run in the source root:

```sh
npm ci
npm run lint
npm test
npm run build
npm run cms:package
npm run hostinger:package
```

For a local CMS-connected preview, supply the real origins in the shell:

```sh
CONTENT_MODE=wordpress CMS_URL=https://YOUR-CMS-DOMAIN SITE_URL=https://YOUR-REVIEW-DOMAIN PRODUCTION_LAUNCH=0 npm run build
npm run preview -- --port 4173
```

The source handover includes layout/assets, locked dependencies, tests, plugin source, current content, supplied FAQ/terms documents and the original replacement founder photograph. Passwords, API tokens, WordPress database user records, old revisions and hosting account configuration are not included. WordPress itself must be installed on the destination host.

**Implementation is complete when:** the website is accessible on the agreed domain; the CMS has the client's content and media; the publishing process is verified; scheduled and unpublished content behave correctly; and the client can edit, publish and recover using documented access and responsibilities. Hostinger automatic publishing remains additional work until its specific integration and acceptance tests are completed.
