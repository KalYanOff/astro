import { readFile } from 'node:fs/promises';
import path from 'node:path';

const INDEXED_PAGES = [
  {
    filePath: 'dist/index.html',
    label: 'home',
    requiredTitlePhrases: ['официальный сайт гостевого дома', 'дельфин'],
    requiredBodyPatterns: [/гостев(ой|ого)\s+дом/iu, /джубг/iu, /мор/iu],
  },
  {
    filePath: 'dist/oteli-dzhubga/index.html',
    label: 'oteli',
    requiredBodyPatterns: [/отел/iu, /джубг/iu, /гостев(ой|ого)\s+дом/iu],
  },
  {
    filePath: 'dist/gostinicy-dzhubga/index.html',
    label: 'gostinicy',
    requiredBodyPatterns: [/гостиниц/iu, /джубг/iu, /гостев(ой|ого)\s+дом/iu],
  },
  {
    filePath: 'dist/otel-dzhubga-u-morya/index.html',
    label: 'otel_u_morya',
    requiredBodyPatterns: [/отел/iu, /джубг/iu, /мор/iu],
  },
];

const DOC_PAGES = [
  'dist/docs/offer/index.html',
  'dist/docs/privacy/index.html',
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

function extractTitle(html) {
  return html.match(/<title>(.*?)<\/title>/isu)?.[1]?.trim() ?? '';
}

function extractDescription(html) {
  return html.match(/<meta name="description" content="(.*?)"/isu)?.[1]?.trim() ?? '';
}

function extractCanonical(html) {
  return html.match(/<link rel="canonical" href="(.*?)"/isu)?.[1]?.trim() ?? '';
}

function extractFirstH1(html) {
  const raw = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/isu)?.[1] ?? '';
  return raw.replace(/<[^>]+>/gu, ' ').replace(/\s+/gu, ' ').trim();
}

function extractRobots(html) {
  return html.match(/<meta name="robots" content="(.*?)"/isu)?.[1]?.trim() ?? '';
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const indexedResults = [];

  for (const page of INDEXED_PAGES) {
    const fullPath = path.resolve(page.filePath);
    const html = await readFile(fullPath, 'utf8');
    const title = extractTitle(html);
    const description = extractDescription(html);
    const canonical = extractCanonical(html);
    const h1 = extractFirstH1(html);
    const visibleText = extractVisibleBodyText(html);

    assert(title, `${page.label}: missing <title>.`);
    assert(description, `${page.label}: missing meta description.`);
    assert(canonical, `${page.label}: missing canonical.`);
    assert(h1, `${page.label}: missing H1.`);

    for (const phrase of page.requiredTitlePhrases ?? []) {
      assert(
        title.toLowerCase().includes(phrase.toLowerCase()),
        `${page.label}: title must contain "${phrase}".`,
      );
    }

    for (const pattern of page.requiredBodyPatterns) {
      assert(
        pattern.test(visibleText),
        `${page.label}: visible body text must match ${pattern}.`,
      );
    }

    indexedResults.push({
      label: page.label,
      title,
      description,
      canonical,
    });
  }

  const titles = new Map();
  const descriptions = new Map();
  const canonicals = new Map();

  for (const result of indexedResults) {
    assert(!titles.has(result.title), `duplicate title: "${result.title}"`);
    assert(
      !descriptions.has(result.description),
      `duplicate meta description: "${result.description}"`,
    );
    assert(!canonicals.has(result.canonical), `duplicate canonical: "${result.canonical}"`);

    titles.set(result.title, result.label);
    descriptions.set(result.description, result.label);
    canonicals.set(result.canonical, result.label);
  }

  for (const filePath of DOC_PAGES) {
    const fullPath = path.resolve(filePath);
    const html = await readFile(fullPath, 'utf8');
    const robots = extractRobots(html);
    assert(
      robots === 'noindex,follow',
      `${filePath}: expected robots="noindex,follow", got "${robots}".`,
    );
  }

  console.log('SEO visible terms check passed.');
}

main().catch((error) => {
  console.error('SEO visible terms check failed.');
  console.error(error);
  process.exit(1);
});
