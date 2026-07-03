<template>
  <div class="rating-bars">
    <div v-for="row in rows" :key="row.key" class="rating-bars__row">
      <div class="rating-bars__label">{{ row.label }}</div>
      <div class="rating-bars__bar">
        <div
          class="rating-bars__fill"
          :class="`rating-bars__fill--${sentimentFor(row.value)}`"
          :style="{ width: `${(row.value / 5) * 100}%` }"
        />
      </div>
      <div class="rating-bars__num" :class="`rating-bars__num--${sentimentFor(row.value)}`">
        {{ row.value.toFixed(1) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** 4-axis rating 1-5 each */
  ratings: {
    withdrawal: number
    platform: number
    support: number
    pricing: number
  }
  /** Override labels via i18n keys */
  labels?: {
    withdrawal?: string
    platform?: string
    support?: string
    pricing?: string
  }
}>(), {
  labels: () => ({}),
})

const { t } = useI18n()

const rows = computed(() => [
  { key: 'withdrawal', value: props.ratings.withdrawal, label: props.labels.withdrawal ?? t('broker.rating_withdrawal') },
  { key: 'platform',   value: props.ratings.platform,   label: props.labels.platform   ?? t('broker.rating_platform') },
  { key: 'support',    value: props.ratings.support,    label: props.labels.support    ?? t('broker.rating_support') },
  { key: 'pricing',    value: props.ratings.pricing,    label: props.labels.pricing    ?? t('broker.rating_pricing') },
])

function sentimentFor(v: number): 'positive' | 'neutral' | 'negative' {
  if (v >= 4.0) return 'positive'
  if (v >= 3.0) return 'neutral'
  return 'negative'
}
</script>

<style scoped>
.rating-bars { display: flex; flex-direction: column; gap: var(--sp-3); }
.rating-bars__row {
  display: grid;
  grid-template-columns: 120px 1fr 40px;
  align-items: center;
  gap: var(--sp-3);
}
.rating-bars__label {
  font-size: var(--text-sm);
  color: var(--color-text-2);
  font-weight: 500;
}
.rating-bars__bar {
  height: 8px;
  background: var(--color-bg-muted);
  border-radius: var(--radius-pill);
  overflow: hidden;
  position: relative;
}
.rating-bars__fill {
  height: 100%;
  border-radius: var(--radius-pill);
  transition: width var(--dur-base) var(--ease-out);
}
.rating-bars__fill--positive { background: var(--sentiment-positive); }
.rating-bars__fill--neutral  { background: var(--sentiment-neutral); }
.rating-bars__fill--negative { background: var(--sentiment-negative); }
.rating-bars__num {
  font-size: var(--text-sm);
  font-weight: 700;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.rating-bars__num--positive { color: var(--sentiment-positive); }
.rating-bars__num--neutral  { color: var(--color-text-2); }
.rating-bars__num--negative { color: var(--sentiment-negative); }

@media (max-width: 540px) {
  .rating-bars__row {
    grid-template-columns: 1fr 40px;
    grid-template-rows: auto auto;
  }
  .rating-bars__label { grid-column: 1 / -1; font-size: var(--text-xs); }
}
</style>