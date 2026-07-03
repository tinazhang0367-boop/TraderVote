<!--
  EmptyStateIllustration — unDraw-style minimal scene for "no results".
  Pure SVG. Use anywhere a list / search has no rows.
-->
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- Ground line -->
    <line x1="20" y1="140" x2="180" y2="140" stroke="var(--color-border)" stroke-width="1.5" stroke-linecap="round" />

    <!-- Magnifier -->
    <g transform="translate(60, 30)">
      <circle cx="35" cy="35" r="30" fill="none" stroke="var(--color-brand-500)" stroke-width="3" />
      <line x1="58" y1="58" x2="80" y2="80" stroke="var(--color-brand-500)" stroke-width="4" stroke-linecap="round" />
      <!-- Question mark inside the magnifier -->
      <path
        d="M25 28 Q35 18, 45 28 Q45 38, 35 42 L35 47"
        fill="none"
        stroke="var(--color-brand-500)"
        stroke-width="3"
        stroke-linecap="round"
      />
      <circle cx="35" cy="55" r="2" fill="var(--color-brand-500)" />
    </g>

    <!-- Floating sparkles / data dots -->
    <g opacity="0.5">
      <circle cx="30" cy="40" r="2" fill="var(--color-brand-500)" />
      <circle cx="170" cy="50" r="2.5" fill="var(--score-excellent)" />
      <circle cx="155" cy="110" r="2" fill="var(--color-brand-500)" />
      <rect x="22" y="110" width="6" height="3" rx="1" fill="var(--color-brand-500)" />
    </g>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
}>(), {
  size: 160,
})
</script>