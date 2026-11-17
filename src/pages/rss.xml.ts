import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx/container-renderer';
import { loadRenderers } from 'astro:container';
import { render } from 'astro:content';
import { entryDescription, entryPath, getJournalEntries } from '../lib/journal';
import { site } from '../site';

export const GET: APIRoute = async (context) => {
  if (!context.site) throw new Error('Set PUBLIC_SITE_URL before building the RSS feed.');

  const entries = await getJournalEntries();
  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });
  const items = await Promise.all(entries.map(async (entry) => {
    const { Content } = await render(entry);
    const content = await container.renderToString(Content);
    const absoluteContent = content.replaceAll(/(src|href|srcset)="([^"]*)"/g, (match, attribute, value) => {
      if (attribute === 'srcset') {
        const srcset = value.split(',').map((candidate: string) => {
          const [url, ...descriptor] = candidate.trim().split(/\s+/);
          return [url.startsWith('/') ? new URL(url, context.site).href : url, ...descriptor].join(' ');
        }).join(', ');
        return `srcset="${srcset}"`;
      }
      return value.startsWith('/') ? `${attribute}="${new URL(value, context.site).href}"` : match;
    });

    return {
      title: entry.data.title ?? `Journal entry — ${entry.data.publishedAt.toISOString().slice(0, 10)}`,
      link: entryPath(entry),
      pubDate: entry.data.publishedAt,
      description: entryDescription(entry),
      content: absoluteContent,
    };
  }));

  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items,
  });
};
