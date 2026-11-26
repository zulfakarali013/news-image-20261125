// Entry program for make.fun's news-image-20261125 bounty ("Sum up 25 November's world news
// in one image"). The picture is drawn ahead of time by render/build.mjs and kept in the repo
// as one line of base64 text (entry.png.b64). This program decodes it, checks that it obeys
// the contest limits, and writes it to /output/entry.png. Standard library only, no network,
// and the same bytes on every run.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1048576; // 1 MiB
const MAX_SIDE = 1024;

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

const text = readFileSync(join(here, 'entry.png.b64'), 'utf8').trim();
const image = Buffer.from(text, 'base64');

function pngSize(buf: Buffer): [number, number] | null {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (buf.length < 24 || !sig.every((b, i) => buf[i] === b)) return null;
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}

function jpegSize(buf: Buffer): [number, number] | null {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
    }
    i += 2 + len;
  }
  return null;
}

const size = pngSize(image) ?? jpegSize(image);
if (!size) throw new Error('entry.png.b64 does not hold a PNG or JPEG image');
const [w, h] = size;
if (image.length > MAX_BYTES) throw new Error(`image is ${image.length} bytes, over 1 MiB`);
if (w > MAX_SIDE || h > MAX_SIDE) throw new Error(`image is ${w}x${h}, over ${MAX_SIDE}px`);

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), image);
console.log(`wrote ${join(outDir, 'entry.png')}: ${w}x${h}, ${image.length} bytes`);
