# Finbharat on Hostinger

For the complete temporary-domain setup, CMS import, publishing implementation,
domain migration and client handover, use `hostinger-implementation.md` or its
printable HTML edition. This file is the shorter upload checklist.

## 1. Upload the website

The **Upload your app files** screen accepts the application source ZIP named
`Finbharat-Hostinger-App-YYYY-MM-DD.zip`. Do not upload the complete client
handover ZIP or the WordPress plugin ZIP into this screen.

Use these application settings:

| Setting | Value |
| --- | --- |
| Framework | Vite / React, frontend application |
| Root directory | Archive root (`.`) |
| Node version | 22.x |
| Package manager | npm |
| Install command, if shown | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Content environment | `CONTENT_MODE=demo` |
| Public URL, once assigned | `SITE_URL=https://YOUR-ACTUAL-DOMAIN` |

No application entry file or persistent Node server is needed: Node builds the
prerendered HTML, CSS and JavaScript and Hostinger serves the result. The source
ZIP includes `package.json` at its root and excludes dependencies and build output.

The first upload uses the saved editorial snapshot. It works without WordPress,
and includes `contact@finbharat.org` and the approved founder LinkedIn profiles.
It remains a prelaunch preview with search indexing disabled. Uploading source
files does not create WordPress, its database, an email inbox, or a publishing hook.

After building, check Home, `/contact/`, `/about/`, the three calculators, direct
blog/case-study URLs and a nonexistent URL. The host must serve each generated
page and return a real 404 for missing URLs. Hostinger does not use `vercel.json`
for routing; verify routing on the assigned preview domain before launch.

Official upload instructions:
https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/

## 2. Install WordPress separately

Create a separate WordPress website in hPanel on a permanent HTTPS subdomain
such as `cms.finbharat.org`, if the client owns and chooses that domain. Keep the
main domain assigned to the React frontend. The contact email's domain alone
does not confirm the final website domain.

Install and activate `finbharat-content.zip` through WordPress → Plugins → Add
New → Upload Plugin. The plugin provides Finbharat's structured page and global
settings. It is not a WordPress theme or a complete WordPress installation.

Restore the editorial snapshot and bundled images with the importer in the client
handover package; its START-HERE guide describes the preview and import commands.
Plugin activation alone does not import the full current blog and media archive.
In the new dashboard confirm the contact email, founder URLs, legal pages, media,
case studies and the hidden introduction video before building from the CMS.

WordPress supports editing copy, images, founder details, blogs, media, case
studies, FAQs and the existing section visibility controls. Layout and calculator
formulas stay in the frontend source.

## 3. Connect the frontend to WordPress

Only after the plugin and content import are ready, set the frontend environment:

```text
CONTENT_MODE=wordpress
CMS_URL=https://YOUR-PERMANENT-WORDPRESS-SUBDOMAIN
SITE_URL=https://YOUR-ACTUAL-WEBSITE-DOMAIN
```

Rebuild the app and verify a published WordPress edit appears in the deployed
page. `CMS_URL` is the WordPress site origin, not a wp-admin login URL. Public
published content is fetched through the REST API at build time; no admin
password belongs in the frontend environment or source archive.

Final search-indexed launch also requires `PRODUCTION_LAUNCH=1` and the existing
launch checks: confirmed public HTTPS URLs, approved legal/contact pages, and
the public email and telephone required by the current project configuration.
No telephone has been supplied yet; do not invent one or enable final-launch
mode just to bypass a build error. The email contact page already works without
showing a phone field.

## 4. Publishing workflow

WordPress edits appear after a successful frontend rebuild. With a ZIP-uploaded
app, plan on a manual rebuild/redeploy until a secure publication-triggered
workflow is configured and tested. GitHub code-push deployment alone does not
detect WordPress content changes. Do not put Hostinger API tokens in a public
webhook URL or in `VITE_*` environment variables.

Before client handover test publication, scheduled publication, unpublishing,
draft exclusion, CMS failure, article metadata and direct URLs. Document the
chosen rebuild trigger, client ownership and backup procedure in the handover.

## Build the upload ZIP again

From the application source folder:

```sh
npm ci
npm run lint
npm test
npm run build
npm run cms:package
npm run hostinger:package
```

The app ZIP is written to `output/hostinger/`. The separate WordPress plugin ZIP
is written to `output/cms/finbharat-content.zip`. Neither contains account
credentials, access tokens or WordPress user passwords.
