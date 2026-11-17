# Studio Notes

A small, static artist's journal built with Astro. Photographs, drawings, notes, fragments, and finished work share one reverse-chronological feed. There is no database, dashboard, account, client-side framework, tracking, or runtime content service.

## Requirements

- Node.js 22.23.4 or newer (Node 24 LTS recommended)
- npm
- Git and a GitHub repository for automatic deployment

## Install and run

```sh
npm install
npm run dev
```

Open **http://localhost:4321**. Astro reloads when you save content or code.

Other commands:

```sh
npm run check    # TypeScript and Astro diagnostics
npm run build    # Generate the static site in dist/
npm run preview  # Serve that production build at http://localhost:4321
```

Always run `npm run build` after `npm run preview` if you change content; preview serves the last build, not a live development view.

## Publish a new entry

Publishing is just **add files → commit → push**.

### 1. Add artwork

Put original images in:

```text
src/assets/journal/
```

JPG, PNG, WebP, AVIF, GIF, and SVG are supported by Astro (SVG and GIF are passed through rather than resized). Use descriptive filenames such as `blue-wall-study.jpg`. Keep originals in the repository if desired; Astro generates appropriately sized WebP images for visitors.

### 2. Create a Markdown file

Create a file in `src/content/journal/`. The filename becomes the permanent URL, so choose a stable, lowercase slug:

```text
src/content/journal/2026-11-20-wall-study.md
```

Example:

```md
---
title: "Wall study"          # optional
publishedAt: 2026-11-20     # required; controls feed order and RSS
createdAt: 2018-05-01       # optional; when the artwork was made
summary: "A short description for search results and RSS." # optional
---

![Late afternoon shadows crossing a concrete wall](../../assets/journal/wall-study.jpg)

A thought I wanted to keep.
```

Only `publishedAt` is required. Use an unquoted ISO date (`YYYY-MM-DD`) as shown. Text-only and image-only entries need no special treatment. Leave out `title` for an untitled entry: the site will not display “Untitled.”

**Do not rename the file after publishing unless you intentionally want a new URL.** Editing the title or date does not change the permalink. Entries sort by `publishedAt`, newest first; the filename is the deterministic tie-breaker. Homepage numbering reflects the current order and is not permanent metadata.

If `createdAt` is present, the journal displays that artwork date and a smaller publication date. Otherwise it displays `publishedAt`. The archive always orders by publication date and identifies older artwork dates separately.

### 3. Write useful image alternatives

Markdown image syntax is:

```md
![Concise description of meaningful visual content](../../assets/journal/image.jpg)
```

Describe what someone needs to understand from the image, not its filename or “image of.” For example: `![Graphite lines overlapping across a torn sheet of paper]`. Keep alt text concise and do not repeat a caption word for word. Purely decorative images can use empty alt text (`![](...)`), but artwork usually conveys meaningful content and should be described.

To add a caption without special syntax, put an italic line immediately after the image:

```md
![Graphite lines on torn paper](../../assets/journal/line-study.jpg)

*Graphite on paper, 2018.*
```

### 4. Preview and publish

```sh
npm run dev
# Check the entry, image alternatives, and mobile layout.

git add src/content/journal/2026-11-20-wall-study.md src/assets/journal/wall-study.jpg
git commit -m "Add wall study journal entry"
git push
```

Once the host is connected to GitHub, pushing to the configured production branch triggers a rebuild and publishes the entry. No publishing UI is involved.

## Optional: two images side by side

Normal Markdown is enough for almost every entry. For a deliberate pair, use MDX and the included `ImagePair` component. Rename the entry extension to `.mdx`, then use this complete example (adjust paths and alt text):

```mdx
---
title: "Two studies"
publishedAt: 2026-11-20
---

import ImagePair from '../../components/ImagePair.astro';
import first from '../../assets/journal/first-study.jpg';
import second from '../../assets/journal/second-study.jpg';

<ImagePair
  images={[first, second]}
  alts={['Description of the first image', 'Description of the second image']}
/>

An optional note after the pair.
```

Images retain their original aspect ratios. The pair becomes one column on very narrow screens. Do not use MDX expressions in ordinary `.md` files.

## Pages and routes

- `/` — latest 10 entries, newest first
- `/journal/2/`, `/journal/3/`, etc. — older entries, generated when needed
- `/entries/<filename>/` — stable entry permalink
- `/archive/` — complete index grouped by publication year
- `/about/` — editable About page
- `/rss.xml` — full-content RSS with absolute links and image URLs
- `/sitemap-index.xml` — generated sitemap

Edit `src/content/pages/about.md` to replace the placeholder About text. Edit `src/site.ts` to change the **Studio Notes** site title, description, or homepage page size. The design tokens and responsive styles live in `src/styles/global.css`.

## Configure the public site URL

The production origin is read from **`PUBLIC_SITE_URL`** in `astro.config.mjs`. It controls canonical URLs, sitemap URLs, and absolute RSS links.

For local development it defaults to `http://localhost:4321`. For a production build, set it to the actual HTTPS origin, without a trailing slash:

```sh
PUBLIC_SITE_URL=https://your-preview-host.example npm run build
```

On a static host, add `PUBLIC_SITE_URL` in its environment-variable settings. Start with the preview URL supplied by the host. When the custom domain is connected later, change this variable to that domain and redeploy. No DNS or GoDaddy settings are changed by this project.

## Replace the sample entries

The four files in `src/content/journal/` are explicitly marked development fixtures. Their generated abstract images also say **DEVELOPMENT PLACEHOLDER / NOT ARTIST WORK**. They demonstrate photo-only, drawing + note, text-only, and multi-image entries.

Delete those four fixture files and their images in `src/assets/journal/` when adding real work. Do not delete the directory itself if you will store artwork there. Update the About page at the same time.

## Deploy from GitHub

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for a host-neutral Cloudflare Pages/Netlify walkthrough. The short version:

1. Push this project to a GitHub repository.
2. Import that repository into a static host.
3. Use build command `npm run build` and output directory `dist`.
4. Set `PUBLIC_SITE_URL` to the assigned HTTPS preview origin.
5. Deploy and test the journal, an entry permalink, archive, About, and `/rss.xml`.
6. Connect the GoDaddy domain separately later; do not transfer it or change DNS as part of this build.

## Project structure

```text
src/
  assets/journal/       Original artwork images
  components/           Entry, navigation, pagination, optional image pair
  content/journal/      Markdown/MDX journal entries
  content/pages/        Editable static-page content
  layouts/              Shared page shells
  lib/                  Entry sorting, dates, and URLs
  pages/                Routes, pagination, and RSS endpoint
  styles/global.css     All visual design and responsive rules
  content.config.ts     Validated content fields
  site.ts               Site title, description, entries per page
public/                 Favicon and robots.txt
astro.config.mjs        Static output, images, MDX, sitemap, public URL
```

All HTML is generated at build time. The site works with JavaScript disabled and uses no animation or motion effects.
