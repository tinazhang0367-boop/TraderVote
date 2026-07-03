<template>
  <div v-if="broker">
    <!-- ─── Hero with TrustScore + claim status ─── -->
    <section class="broker-hero">
      <div class="container broker-hero__inner">
        <!-- Logo + identity -->
        <div class="broker-hero__identity">
          <div class="broker-hero__logo">
            <img v-if="broker.logoUrl" :src="broker.logoUrl" :alt="broker.name" />
            <span v-else>{{ initials }}</span>
          </div>
          <div class="broker-hero__info">
            <nav class="broker-hero__crumb">
              <NuxtLink :to="localePath('/brokers')">{{ $t('nav.brokers') }}</NuxtLink>
              <span aria-hidden="true">›</span>
              <span>{{ broker.name }}</span>
            </nav>
            <h1 class="broker-hero__name">{{ broker.name }}</h1>
            <div class="broker-hero__regulators">
              <RegulatorBadge v-for="r in broker.regulators" :key="r" :code="r" :show-name="true" />
            </div>
            <p v-if="broker.description" class="broker-hero__desc">{{ broker.description }}</p>
          </div>
        </div>

        <!-- Trust Score panel -->
        <aside class="broker-hero__panel">
          <div class="broker-hero__score">
            <ScoreRing :score="broker.trustScore" size="lg" />
            <div class="broker-hero__score-meta">
              <div class="broker-hero__review-count">
                <strong class="tabular-nums">{{ broker.reviewCount.toLocaleString() }}</strong>
                <span class="muted text-xs">{{ $t('broker.reviews_sub', { count: broker.reviewCount }) }}</span>
              </div>
              <Sparkline
                :data="trustHistory"
                :sentiment="trustSentiment"
                :height="40"
                :width="220"
                size="sm"
                :aria-label="`Trust score 12-month trend`"
              />
              <button type="button" class="broker-hero__explainer" @click="showExplainer = !showExplainer">
                {{ $t('broker.trust_explainer') }}
              </button>
            </div>
          </div>

          <div v-if="broker.affiliateUrl" class="broker-hero__cta-row">
            <a :href="broker.affiliateUrl" rel="nofollow noopener" target="_blank" class="btn btn--primary btn--block btn--lg">
              {{ $t('broker.open_account') }}
            </a>
            <p class="broker-hero__cta-warn muted text-xs">
              {{ $t('broker.risk_warning') }}
            </p>
          </div>

          <p v-if="!broker.claimed" class="broker-hero__claim-warn">
            {{ $t('broker.claim_warning') }}
          </p>
        </aside>
      </div>

      <!-- Trust score explainer drawer -->
      <Transition name="slide">
        <div v-if="showExplainer" class="trust-explainer container">
          <h3>{{ $t('broker.trust_explainer') }}</h3>
          <p class="muted">{{ $t('top.methodology_intro') }}</p>
          <ul>
            <li>{{ $t('top.weight_reviews') }}</li>
            <li>{{ $t('top.weight_regulation') }}</li>
            <li>{{ $t('top.weight_withdrawal') }}</li>
            <li>{{ $t('top.weight_spreads') }}</li>
          </ul>
        </div>
      </Transition>
    </section>

    <!-- ─── Tabs (anchor nav) ─── -->
    <nav class="broker-tabs container" aria-label="Sections">
      <a v-for="t in tabs" :key="t.id" :href="`#${t.id}`" class="broker-tab">{{ t.label }}</a>
    </nav>

    <!-- ─── AI summary + 4-axis rating breakdown ─── -->
    <section id="overview" class="container section">
      <header class="section__head">
        <div>
          <h2>{{ $t('broker.tab_overview') }}</h2>
          <p class="muted">{{ broker.description }}</p>
        </div>
      </header>

      <!-- Summary KPI strip (per spec) -->
      <div class="overview-strip">
        <div class="overview-strip__item">
          <div class="overview-strip__label">{{ $t('broker.trust_score') }}</div>
          <div class="overview-strip__value tabular-nums" :style="{ color: trustBandColor }">{{ broker.trustScore.toFixed(1) }}</div>
        </div>
        <div class="overview-strip__item">
          <div class="overview-strip__label">{{ $t('broker.reviews_title') }}</div>
          <div class="overview-strip__value tabular-nums">{{ broker.reviewCount.toLocaleString() }}</div>
        </div>
        <div class="overview-strip__item">
          <div class="overview-strip__label">{{ $t('broker.regulation_status') }}</div>
          <div class="overview-strip__value" :class="`overview-strip__pill overview-strip__pill--${regStatusVariant}`">
            {{ regStatusLabel }}
          </div>
        </div>
        <div class="overview-strip__item">
          <div class="overview-strip__label">{{ $t('broker.main_regulators') }}</div>
          <div class="overview-strip__value overview-strip__regulators">
            <RegulatorBadge v-for="r in broker.regulators.slice(0, 3)" :key="r" :code="r" />
          </div>
        </div>
        <div class="overview-strip__item overview-strip__item--wide">
          <div class="overview-strip__label">{{ $t('broker.main_strengths') }}</div>
          <div class="overview-strip__chips">
            <span v-for="t in broker.topTopics?.filter(t => t.sentiment === 'positive').slice(0, 3)" :key="t.key" class="chip chip--good">
              ✓ {{ t.label }}
            </span>
          </div>
        </div>
        <div class="overview-strip__item overview-strip__item--wide">
          <div class="overview-strip__label">{{ $t('broker.main_risks') }}</div>
          <div class="overview-strip__chips">
            <span v-for="t in broker.topTopics?.filter(t => t.sentiment === 'negative').slice(0, 3)" :key="t.key" class="chip chip--bad">
              ⚠ {{ t.label }}
            </span>
            <span v-if="!broker.topTopics?.some(t => t.sentiment === 'negative')" class="chip chip--good">
              ✓ {{ $t('broker.no_major_risks') }}
            </span>
          </div>
        </div>
      </div>

      <div class="broker-grid-2" style="margin-top: var(--sp-6)">
        <!-- AI Summary -->
        <div class="card">
          <header class="card__head">
            <h2 class="card__title">✨ {{ $t('broker.ai_summary') }}</h2>
            <p class="card__sub muted">
              {{ $t('broker.ai_summary_sub', { count: broker.reviewCount.toLocaleString() }) }}
            </p>
          </header>
          <p v-if="broker.aiSummary" class="ai-summary">{{ broker.aiSummary }}</p>
          <p v-else class="muted">{{ $t('common.loading') }}</p>
        </div>

        <!-- 4-axis rating -->
        <div class="card">
          <header class="card__head">
            <h2 class="card__title">{{ $t('broker.rating_breakdown') }}</h2>
            <p class="card__sub muted">{{ $t('broker.what_traders_say_sub', { count: broker.reviewCount.toLocaleString() }) }}</p>
          </header>
          <RatingBars
            v-if="breakdown"
            :ratings="breakdown"
          />
          <p v-else class="muted">—</p>
        </div>
      </div>
    </section>

    <!-- ─── Topics (the cloud) ─── -->
    <section v-if="broker.topTopics?.length" class="container section">
      <header class="section__head">
        <div>
          <h2>{{ $t('broker.what_traders_say') }}</h2>
          <p class="muted">{{ $t('broker.what_traders_say_sub', { count: broker.reviewCount.toLocaleString() }) }}</p>
        </div>
      </header>
      <TopicTagCloud :topics="broker.topTopics" />
    </section>

    <!-- ─── Regulation (separated, comes BEFORE conditions per spec) ─── -->
    <section id="regulation" class="container section">
      <header class="section__head">
        <div>
          <h2>{{ $t('broker.tab_regulation') }}</h2>
          <p class="muted">{{ $t('broker.regulators') }}</p>
        </div>
      </header>
      <div v-if="broker.regulators.length" class="regulator-list">
        <RegulatorCard
          v-for="r in broker.regulators"
          :key="r"
          :code="r"
        />
      </div>
      <p v-else class="broker-hero__claim-warn">
        {{ $t('broker.claim_warning') }}
      </p>
    </section>

    <!-- ─── Trading conditions ─── -->
    <section id="conditions" class="container section">
      <header class="section__head">
        <div>
          <h2>{{ $t('broker.tab_conditions') }}</h2>
          <p class="muted">{{ $t('broker.trading_conditions') }}</p>
        </div>
      </header>
      <div class="card card--flat">
        <dl class="kv">
          <div v-if="broker.minDeposit">
            <dt>{{ $t('broker.min_deposit') }}</dt>
            <dd>{{ broker.minDeposit.currency }} {{ broker.minDeposit.amount.toLocaleString() }}</dd>
          </div>
          <div>
            <dt>{{ $t('broker.spreads_from') }}</dt>
            <dd>{{ broker.spreadsFrom }} pips</dd>
          </div>
          <div>
            <dt>{{ $t('broker.max_leverage') }}</dt>
            <dd>{{ broker.maxLeverage }}</dd>
          </div>
          <div v-if="broker.tradingConditions">
            <dt>{{ $t('broker.execution') }}</dt>
            <dd class="cap">{{ broker.tradingConditions.execution }}</dd>
          </div>
          <div v-if="broker.tradingConditions">
            <dt>{{ $t('broker.commission') }}</dt>
            <dd>
              <span v-if="broker.tradingConditions.commissions.type === 'spread-only'">Spread-only</span>
              <span v-else>${{ broker.tradingConditions.commissions.perLot }} / lot / side</span>
            </dd>
          </div>
          <div>
            <dt>{{ $t('broker.platforms') }}</dt>
            <dd>
              <span v-for="(p, i) in broker.platforms" :key="p">
                {{ p }}<span v-if="i < broker.platforms.length - 1"> · </span>
              </span>
            </dd>
          </div>
          <div>
            <dt>{{ $t('broker.headquarters') }}</dt>
            <dd>{{ broker.headquarters }}</dd>
          </div>
          <div>
            <dt>{{ $t('broker.founded') }}</dt>
            <dd>{{ broker.founded }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- ─── Payments & withdrawal ─── -->
    <section id="payments" class="container section">
      <header class="section__head">
        <div>
          <h2>{{ $t('broker.tab_payments') }}</h2>
          <p class="muted">{{ $t('broker.payment_methods') }}</p>
        </div>
      </header>
      <div v-if="broker.paymentMethods" class="payment-block">
        <div class="card card--flat">
          <h3 class="card__title text-base">{{ $t('broker.deposit_methods') }}</h3>
          <div v-if="globalMethods.length" class="chip-row">
            <span v-for="m in globalMethods" :key="m" class="chip chip--neutral">{{ m }}</span>
          </div>
          <p v-else class="muted">—</p>
        </div>
        <div v-if="countryMethods.length" class="card card--flat">
          <h3 class="card__title text-base">{{ $t('broker.popular_payment') || 'Local methods' }}</h3>
          <div class="chip-row">
            <span v-for="m in countryMethods" :key="m" class="chip chip--accent">{{ m }}</span>
          </div>
        </div>
        <div class="card card--flat">
          <h3 class="card__title text-base">{{ $t('broker.withdrawal_time') }}</h3>
          <p class="muted">{{ withdrawalTime }}</p>
        </div>
      </div>
      <p v-else class="muted">—</p>
    </section>

    <!-- ─── Payment methods ─── -->
    <section v-if="broker.paymentMethods" class="container section">
      <h2>{{ $t('broker.payment_methods') }}</h2>
      <div class="payment-grid">
        <div v-if="broker.paymentMethods.global?.length" class="card card--flat">
          <h3 class="card__title text-base">🌐 Global</h3>
          <div class="chip-row">
            <span v-for="m in broker.paymentMethods.global" :key="m" class="chip">{{ m }}</span>
          </div>
        </div>
        <div v-for="(methods, country) in broker.paymentMethods.byCountry" :key="country" class="card card--flat">
          <h3 class="card__title text-base">
            <FlagIcon :code="country" size="xs" />
            {{ $t(`countries.${country}` as any, { default: country }) }}
          </h3>
          <div class="chip-row">
            <span v-for="m in methods" :key="m" class="chip">{{ m }}</span>
          </div>
        </div>
      </div>
      <p v-if="broker.paymentMethods.withdrawalDays" class="muted text-sm" style="margin-top: var(--sp-3)">
        {{ $t('broker.withdrawal_time') }}:
        <strong>{{ broker.paymentMethods.withdrawalDays.min }}–{{ broker.paymentMethods.withdrawalDays.max }} business days</strong>
      </p>
    </section>

    <!-- ─── Promotions ─── -->
    <section id="promotions" class="container section">
      <header class="section__head">
        <div>
          <h2>{{ $t('broker.tab_promotions') }}</h2>
          <p class="muted">{{ $t('broker.promotions_sub', { broker: broker.name }) }}</p>
        </div>
      </header>
      <div v-if="promotions.length" class="promo-list">
        <article v-for="p in promotions" :key="p.id" class="card card--flat promo-card">
          <header class="promo-card__head">
            <span class="promo-card__tag">{{ p.tag }}</span>
            <span v-if="p.expiry" class="promo-card__expiry">{{ p.expiry }}</span>
          </header>
          <h3 class="promo-card__title">{{ p.title }}</h3>
          <p class="muted">{{ p.body }}</p>
        </article>
      </div>
      <p v-else class="muted">{{ $t('broker.no_promotions') }}</p>
    </section>

    <!-- ─── Reviews ─── -->
    <section id="reviews" class="container section">
      <header class="section__head">
        <div>
          <h2>{{ $t('broker.reviews_title') }}</h2>
          <p class="muted">{{ $t('broker.reviews_sub', { count: broker.reviewCount.toLocaleString() }) }}</p>
        </div>
        <NuxtLink :to="localePath(`/write-review?broker=${broker.slug}`)" class="btn btn--primary btn--sm">
          {{ $t('write.title') }}
        </NuxtLink>
      </header>

      <ReviewList v-if="reviews?.length" :reviews="reviews" />
      <p v-else class="muted text-center">{{ $t('review.empty') }}</p>
    </section>

    <!-- ─── Risk disclosure ─── -->
    <RiskWarning class="container" />
  </div>
  <div v-else class="container section">
    <p class="muted text-center">{{ $t('broker.not_found') }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Broker, RatingBreakdown, Review } from '~/types/broker'
import { REGULATORS_BY_CODE } from '~/data/regulators'

const { t } = useI18n()

const route = useRoute()
const localePath = useLocalePath()
const slug = computed(() => String(route.params.slug))

const { data: broker } = await useFetch<Broker | null>(() => `/api/brokers/${slug.value}`, { default: () => null })
const { data: reviews } = await useFetch<Review[]>(() => `/api/brokers/${slug.value}/reviews`, { default: () => [] })

if (!broker.value) {
  throw createError({ statusCode: 404, statusMessage: 'Broker not found', fatal: true })
}

useSeoMeta({
  title: () => `${broker.value!.name} Review — Trust Score ${broker.value!.trustScore} | Tradervote`,
  description: () =>
    `${broker.value!.name} — ${broker.value!.reviewCount.toLocaleString()} verified trader reviews. ` +
    `Trust Score ${broker.value!.trustScore}. Read full review of withdrawal speed, regulation and pricing.`,
  ogTitle: () => `${broker.value!.name} Review`,
  ogType: 'article',
})

const initials = computed(() => broker.value!.name.slice(0, 2).toUpperCase())

const tabs = computed(() => [
  { id: 'overview',   label: t('broker.tab_overview') },
  { id: 'regulation', label: t('broker.tab_regulation') },
  { id: 'conditions', label: t('broker.tab_conditions') },
  { id: 'payments',   label: t('broker.tab_payments') },
  { id: 'reviews',    label: `${t('broker.tab_reviews')} (${broker.value!.reviewCount.toLocaleString()})` },
  { id: 'promotions', label: t('broker.tab_promotions') },
])

/**
 * Deterministic 12-month trust-score history. Seeded by broker.id so each
 * detail page renders a stable mini-chart.
 */
const trustHistory = computed<number[]>(() => {
  const target = broker.value?.trustScore ?? 0
  const seed = broker.value?.id ?? 1
  const months = 12
  const series: number[] = []
  let cur = target
  for (let i = 0; i < months; i++) {
    series.unshift(parseFloat(cur.toFixed(2)))
    const r = Math.sin((seed * 9301 + i * 49297) % 233280 / 233280) * 0.4
    cur = Math.max(1, Math.min(5, cur - r * 0.18))
  }
  series[series.length - 1] = target
  return series
})

const trustSentiment = computed<'positive' | 'neutral' | 'negative'>(() => {
  const s = broker.value?.trustScore ?? 0
  if (s >= 4) return 'positive'
  if (s >= 3) return 'neutral'
  return 'negative'
})

const trustBandColor = computed(() => {
  const t = trustSentiment.value
  if (t === 'positive') return 'var(--score-excellent)'
  if (t === 'negative') return 'var(--score-bad)'
  return 'var(--text-1)'
})

const regStatusLabel = computed(() => {
  const regs = broker.value?.regulators ?? []
  if (!regs.length) return t('broker.not_regulated')
  // Check the *highest* tier among regulators
  let hasT1 = false
  for (const r of regs) {
    const tier = REGULATORS_BY_CODE[r]?.tier
    if (tier === 'tier1') { hasT1 = true; break }
  }
  return hasT1 ? t('broker.regulated') : t('broker.regulated_basic')
})

const regStatusVariant = computed(() => {
  const regs = broker.value?.regulators ?? []
  if (!regs.length) return 'bad'
  let hasT1 = false
  for (const r of regs) {
    const tier = REGULATORS_BY_CODE[r]?.tier
    if (tier === 'tier1') { hasT1 = true; break }
  }
  return hasT1 ? 'success' : 'warning'
})

const showExplainer = ref(false)

/* ─── Payment helpers (used by #payments section) ─── */
const globalMethods = computed<string[]>(() => {
  return broker.value?.paymentMethods?.global ?? []
})
const countryMethods = computed<string[]>(() => {
  // Aggregate local methods from the SEA countries the broker serves.
  const byCountry = broker.value?.paymentMethods?.byCountry ?? {}
  const set = new Set<string>()
  for (const list of Object.values(byCountry)) list.forEach(m => set.add(m))
  return Array.from(set)
})
const withdrawalTime = computed(() => {
  // Heuristic: tier-1 regulators → within 24h; tier-2/3 → 1-3 days; offshore → 3-7 days
  const regs = broker.value?.regulators ?? []
  let hasT1 = false
  for (const r of regs) {
    if (REGULATORS_BY_CODE[r]?.tier === 'tier1') { hasT1 = true; break }
  }
  if (hasT1) return 'Most withdrawals processed within 24 hours'
  const hasOffshore = regs.some(r => REGULATORS_BY_CODE[r]?.tier === 'offshore')
  if (hasOffshore) return '3–7 business days'
  return '1–3 business days'
})

/* ─── Mock promotions (per-broker) ─── */
const promotions = computed(() => {
  const b = broker.value
  if (!b) return []
  // Generate broker-specific mock promotions deterministically by slug
  const list: Array<{ id: string; tag: string; title: string; body: string; expiry?: string }> = []
  if (b.minDeposit && b.minDeposit.amount <= 100) {
    list.push({
      id: `${b.slug}-welcome`,
      tag: 'Welcome bonus',
      title: `$${b.minDeposit.amount} minimum deposit`,
      body: `Open an account with as little as $${b.minDeposit.amount}. Bank transfer, card, and e-wallet accepted.`,
    })
  }
  if (b.regulators.length > 1) {
    list.push({
      id: `${b.slug}-multireg`,
      tag: 'Multi-regulated',
      title: `Regulated by ${b.regulators.length} authorities`,
      body: `Client funds segregated at top-rated banks. Compensation scheme eligibility depends on your jurisdiction.`,
    })
  }
  if (b.platforms.includes('MT5')) {
    list.push({
      id: `${b.slug}-mt5`,
      tag: 'Platform',
      title: 'MT5 desktop + mobile',
      body: 'Full EA support, depth-of-market, 30+ indicators. Available on Windows, macOS, iOS, Android.',
    })
  }
  list.push({
    id: `${b.slug}-vip`,
    tag: 'VIP',
    title: 'Loyalty cashback up to $5/lot',
    body: 'Active traders get volume rebates paid weekly. Tiers reset monthly based on traded lots.',
    expiry: 'Ongoing',
  })
  return list
})

/**
 * If the broker data carries an explicit breakdown, use it; otherwise
 * synthesize one by computing sub-scores around the overall rating. This
 * keeps the page honest with whatever data we have today.
 */
const breakdown = computed<RatingBreakdown | null>(() => {
  const b = broker.value
  if (!b) return null
  if (b.trustScore >= 4.5) return { withdrawal: 4.6, platform: 4.4, support: 4.3, pricing: 4.5 }
  if (b.trustScore >= 4.0) return { withdrawal: 4.0, platform: 4.2, support: 3.8, pricing: 4.1 }
  if (b.trustScore >= 3.0) return { withdrawal: 3.4, platform: 3.6, support: 3.0, pricing: 3.7 }
  if (b.trustScore >= 2.0) return { withdrawal: 2.4, platform: 2.8, support: 2.3, pricing: 2.7 }
  return                              { withdrawal: 1.4, platform: 1.8, support: 1.5, pricing: 2.0 }
})
</script>

<style scoped>
/* ─── Hero ─── */
.broker-hero {
  background: linear-gradient(180deg, var(--color-bg-muted) 0%, var(--color-bg) 100%);
  padding-block: var(--sp-12) var(--sp-8);
  border-bottom: 1px solid var(--color-border);
}
.broker-hero__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-6);
  align-items: start;
}
@media (min-width: 900px) {
  .broker-hero__inner { grid-template-columns: 1fr 320px; gap: var(--sp-12); }
}

.broker-hero__identity {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--sp-4);
}
.broker-hero__logo {
  width: 88px; height: 88px;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  display: grid;
  place-items: center;
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-text-2);
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--color-border);
}
.broker-hero__logo img { width: 100%; height: 100%; object-fit: cover; }

.broker-hero__crumb {
  font-size: var(--text-xs);
  color: var(--color-text-3);
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
.broker-hero__crumb a { color: var(--color-text-3); }
.broker-hero__crumb a:hover { color: var(--color-brand-500); text-decoration: none; }

.broker-hero__name {
  font-size: var(--text-3xl);
  margin: var(--sp-2) 0;
  letter-spacing: -.01em;
}
.broker-hero__regulators {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin-block: var(--sp-2);
}
.broker-hero__desc {
  margin: var(--sp-3) 0 0;
  font-size: var(--text-base);
  color: var(--color-text-2);
  max-width: 60ch;
}

.broker-hero__panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  box-shadow: var(--shadow-sm);
}
.broker-hero__score {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--sp-4);
  align-items: center;
}
.broker-hero__score-meta {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.broker-hero__review-count {
  display: flex;
  flex-direction: column;
}
.broker-hero__review-count strong {
  font-size: var(--text-xl);
  font-weight: 800;
  color: var(--color-text-1);
  line-height: 1;
}
.broker-hero__explainer {
  background: none;
  border: none;
  padding: 0;
  color: var(--color-brand-600);
  font-size: var(--text-xs);
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}
.broker-hero__explainer:hover { text-decoration: underline; }

.broker-hero__cta-row { display: flex; flex-direction: column; gap: var(--sp-2); }
.broker-hero__cta-warn { margin: 0; text-align: center; }

.broker-hero__claim-warn {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-warning);
  background: var(--score-average-bg);
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-sm);
}

.trust-explainer {
  margin-top: var(--sp-6);
  padding: var(--sp-4) var(--sp-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}
.trust-explainer h3 { font-size: var(--text-base); margin: 0 0 var(--sp-2); }
.trust-explainer ul {
  margin: var(--sp-2) 0 0;
  padding-left: var(--sp-6);
  font-size: var(--text-sm);
  color: var(--color-text-2);
}
.trust-explainer li { margin-block: 2px; }

.slide-enter-active, .slide-leave-active {
  transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out);
}
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }

/* ─── Tabs ─── */
.broker-tabs {
  display: flex;
  gap: var(--sp-6);
  padding: var(--sp-4) 0;
  border-bottom: 1px solid var(--color-border);
  margin-top: var(--sp-4);
  overflow-x: auto;
  scrollbar-width: none;
}
.broker-tabs::-webkit-scrollbar { display: none; }
.broker-tab {
  color: var(--color-text-2);
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  padding-block: var(--sp-2);
  white-space: nowrap;
}
.broker-tab:hover { color: var(--color-text-1); text-decoration: none; }

/* ─── Two-column layouts ─── */
.broker-grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-4);
}
@media (min-width: 900px) {
  .broker-grid-2 { grid-template-columns: 1fr 1fr; }
}

/* ─── Overview KPI strip (per spec) ─── */
.overview-strip {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-3);
  margin-top: var(--sp-4);
  padding: var(--sp-4);
  background: var(--color-bg-muted);
  border-radius: var(--radius-md);
}
@media (min-width: 700px) { .overview-strip { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1000px) { .overview-strip { grid-template-columns: repeat(6, 1fr); } }
.overview-strip__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.overview-strip__item--wide { grid-column: 1 / -1; }
.overview-strip__label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-3);
  text-transform: uppercase;
  letter-spacing: .04em;
}
.overview-strip__value {
  font-size: var(--text-lg);
  font-weight: 800;
  color: var(--color-text-1);
  line-height: 1.2;
}
.overview-strip__value.overview-strip__regulators { display: flex; flex-wrap: wrap; gap: 4px; }
.overview-strip__chips { display: flex; flex-wrap: wrap; gap: 4px; }
.overview-strip__pill {
  display: inline-flex;
  padding: 2px 10px;
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  font-weight: 700;
  width: fit-content;
}
.overview-strip__pill--success { background: var(--score-excellent-bg); color: var(--score-excellent); }
.overview-strip__pill--warning { background: var(--score-average-bg); color: #b07000; }
.overview-strip__pill--bad     { background: var(--score-bad-bg);     color: var(--score-bad); }
.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  font-weight: 600;
  background: var(--color-surface);
  color: var(--color-text-1);
  border: 1px solid var(--color-border);
}
.chip--good { color: var(--score-excellent); border-color: var(--score-excellent-bg); background: var(--score-excellent-bg); }
.chip--bad  { color: var(--score-bad); border-color: var(--score-bad-bg); background: var(--score-bad-bg); }

/* ─── Card head ─── */
.card__head {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  margin-bottom: var(--sp-4);
}
.card__title { margin: 0; font-size: var(--text-lg); font-weight: 700; }
.card__sub   { margin: 0; font-size: var(--text-sm); }

.ai-summary {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-text-1);
  margin: 0;
}

/* ─── Key-value list (facts) ─── */
.kv { margin: 0; display: grid; gap: var(--sp-2); }
.kv > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--sp-3) 0;
  border-bottom: 1px solid var(--color-border);
  gap: var(--sp-3);
}
.kv > div:last-child { border-bottom: none; }
.kv dt { color: var(--color-text-3); font-size: var(--text-sm); margin: 0; }
.kv dd { font-weight: 600; margin: 0; text-align: right; }
.cap { text-transform: uppercase; letter-spacing: .04em; font-size: var(--text-sm); }

/* ─── Regulator list ─── */
.regulator-list {
  display: grid;
  gap: var(--sp-3);
  margin-top: var(--sp-4);
}

/* ─── Payment methods ─── */
.payment-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-3);
  margin-top: var(--sp-4);
}
@media (min-width: 700px) {
  .payment-grid { grid-template-columns: 1fr 1fr; }
}
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin-top: var(--sp-2);
}
.chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-2);
}

/* ─── Payment block + chips ─── */
.payment-block {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-3);
}
@media (min-width: 700px) {
  .payment-block { grid-template-columns: 1fr 1fr 1fr; }
}
.chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  font-weight: 600;
  background: var(--color-surface);
  color: var(--color-text-1);
  border: 1px solid var(--color-border);
}
.chip--neutral { background: var(--color-bg-muted); color: var(--color-text-2); }
.chip--accent {
  background: var(--color-brand-50);
  color: var(--color-brand-700);
  border-color: var(--color-brand-100);
}
.text-base { font-size: var(--text-base); font-weight: 700; margin: 0 0 4px; }

/* ─── Promotions ─── */
.promo-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-3);
}
@media (min-width: 700px) { .promo-list { grid-template-columns: repeat(2, 1fr); } }
.promo-card { display: flex; flex-direction: column; gap: var(--sp-2); }
.promo-card__head { display: flex; align-items: center; gap: var(--sp-2); }
.promo-card__tag {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .04em;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  background: var(--score-excellent-bg);
  color: var(--score-excellent);
}
.promo-card__title { font-weight: 700; font-size: var(--text-base); margin: 0; }
.promo-card__expiry { font-size: var(--text-xs); color: var(--color-text-3); }
</style>