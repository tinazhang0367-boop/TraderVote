<template>
  <article class="broker-card card card--hover">
    <!-- Trust band header -->
    <header class="broker-card__band" :class="`broker-card__band--${band}`">
      <div class="broker-card__band-left">
        <span v-if="rank" class="broker-card__rank">#{{ rank }}</span>
        <span
          class="broker-card__band-label"
          :style="{ color: bandColor, background: bandBg }"
        >
          {{ bandLabel }}
        </span>
      </div>
      <div class="broker-card__score">
        <span class="broker-card__score-num" :style="{ color: bandColor }">{{ broker.trustScore.toFixed(1) }}</span>
        <span
          class="broker-card__score-stars"
          :style="{ color: bandColor }"
          :aria-label="`${broker.trustScore} out of 5`"
        >
          {{ stars }}
        </span>
      </div>
    </header>

    <div class="broker-card__body stack-3">
      <!-- Name + logo -->
      <NuxtLink :to="localePath(`/brokers/${broker.slug}`)" class="broker-card__head">
        <div class="broker-card__logo">
          <img v-if="broker.logoUrl" :src="broker.logoUrl" :alt="broker.name" loading="lazy" width="56" height="56" />
          <span v-else class="broker-card__logo-fallback">{{ initials }}</span>
        </div>
        <div class="broker-card__name-block">
          <h3 class="broker-card__name">{{ broker.name }}</h3>
          <div class="broker-card__meta">
            <FlagIcon
              v-for="reg in broker.regulators.slice(0, 3)"
              :key="reg"
              :code="reg"
              size="xs"
            />
            <span v-if="broker.regulators.length > 3" class="broker-card__more">
              +{{ broker.regulators.length - 3 }}
            </span>
          </div>
        </div>
      </NuxtLink>

      <!-- Trust score sparkline (mock — in prod, real history) -->
      <Sparkline
        :data="trustHistory"
        :sentiment="broker.trustScore >= 4 ? 'positive' : broker.trustScore >= 3 ? 'neutral' : 'negative'"
        :height="36"
        :width="220"
        size="sm"
        :aria-label="`Trust score trend for ${broker.name}`"
      />

      <!-- Regulator chips -->
      <div class="broker-card__regulators">
        <RegulatorBadge v-for="reg in broker.regulators.slice(0, 3)" :key="reg" :code="reg" />
        <span v-if="broker.regulators.length > 3" class="muted text-xs">
          +{{ broker.regulators.length - 3 }}
        </span>
        <span v-if="broker.regulators.length === 0" class="pill pill--danger">
          ⚠️ Not regulated
        </span>
      </div>

      <!-- Quick facts -->
      <ul class="broker-card__facts">
        <li>
          <span class="muted text-xs">{{ $t('broker.min_deposit') }}</span>
          <span class="broker-card__fact-val">{{ formattedMinDeposit }}</span>
        </li>
        <li>
          <span class="muted text-xs">{{ $t('broker.spreads_from') }}</span>
          <span class="broker-card__fact-val">{{ broker.spreadsFrom }} pips</span>
        </li>
        <li>
          <span class="muted text-xs">{{ $t('broker.max_leverage') }}</span>
          <span class="broker-card__fact-val">{{ broker.maxLeverage }}</span>
        </li>
      </ul>

      <!-- Footer: review count + actions -->
      <footer class="broker-card__foot">
        <div class="broker-card__count">
          <span class="broker-card__count-num">{{ broker.reviewCount.toLocaleString() }}</span>
          <span class="muted text-xs">{{ $t('broker.reviews_sub', { count: broker.reviewCount }) }}</span>
        </div>
        <div class="broker-card__actions">
          <NuxtLink :to="localePath(`/brokers/${broker.slug}`)" class="btn btn--ghost btn--sm">
            {{ $t('broker.read_review') }}
          </NuxtLink>
          <a
            v-if="broker.affiliateUrl"
            :href="broker.affiliateUrl"
            rel="nofollow noopener"
            target="_blank"
            class="btn btn--primary btn--sm"
          >
            {{ $t('broker.open_account') }}
          </a>
        </div>
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Broker } from '~/types/broker'
import { bandFromScore, starsFor, TRUST_BAND_LABEL, TRUST_BAND_COLOR, TRUST_BAND_BG } from '~/utils/trust-score'

const props = defineProps<{ broker: Broker; rank?: number }>()
const localePath = useLocalePath()

const band = computed(() => bandFromScore(props.broker.trustScore))
const bandColor = computed(() => TRUST_BAND_COLOR[band.value])
const bandBg = computed(() => TRUST_BAND_BG[band.value])
const bandLabel = computed(() => TRUST_BAND_LABEL[band.value])
const stars = computed(() => starsFor(props.broker.trustScore))

const initials = computed(() => props.broker.name.slice(0, 2).toUpperCase())

const formattedMinDeposit = computed(() => {
  const m = props.broker.minDeposit
  if (!m) return '—'
  return `${m.currency} ${m.amount.toLocaleString()}`
})

/**
 * Deterministic mock trust-score trend (last 12 months).
 * Seeded by broker.id so each card gets a different but stable line.
 * In production this would come from a /api/brokers/:id/trust-history endpoint.
 */
const trustHistory = computed<number[]>(() => {
  const target = props.broker.trustScore
  const seed = props.broker.id
  const months = 12
  // Walk backwards from target using a deterministic pseudo-random walk.
  const series: number[] = []
  let cur = target
  for (let i = 0; i < months; i++) {
    series.unshift(parseFloat(cur.toFixed(2)))
    // Step: +/- 0.1 based on hash of seed + index
    const r = Math.sin((seed * 9301 + i * 49297) % 233280 / 233280) * 0.4
    cur = Math.max(1, Math.min(5, cur - r * 0.18))
  }
  // Ensure final value equals current trustScore
  series[series.length - 1] = target
  return series
})
</script>

<style scoped>
.broker-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.broker-card__band {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-3) var(--sp-4);
  background: var(--color-bg-subtle);
  border-bottom: 1px solid var(--color-border);
  font-weight: 600;
  position: relative;
}
.broker-card__band::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: var(--score-average);
}
.broker-card__band--excellent::before { background: var(--score-excellent); }
.broker-card__band--great::before { background: var(--score-great); }
.broker-card__band--average::before { background: var(--score-average); }
.broker-card__band--poor::before { background: var(--score-poor); }
.broker-card__band--bad::before { background: var(--score-bad); }
.broker-card__band--excellent { background: linear-gradient(90deg, var(--score-excellent-bg), var(--color-bg-subtle) 44%); }
.broker-card__band--great { background: linear-gradient(90deg, var(--score-great-bg), var(--color-bg-subtle) 44%); }
.broker-card__band--average { background: linear-gradient(90deg, var(--score-average-bg), var(--color-bg-subtle) 44%); }
.broker-card__band--poor { background: linear-gradient(90deg, var(--score-poor-bg), var(--color-bg-subtle) 44%); }
.broker-card__band--bad { background: linear-gradient(90deg, var(--score-bad-bg), var(--color-bg-subtle) 44%); }
.broker-card__band-left { display: flex; align-items: center; gap: var(--sp-2); }
.broker-card__rank {
  font-size: var(--text-xs);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-2);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
}
.broker-card__band-label {
  text-transform: uppercase;
  letter-spacing: .04em;
  font-size: var(--text-xs);
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  font-weight: 800;
}
.broker-card__score { display: flex; align-items: baseline; gap: var(--sp-2); }
.broker-card__score-num { font-size: var(--text-xl); font-weight: 800; }
.broker-card__score-stars { font-size: var(--text-base); letter-spacing: 2px; opacity: .95; }

.broker-card__body {
  padding: var(--sp-4);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.broker-card__head {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  text-decoration: none;
  color: inherit;
}
.broker-card__head:hover { text-decoration: none; }
.broker-card__head:hover .broker-card__name { color: var(--color-brand-600); }

.broker-card__logo {
  width: 48px; height: 48px;
  border-radius: var(--radius-md);
  background: var(--color-bg-muted);
  display: grid;
  place-items: center;
  overflow: hidden;
  flex-shrink: 0;
}
.broker-card__logo-fallback {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text-2);
}

.broker-card__name-block { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.broker-card__name {
  font-size: var(--text-base);
  font-weight: 700;
  margin: 0;
  transition: color var(--dur-fast) var(--ease-out);
}
.broker-card__meta {
  display: flex;
  gap: 4px;
  align-items: center;
  flex-wrap: wrap;
}
.broker-card__more {
  font-size: var(--text-xs);
  color: var(--color-text-3);
  font-weight: 600;
}

.broker-card__regulators {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.broker-card__facts {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--sp-2);
  padding-block: var(--sp-2);
  border-block: 1px solid var(--color-border);
}
.broker-card__facts li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.broker-card__fact-val {
  font-size: var(--text-sm);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.broker-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  margin-top: auto;
  flex-wrap: wrap;
}
.broker-card__count { display: flex; flex-direction: column; gap: 2px; }
.broker-card__count-num {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-1);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.broker-card__actions { display: flex; gap: var(--sp-2); flex-wrap: wrap; }
</style>
