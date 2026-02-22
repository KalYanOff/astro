import { readFile } from 'node:fs/promises';
import path from 'node:path';

const PAGES_TO_CHECK = [
  'dist/index.html',
  'dist/oteli-dzhubga/index.html',
  'dist/gostinicy-dzhubga/index.html',
  'dist/otel-dzhubga-u-morya/index.html',
];

const FORBIDDEN_TERMS = [
  { label: 'отел*', regex: /отел/iu },
  { label: 'гостиниц*', regex: /гостиниц/iu },
  { label: 'hotel', regex: /hotel/iu },
];

function extractVisibleBodyText(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/iu);
  const body = bodyMatch ? bodyMatch[1] : html;

  const withoutHiddenBlocks = body
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, ' ')
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/giu, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/giu, ' ')
    .replace(/<!--([\s\S]*?)-->/gu, ' ')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/giu, ' ');

  return withoutHiddenBlocks
    .replace(/<[^>]+>/gu, ' ')
    .replace(/&nbsp;/giu, ' ')
    .replace(/&[a-zA-Z0-9#]+;/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function buildExcerpt(text, index, radius = 45) {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + radius);
  return text.slice(start, end);
}

async function main() {
  const violations = [];

  for (const filePath of PAGES_TO_CHECK) {
    const fullPath = path.resolve(filePath);
    const html = await readFile(fullPath, 'utf8');
    const visibleText = extractVisibleBodyText(html);

    for (const term of FORBIDDEN_TERMS) {
      const match = term.regex.exec(visibleText);
      if (!match) continue;

      violations.push({
        filePath,
        term: term.label,
        excerpt: buildExcerpt(visibleText, match.index ?? 0),
      });
    }
  }

  if (violations.length > 0) {
    console.error('SEO visible terms check failed: forbidden terms found in body text.');
    for (const v of violations) {
      console.error(`- ${v.filePath} | term: ${v.term}`);
      console.error(`  excerpt: ${v.excerpt}`);
    }
    process.exit(1);
  }

  console.log('SEO visible terms check passed.');
}

main().catch((error) => {
  console.error('SEO visible terms check failed with runtime error.');
  console.error(error);
  process.exit(1);
});
