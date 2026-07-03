<template>
  <div :class="['skeleton', `skeleton--${variant}`]" :style="customStyle" :aria-busy="true" aria-live="polite">
    <span v-if="!srOnly" class="visually-hidden">{{ $t ? $t('common.loading') : 'Loading…' }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'text' | 'circular' | 'rect' | 'card'
  /** Tailwind-style sizing shorthand. */
  width?: string
  height?: string
  /** Hide visually but keep for screen readers. */
  srOnly?: boolean
}>(), {
  variant: 'text',
  width: '',
  height: '',
  srOnly: false,
})

const customStyle = computed(() => ({
  width: props.width || undefined,
  height: props.height || undefined,
}))
</script>

<style scoped>
.skeleton {
  display: block;
  background: linear-gradient(
    90deg,
    var(--color-bg-muted) 0%,
    var(--color-border) 50%,
    var(--color-bg-muted) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.4s linear infinite;
  border-radius: var(--radius-sm);
}

.skeleton--text {
  height: 1em;
  border-radius: 4px;
  margin-block: 4px;
}
.skeleton--circular {
  border-radius: 50%;
}
.skeleton--rect {
  border-radius: var(--radius-md);
}
.skeleton--card {
  height: 120px;
  border-radius: var(--radius-lg);
}

@keyframes skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
}
</style>