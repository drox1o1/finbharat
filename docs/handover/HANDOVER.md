# Finbharat website and CMS handover

This package contains the Finbharat website, its current editorial content, the WordPress integration and the files needed to run it on the client’s own systems. Open `START-HERE.html` for a readable copy of this guide. Begin with the local website, then restore the CMS on a fresh WordPress installation.

## What is included

| Folder or file | Purpose |
| --- | --- |
| `website/` | React source, locked dependencies, tests, assets, deployment configuration and technical documentation |
| `website/dist/` | The verified static website build, ready for a static host |
| `cms/finbharat-content.zip` | Installable Finbharat WordPress plugin |
| `cms/content.json` | Portable snapshot of the current published content, plus pending contact content |
| `cms/import-content.php` | WP-CLI importer for fixed pages, blogs, newsroom, case studies, shared settings and featured images |
| `reference-documents/` | Supplied FAQ and terms DOCX files, including the privacy policy |
| `THIRD-PARTY-NOTICES.txt` | Dependency notices and references to asset provenance |
| `RELEASE.json` and `SHA256SUMS.txt` | Source commit, package contents, checks and file integrity hashes |

The package includes two sample blogs, two attributed press entries, three fictional planning stories, 94 FAQ questions in 15 topics, and the supplied Terms and Privacy pages. The Inclusion page shares the homepage case studies. The current wording uses “Meet the Founders” and “Your choice, without pressure.”

Passwords, WordPress.com tokens, deploy-hook secrets, personal account settings, database user records, dependency caches and Git history are excluded. Create individual client accounts on the new host. This is an editable content migration and source handover; it does not preserve old user accounts, revisions, deleted items or server configuration.

## Current deployment and CMS status

The GitHub repository is https://github.com/drox1o1/finbharat and the deployment branch is `main`. The current Vercel project is `finbharat` under `durgeshkukreti27livecoms-projects`.

Vercel currently publishes the committed `website/content/demo-content.json`. WordPress dashboard edits do not yet update that live demo automatically. Demo pages use `noindex`; final launch requires the settings below.

A temporary WordPress Studio CMS demo is available at https://durgeshkukreti52-xdwnv-studio.wp.build/wp-admin/. Studio previews expire seven days after their last Studio snapshot update. Treat this URL as temporary; the package contains the portable content so the client does not depend on it. Dashboard edits do not automatically refresh the Studio expiry or synchronize back to the local Studio copy.

WordPress requires a PHP-capable host with a supported database. Vercel hosts the React website separately. Hosting accounts, domain registration and subscriptions should belong to the client.

## Run the website locally

Install Node.js 22 or 24 and npm. Extract the ZIP, open a terminal in `website/`, then run:

```sh
npm ci
npm run dev
```

Vite prints the local URL. To verify the production output:

```sh
npm run lint
npm test
npm run build
npm run preview -- --port 4173
```

Open http://localhost:4173. Use the FD, SIP and goal calculators; open each case study; check `/faq/`, `/terms/`, `/privacy/`, `/blog/` and `/media/`.

The ready-made `website/dist/` is the portable demo build. To host it, upload its contents to a static web host that serves directory `index.html` files. Configure missing URLs to serve `404.html` with HTTP status 404. Set `SITE_URL` and rebuild when using a different public domain so canonical URLs and the sitemap match it.

## Restore WordPress on a client host

Use a fresh WordPress installation with HTTPS, PHP 8.1 or later, and WordPress 6.4 or later. Install the plugin from `cms/finbharat-content.zip` under Plugins → Add New → Upload Plugin, then activate it. A host’s support team can run the WP-CLI commands if SSH is unavailable.

Upload `cms/` and `website/public/` to a private directory outside the public web root. From the WordPress installation directory, run the importer preview using the actual absolute paths:

```sh
wp eval-file /private/handover/cms/import-content.php /private/handover/cms/content.json /private/handover/website/public preview
```

Review the listed actions, then import:

```sh
wp eval-file /private/handover/cms/import-content.php /private/handover/cms/content.json /private/handover/website/public import
```

The importer copies featured images into the WordPress Media Library and assigns them to the corresponding articles and case studies. Layout images remain bundled with the React frontend. Supplied published pages are restored; Contact remains a draft until official details are provided. Sample posts are demonstration content for the client to review before final launch. Remove WordPress’s default “Hello world” post and Sample Page if present.

On reruns, `import` preserves existing articles and edited template fields. `replace` explicitly replaces matching records from this package; use it only after a CMS backup. The importer does not delete unrelated content. Create a client Administrator for configuration and individual Editor accounts for content, using new passwords. Existing draft posts and revision history from the demo are not restored.

For a local Docker demonstration, use `website/wordpress/compose.yml` and follow `website/docs/cms-setup.md`. Its loopback-only credentials are development examples. Use independently managed credentials and HTTPS on a public host.

## Connect the client’s Vercel website

Import the `website/` source into a client-owned GitHub repository. Create a Vercel project from it. If the repository root contains the whole package, set the Vercel Root Directory to `website`; if it contains only website files, use the repository root.

Use Framework Preset **Other**, Install Command `npm ci`, Build Command `npm run build`, and Output Directory `dist`. The included `vercel.json` serves prerendered files and returns an actual 404 for missing routes.

For a demo, use `CONTENT_MODE=demo`, leave `CMS_URL` unset, and keep `PRODUCTION_LAUNCH` unset or `0`. Set `SITE_URL` to the review domain if available. This runs from the saved snapshot.

For final launch with the client CMS, set these Vercel environment variables:

```text
CONTENT_MODE=wordpress
CMS_URL=https://the-clients-wordpress-host
SITE_URL=https://the-clients-public-website
PRODUCTION_LAUNCH=1
```

Use real origins without `/wp-admin/`. The final-launch build requires official public email and telephone details and approved, published Contact, Terms and Privacy pages. The supplied Terms and Privacy are currently published; official contact details and the production domain remain outstanding. The app is coming soon, with no store URLs. The intro video remains a thumbnail placeholder until an approved video, captions and transcript are supplied.

Create a Vercel deploy hook for `main`. In WordPress, open Finbharat → Publishing configuration and save the secret hook and public frontend URL. Keep the hook in server-side WordPress settings. Never put it in GitHub, this ZIP or a `VITE_*` environment variable.

Published content changes then trigger a build. The new content appears after a successful deployment, rather than immediately on saving. Failed CMS fetches and failed builds preserve the last successful Vercel deployment. Configure the host’s reliable scheduled-task execution for WordPress scheduled publishing, as described in `website/docs/cms-setup.md`.

## Client editing guide

| WordPress location | What the client can edit |
| --- | --- |
| Posts | Blog title, slug, excerpt, body, categories, cover image and publication date |
| Newsroom | Press coverage, announcements, source attribution and video entries |
| Case studies | Story, persona, portrait, order, SEO and FD/SIP sample assumptions |
| Website pages | Homepage copy, Inclusion, About, product content, FAQ topics, Terms, Privacy and Contact |
| Finbharat | Global tagline, mission, founder profiles, approved links, intro media and trust text |

Choose a relevant record, edit, preview, then publish. Use meaningful alt text for images. FAQs have rich-text body fields for each topic; headings and lists can be edited there. Typography, layout, animation and calculator formulas remain in frontend code. Case study disclosures identify imagined stories and do not claim customer results.

To manually refresh a saved demo snapshot after CMS edits:

```sh
CMS_URL=https://the-clients-wordpress-host npm run cms:export-demo
```

Bundle all uploaded assets before committing the snapshot; temporary CMS media URLs should not become permanent website dependencies. For ongoing client publishing, use WordPress mode and the hook instead of repeatedly exporting the demo.

## Acceptance and launch

Before production, confirm the domain, public email and telephone; review sample articles, legal wording and product-specific FAQ details; replace demo account credentials; configure backups and scheduled publishing. The client previously approved the FAQ’s Purse, Way2Wealth support, Shriram, NPS and insurance references. Original wording is retained, including legacy entity references and the source’s missing revision date/address. This handover records that provenance; it is not an independent legal review.

Verify one blog, newsroom entry, homepage field, FAQ, legal page and case study edit through WordPress followed by a successful deployment. Test scheduling, draft exclusion, unpublishing and a failed fetch/build on a preview environment. Check mobile and keyboard use, direct URLs, 404 responses, sitemap, metadata, reduced motion and calculator results.

Original assets and their provenance are documented in `website/docs/assets-provenance.md` and `website/docs/artwork.md`. Publisher images and logos identify attributed coverage; they do not imply endorsement. Review the documented usage rights before repurposing press assets.

CRM integration, transactions and campaign landing page templates are later scope. The website does not accept investments or open deposits.

## Updates and recovery

Keep source and locked dependencies in the client’s GitHub repository. Build and review changes before merging into `main`. Vercel’s deployment history can restore a previously successful frontend. CMS backups are separate: back up both the database and uploaded media regularly and before migrations or plugin updates.

Keep a copy of this ZIP and its checksum offline. Source history is available in the GitHub repository; this archive contains the current source snapshot. Transfer hosting ownership, billing, DNS and account access directly through their providers rather than sharing personal account passwords.
