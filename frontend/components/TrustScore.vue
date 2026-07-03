<template>
  <div class="trust-score" :class="[`trust-score--${layout}`]">
    <ScoreRing v-if="useRing" :score="score" :size="ringSize" />
    <div v-else class="trust-score__num" :style="{ color: bandColor }">
      {{ score.toFixed(1) }}
    </div>

    <div class="trust-score__meta">
      <div v-if="showStars" class="trust-score__stars" :style="{ color: bandColor }">{{ stars }}</div>
      <div v-if="showLabel" class="trust-score__band">{{ bandLabel }}</div>
      <div v-if="reviewCount != null" class="trust-score__count">
        {{ $t('trust.based_on', { count: reviewCount.toLocaleString() }) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { bandFromScore, starsFor, TRUST_BAND_LABEL, TRUST_BAND_COLOR } from '~/utils/trust-score'

const props = withDefaults(defineProps<{
  score: number
  reviewCount?: number | null
  showLabel?: boolean
  showStars?: boolean
  /** Display variant. */
  layout?: 'inline' | 'stacked' | 'ring'
  /** Ring size when layout='ring'. */
  ringSize?: 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  reviewCount: null,
  showLabel: true,
  showStars: true,
  layout: 'stacked',
  ringSize: 'lg',
})

const band = computed(() => bandFromScore(props.score))
const bandColor = computed(() => TRUST_BAND_COLOR[band.value])
const bandLabel = computed(() => TRUST_BAND_LABEL[band.value])
const stars = computed(() => starsFor(props.score))
const useRing = computed(() => props.layout === 'ring')
</script>

<style scoped>
.trust-score {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}
.trust-score--inline {
  flex-direction: row;
}
.trust-score--stacked {
  flex-direction: row;
  align-items: center;
}
.trust-score__num {
  font-size: var(--text-4xl);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -.02em;
  font-variant-numeric: tabular-nums;
}
.trust-score__meta { display: flex; flex-direction: column; gap: 2px; }
.trust-score__stars { font-size: var(--text-lg); letter-spacing: 2px; }
.trust-score__band { font-size: var(--text-sm); font-weight: 600; color: var(--color-text-1); }
.trust-score__count { font-size: var(--text-xs); color: var(--color-text-3); }
</style>