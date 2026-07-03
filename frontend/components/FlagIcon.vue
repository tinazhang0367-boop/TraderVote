<template>
  <span
    :class="[
      'flag-icon',
      `flag-icon--${size}`,
      { 'flag-icon--rounded': rounded, 'flag-icon--square': !rounded },
    ]"
    :title="title || (resolution.code ? resolution.code.toUpperCase() : '')"
  >
    <img
      v-if="resolution.url"
      :src="resolution.url"
      :alt="alt || title || (resolution.code ? resolution.code.toUpperCase() : 'Flag')"
      :width="dim.width"
      :height="dim.height"
      class="flag-icon__img"
      loading="lazy"
      decoding="async"
      @error="onError"
    />
    <span v-else class="flag-icon__fallback" :aria-label="alt || 'Flag'">🌐</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveFlag, type FlagResolution } from '~/composables/useFlagUrl'

type FlagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(defineProps<{
  /**
   * Country code (ISO 3166-1 alpha-2 like 'us' or 'US'),
   * alpha-3 (like 'USA'), locale code ('en', 'zh-CN'),
   * or any resolvable identifier.
   */
  code?: string | null
  /**
   * Alias for `code` — used by the language switcher so callers can pass
   * `lang="en"` to mean "the home-country flag for English".
   */
  lang?: string | null
  /**
   * Pre-resolved flag URL. Useful if you've already resolved the URL
   * elsewhere and want to skip the lookup.
   */
  url?: string | null
  /** Display size preset. */
  size?: FlagSize
  /** If true, give the flag rounded corners (pill / circle look). */
  rounded?: boolean
  /** Accessible title for tooltip / screen readers. */
  title?: string
  /** alt text for the inner <img>; defaults to title. */
  alt?: string
}>(), {
  code: null,
  lang: null,
  url: null,
  size: 'sm',
  rounded: false,
  title: '',
  alt: '',
})

// Resolve flag. Explicit url > code > lang. Fallback to emoji on miss.
const resolution = computed<FlagResolution>(() => {
  if (props.url) {
    return { url: props.url, code: null, isFallback: false }
  }
  const input = props.code ?? props.lang ?? null
  return resolveFlag(input)
})

// Pixel dimensions for the inner <img> — width/height attrs help prevent
// layout shift while the SVG loads. Always 4:3 ratio to match flag-icons/4x3/.
const dim = computed(() => {
  const map: Record<FlagSize, { width: number; height: number }> = {
    xs: { width: 12, height: 9 },
    sm: { width: 18, height: 14 },
    md: { width: 24, height: 18 },
    lg: { width: 36, height: 27 },
    xl: { width: 48, height: 36 },
  }
  return map[props.size]
})

function onError(e: Event) {
  // Hide the broken <img> and surface the fallback emoji instead.
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
.flag-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  flex-shrink: 0;
  line-height: 1;
}

.flag-icon__img {
  display: block;
  object-fit: cover;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  /* Reset inline <img> quirks in some browsers */
  max-width: 100%;
  height: auto;
}

.flag-icon--rounded .flag-icon__img {
  border-radius: 50%;
}
.flag-icon--square .flag-icon__img {
  border-radius: 2px;
}

.flag-icon__fallback {
  font-size: 1.1em;
  opacity: 0.6;
  /* Some platforms still render emoji badly; provide text fallback */
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
}
</style>