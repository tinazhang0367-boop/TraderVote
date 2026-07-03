<template>
  <div class="country-page">
    <section class="country-hero">
      <div class="container country-hero__inner">
        <nav class="country-hero__crumb">
          <NuxtLink :to="localePath('/brokers')">{{ $t('nav.brokers') }}</NuxtLink>
          <span aria-hidden="true">›</span>
          <span>{{ countryName }}</span>
        </nav>

        <div class="country-hero__head">
          <FlagIcon :code="code" size="xl" />
          <div>
            <h1 class="country-hero__title">{{ countryName }}</h1>
            <p class="country-hero__sub">{{ sub }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container section">
      <header class="section__head">
        <h2>{{ $t('country.popular_brokers') }}</h2>
      </header>
      <div v-if="countryBrokers.length" class="broker-grid">
        <BrokerCard v-for="b in countryBrokers" :key="b.id" :broker="b" />
      </div>
      <p v-else class="muted text-center">
        {{ $t('common.no_results') }}
      </p>
    </section>

    <!-- Payment methods (popular in this country) -->
    <section v-if="paymentMethods.length" class="container section section--tight">
      <h2>{{ $t('country.popular_payment') }}</h2>
      <p class="muted text-sm">
        {{ $t('country.popular_payment') }} — data aggregated from broker paymentMethods
      </p>
      <div class="chip-row">
        <span v-for="m in paymentMethods" :key="m" class="chip">{{ m }}</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Broker, CountryCode } from '~/types/broker'
import { BROKERS_BY_COUNTRY, BROKERS } from '~/data/brokers'

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()

const code = computed(() => String(route.params.code).toUpperCase() as CountryCode)

const countryBrokers = computed<Broker[]>(() => {
  // Prefer the per-country pool, fall back to brokers that list this country
  // in their paymentMethods.
  const c = code.value
  const pool = BROKERS_BY_COUNTRY[c]
  if (pool?.length) return pool
  return BROKERS.filter(b => b.paymentMethods?.byCountry?.[c])
})

const countryName = computed(() => t(`countries.${code.value}` as any, { default: code.value }))

const sub = computed(() =>
  t('country.broker_count', { count: countryBrokers.value.length }),
)

/** Aggregate unique payment methods from all brokers serving this country. */
const paymentMethods = computed(() => {
  const set = new Set<string>()
  const c = code.value
  for (const b of countryBrokers.value) {
    const methods = b.paymentMethods?.byCountry?.[c]
    if (methods) methods.forEach((m: string) => set.add(m))
  }
  return Array.from(set).slice(0, 12)
})

useSeoMeta({
  title: () => `${countryName.value} — Best brokers & reviews | Tradervote`,
  description: () =>
    `${countryName.value} traders prefer brokers that support local payment methods and language. ` +
    `Compare ${countryBrokers.value.length} brokers serving ${countryName.value}.`,
})
</script>

<style scoped>
.country-hero {
  background: var(--color-bg-muted);
  padding-block: var(--sp-12);
  border-bottom: 1px solid var(--color-border);
}
.country-hero__inner { display: flex; flex-direction: column; gap: var(--sp-4); }
.country-hero__crumb {
  font-size: var(--text-xs);
  color: var(--color-text-3);
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
.country-hero__crumb a { color: var(--color-text-3); }
.country-hero__head {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--sp-4);
  align-items: center;
}
.country-hero__title {
  font-size: var(--text-4xl);
  margin: 0;
}
.country-hero__sub {
  margin: var(--sp-1) 0 0;
  color: var(--color-text-3);
  font-size: var(--text-sm);
}

.broker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--sp-4);
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin-top: var(--sp-3);
}
.chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  font-size: var(--text-sm);
  font-weight: 500;
}
</style>