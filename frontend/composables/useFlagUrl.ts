/**
 * useFlagUrl — central resolver for country flag SVGs.
 *
 * Resolves a flag from a wide range of inputs:
 *   - ISO 3166-1 alpha-2 country code: "US" | "us" | "gb" | "CN"
 *   - ISO 3166-1 alpha-3 country code: "USA" | "CHN" | "THA"
 *   - Locale / language code:        "en" | "zh-CN" | "th"
 *   - Custom 2-letter codes used by the app: e.g. "TH" for Thailand
 *
 * Returns an object with:
 *   - url:     the public path to the SVG file, or null if not resolvable
 *   - code:    the normalized 2-letter ISO code that was matched, or null
 *   - isFallback: true if no match was found
 *
 * All flag SVGs live under /public/flags/4x3/{code}.svg, copied from the
 * `flag-icons` npm package. See scripts/copy-flags.mjs for the sync job.
 */

const COUNTRY_ALPHA3_TO_ALPHA2: Record<string, string> = {
  USA: 'us', GBR: 'gb', CHN: 'cn', TWN: 'tw', JPN: 'jp', KOR: 'kr',
  THA: 'th', IDN: 'id', VNM: 'vn', DEU: 'de', FRA: 'fr', ESP: 'es',
  ITA: 'it', BGR: 'bg', HRV: 'hr', RUS: 'ru', SAU: 'sa',
  AUS: 'au', CAN: 'ca', MYS: 'my', SGP: 'sg', PHL: 'ph', KHM: 'kh',
  MMR: 'mm', IND: 'in', PAK: 'pk', BGD: 'bd', LKA: 'lk', NPL: 'np',
  MYS_: 'my',
}

/**
 * Locale → country mapping for the language switcher. Picks the canonical
 * "home country" of the language so users see a familiar flag.
 */
const LANG_TO_COUNTRY: Record<string, string> = {
  en:    'us',
  'zh-CN': 'cn',
  'zh-TW': 'tw',
  ja:    'jp',
  ko:    'kr',
  th:    'th',
  id:    'id',
  vi:    'vn',
  de:    'de',
  fr:    'fr',
  es:    'es',
  it:    'it',
  bg:    'bg',
  hr:    'hr',
  ru:    'ru',
  ar:    'sa',
}

export interface FlagResolution {
  url: string | null
  code: string | null
  isFallback: boolean
}

function normalize(input: string | null | undefined): string {
  if (!input) return ''
  return String(input).trim().toLowerCase()
}

function tryAlpha2(code: string): string | null {
  // Accept 'us', 'US', 'usa' (trimmed) — only true alpha-2 (2 letters) reach here
  if (code.length === 2) return code
  return null
}

export function resolveFlag(input: string | null | undefined): FlagResolution {
  if (!input) {
    return { url: null, code: null, isFallback: true }
  }
  const raw = String(input).trim()
  const lower = normalize(raw)

  // 1. Locale / language code FIRST — so 'en' maps to US, not to en.svg (which
  //    doesn't exist). Languages must be checked before the generic alpha-2
  //    fallback because 'en', 'th', 'id', 'vi', 'ar', 'bg', 'hr', 'ko' all
  //    happen to be 2 chars but aren't country codes.
  if (LANG_TO_COUNTRY[lower]) {
    const a2 = LANG_TO_COUNTRY[lower]
    return { url: `/flags/4x3/${a2}.svg`, code: a2, isFallback: false }
  }

  // 2. Direct alpha-2 (most common case for ISO country codes like 'US', 'CN')
  if (raw.length === 2) {
    return { url: `/flags/4x3/${lower}.svg`, code: lower, isFallback: false }
  }

  // 3. Alpha-3 (USA, CHN, THA, ...) — convert then resolve
  if (raw.length === 3 && COUNTRY_ALPHA3_TO_ALPHA2[raw.toUpperCase()]) {
    const a2 = COUNTRY_ALPHA3_TO_ALPHA2[raw.toUpperCase()]
    return { url: `/flags/4x3/${a2}.svg`, code: a2, isFallback: false }
  }

  // 4. Heuristic: maybe it's "us.svg" or "/flags/4x3/us" — extract tail
  const tail = lower.split('/').pop()?.replace(/\.svg$/, '') || ''
  if (tail.length === 2) {
    return { url: `/flags/4x3/${tail}.svg`, code: tail, isFallback: false }
  }

  return { url: null, code: null, isFallback: true }
}

/** Convenience: just get the URL string, or null. */
export function flagUrl(input: string | null | undefined): string | null {
  return resolveFlag(input).url
}

/** Composable wrapper so Vue templates can call it directly. */
export function useFlagUrl() {
  return {
    resolve: resolveFlag,
    url: flagUrl,
  }
}