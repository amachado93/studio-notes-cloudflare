# Studio Journal — MVP Build Specification

## Purpose
Build a small, personal artist's journal: a public place to share photographs, drawings, notes, fragments, experiments, and finished work side by side. It should feel like an artist's working studio, **not** a portfolio, social feed, or polished publication.

The most important outcome: the artist can add an entry by editing files, committing, and pushing to GitHub. No dashboard, database, account, or publishing ceremony.

## Design direction

Reference for visual language: https://grids03.obys.agency/

Borrow the **restrained Swiss/editorial typography, disciplined grid, hierarchy, and generous negative space**—not its animations or elaborate effects. The attached design mockup (if available to the builder) illustrates the *layout*, not a requirement to reproduce sample images or text.

- Monochrome interface: near-black type and rules over a **flat**, light, cool off-white / aluminum-gray background. **No texture, gradients, brushed-metal effects, or skeuomorphism.** Suggested starting tokens (adjust for contrast): `--bg: #DEDFD9`, `--text: #111111`, `--rule: #888A86`, `--muted: #525450`.
- Large, expressive, clean sans-serif title. Small, quiet labels for dates, entry numbers, links. Strong contrast and readable body text.
- Layout is crisp and editorial, but content can be messy, unfinished, or casual.
- Desktop: generous margins, simple grid with a narrow metadata column and a flexible content column. Mobile: collapse to one column with metadata above content.
- Thin horizontal rules between entries. No cards, drop shadows, carousels, masonry feeds, or decorative UI.
- Preserve artwork aspect ratios. Images may be portrait, landscape, or square; never crop by default. Artwork is not artificially forced into grayscale: **the UI** is monochrome; uploaded artwork is displayed as supplied.
- **No animations** (including parallax, scroll effects, or page transitions). Standard unobtrusive link affordances are fine.
- Accessible keyboard focus, responsive images, and sufficient contrast. Respect reduced-motion preferences by avoiding motion entirely.

## MVP information architecture

1. **Journal (`/`)** — newest-first chronological feed of entries. This is the primary experience. Each entry shows its date (when known), content, and optional title; text-only, image-only, and mixed entries must all work. Individual entries may have multiple images and text interleaved.
2. **Entry permalink (`/entries/<slug>/`)** — a stable, shareable URL for each entry, with full content and a simple link back to the journal.
3. **Archive (`/archive/`)** — compact, chronological index grouped by year. Entries without a known creation date may use a publication date for ordering while leaving the artwork itself undated. No subject categories or tags.
4. **About (`/about/`)** — a short editable Markdown page, not a resume or artist statement unless the author chooses.
5. **RSS (`/rss.xml`)** — valid feed, linked visibly in navigation and discoverable in the HTML head. Use absolute permalinks and URLs; provide entry text and useful image references. An RSS reader should be able to follow new posts without using a social network.

Navigation: **Journal / Archive / About / RSS**. Use a simple temporary site title, **Studio Notes**, as a configurable placeholder. Do not invent a personal name or biography.

No categories, tags, search, comments, reactions, followers, analytics, ads, newsletter signup, or third-party embeds in the MVP. Public and crawlable by default; include sensible SEO basics (unique page titles, descriptions, canonical URLs, sitemap if straightforward).

## Content authoring

Use **Astro content collections** backed by local Markdown files; MDX only if necessary for layouts the Markdown renderer cannot support cleanly. Content and image assets are stored in the repository.

Suggested structure (adapt to Astro conventions):

```text
src/
  content/
    journal/
      2026-11-15-untitled.md
      2026-10-28-on-looking.md
  pages/
    index.astro
    archive.astro
    about.astro
    rss.xml.js
    entries/[...slug].astro
  layouts/
  components/
  styles/
  assets/
    journal/
public/
  favicon.svg
  ...
README.md
astro.config.mjs
```

Suggested minimal frontmatter:

```md
---
title: "Untitled"        # optional
publishedAt: 2026-11-15 # required for feed ordering and RSS
createdAt: 2018-05-01   # optional; date of the artwork, if known
summary: ""           # optional
---

![A building wall with shadows](/example-path/photo.jpg)

A thought I wanted to keep.
```

- `publishedAt` is the only required editorial field, besides the filename/slug. It represents the **entry's publication date**, not necessarily when an artwork was made.
- Titles and captions are optional. The journal must look intentional without them; do not display “Untitled” automatically if no title was entered.
- An image-only entry is valid. A few lines of writing alone are valid. Multiple images and mixed media are valid.
- Preserve source image aspect ratios, use responsive sizes/optimized formats where practical, lazy-load below-the-fold images, and avoid shipping full-resolution originals to every visitor. Keep original files in the repository as desired.
- Provide image alt text in Markdown and document how to write meaningful alternatives; captions are optional.
- Do not add elaborate layout syntax to content just to make a post. Default Markdown image and paragraph rendering should be attractive. If paired images are desired, one small reusable component or documented shortcode is acceptable, but not necessary for initial launch.
- Sort by `publishedAt` descending, with a deterministic tie-breaker. Stable slugs/permalinks should not change when titles or dates are edited.
- Show a manageable number of entries on the homepage (e.g. latest 10); provide a simple **Older entries** route or pagination for the rest, while retaining a complete archive. Avoid infinite scroll.
- Sample posts are only fixtures for development: clearly marked and easy to replace. Do not present generated sample imagery as the artist's own work.

## Technology and deployment

- **Astro**, static output (`output: 'static'`) and semantic HTML.
- Plain CSS (CSS variables for typography, spacing, and color); do not introduce Tailwind, a component framework, or client-side hydration unless there is a compelling need.
- No database, CMS, API server, auth system, or runtime content fetching. Content is built from files at deploy time.
- GitHub repository is the source of truth. Workflow: **add/edit a Markdown file and images → commit → push → host automatically rebuilds and deploys**.
- Keep hosting provider flexible. A static host such as Cloudflare Pages or Netlify is suitable. Do not hardcode a hosting provider or DNS records at MVP stage.
- Make the production URL configurable through a documented site setting / environment variable and ensure it is used for canonical URLs, sitemap, and RSS. A temporary preview URL is fine until the custom domain is configured.
- The author has an existing domain registered at **GoDaddy**. **Do not transfer the domain or alter DNS as part of the build.** Domain hookup (DNS, HTTPS, verification, redirects) will be done separately after the site works on a preview host.
- Avoid exposing credentials. GitHub-hosted CI or platform Git integration should build on push to the chosen production branch.

## Build and content quality

- All routes work locally and in a production static build.
- Mobile, tablet, and desktop layouts are considered, with readable type and no sideways scrolling.
- Pages are lightweight and work with JavaScript disabled where possible.
- Main navigation, dates, and entry links are accessible and semantic.
- RSS XML validates and includes correct absolute links once the site's public URL is set.
- No noisy dependencies, animation libraries, tracking, or speculative extra features.

## Deliverables

1. Working Astro project with clean, minimal design and responsive layouts.
2. Example entries exercising photo-only, drawing + note, text-only, and multi-image formats (explicitly placeholders).
3. `README.md` documenting installation, development, build, where assets go, **exactly how to publish a new entry**, how to preview locally, and how to configure the final site URL.
4. A short deployment guide for connecting a GitHub repository to a static host, leaving the GoDaddy custom-domain steps for later.
5. Confirmation that `npm run build` completes successfully and the generated static site includes RSS and entry permalinks.

## Boundaries and acceptance criteria

Treat this as an intentionally small, nearly static personal publishing tool. Do not invent product features, social mechanisms, a design system, or elaborate interactions.

The MVP is finished when:

- Someone can visit the journal and quietly browse entries in reverse chronological order.
- Photographs, drawings, and writing can coexist without categories or labels such as “work in progress.”
- An entry can be published **by adding a file and pushing to GitHub**, without using a UI or database.
- The journal is visually coherent and attractive even when entries vary radically in length and format.
- Archive, About, permalinks, and RSS work.
- The interface is flat, monochrome, and animation-free.

**Guiding principle:** It should feel like walking into a working artist's studio—not inspecting a curated portfolio.
