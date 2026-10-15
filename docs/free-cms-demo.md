# Free hosted WordPress client demo

## Current status — 10 October 2026

The WordPress Studio preview is online at:

**[Finbharat CMS dashboard](https://durgeshkukreti52-xdwnv-studio.wp.build/wp-admin/)**

This is a temporary hosted copy of the local CMS, with the Finbharat Content plugin, 12 fixed page templates (including the published FAQ, Terms and Privacy pages and the pending Contact draft), two published sample blogs, two press entries, three case studies and the existing uploaded images. The client Editor login, blog management, featured images, public REST content and administrator-only publishing permissions were verified online.

The Vercel website still uses the committed demo snapshot. Saving in this hosted dashboard does **not** currently update that website. Connecting a Vercel preview deployment to this CMS and configuring a deploy hook are separate next steps; production WordPress builds retain the legal/contact/domain launch checks. Do not set this temporary CMS as the production content source merely to bypass those checks.

## Access and duration

Use the separately supplied **client-editor** login. The password is in a private local handoff file, not this repository. Administrator credentials and the WordPress.com account token are also excluded from GitHub. The local Docker demonstration credentials do not work on this hosted copy.

[WordPress Studio preview sites](https://developer.wordpress.com/docs/developer-tools/studio/preview-sites/) are free, temporary snapshots that expire seven days after their last update. Updating from Studio restarts that period. This is a client review environment, not permanent hosting. The dashboard is the CMS; its WordPress theme homepage is not the React website.

Before refreshing the preview from Studio, export any edits made by the client in the hosted dashboard. A preview update uploads the local copy; do not assume client edits are synchronized back to this Mac. Keep important approved content in a backed-up CMS before the preview expires.

## Manage this prepared preview

The official Studio CLI is available using `npx` without adding a website dependency:

```sh
npx --yes --package=wp-studio@1.23.0 studio auth status
```

To authenticate, run the following in your own Terminal. Complete WordPress.com's browser sign-in and paste the token into Terminal, never into chat, Git or a frontend environment variable:

```sh
npx --yes --package=wp-studio@1.23.0 studio auth login
```

From the prepared Studio site directory, inspect or refresh the existing preview:

```sh
npx --yes --package=wp-studio@1.23.0 studio preview list
npx --yes --package=wp-studio@1.23.0 studio preview update durgeshkukreti52-xdwnv-studio.wp.build
```

On the current Mac, that directory is `finbharat-web/output/cms/studio-site`. It is ignored by Git. Private backup archives, database copies and login files are also in ignored `output/cms/`; do not commit or upload them to a public release. The source plugin remains versioned under `wordpress/finbharat-content/`.

## Later client handoff

The client can clone the GitHub source and install the versioned plugin on their own PHP-capable WordPress host. Transfer the latest content and media separately, create individual accounts, configure HTTPS, backups and scheduled publishing, then connect the client's Vercel deployment and server-side hook. See [CMS setup](cms-setup.md) for the full configuration. Permanent hosting and the final production launch remain pending.

## Content updates after the original preview upload

The hosted dashboard received the supplied FAQ, Terms and Privacy content on 13 October 2026 and plain-language copy on 15 October 2026. These updates were made in place, preserving other content. The older local Studio snapshot does not include all those edits; refreshing the hosted preview from it would replace them. The portable client handover contains the current website content and a fresh-site WordPress importer.
