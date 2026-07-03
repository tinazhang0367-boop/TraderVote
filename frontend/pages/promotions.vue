<template>
  <div>
    <section class="promo-hero">
      <div class="container promo-hero__inner">
        <h1>🎁 {{ $t('promo.title') }}</h1>
        <p>{{ $t('promo.subtitle') }}</p>
      </div>
    </section>

    <div class="container section">
      <div v-if="pending" class="loading">{{ $t('common.loading') }}</div>
      <div v-else class="promo-grid">
        <PromoCard v-for="p in promos" :key="p.id" :promotion="p" />
      </div>
      <div v-if="!pending && !promos?.length" class="empty">{{ $t('promo.empty') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Promotion } from '~/types/broker'

const { data: promos, pending } = await useFetch<Promotion[]>('/api/promotions', { default: () => [] })

useSeoMeta({
  title: 'Active Broker Promotions — Tradervote',
  description: 'Up to $1,500 welcome bonuses, cashback and free withdrawals from verified brokers.',
})
</script>

<style scoped>
.promo-hero { background: linear-gradient(135deg, var(--color-brand-500), #7c3aed); color: #fff; padding: var(--sp-12) 0; }
.promo-hero__inner h1 { font-size: var(--text-4xl); }
.promo-hero__inner p { color: #c9d4ff; margin-top: var(--sp-2); }
.section { padding: var(--sp-12) 0; }
.promo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--sp-4); }
.loading, .empty { padding: var(--sp-12); text-align: center; color: var(--color-text-3); }
</style>
