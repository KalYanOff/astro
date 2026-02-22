import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/seo';

export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    'Host: delfinstay.ru',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
    'Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content&yclid&gclid&fbclid /',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
