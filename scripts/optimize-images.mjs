import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const IMAGE_ROOT = path.join(ROOT, 'public', 'img');
const INPUT_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(absolutePath);
      }
      return [absolutePath];
    })
  );
  return files.flat();
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!INPUT_EXTENSIONS.has(ext)) return;

  const basename = filePath.slice(0, -ext.length);
  const webpPath = `${basename}.webp`;
  const avifPath = `${basename}.avif`;

  const createWebp = ext !== '.webp' && !(await fileExists(webpPath));
  const createAvif = !(await fileExists(avifPath));
  if (!createWebp && !createAvif) return;

  const image = sharp(filePath, { failOn: 'none' });

  if (createWebp) {
    await image.clone().webp({ quality: 78, effort: 5 }).toFile(webpPath);
    console.log(`created: ${path.relative(ROOT, webpPath)}`);
  }

  if (createAvif) {
    await image.clone().avif({ quality: 52, effort: 6 }).toFile(avifPath);
    console.log(`created: ${path.relative(ROOT, avifPath)}`);
  }
}

async function main() {
  if (!(await fileExists(IMAGE_ROOT))) {
    console.error(`Directory not found: ${IMAGE_ROOT}`);
    process.exit(1);
  }

  const files = await walk(IMAGE_ROOT);
  const targets = files.filter((filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!INPUT_EXTENSIONS.has(ext)) return false;
    const normalized = filePath.replace(/\\/g, '/');
    return normalized.includes('/photo/') || normalized.includes('/rooms/') || normalized.endsWith('/logo.webp');
  });

  for (const filePath of targets) {
    await optimizeFile(filePath);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
