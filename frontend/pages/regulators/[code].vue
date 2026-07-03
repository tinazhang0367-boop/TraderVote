<template>
  <div class="reg-page">
    <section class="reg-hero">
      <div class="container reg-hero__inner">
        <nav class="cat-hero__crumb">
          <NuxtLink :to="localePath('/regulators')">{{ $t('regulators.title') }}</NuxtLink>
          <span aria-hidden="true">›</span>
          <span>{{ regulator?.shortName ?? code }}</span>
        </nav>
        <div v-if="regulator" class="reg-hero__head">
          <RegulatorBadge :code="regulator.code" />
          <h1 class="reg-hero__title">{{ regulator.name }}</h1>
          <p class="muted">{{ regulator.shortName }} · {{ regulator.country }}</p>
          <p class="reg-hero__desc">{{ regulator.description }}</p>
          <div class="reg-hero__meta">
            <span :class="`pill pill--${tierVariant(regulator.tier)}`">
              {{ tierLabel(regulator.tier) }}
            </span>
            <span v-if="regulator.investorProtection && regulator.investorProtection.amount > 0" class="pill pill--success">
              🛡️ {{ formatAmount(regulator.investorProtection.amount, regulator.investorProtection.currency) }} protected
            </span>
            <span v-else class="pill pill--danger">
              ⚠️ No investor protection
            </span>
          </div>
        </div>
        <div v-else>
          <h1 class="reg-hero__title">{{ code }}</h1>
          <p class="muted">{{ $t('common.no_results') }}</p>
        </div>
      </div>
    </section>

    <section v-if="regulatedBrokers.length" class="container section">
      <header class="section__head">
        <div>
          <h2>{{ $t('regulator.broker_count', { count: regulatedBrokers.length }) }}</h2>
        </div>
      </header>
      <div class="broker-grid">
        <BrokerCard v-for="b in regulatedBrokers" :key="b.id" :broker="b" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Broker } from '~/types/broker'
import { REGULATORS_BY_CODE } from '~/data/regulators'
import { BROKERS } from '~/data/brokers'

const route = useRoute()
const localePath = useLocalePath()
const code = computed(() => String(route.params.code))

const regulator = computed(() => REGULATORS_BY_CODE[code.value])

const regulatedBrokers = computed<Broker[]>(() =>
  BROKERS.filter(b => b.regulators.includes(code.value)),
)

useSeoMeta({
  title: () => regulator.value
    ? `${regulator.value.name} — ${regulator.value.shortName ?? ''} | Tradervote`
    : `${code.value} — Regulator | Tradervote`,
  description: () => regulator.value?.description ?? '',
})

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}

function tierLabel(tier: string): string {
  return tier === 'tier1' ? 'Tier-1 (top-tier)'
    : tier === 'tier2' ? 'Tier-2'
    : tier === 'tier3' ? 'Tier-3'
    : 'Offshore'
}
function tierVariant(tier: string): string {
  return tier === 'offshore' ? 'danger'
    : tier === 'tier3' ? 'warning'
    : 'success'
}
</script>

<style scoped>
.reg-hero {
  background: var(--color-bg-muted);
  padding-block: var(--sp-12);
  border-bottom: 1px solid var(--color-border);
}
.reg-hero__inner { display: flex; flex-direction: column; gap: var(--sp-4); }
.cat-hero__crumb {
  font-size: var(--text-xs);
  color: var(--color-text-3);
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
.cat-hero__crumb a { color: var(--color-text-3); }
.reg-hero__head {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  align-items: flex-start;
}
.reg-hero__title {
  font-size: var(--text-4xl);
  margin: 0;
}
.reg-hero__desc {
  margin: 0;
  font-size: var(--text-base);
  color: var(--color-text-2);
  max-width: 70ch;
}
.reg-hero__meta { display: flex; flex-wrap: wrap; gap: var(--sp-2); margin-top: var(--sp-2); }

.broker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--sp-4);
}
</style>