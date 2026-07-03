<template>
  <span class="site-logo" :class="[`site-logo--${size}`, `site-logo--${variant}`]">
    <img
      :src="logoSrc"
      alt="Tradervote"
      :width="width"
      :height="height"
      class="site-logo__img"
    >
    <span v-if="showText && variant === 'icon'" class="site-logo__wordmark" :class="`site-logo__wordmark--${size}`">
      <span class="site-logo__wordmark-trader">Trader</span><span class="site-logo__wordmark-vote">Vote</span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'full' | 'square' | 'round'
  showText?: boolean
}>(), {
  size: 'sm',
  variant: 'icon',
  showText: false,
})

const iconWidth = computed(() => {
  switch (props.size) {
    case 'xs': return 20
    case 'sm': return 28
    case 'md': return 44
    case 'lg': return 48
    default: return 28
  }
})

const fullWidth = computed(() => {
  switch (props.size) {
    case 'xs': return 108
    case 'sm': return 142
    case 'md': return 176
    case 'lg': return 232
    default: return 142
  }
})

const width = computed(() => props.variant === 'full' ? fullWidth.value : iconWidth.value)
const height = computed(() => {
  if (props.variant === 'full') return Math.round(width.value * (821 / 1916))
  if (props.variant === 'round' || props.variant === 'square') return width.value
  return Math.round(width.value * (280 / 340))
})

const logoSrc = computed(() => {
  switch (props.variant) {
    case 'full': return '/images/brand/TV_full_color.svg'
    case 'square': return '/images/brand/TV_icon_square.svg'
    case 'round': return '/images/brand/TV_icon_round.svg'
    case 'icon':
    default: return '/images/brand/TV_symbol.svg'
  }
})
</script>

<style scoped>
.site-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  line-height: 1;
  user-select: none;
}
.site-logo__img {
  display: block;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(15, 23, 42, .08));
}
.site-logo--full .site-logo__img {
  filter: none;
}
.site-logo__wordmark {
  font-family: var(--font-sans);
  font-weight: 780;
  letter-spacing: -.02em;
  white-space: nowrap;
}
.site-logo__wordmark-trader {
  color: var(--color-gold);
}
.site-logo__wordmark-vote {
  color: var(--color-teal-dark);
}
.site-logo__wordmark--xs { font-size: var(--text-sm); }
.site-logo__wordmark--sm { font-size: var(--text-base); }
.site-logo__wordmark--md { font-size: var(--text-base); }
.site-logo__wordmark--lg { font-size: var(--text-xl); }
</style>
