#!/usr/bin/env node
/**
 * Copies the default photos from the CDN into /public/images as optimized WebP
 * files and records them in src/content/photos.local.json, so the site no
 * longer depends on the CDN. Run once on a machine with internet access:
 *
 *   npm run photos:localize
 *
 * then commit public/images and src/content/photos.local.json.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifestSource = await readFile(path.join(root, 'src/content/photos.ts'), 'utf8')

const cdn = manifestSource.match(/const CDN = '([^']+)'/)?.[1]
if (!cdn) throw new Error('Could not find the CDN base URL in src/content/photos.ts')

// Pairs of `key: '<slot>'` … remote: `${CDN}/<file>`
const slots = [...manifestSource.matchAll(/key: '(\w+)'[\s\S]*?remote: `\$\{CDN\}\/([^`]+)`/g)].map(([, key, file]) => ({
  key,
  url: `${cdn}/${file}`,
}))

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.warn('sharp is not installed — saving original files without conversion.')
}

const outDir = path.join(root, 'public/images')
await mkdir(outDir, { recursive: true })

const localized = {}
for (const { key, url } of slots) {
  process.stdout.write(`→ ${key} … `)
  const res = await fetch(url)
  if (!res.ok) {
    console.log(`failed (${res.status})`)
    continue
  }
  const input = Buffer.from(await res.arrayBuffer())
  if (sharp) {
    const file = `${key}.webp`
    await sharp(input).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(outDir, file))
    localized[key] = `/images/${file}`
  } else {
    const file = `${key}${path.extname(new URL(url).pathname) || '.png'}`
    await writeFile(path.join(outDir, file), input)
    localized[key] = `/images/${file}`
  }
  console.log('ok')
}

await writeFile(path.join(root, 'src/content/photos.local.json'), `${JSON.stringify(localized, null, 2)}\n`)
console.log(`\nSaved ${Object.keys(localized).length} photo(s). Commit public/images and src/content/photos.local.json.`)
