# Finbharat client demo

## Present from this Mac

Use screen sharing and keep the website and WordPress in two browser tabs. Localhost links work on this Mac; sending them to a client does not give the client access.

- Website: http://localhost:4173/
- Journal: http://localhost:4173/blog/
- Case studies: http://localhost:4173/case-studies/
- WordPress: http://localhost:8088/wp-admin/
- Local Editor login: `local-editor` / `local-development-editor`

These credentials belong to the disposable local demo only. The Editor account shows content tools without exposing administrator publishing configuration.

## Five-minute walkthrough

1. **Show the finished website.** Open the journal, one sample article and the three fictional planning stories. Explain that the covers, copy and assumptions can be managed from WordPress.
2. **Show a blog edit.** In WordPress → Posts, open “Seven mutual funds. How many different risks?” Save a copy of its current excerpt. Change the excerpt to “Two fund names can still hide the same underlying risks. Explore the overlap before adding another investment.” Click Update/Save. Keep the slug unchanged.
3. **Show the result.** Wait for the local watcher to report “Preview updated” (it checks every eight seconds, then builds). Refresh the journal and article. Point out the revised excerpt. Restore the original excerpt and save again after the demonstration.
4. **Show images and case studies.** Open the post's Featured image control and Media Library. Then open Case studies → Srijan. Expand Meta Boxes if collapsed; show the profile, City, portrait and FD/SIP assumptions. Calculator formulas stay in the website. If changing an amount, also update matching amounts written in the story and restore both after the demo.
5. **Show the remaining content tools.** Website pages contains page copy and FAQs. Finbharat contains the mission, shared content, founder profiles and contacts. Newsroom manages announcements and source links. Show a draft's status: it stays off the public website until published and the next build finishes.

The local WordPress theme preview is not the React website. Show the result in the website tab after rebuilding. The supplied posts are labelled samples; the planning stories are fictional, with illustrative estimates.

## Start or restart the demo

Open Docker Desktop first. From the project directory:

```sh
cd /Users/durgeshkukreti/Documents/Finbharat/finbharat-web
docker compose -p finbharat-cms -f wordpress/compose.yml up -d wordpress
CMS_URL=http://127.0.0.1:8088 npm run cms:watch
```

Keep that terminal running. After its first successful build, open another terminal:

```sh
cd /Users/durgeshkukreti/Documents/Finbharat/finbharat-web
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Check synchronization in a third terminal if needed:

```sh
cd /Users/durgeshkukreti/Documents/Finbharat/finbharat-web
CMS_URL=http://127.0.0.1:8088 WEBSITE_URL=http://localhost:4173 npm run cms:check
```

A matching revision confirms that the website uses the currently published CMS content. Stop duplicate watcher/preview processes before starting replacements. The existing WordPress database retains posts and accounts; do not reinstall it or delete its Docker volume.

## Let the client try it independently

Set up a client-owned, hosted WordPress staging CMS with custom-plugin support, install the Finbharat Content plugin, and give the client an individual Editor account. Connect a Vercel staging deployment to that CMS using `CMS_URL`; set its `SITE_URL` to the actual staging origin. Use a deploy hook for the staging branch, stored in WordPress's Administrator-only Publishing configuration. Keep production launch gates separate.

The hosted flow is: client saves published content → WordPress requests a Vercel build → Vercel reads published content → the new version appears after a successful deployment. The local polling watcher is for this Mac only.

Vercel hosts the React frontend; WordPress runs on its own PHP-capable host. GitHub contains the website code, plugin, bundled images and sample source files. WordPress's database and uploaded media are separate and need their own migration/backups. The local login details and localhost media URLs must not be reused for a hosted site.

See [CMS setup and handover](cms-setup.md) for account setup, publishing configuration and production approval requirements. Hosted WordPress and a live Vercel CMS connection are not yet provisioned or verified by this project.
