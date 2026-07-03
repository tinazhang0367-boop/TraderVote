<template>
  <svg
    :class="['sparkline', `sparkline--${size}`]"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    preserveAspectRatio="none"
    :aria-label="ariaLabel"
    role="img"
  >
    <!-- Optional gradient fill -->
    <defs v-if="gradient">
      <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="resolvedColor" stop-opacity="0.25" />
        <stop offset="100%" :stop-color="resolvedColor" stop-opacity="0" />
      </linearGradient>
    </defs>

    <!-- Filled area -->
    <path
      v-if="gradient"
      :d="areaPath"
      :fill="`url(#${gradientId})`"
    />

    <!-- Line -->
    <path
      :d="linePath"
      fill="none"
      :stroke="resolvedColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />

    <!-- End-point dot (only when there's room) -->
    <circle
      v-if="points.length > 0 && !flat"
      :cx="lastPoint.x"
      :cy="lastPoint.y"
      :r="size === 'lg' ? 2.5 : 2"
      :fill="resolvedColor"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(defineProps<{
  /** Numeric series. Direction inferred automatically. */
  data: number[]
  /** Force a color (overrides sentiment-driven default). */
  color?: string
  /** Sentiment polarity for default color. */
  sentiment?: 'positive' | 'neutral' | 'negative'
  /** Show gradient fill under the line. */
  gradient?: boolean
  /** SVG viewBox width in px. */
  width?: number
  /** SVG viewBox height in px. */
  height?: number
  /** Preset size — controls stroke / radius. */
  size?: 'sm' | 'md' | 'lg'
  /** Accessible label. */
  ariaLabel?: string
}>(), {
  color: '',
  sentiment: 'neutral',
  gradient: true,
  width: 120,
  height: 32,
  size: 'md',
  ariaLabel: 'Trend',
})

const uid = useId()
const gradientId = `sparkline-grad-${uid}`

const points = computed(() => {
  const data = props.data.filter(n => Number.isFinite(n))
  if (data.length < 2) return []
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = props.width / (data.length - 1)
  return data.map((v, i) => ({
    x: i * stepX,
    y: props.height - ((v - min) / range) * props.height,
  }))
})

const linePath = computed(() => {
  if (points.value.length === 0) return ''
  return points.value
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ')
})

const areaPath = computed(() => {
  if (points.value.length === 0) return ''
  const first = points.value[0]
  const last = points.value[points.value.length - 1]
  return `${linePath.value} L${last.x.toFixed(2)},${props.height} L${first.x.toFixed(2)},${props.height} Z`
})

const lastPoint = computed(() => points.value[points.value.length - 1] ?? { x: 0, y: 0 })

const flat = computed(() => {
  const data = props.data
  return data.length === 0 || new Set(data).size === 1
})

const resolvedColor = computed(() => {
  if (props.color) return props.color
  switch (props.sentiment) {
    case 'positive': return 'var(--sentiment-positive)'
    case 'negative': return 'var(--sentiment-negative)'
    default:        return 'var(--color-brand-500)'
  }
})
</script>

<style scoped>
.sparkline {
  display: block;
  overflow: visible;
}
</style>