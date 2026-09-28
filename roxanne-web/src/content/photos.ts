import type { PhotoKey } from './types'
import localized from './photos.local.json'

export interface PhotoSlot {
  key: PhotoKey
  label: string
  hint: string
  alt: string
  /** Alt text used once Roxanne replaces the default photo with her own. */
  customAlt: string
  remote: string
  width: number
  height: number
}

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FmcdDgPgjsmUS4bvWI9LDeCYkh'

/**
 * Default photography (AI-generated still lifes — no people, so nothing can be
 * mistaken for Roxanne or her clients). Replace any slot from Dashboard → Photos.
 */
export const PHOTO_SLOTS: Record<PhotoKey, PhotoSlot> = {
  hero: {
    key: 'hero',
    label: 'Home — hero',
    hint: 'Wide photo (landscape) shown in the arch at the top of the home page.',
    alt: 'Sunlit desk with an open law book, a fountain pen on a contract and brass scales of justice',
    customAlt: 'Law & Business English coaching with Roxanne',
    remote: `${CDN}/hf_20260928_165842_8ff506c4-a7ab-4290-b8fe-233e6bef001e.png`,
    width: 2048,
    height: 1152,
  },
  portrait: {
    key: 'portrait',
    label: 'About — your portrait',
    hint: 'Upload a professional portrait of Roxanne (vertical works best).',
    alt: 'A calm reading corner with a linen armchair, an open notebook and a cup of tea',
    customAlt: 'Portrait of Roxanne, English language coach',
    remote: `${CDN}/hf_20260928_170109_d949ac94-a0e4-4250-a7d2-ee5a52d7e7e2.png`,
    width: 1536,
    height: 2048,
  },
  business: {
    key: 'business',
    label: 'Business English',
    hint: 'Shown on the Business English course.',
    alt: 'An elegant boardroom at golden hour overlooking a European city skyline',
    customAlt: 'Business English lessons for professionals',
    remote: `${CDN}/hf_20260928_170012_6f9701d5-0678-47c1-8dc3-d93d0a28a6d1.png`,
    width: 2048,
    height: 1536,
  },
  legal: {
    key: 'legal',
    label: 'Legal English',
    hint: 'Shown on the Legal English course.',
    alt: "Leather-bound law books, a judge's gavel and brass scales of justice in warm lamplight",
    customAlt: 'Legal English training for lawyers',
    remote: `${CDN}/hf_20260928_170012_45976b2c-0f98-43c2-8cf6-b74d2e0351ef.png`,
    width: 2048,
    height: 1536,
  },
  beginner: {
    key: 'beginner',
    label: 'Beginner English for Adults',
    hint: 'Shown on the Beginner English course.',
    alt: 'An open notebook with a pencil, colourful tabs and a cappuccino on a linen tablecloth',
    customAlt: 'Beginner English lessons for adults',
    remote: `${CDN}/hf_20260928_170012_b7227911-95ee-4bc9-a86a-c44b7f60eec9.png`,
    width: 2048,
    height: 1536,
  },
  speech: {
    key: 'speech',
    label: 'Speech & Presentation Coaching',
    hint: 'Shown on the Speech & Presentation Coaching course.',
    alt: 'A vintage microphone on stage under a warm golden spotlight',
    customAlt: 'Speech and presentation coaching',
    remote: `${CDN}/hf_20260928_171139_0117c373-08e6-450c-89e9-8491ef5d14c8.png`,
    width: 2048,
    height: 1536,
  },
  freelance: {
    key: 'freelance',
    label: 'Freelance & Project Needs',
    hint: 'Shown on the Freelance page and the home page banner.',
    alt: 'A tidy remote-work desk with a laptop, neatly stacked documents and a fountain pen',
    customAlt: 'Remote freelance legal support',
    remote: `${CDN}/hf_20260928_170012_433d44aa-0728-4d18-a6b2-57d47bfd323f.png`,
    width: 2048,
    height: 1536,
  },
}

/** Paths written by `npm run photos:localize` once the photos are copied into /public/images. */
const LOCAL: Partial<Record<PhotoKey, string>> = localized

export interface ResolvedPhoto {
  src: string
  alt: string
  width: number
  height: number
  /** Uploaded files are already resized in the browser, so they skip the optimizer. */
  unoptimized: boolean
  custom: boolean
}

export function resolvePhoto(key: PhotoKey, overrides: Partial<Record<PhotoKey, string>> = {}): ResolvedPhoto {
  const slot = PHOTO_SLOTS[key]
  const override = overrides[key]
  if (override) {
    return {
      src: override,
      alt: slot.customAlt,
      width: slot.width,
      height: slot.height,
      unoptimized: override.startsWith('/media/'),
      custom: true,
    }
  }
  return {
    src: LOCAL[key] ?? slot.remote,
    alt: slot.alt,
    width: slot.width,
    height: slot.height,
    unoptimized: false,
    custom: false,
  }
}
