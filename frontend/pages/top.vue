<template>
  <div class="container section">
    <header class="top-head">
      <h1>{{ $t('top.title') }} — {{ currentMonth }}</h1>
      <p class="top-sub">{{ $t('top.subtitle', { count: brokers?.length ?? 0 }) }}</p>
    </header>

    <div v-if="pending" class="loading">{{ $t('common.loading') }}</div>
    <ol v-else class="top-list">
      <li v-for="b in brokers" :key="b.id" class="top-row">
        <span class="top-row__rank" :style="{ background: rankColor(b.trustScore) }">{{ b.rank }}</span>
        <NuxtLink :to="localePath(`/brokers/${b.slug}`)" class="top-row__main">
          <img v-if="b.logoUrl" :src="b.logoUrl" :alt="b.name" width="48" height="48" class="top-row__logo" />
          <span v-else class="top-row__logo-fallback">{{ b.name.slice(0, 2) }}</span>
          <span>
            <strong>{{ b.name }}</strong>
            <small>{{ b.regulators.join(' · ') }}</small>
          </span>
        </NuxtLink>
        <TrustScore :score="b.trustScore" :show-label="false" :review-count="b.reviewCount" />
        <NuxtLink :to="localePath(`/brokers/${b.slug}`)" class="top-row__cta">
          {{ $t('broker.read_review') }}
        </NuxtLink>
      </li>
    </ol>

    <section class="methodology">
      <h2>{{ $t('top.methodology_title') }}</h2>
      <p>{{ $t('top.methodology_intro') }}</p>
      <ul>
        <li>40% — {{ $t('top.weight_reviews') }}</li>
        <li>25% — {{ $t('top.weight_regulation') }}</li>
        <li>20% — {{ $t('top.weight_withdrawal') }}</li>
        <li>15% — {{ $t('top.weight_spreads') }}</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Broker } from '~/types/broker'
import { bandFromScore, TRUST_BAND_COLOR } from '~/utils/trust-score'

const localePath = useLocalePath()
const { t } = useI18n()

const { data: brokers, pending } = await useFetch<Broker[]>('/api/brokers/top', { default: () => [] })

useSeoMeta({
  title: () => `${t('top.title')} | Tradervote`,
  description: () => t('top.subtitle', { count: brokers.value?.length ?? 0 }),
})

const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

function rankColor(score: number) { return TRUST_BAND_COLOR[bandFromScore(score)] }
</script>

<style scoped>
.section { padding: var(--sp-12) 0; }
.top-head { margin-bottom: var(--sp-8); }
.top-sub { color: var(--color-text-3); margin-top: var(--sp-2); }
.top-list { list-style: none; padding: 0; margin: 0; display: grid; gap: var(--sp-3); }
.top-row { display: grid; grid-template-columns: 48px 1fr auto auto; align-items: center; gap: var(--sp-4); background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--sp-3) var(--sp-4); }
.top-row__rank { width: 48px; height: 48px; border-radius: var(--radius-md); color: #fff; font-weight: 800; font-size: var(--text-xl); display: grid; place-items: center; }
.top-row__main { display: flex; align-items: center; gap: var(--sp-3); text-decoration: none; color: var(--color-text-1); }
.top-row__main:hover { text-decoration: none; }
.top-row__main strong { display: block; }
.top-row__main small { color: var(--color-text-3); font-size: var(--text-xs); }
.top-row__logo, .top-row__logo-fallback { width: 48px; height: 48px; border-radius: var(--radius-md); background: var(--color-bg-muted); }
.top-row__logo-fallback { display: grid; place-items: center; font-weight: 700; }
.top-row__cta { background: var(--color-brand-500); color: #fff; padding: 10px 16px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 600; text-decoration: none; }
.top-row__cta:hover { background: var(--color-brand-600); text-decoration: none; }
.methodology { background: var(--color-bg-muted); padding: var(--sp-6); border-radius: var(--radius-lg); margin-top: var(--sp-12); }
.methodology ul { padding-left: var(--sp-6); color: var(--color-text-2); }
.loading { padding: var(--sp-12); text-align: center; color: var(--color-text-3); }
</style>
