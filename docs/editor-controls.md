# WordPress editing and section controls

The client can manage the website’s main content and images through the Finbharat Content plugin. Version 1.4.0 adds optional-section visibility controls, image previews, navigation labels and founder portrait framing. Layout, styling and calculator behavior stay in the frontend.

## Hide or restore the introduction video

Open **Finbharat → Site → Intro**. Uncheck **Show introduction video** and save shared content. The entire section is omitted, including its thumbnail and player. Its title, text, poster and video settings remain stored so it can return later. This release keeps it hidden.

To bring it back, check the same setting. With no approved accessible video, it shows the retained placeholder. Playback needs an approved video URL and transcript; direct video files also need a captions file. A supported unlisted YouTube URL can be used, with captions enabled in YouTube Studio. The visibility and approval settings serve different purposes.

## Hide other optional sections

Open **Website pages**, select **Home**, **About**, **Inclusion**, **Mutual funds** or **Fixed deposits**, and expand **Section visibility**. Use the labelled Show checkboxes and update the page. Hiding a section removes its markup and media without deleting its content. Hide it independently on each page where it appears; for example, homepage case studies and Inclusion case studies have separate switches.

The page hero, header/footer structure, required risk disclosures and regulatory identifiers remain frontend-controlled. The standalone calculator routes remain available if their embedded section is hidden. Main calculator links use that route when the homepage calculator section is hidden.

## Replace images and founder details

Open **Finbharat → Site → Founders** for names, biographies, roles, credentials, locations, LinkedIn links and portraits. Select **Choose from media library**, upload or select an image, review the preview, add accurate portrait alt text and save. **Portrait focus position** accepts percentages such as `50% 10%`; **Portrait zoom** accepts values from `1` to `2.5` to frame photographs of different sizes.

Rakesh’s portrait is the owner-supplied `founder2.jpeg`, optimized as `public/founders/rakesh-finbharat.webp`. It is used on Home and About. The original photograph is not retouched. Desktop grayscale transitions to colour on hover or keyboard focus; touch devices show the original colour.

**Site → Assets** controls the light and dark logos, decorative hero poster/video, belief illustration, Inclusion hero image and footer landscape. Product hero images and image descriptions are under each product page’s Product fields. Homepage gallery and pillar images are under Home. Blog, newsroom and case study covers use WordPress Featured image. WordPress’s normal file permissions and allowed upload formats still apply.

## What can be edited

| Content or behavior | WordPress control |
| --- | --- |
| Main headings, marketing paragraphs, button copy, navigation labels and footer copy | Fixed page Copy groups and shared Site Copy |
| Hero headline, mission and tagline | Home and shared Site fields |
| Founder profile copy, photo, image description and framing | Site → Founders |
| Main logos, illustrations, hero background and footer artwork | Site → Assets and page image fields |
| Introduction copy, thumbnail, video and visibility | Site → Intro |
| Optional sections on Home, About, Inclusion and product pages | Page → Section visibility |
| Product explanations, gateway descriptions, concepts and planning steps | Mutual funds or Fixed deposits → Product |
| FAQ topics, Terms, Privacy and Contact copy | Corresponding Website page |
| Blogs, press entries and case study narratives, dates, images and SEO | Posts, Newsroom and Case studies |
| Case study example amounts, durations and rate assumptions | Case study structured fields |
| Published or draft status for editorial entries | Standard WordPress publishing controls |
| Layout, section order, design system, animation, calculator formulas and validation | Frontend code |
| New page templates, navigation destinations, system labels and protected disclosures | Frontend code |

These controls provide structured editing rather than a free-form page designer. Some interface labels inside calculators, accessibility behavior and generated financial disclosures remain in code to keep them consistent with the calculation logic.

## When updates reach the website

The current Vercel demo builds from `content/demo-content.json`. Changes in the temporary WordPress Studio dashboard do not automatically update it. The supplied portrait and hidden-video setting are included in the committed snapshot for this deployment.

To publish future CMS edits automatically, configure a permanent HTTPS WordPress host, the client’s Vercel CMS environment variables and the server-side deploy hook described in `cms-setup.md`. Published changes then appear after a successful build. Until that connection is configured, export the public snapshot, review it, bundle any new images, commit and deploy. The handover guide documents both workflows.
