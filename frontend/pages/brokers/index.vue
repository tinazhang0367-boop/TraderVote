<template>
  <div class="container section">
    <header class="page-head">
      <h1>{{ $t('brokers.title') }}</h1>
      <p class="muted">{{ $t('brokers.subtitle', { count: brokers.length }) }}</p>
    </header>

    <div class="brokers-layout">
      <!-- ─── Filter sidebar (regulator-first per spec) ─── -->
      <aside class="brokers-filters">
        <!-- Tier groups first (regulator quality > country) -->
        <section class="brokers-filter-group">
          <h3 class="brokers-filter-title">
            <span class="brokers-filter-icon">🛡️</span> {{ $t('brokers.filter_regulator_tier') }}
          </h3>
          <label v-for="t in tierOptions" :key="t.value" class="brokers-filter-row brokers-filter-row--tier" :class="`brokers-filter-row--${t.value}`">
            <input type="checkbox" :value="t.value" v-model="selectedTiers" />
            <span class="brokers-filter-pip" :class="`brokers-filter-pip--${t.value}`"></span>
            <span class="brokers-filter-label">{{ $t(`brokers.tier_${t.value}`) }}</span>
            <span class="brokers-filter-count tabular-nums">{{ tierCount(t.value) }}</span>
          </label>
        </section>

        <section class="brokers-filter-group">
          <h3 class="brokers-filter-title">
            <span class="brokers-filter-icon">🏛️</span> {{ $t('brokers.filter_regulator') }}
          </h3>
          <label v-for="r in regulators" :key="r.code" class="brokers-filter-row">
            <input type="checkbox" :value="r.code" v-model="selectedRegulators" />
            <RegulatorBadge :code="r.code" />
            <span class="brokers-filter-count tabular-nums">{{ regulatorCount(r.code) }}</span>
          </label>
        </section>

        <section class="brokers-filter-group">
          <h3 class="brokers-filter-title">
            <span class="brokers-filter-icon">🌏</span> {{ $t('brokers.filter_country') }}
          </h3>
          <label v-for="c in countries" :key="c.code" class="brokers-filter-row">
            <input type="checkbox" :value="c.code" v-model="selectedCountries" />
            <FlagIcon :code="c.alpha2 ?? c.code" size="xs" />
            <span class="brokers-filter-label">{{ $t(`countries.${c.code}`) }}</span>
            <span class="brokers-filter-count tabular-nums">{{ c.brokerCount }}</span>
          </label>
        </section>

        <section class="brokers-filter-group">
          <h3 class="brokers-filter-title">
            <span class="brokers-filter-icon">💵</span> {{ $t('brokers.filter_min_deposit') }}
          </h3>
          <label v-for="d in depositBuckets" :key="d.value" class="brokers-filter-row">
            <input type="radio" :value="d.value" v-model="selectedDeposit" name="deposit" />
            <span class="brokers-filter-label">{{ $t(d.label) }}</span>
            <span class="brokers-filter-count tabular-nums">{{ depositCount(d.value) }}</span>
          </label>
        </section>

        <section class="brokers-filter-group">
          <h3 class="brokers-filter-title">
            <span class="brokers-filter-icon">⭐</span> {{ $t('brokers.filter_score') }}
          </h3>
          <label v-for="s in scoreBuckets" :key="s.value" class="brokers-filter-row">
            <input type="radio" :value="s.value" v-model="selectedScore" name="score" />
            <span class="brokers-filter-label">{{ $t(s.label) }}</span>
            <span class="brokers-filter-count tabular-nums">{{ scoreCount(s.value) }}</span>
          </label>
        </section>

        <button v-if="hasAnyFilter" type="button" class="btn btn--ghost btn--sm brokers-clear" @click="clearAll">
          {{ $t('common.clear_filters') }}
        </button>
      </aside>

      <!-- ─── Result list ─── -->
      <main class="brokers-list-wrap">
        <header class="brokers-list-head">
          <span class="brokers-count tabular-nums">{{ filteredBrokers.length }}</span>
          <span class="muted">/ {{ brokers.length }} {{ $t('common.results') }}</span>
          <select v-model="sortKey" class="brokers-sort">
            <option value="score">{{ $t('brokers.sort_trust') }}</option>
            <option value="reviews">{{ $t('brokers.sort_reviews') }}</option>
            <option value="spreads">{{ $t('brokers.sort_spreads') }}</option>
            <option value="minDeposit">{{ $t('brokers.sort_min_deposit') }}</option>
          </select>
        </header>

        <div v-if="pending" class="brokers-loading">
          <SkeletonLoader v-for="i in 4" :key="i" variant="card" width="100%" height="180px" />
        </div>
        <div v-else-if="filteredBrokers.length" class="brokers-list">
          <BrokerCard v-for="b in sortedBrokers" :key="b.id" :broker="b" :rank="b.rank" />
        </div>
        <div v-else class="brokers-empty">
          <EmptyStateIllustration :size="160" />
          <p class="muted">{{ $t('brokers.empty') }}</p>
          <button type="button" class="btn btn--primary" @click="clearAll">
            {{ $t('common.clear_filters') }}
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Broker, Country, RegulatorTier } from '~/types/broker'
import { REGULATORS, REGULATORS_BY_CODE } from '~/data/regulators'

const route = useRoute()
const localePath = useLocalePath()

const { data: brokers, pending } = await useFetch<Broker[]>('/api/brokers', {
  query: { q: computed(() => String(route.query.q ?? '')) },
  default: () => [],
})

// Country list comes from API
const { data: countriesData } = await useFetch<Country[]>('/api/countries', { default: () => [] })
const countries = computed(() => countriesData.value ?? [])

// Pre-fill from query string
const selectedRegulators = ref<string[]>(
  route.query.regulator ? String(route.query.regulator).split(',') : [],
)
const selectedCountries = ref<string[]>(
  route.query.country ? String(route.query.country).split(',') : [],
)
const selectedTiers = ref<RegulatorTier[]>(
  route.query.tier ? String(route.query.tier).split(',') as RegulatorTier[] : [],
)
const selectedDeposit = ref<string>(route.query.deposit ? String(route.query.deposit) : '')
const selectedScore = ref<string>(route.query.score ? String(route.query.score) : '')
const sortKey = ref<string>(route.query.sort ? String(route.query.sort) : 'score')

// Filter regulators to those present in broker data
const regulators = computed(() => {
  const codes = new Set<string>()
  for (const b of brokers.value ?? []) for (const r of b.regulators) codes.add(r)
  return Array.from(codes)
    .map(c => REGULATORS_BY_CODE[c])
    .filter(Boolean)
    .sort((a, b) => {
      // Tier-1 first, then tier-2, then tier-3, then offshore
      const order: Record<string, number> = { tier1: 0, tier2: 1, tier3: 2, offshore: 3 }
      return (order[a.tier] ?? 4) - (order[b.tier] ?? 4)
    })
})

function tierOf(reg: string | null | undefined): RegulatorTier | null {
  if (!reg) return null
  return REGULATORS_BY_CODE[reg]?.tier ?? null
}

const tierOptions: { value: RegulatorTier; label: string }[] = [
  { value: 'tier1',    label: 'brokers.tier_tier1' },
  { value: 'tier2',    label: 'brokers.tier_tier2' },
  { value: 'tier3',    label: 'brokers.tier_tier3' },
  { value: 'offshore', label: 'brokers.tier_offshore' },
]

const depositBuckets = [
  { value: '',        label: 'brokers.deposit_any',     min: 0,    max: Infinity },
  { value: 'lt10',    label: 'brokers.deposit_lt10',     min: 0,    max: 10 },
  { value: 'lt100',   label: 'brokers.deposit_lt100',    min: 0,    max: 100 },
  { value: 'lt1000',  label: 'brokers.deposit_lt1000',   min: 0,    max: 1000 },
]

const scoreBuckets = [
  { value: '',      label: 'brokers.score_any' },
  { value: '4.5+',  label: 'brokers.score_excellent' },
  { value: '4.0+',  label: 'brokers.score_great' },
  { value: '3.5+',  label: 'brokers.score_good' },
]

function tierCount(tier: RegulatorTier): number {
  return (brokers.value ?? []).filter(b => b.regulators.some(r => tierOf(r) === tier)).length
}
function regulatorCount(code: string): number {
  return (brokers.value ?? []).filter(b => b.regulators.includes(code)).length
}
function depositCount(value: string): number {
  const bucket = depositBuckets.find(b => b.value === value)
  if (!bucket) return (brokers.value ?? []).length
  return (brokers.value ?? []).filter(b => {
    const m = b.minDeposit?.amount ?? Infinity
    return m >= bucket.min && m <= bucket.max
  }).length
}
function scoreCount(value: string): number {
  if (!value) return (brokers.value ?? []).length
  const threshold = parseFloat(value)
  return (brokers.value ?? []).filter(b => b.trustScore >= threshold).length
}

const filteredBrokers = computed(() => {
  return (brokers.value ?? []).filter((b) => {
    // Tier filter
    if (selectedTiers.value.length) {
      const ok = b.regulators.some(r => {
        const t = tierOf(r)
        return t && selectedTiers.value.includes(t)
      })
      if (!ok) return false
    }
    // Regulator filter
    if (selectedRegulators.value.length && !selectedRegulators.value.some(r => b.regulators.includes(r))) return false
    // Country filter
    if (selectedCountries.value.length && !selectedCountries.value.some(c =>
      b.regulators.some(r => r.includes(c)) || (b.headquarters ?? '').includes(c),
    )) return false
    // Deposit bucket
    if (selectedDeposit.value) {
      const bucket = depositBuckets.find(x => x.value === selectedDeposit.value)
      if (bucket) {
        const m = b.minDeposit?.amount ?? Infinity
        if (m < bucket.min || m > bucket.max) return false
      }
    }
    // Score
    if (selectedScore.value) {
      const threshold = parseFloat(selectedScore.value)
      if (b.trustScore < threshold) return false
    }
    return true
  })
})

const sortedBrokers = computed(() => {
  const list = [...filteredBrokers.value]
  switch (sortKey.value) {
    case 'reviews':     return list.sort((a, b) => b.reviewCount - a.reviewCount)
    case 'spreads':     return list.sort((a, b) => a.spreadsFrom - b.spreadsFrom)
    case 'minDeposit':  return list.sort((a, b) => (a.minDeposit?.amount ?? Infinity) - (b.minDeposit?.amount ?? Infinity))
    case 'score':
    default:            return list.sort((a, b) => b.trustScore - a.trustScore)
  }
})

const hasAnyFilter = computed(() =>
  selectedRegulators.value.length > 0 ||
  selectedCountries.value.length > 0 ||
  selectedTiers.value.length > 0 ||
  !!selectedDeposit.value ||
  !!selectedScore.value,
)

function clearAll() {
  selectedRegulators.value = []
  selectedCountries.value = []
  selectedTiers.value = []
  selectedDeposit.value = ''
  selectedScore.value = ''
}

useSeoMeta({
  title: '全部外汇/CFD 经纪商 — Tradervote',
  description: '按监管机构、监管等级、国家、最低入金、评分筛选外汇/CFD 经纪商。',
})
</script>

<style scoped>
.page-head { margin-bottom: var(--sp-6); }
.page-head h1 { font-size: var(--text-3xl); margin: 0 0 var(--sp-2); letter-spacing: -.01em; }

.brokers-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-6);
}
@media (min-width: 960px) {
  .brokers-layout { grid-template-columns: 260px 1fr; }
}

.brokers-filters {
  background: var(--color-bg-muted);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}
.brokers-filter-group { display: flex; flex-direction: column; gap: 4px; }
.brokers-filter-title {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--color-text-3);
  margin: 0 0 var(--sp-1);
  display: flex;
  align-items: center;
  gap: 6px;
}
.brokers-filter-icon { font-size: var(--text-sm); }
.brokers-filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  font-size: var(--text-sm);
  cursor: pointer;
  border-radius: var(--radius-sm);
  color: var(--color-text-1);
  transition: background var(--dur-fast) var(--ease-out);
}
.brokers-filter-row:hover { background: var(--color-surface); }
.brokers-filter-row input { accent-color: var(--color-brand-500); }
.brokers-filter-pip {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.brokers-filter-pip--tier1    { background: var(--regulator-tier1); }
.brokers-filter-pip--tier2    { background: var(--regulator-tier2); }
.brokers-filter-pip--tier3    { background: var(--regulator-tier3); }
.brokers-filter-pip--offshore { background: var(--regulator-offshore); }
.brokers-filter-label { flex: 1; }
.brokers-filter-count {
  font-size: var(--text-xs);
  color: var(--color-text-3);
  font-weight: 600;
  min-width: 24px;
  text-align: right;
}
.brokers-filter-row--tier.tier-offshore .brokers-filter-label { color: var(--regulator-offshore); }
.brokers-filter-row--tier.tier-tier3 .brokers-filter-label { color: var(--regulator-tier3); }
.brokers-filter-row--tier.tier-tier2 .brokers-filter-label { color: var(--regulator-tier2); }

.brokers-clear { align-self: flex-start; margin-top: var(--sp-2); }

.brokers-list-wrap { display: flex; flex-direction: column; gap: var(--sp-4); }

.brokers-list-head {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--text-sm);
  padding: var(--sp-3) var(--sp-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}
.brokers-count {
  font-size: var(--text-base);
  font-weight: 800;
  color: var(--color-text-1);
}
.brokers-sort {
  margin-inline-start: auto;
  padding: 4px 8px;
  font-size: var(--text-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-1);
}

.brokers-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-3);
}
@media (min-width: 700px) {
  .brokers-list { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--sp-4); }
}

.brokers-loading, .brokers-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-12);
  text-align: center;
  color: var(--color-text-3);
}
.brokers-empty { background: var(--color-bg-muted); border-radius: var(--radius-md); }
</style>