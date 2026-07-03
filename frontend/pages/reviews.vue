<template>
  <div class="container section">
    <header class="page-head">
      <h1>{{ $t('reviews.title') }}</h1>
      <p class="muted">{{ $t('reviews.subtitle') }}</p>
    </header>

    <div v-if="reviews.length" class="reviews-list">
      <ReviewList :reviews="reviews" />
    </div>
    <div v-else class="reviews-empty">
      <EmptyStateIllustration :size="160" />
      <p class="muted">{{ $t('review.empty') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Review } from '~/types/broker'

const { data } = await useFetch<Review[]>('/api/reviews/latest', { default: () => [] })
const reviews = computed(() => data.value ?? [])

useSeoMeta({
  title: '真实交易者评测 — Tradervote',
  description: '来自真实交易账户的经纪商评测。涵盖出金、平台、客服、点差。',
})
</script>

<style scoped>
.page-head { margin-bottom: var(--sp-6); }
.page-head h1 { font-size: var(--text-3xl); margin: 0 0 var(--sp-2); letter-spacing: -.01em; }

.reviews-list { display: grid; gap: var(--sp-4); }
.reviews-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-12);
  text-align: center;
  background: var(--color-bg-muted);
  border-radius: var(--radius-md);
}
</style>