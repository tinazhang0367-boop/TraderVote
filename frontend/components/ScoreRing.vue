<template>
  <div class="score-ring" :class="[`score-ring--${size}`, bandClass]">
    <svg
      :viewBox="`0 0 ${dim} ${dim}`"
      :width="dim"
      :height="dim"
      class="score-ring__svg"
      role="img"
      :aria-label="`Trust score ${score} out of 5`"
    >
      <!-- Track ring -->
      <circle
        :cx="cx"
        :cy="cx"
        :r="radius"
        fill="none"
        class="score-ring__track"
        :stroke-width="stroke"
      />

      <!-- Animated score arc -->
      <circle
        :cx="cx"
        :cy="cx"
        :r="radius"
        fill="none"
        class="score-ring__progress"
        :stroke-width="stroke"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        :transform="`rotate(-90 ${cx} ${cx})`"
      />
    </svg>
    <div class="score-ring__center">
      <div class="score-ring__num">{{ score.toFixed(1) }}</div>
      <div class="score-ring__label">{{ bandLabel }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { bandFromScore, TRUST_BAND_LABEL } from '~/utils/trust-score'

const props = withDefaults(defineProps<{
  score: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showLabel?: boolean
}>(), {
  size: 'lg',
  showLabel: true,
})

// Sizing matrix
const dimMap = { sm: 80, md: 120, lg: 160, xl: 200 }
const strokeMap = { sm: 6, md: 8, lg: 10, xl: 12 }
const dim = computed(() => dimMap[props.size])
const stroke = computed(() => strokeMap[props.size])
const cx = computed(() => dim.value / 2)
const radius = computed(() => (dim.value - stroke.value) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const band = computed(() => bandFromScore(props.score))
const bandLabel = computed(() => props.showLabel ? TRUST_BAND_LABEL[band.value] : '')
const bandClass = computed(() => `score-ring--${band.value}`)

const dashOffset = computed(() => {
  const progress = Math.min(1, Math.max(0, props.score / 5))
  return circumference.value * (1 - progress)
})
</script>

<style scoped>
.score-ring {
  position: relative;
  display: inline-grid;
  place-items: center;
  line-height: 1;
}

.score-ring__svg {
  display: block;
  overflow: visible;
}

.score-ring__track {
  stroke: var(--color-bg-muted);
}

.score-ring__progress {
  /* The band class supplies the color via currentColor. */
  stroke: currentColor;
  transition: stroke-dashoffset var(--dur-slow) var(--ease-out);
}

.score-ring--excellent { color: var(--score-excellent); }
.score-ring--great     { color: var(--score-great); }
.score-ring--average   { color: var(--score-average); }
.score-ring--poor      { color: var(--score-poor); }
.score-ring--bad       { color: var(--score-bad); }

.score-ring__center {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
  pointer-events: none;
}

.score-ring__num {
  font-weight: 800;
  letter-spacing: -.02em;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-1);
  line-height: 1;
}
.score-ring--sm  .score-ring__num { font-size: var(--text-xl); }
.score-ring--md  .score-ring__num { font-size: var(--text-3xl); }
.score-ring--lg  .score-ring__num { font-size: var(--text-4xl); }
.score-ring--xl  .score-ring__num { font-size: var(--text-5xl); }

.score-ring__label {
  margin-top: 4px;
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--color-text-3);
}
</style>