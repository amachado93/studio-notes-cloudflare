import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// Set PUBLIC_SITE_URL on the production host, for example:
// PUBLIC_SITE_URL=https://journal.example.com npm run build
// The placeholder is intentionally local until a public URL is configured.
const site = process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  image: {
    layout: 'constrained',
    responsiveStyles: true,
    breakpoints: [480, 768, 1024, 1440, 1920],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
