// Offline derivative generation only. Never imports the art-direction UI reference.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const source = fileURLToPath(new URL('../docs/design-reference/training/foundations/hero-approved/hero-production-source-v1.png', import.meta.url));
const destination = new URL('../public/training/', import.meta.url);
await mkdir(destination, { recursive: true });
for (const width of [1600, 800]) {
  const info = await sharp(source).rotate().resize({ width, withoutEnlargement: true })
    .webp({ quality: 85, effort: 6 }).toFile(fileURLToPath(new URL(`hero-consultation-${width}.webp`, destination)));
  console.log(JSON.stringify({ width: info.width, height: info.height, bytes: info.size }));
}
