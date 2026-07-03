<template>
  <div class="container section">
    <header class="page-head">
      <h1>{{ $t('countries.title') }}</h1>
      <p class="muted">{{ $t('countries.subtitle') }}</p>
    </header>

    <div class="country-grid">
      <CountryTile v-for="c in countries" :key="c.code" :country="c" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Country } from '~/types/broker'

const { data } = await useFetch<Country[]>('/api/countries', { default: () => [] })
const countries = computed(() => data.value ?? [])

useSeoMeta({
  title: '按国家/地区查经纪商 — Tradervote',
  description: '按国家/地区搜索外汇经纪商，查看当地支付方式和服务支持。',
})
</script>

<style scoped>
.page-head { margin-bottom: var(--sp-6); }
.page-head h1 { font-size: var(--text-3xl); margin: 0 0 var(--sp-2); letter-spacing: -.01em; }

.country-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--sp-3);
}
</style>