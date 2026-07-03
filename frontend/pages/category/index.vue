<template>
  <div class="cat-index">
    <section class="container section">
      <header class="section__head">
        <div>
          <h1>{{ $t('categories.browse_title') }}</h1>
          <p class="muted">{{ $t('categories.browse_sub') }}</p>
        </div>
      </header>

      <!-- SEA focus -->
      <h2 class="cat-index__group-title">🌏 {{ $t('categories.sea_title') }}</h2>
      <p class="muted">{{ $t('categories.sea_sub') }}</p>
      <div class="cat-grid">
        <CategoryTile v-for="cat in topCategories" :key="cat.slug" :category="cat" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { CATEGORIES } from '~/data/categories'

const topCategories = computed(() => CATEGORIES.slice(0, 4))

useSeoMeta({
  title: 'Broker categories — Forex, crypto, prop firms, copy trading | Tradervote',
  description: 'Browse Tradervote brokers by what you trade: forex, crypto, prop firms, copy trading and more.',
})
</script>

<style scoped>
.cat-index__group-title {
  margin: var(--sp-12) 0 var(--sp-2);
}
.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--sp-3);
  margin-top: var(--sp-3);
}
</style>