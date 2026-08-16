import {cpSync, existsSync, mkdirSync, readdirSync} from 'node:fs';
import {join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const sourceRoot = join(projectRoot, 'assets', 'v1.3-client-presentation');
const targetRoot = join(projectRoot, 'public', 'report-assets', 'v1.3-client-presentation');
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.svg']);

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    const relativePath = relative(sourceRoot, fullPath).replaceAll('\\', '/');
    if (relativePath.startsWith('references/') || relativePath.startsWith('product-ui/')) return [];
    return imageExtensions.has(entry.name.slice(entry.name.lastIndexOf('.')).toLowerCase()) ? [{fullPath, relativePath}] : [];
  });
}

const files = walk(sourceRoot);
if (!files.length) {
  console.log('[property-report-assets] source package not found; runtime fallbacks remain enabled.');
} else {
  files.forEach(({fullPath, relativePath}) => {
    const destination = join(targetRoot, relativePath);
    mkdirSync(join(destination, '..'), {recursive: true});
    cpSync(fullPath, destination);
  });
  console.log(`[property-report-assets] prepared ${files.length} mock image assets.`);
}

