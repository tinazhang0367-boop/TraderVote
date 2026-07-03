<template>
  <div class="home">
    <!-- ═══ 0. TRUST STRIP (slogan band) ═══ -->
    <aside class="trust-strip" aria-label="Trust statement">
      <div class="container trust-strip__inner">
        <span class="trust-strip__slogan">
          <strong class="trust-strip__slogan--white">Trusted by Traders.</strong>
          <span class="trust-strip__slogan--teal">Driven by Votes.</span>
        </span>
        <span class="trust-strip__sep" aria-hidden="true">·</span>
        <span class="trust-strip__sub">
          <span class="tabular-nums">{{ stats.reviews.toLocaleString() }}</span> verified reviews
        </span>
      </div>
    </aside>

    <!-- ═══ 1. HERO SEARCH — full-width banner with centered content ═══ -->
    <section class="hero">
      <div class="hero__bg" aria-hidden="true">
        <HeroAmbient />
      </div>

      <div class="hero__inner">
        <div class="hero__content">
          <p class="hero__eyebrow">Forex / CFD Broker Trust Intelligence</p>
          <h1 class="hero__title">找到值得信任的外汇/CFD 经纪商</h1>
          <p class="hero__sub">查询监管牌照、真实交易者评测和交易条件，快速判断经纪商是否可靠。</p>

          <form class="hero__search" @submit.prevent="onSearch">
            <span class="hero__search-icon" aria-hidden="true">Search</span>
            <input
              v-model="searchQ"
              type="search"
              class="hero__search-input"
              placeholder="搜索经纪商、监管机构、牌照号或国家"
              aria-label="搜索经纪商、监管机构、牌照号或国家"
            >
            <button type="submit" class="btn btn--primary hero__search-btn">
              搜索
            </button>
          </form>

          <!-- Quick filter chips -->
          <div class="hero__quick">
            <span class="hero__quick-label">快速筛选</span>
            <NuxtLink
              v-for="chip in quickFilters"
              :key="chip.query"
              :to="localePath(`/brokers?${chip.query}`)"
              class="hero__chip"
            >
              {{ chip.label }}
            </NuxtLink>
          </div>

        </div>

        <aside class="hero-ai" aria-label="AI broker diagnosis assistant">
          <img
            class="hero-ai__image"
            :src="aiHeroImage"
            alt="TraderVote AI 智能诊断助手"
          >
          <div class="hero-ai__panel">
            <p class="hero-ai__eyebrow">AI Broker Diagnosis</p>
            <h2>AI 经纪商诊断</h2>
            <p>监管、评测、出入金风险，一次看懂。</p>
            <div class="hero-ai__chips" aria-label="AI diagnosis capabilities">
              <span>监管核验</span>
              <span>评测摘要</span>
              <span>风险提示</span>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <!-- ═══ 2. THIS MONTH'S TOP BROKERS ═══ -->
    <section class="container section">
      <header class="section__head">
        <div>
          <h2>{{ $t('home.top_title') }}</h2>
          <p class="muted">{{ $t('home.top_sub') }}</p>
        </div>
        <NuxtLink :to="localePath('/top')" class="section__link">
          {{ $t('home.view_all_brokers') }} →
        </NuxtLink>
      </header>
      <div class="broker-grid">
        <BrokerCard v-for="b in topBrokers" :key="b.id" :broker="b" :rank="b.rank" />
      </div>
    </section>

    <!-- ═══ 3. BY REGULATOR ═══ -->
    <section class="container section">
      <header class="section__head">
        <div>
          <h2>{{ $t('home.by_regulator_title') }}</h2>
          <p class="muted">{{ $t('home.by_regulator_sub') }}</p>
        </div>
        <NuxtLink :to="localePath('/regulators')" class="section__link">
          {{ $t('home.view_all_regulators') }} →
        </NuxtLink>
      </header>
      <div class="reg-grid">
        <NuxtLink
          v-for="r in featuredRegulators"
          :key="r.code"
          :to="localePath(`/regulators/${r.code}`)"
          class="reg-tile card card--hover"
        >
          <div class="reg-tile__head">
            <RegulatorBadge :code="r.code" />
            <span v-if="r.brokerCount" class="reg-tile__count tabular-nums">{{ r.brokerCount }}</span>
          </div>
          <div class="reg-tile__name">{{ r.shortName ?? r.name }}</div>
          <p class="reg-tile__desc muted">{{ r.description }}</p>
        </NuxtLink>
      </div>
    </section>

    <!-- ═══ 4. CORE CONDITIONS COMPARISON (Forex / CFD) ═══ -->
    <section class="container section">
      <header class="section__head">
        <div>
          <h2>{{ $t('home.compare_title') }}</h2>
          <p class="muted">{{ $t('home.compare_sub') }}</p>
        </div>
      </header>
      <div class="cat-grid">
        <NuxtLink :to="localePath('/category/forex')" class="cat-tile card card--hover">
          <div class="cat-tile__icon" style="background: rgba(22, 82, 240, .12)">💱</div>
          <div class="cat-tile__body">
            <h3 class="cat-tile__title">{{ $t('home.cat_forex') }}</h3>
            <p class="cat-tile__sub muted">{{ $t('home.cat_forex_sub') }}</p>
          </div>
        </NuxtLink>
        <NuxtLink :to="localePath('/category/cfd')" class="cat-tile card card--hover">
          <div class="cat-tile__icon" style="background: rgba(156, 39, 176, .12)">📊</div>
          <div class="cat-tile__body">
            <h3 class="cat-tile__title">{{ $t('home.cat_cfd') }}</h3>
            <p class="cat-tile__sub muted">{{ $t('home.cat_cfd_sub') }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ═══ 5. RECENT REVIEWS ═══ -->
    <section class="container section">
      <header class="section__head">
        <div>
          <h2>{{ $t('home.reviews_title') }}</h2>
          <p class="muted">{{ $t('home.reviews_sub') }}</p>
        </div>
        <NuxtLink :to="localePath('/reviews')" class="section__link">
          {{ $t('home.view_all_reviews') }} →
        </NuxtLink>
      </header>
      <ReviewList :reviews="latestReviews" />
    </section>

    <!-- ═══ 6. METHODOLOGY / TRUST ═══ -->
    <section class="container section">
      <div class="method-card card card--flat">
        <div class="method-card__icon" aria-hidden="true">⚖️</div>
        <div>
          <h2 class="method-card__title">{{ $t('home.method_title') }}</h2>
          <p class="muted">{{ $t('home.method_sub') }}</p>
          <ul class="method-list">
            <li><strong>{{ $t('home.method_weight_reviews') }}</strong></li>
            <li><strong>{{ $t('home.method_weight_regulation') }}</strong></li>
            <li><strong>{{ $t('home.method_weight_withdrawal') }}</strong></li>
            <li><strong>{{ $t('home.method_weight_spreads') }}</strong></li>
          </ul>
          <NuxtLink :to="localePath('/methodology')" class="btn btn--ghost btn--sm">
            {{ $t('home.method_more') }} →
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Review } from '~/types/broker'
import { BROKERS } from '~/data/brokers'
import { REGULATORS } from '~/data/regulators'

const localePath = useLocalePath()
const aiHeroImage = '/images/hero/ai-trust-secretary.png'

useHead({
  title: 'Tradervote — 外汇/CFD 经纪商监管查询与真实评测',
  meta: [
    { name: 'description', content: '查询 FCA、ASIC、CySEC 等监管牌照，浏览真实交易者评测，对比交易条件、外汇经纪商是否可靠。' },
    { property: 'og:title', content: 'Tradervote — 外汇/CFD 经纪商监管查询' },
    { property: 'og:description', content: '真实交易者评测 · 监管牌照验证 · 交易条件对比' },
  ],
})

const searchQ = ref('')
function onSearch() {
  const q = searchQ.value.trim()
  if (!q) return
  navigateTo({ path: localePath('/brokers'), query: { q } })
}

const quickFilters = [
  { label: 'FCA 监管',     query: 'regulator=FCA' },
  { label: 'ASIC 监管',    query: 'regulator=ASIC' },
  { label: 'CySEC 监管',   query: 'regulator=CySEC' },
]

const stats = computed(() => ({
  reviews: 12_847,
  brokers: 380,
  regulators: REGULATORS.length,
}))

const topBrokers = computed(() =>
  BROKERS.filter(b => b.rank && b.rank <= 5).sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99)),
)

const featuredRegulators = computed(() => {
  const byTier: Record<string, typeof REGULATORS[number][]> = { tier1: [], tier2: [], tier3: [], offshore: [] }
  REGULATORS.forEach(r => byTier[r.tier]?.push(r))
  const pick = (n: number) => (arr: typeof REGULATORS[number][]) => arr.slice(0, n)
  // Show: top 4 Tier-1 + top 2 Tier-2 + 1 Tier-3 + 1 offshore
  return [
    ...pick(4)(byTier.tier1),
    ...pick(2)(byTier.tier2),
    ...pick(1)(byTier.tier3),
    ...pick(1)(byTier.offshore),
  ].map((r, i) => ({ ...r, brokerCount: 50 - i * 3 }))
})

const { data: latestReviewsData } = await useFetch<Review[]>('/api/reviews/latest', {
  default: () => [],
})
const latestReviews = computed<Review[]>(() => (latestReviewsData.value ?? []).slice(0, 4))
</script>

<style scoped>
/* ─── Trust strip — slim slogan band above hero ─── */
.trust-strip {
  display: none;
  background: var(--color-bg-muted);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--text-xs);
  color: var(--color-text-2);
  padding-block: 8px;
}
.trust-strip__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--sp-2);
  text-align: center;
}
.trust-strip__slogan {
  font-weight: 500;
  letter-spacing: .01em;
}
.trust-strip__slogan strong { font-weight: 700; color: var(--color-text-1); }
.trust-strip__slogan--white { color: var(--color-text-1, #0F172A); font-weight: 700; }    /* dark text, NOT gold */
.trust-strip__slogan--teal  { color: #14B8A6; font-weight: 700; margin-left: 4px; }       /* teal — matches logo V */
.trust-strip__sep {
  color: var(--color-border-strong);
  opacity: .6;
}
.trust-strip__sub {
  font-weight: 500;
  color: var(--color-text-3);
}
@media (max-width: 480px) {
  .trust-strip__sep,
  .trust-strip__sub { display: none; }
}

/* ─── Hero — full-width banner with centered inner content ─── */
.hero {
  background:
    linear-gradient(110deg, rgba(6, 17, 31, .96) 0%, rgba(8, 22, 38, .92) 42%, rgba(10, 34, 48, .78) 68%, rgba(9, 20, 34, .96) 100%),
    linear-gradient(135deg, #06111f 0%, #0f172a 48%, #111827 100%);
  padding-block: clamp(var(--sp-10), 6vw, var(--sp-16));
  text-align: left;
  position: relative;
  border-bottom: 1px solid rgba(148, 163, 184, .18);
  overflow: hidden;
  width: 100%;
  color: #f8fafc;
}
.hero::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 46%;
  background: linear-gradient(180deg, transparent, rgba(5, 12, 24, .72));
  pointer-events: none;
  z-index: 0;
}
.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.hero-ambient,
.hero__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: .6;
}
.hero__inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--sp-4);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--sp-4);
  align-items: center;
  min-height: clamp(520px, 62vw, 660px);
}
.hero__content {
  position: relative;
  z-index: 3;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sp-4);
}
@media (min-width: 1024px) {
  .hero__inner {
    grid-template-columns: minmax(0, 1fr);
    padding-inline: var(--sp-6);
  }
  .hero__title { font-size: clamp(2.75rem, 5vw, 4.25rem); letter-spacing: 0; }
  .hero__sub { font-size: 1.125rem; max-width: 64ch; }
  .hero-ai {
    position: absolute;
    top: calc(var(--sp-8) * -1);
    right: calc((var(--container-max) - 100vw) / 2);
    bottom: calc(var(--sp-8) * -1);
    width: min(64vw, 860px);
    min-height: auto;
    margin: 0;
    z-index: 1;
  }
  .hero-ai__panel {
    right: clamp(var(--sp-6), 10vw, 160px);
  }
  .hero-ai__image {
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 26%, #000 100%);
    mask-image: linear-gradient(90deg, transparent 0%, #000 26%, #000 100%);
  }
  .hero-ai::after {
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 26%, #000 100%);
    mask-image: linear-gradient(90deg, transparent 0%, #000 26%, #000 100%);
  }
}
.hero__eyebrow {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #5eead4;
}
.hero__title {
  font-size: clamp(2rem, 5vw, 3.25rem);
  max-width: 14ch;
  margin: 0;
  letter-spacing: 0;
  color: #f8fafc;
}
.hero__sub {
  margin: 0;
  font-size: var(--text-base);
  color: #cbd5e1;
  max-width: 54ch;
  line-height: var(--leading-relaxed);
}

.hero__search {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 680px;
  background: rgba(248, 250, 252, .92);
  border: 1px solid rgba(255,255,255,.50);
  border-radius: var(--radius-md);
  padding: 4px 4px 4px var(--sp-4);
  margin-top: var(--sp-3);
  box-shadow: 0 24px 64px rgba(0, 0, 0, .28), 0 0 0 1px rgba(94, 234, 212, .10);
  backdrop-filter: blur(14px) saturate(130%);
  -webkit-backdrop-filter: blur(14px) saturate(130%);
  transition: box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-fast) var(--ease-out);
}
.hero__search:focus-within {
  box-shadow: var(--shadow-md);
  border-color: var(--color-brand-500);
}
.hero__search-icon {
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--color-text-3);
  margin-right: var(--sp-2);
}
.hero__search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--text-base);
  padding: 10px 4px;
  outline: none;
  min-width: 0;
}
.hero__search-btn {
  flex-shrink: 0;
  border-radius: var(--radius-sm);
}

.hero__quick {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: var(--sp-2);
  margin-top: var(--sp-2);
  font-size: var(--text-sm);
}
.hero__quick-label { color: var(--color-text-3); }
.hero__chip {
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.16);
  color: #e2e8f0;
  font-size: var(--text-xs);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--dur-fast) var(--ease-out);
}
.hero__chip:hover {
  border-color: rgba(94, 234, 212, .6);
  background: rgba(20, 184, 166, .14);
  color: #ffffff;
  text-decoration: none;
}

.hero__stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: var(--sp-2);
  margin: var(--sp-3) 0 0;
  font-size: var(--text-sm);
  color: #94a3b8;
}
.hero__stats span {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.10);
}
.hero__stats strong { color: #f8fafc; font-weight: 800; }
.hero__stats-sep { color: var(--color-border-strong); }

.hero-ai {
  position: relative;
  min-height: clamp(420px, 52vw, 620px);
  overflow: visible;
  margin-left: clamp(-80px, -7vw, -24px);
  background: transparent;
  color: #f8fafc;
  isolation: isolate;
}
.hero-ai::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(90deg, transparent 0%, rgba(6, 17, 31, .34) 26%, rgba(6, 17, 31, .02) 58%),
    linear-gradient(180deg, rgba(7, 17, 31, .04) 18%, rgba(7, 17, 31, .32) 68%, rgba(7, 17, 31, .86) 100%);
  pointer-events: none;
}
.hero-ai__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: .9;
  transform: scale(1.08);
}
.hero-ai__panel {
  position: absolute;
  right: clamp(var(--sp-3), 4vw, var(--sp-8));
  bottom: clamp(var(--sp-4), 5vw, var(--sp-8));
  left: auto;
  z-index: 2;
  display: grid;
  gap: 8px;
  width: min(360px, 86%);
  padding: var(--sp-4);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: var(--radius-md);
  background: rgba(8, 13, 26, .50);
  backdrop-filter: blur(18px) saturate(145%);
  -webkit-backdrop-filter: blur(18px) saturate(145%);
}
.hero-ai__eyebrow {
  margin: 0;
  color: #5eead4;
  font-size: var(--text-xs);
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.hero-ai h2 {
  margin: 0;
  color: #f8fafc;
  font-size: clamp(1.35rem, 2vw, 1.75rem);
  letter-spacing: 0;
}
.hero-ai p {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.65;
}
.hero-ai__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 2px;
}
.hero-ai__chips span {
  padding: 6px 10px;
  border: 1px solid rgba(94, 234, 212, .28);
  border-radius: var(--radius-sm);
  background: rgba(20, 184, 166, .12);
  color: #ecfeff;
  font-size: var(--text-xs);
  font-weight: 700;
}
@media (min-width: 1024px) {
  .hero-ai {
    position: absolute;
    top: calc(var(--sp-8) * -1);
    right: calc((var(--container-max) - 100vw) / 2);
    bottom: calc(var(--sp-8) * -1);
    width: min(64vw, 860px);
    min-height: auto;
    margin: 0;
    z-index: 1;
  }
  .hero-ai__panel {
    right: clamp(var(--sp-6), 10vw, 160px);
  }
  .hero-ai__image {
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 26%, #000 100%);
    mask-image: linear-gradient(90deg, transparent 0%, #000 26%, #000 100%);
  }
  .hero-ai::after {
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 26%, #000 100%);
    mask-image: linear-gradient(90deg, transparent 0%, #000 26%, #000 100%);
  }
}
@media (max-width: 1023px) {
  .hero {
    text-align: center;
  }
  .hero__inner {
    min-height: auto;
  }
  .hero__content {
    align-items: center;
    margin-inline: auto;
  }
  .hero__quick,
  .hero__stats {
    justify-content: center;
  }
  .hero-ai {
    width: min(560px, 100%);
    margin: var(--sp-2) auto 0;
  }
  .hero-ai::after {
    background:
      linear-gradient(180deg, rgba(7, 17, 31, .04) 18%, rgba(7, 17, 31, .34) 66%, rgba(7, 17, 31, .88) 100%),
      linear-gradient(90deg, rgba(7, 17, 31, .24), rgba(7, 17, 31, .02), rgba(7, 17, 31, .24));
    -webkit-mask-image: none;
    mask-image: none;
  }
  .hero-ai__image {
    -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 12%, #000 100%);
    mask-image: linear-gradient(180deg, transparent 0%, #000 12%, #000 100%);
  }
  .hero-ai__panel {
    right: var(--sp-4);
    left: var(--sp-4);
    width: auto;
  }
}

@media (max-width: 640px) {
  .hero-ai {
    min-height: 380px;
  }
  .hero-ai__panel {
    right: var(--sp-3);
    bottom: var(--sp-3);
    left: var(--sp-3);
    padding: var(--sp-3);
  }
}

/* ─── Grids ─── */
.broker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--sp-3);
}

.reg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--sp-3);
}
.reg-tile {
  display: grid;
  gap: var(--sp-2);
  padding: var(--sp-4);
  text-decoration: none;
  color: var(--color-text-1);
}
.reg-tile:hover { text-decoration: none; }
.reg-tile__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.reg-tile__count {
  font-size: var(--text-xs);
  color: var(--color-text-3);
  font-weight: 600;
}
.reg-tile__name {
  font-weight: 700;
  font-size: var(--text-base);
}
.reg-tile__desc {
  margin: 0;
  font-size: var(--text-xs);
  line-height: var(--leading-snug);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--sp-3);
}
.cat-tile {
  display: grid;
  grid-template-columns: 56px 1fr;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-4) var(--sp-6);
  text-decoration: none;
  color: var(--color-text-1);
}
.cat-tile:hover { text-decoration: none; }
.cat-tile__icon {
  width: 48px; height: 48px;
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
  font-size: 22px;
}
.cat-tile__body { display: flex; flex-direction: column; gap: 2px; }
.cat-tile__title { font-size: var(--text-base); font-weight: 700; margin: 0; }
.cat-tile__sub { margin: 0; font-size: var(--text-sm); }

.method-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--sp-6);
  align-items: start;
  padding: var(--sp-6);
}
.method-card__icon {
  font-size: var(--text-3xl);
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  background: var(--color-brand-50);
  border-radius: var(--radius-md);
}
.method-card__title { margin: 0 0 var(--sp-1); font-size: var(--text-lg); }
.method-list {
  list-style: none;
  padding: 0;
  margin: var(--sp-3) 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-2);
  font-size: var(--text-sm);
  color: var(--color-text-2);
}
.method-list li {
  padding-left: var(--sp-4);
  position: relative;
}
.method-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--score-excellent);
  font-weight: 700;
}
@media (max-width: 600px) {
  .method-list { grid-template-columns: 1fr; }
  .method-card { grid-template-columns: 1fr; }
}
</style>
