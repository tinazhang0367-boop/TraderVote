<template>
  <div v-if="categoryDef" class="cat-page">
    <section class="cat-hero">
      <div class="container cat-hero__inner">
        <nav class="cat-hero__crumb">
          <NuxtLink :to="localePath('/category')">{{ $t('nav.categories') }}</NuxtLink>
          <span aria-hidden="true">›</span>
          <span>{{ categoryDef.title }}</span>
        </nav>

        <div class="cat-hero__head">
          <div class="cat-hero__icon" :style="{ background: tint(categoryDef.color) }">
            {{ categoryDef.icon }}
          </div>
          <div>
            <h1 class="cat-hero__title">{{ categoryDef.title }}</h1>
            <p class="cat-hero__sub">{{ categoryDef.description }}</p>
            <p class="cat-hero__count">
              <strong>{{ brokers.length }}</strong> {{ $t('cat-page.broker_count', { count: brokers.length }).split(' ').slice(1).join(' ') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Top brokers in this category -->
    <section class="container section">
      <header class="section__head">
        <h2>{{ $t('cat-page.top_in_category') }}</h2>
        <NuxtLink :to="localePath('/brokers')" class="section__link">
          {{ $t('common.view_all') }} →
        </NuxtLink>
      </header>
      <div v-if="brokers.length" class="broker-grid">
        <BrokerCard v-for="b in brokers" :key="b.id" :broker="b" :rank="b.rank" />
      </div>
      <p v-else class="muted text-center">{{ $t('common.no_results') }}</p>
    </section>

    <!-- Methodology callout -->
    <section class="container section section--tight">
      <div class="card card--flat method-card">
        <h3 class="card__title">{{ $t('cat-page.methodology_title') }}</h3>
        <p class="muted">{{ $t('cat-page.methodology_body') }}</p>
      </div>
    </section>
  </div>
  <div v-else class="container section">
    <p class="muted text-center">{{ $t('common.no_results') }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Broker } from '~/types/broker'
import { BROKERS_BY_CATEGORY } from '~/data/brokers'
import { CATEGORIES_BY_SLUG } from '~/data/categories'

const route = useRoute()
const localePath = useLocalePath()
const slug = computed(() => String(route.params.slug))

const categoryDef = computed(() => CATEGORIES_BY_SLUG[slug.value])

const brokers = computed<Broker[]>(() => {
  const s = slug.value
  return BROKERS_BY_CATEGORY[s as keyof typeof BROKERS_BY_CATEGORY] ?? []
})

useSeoMeta({
  title: () => categoryDef.value ? `${categoryDef.value.title} — Brokers Compared | Tradervote` : 'Category not found',
  description: () => categoryDef.value?.description ?? '',
  ogTitle: () => categoryDef.value?.title ?? '',
})

function tint(hex: string): string {
  if (!hex?.startsWith('#')) return 'var(--color-bg-muted)'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, .12)`
}
</script>

<style scoped>
.cat-hero {
  background: var(--color-bg-muted);
  padding-block: var(--sp-12);
  border-bottom: 1px solid var(--color-border);
}
.cat-hero__inner { display: flex; flex-direction: column; gap: var(--sp-4); }
.cat-hero__crumb {
  font-size: var(--text-xs);
  color: var(--color-text-3);
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
.cat-hero__crumb a { color: var(--color-text-3); }
.cat-hero__head {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--sp-6);
  align-items: center;
}
.cat-hero__icon {
  width: 80px; height: 80px;
  border-radius: var(--radius-lg);
  display: grid;
  place-items: center;
  font-size: 36px;
  font-weight: 700;
}
.cat-hero__title {
  font-size: var(--text-4xl);
  margin: 0 0 var(--sp-2);
}
.cat-hero__sub {
  margin: 0;
  font-size: var(--text-base);
  color: var(--color-text-2);
  max-width: 60ch;
}
.cat-hero__count {
  margin: var(--sp-3) 0 0;
  font-size: var(--text-sm);
  color: var(--color-text-3);
}
.cat-hero__count strong { color: var(--color-brand-600); }

.broker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--sp-4);
}

.method-card { padding: var(--sp-6); }
</style>