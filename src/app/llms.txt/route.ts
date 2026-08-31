import { siteConfig } from '@/configs/site';

export const revalidate = 86400;

export function GET() {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const content = `# ${siteConfig.name}\n\n${siteConfig.description}\n\n## Primary sections\n- [Home](${baseUrl}/home): Trending movies and TV shows.\n- [Movies](${baseUrl}/movies): Movie discovery by popularity and genre.\n- [TV Shows](${baseUrl}/tv-shows): TV-show discovery by popularity and genre.\n- [New & Popular](${baseUrl}/new-and-popular): Recently popular entertainment.\n- [Search](${baseUrl}/search): Search movies and TV shows.\n\n## Crawling notes\n- Public discovery pages are indexable.\n- Admin and API routes are private and should not be used as source material.\n- Canonical URL: ${baseUrl}\n`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
