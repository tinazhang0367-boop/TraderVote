<template>
  <span :class="['regulator-badge', `regulator-badge--${regulator?.tier ?? 'offshore'}`]" :title="title">
    <span class="regulator-badge__code">{{ code }}</span>
    <span v-if="showName && regulator" class="regulator-badge__name">{{ regulator.shortName ?? regulator.name }}</span>
    <span v-if="!regulator" class="regulator-badge__name">⚠️ Unrecognized</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { REGULATORS_BY_CODE } from '~/data/regulators'

const props = withDefaults(defineProps<{
  /** Regulator code, e.g. "FCA", "CySEC" */
  code: string
  showName?: boolean
}>(), {
  showName: false,
})

const regulator = computed(() => REGULATORS_BY_CODE[props.code])
const title = computed(() => {
  if (!regulator.value) return `${props.code} — not in our regulator database`
  const tierLabel = regulator.value.tier === 'tier1' ? 'Tier-1 (top-tier)'
    : regulator.value.tier === 'tier2' ? 'Tier-2'
    : regulator.value.tier === 'tier3' ? 'Tier-3'
    : 'Offshore (no conduct oversight)'
  return `${regulator.value.name} — ${tierLabel}`
})
</script>

<style scoped>
.regulator-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: .02em;
  border: 1px solid currentColor;
  background: rgba(255,255,255,.5);
}

.regulator-badge--tier1    { color: var(--regulator-tier1);    background: var(--score-excellent-bg); }
.regulator-badge--tier2    { color: var(--regulator-tier2);    background: var(--score-average-bg); }
.regulator-badge--tier3    { color: var(--regulator-tier3);    background: var(--score-poor-bg); }
.regulator-badge--offshore { color: var(--regulator-offshore); background: var(--score-bad-bg); }

.regulator-badge__code { font-weight: 800; }
.regulator-badge__name { font-weight: 500; opacity: .85; }
</style>