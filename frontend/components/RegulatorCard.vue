<template>
  <article v-if="regulator" class="reg-card" :class="`reg-card--${regulator.tier}`">
    <header class="reg-card__head">
      <RegulatorBadge :code="regulator.code" />
      <h3 class="reg-card__name">{{ regulator.shortName ?? regulator.name }}</h3>
    </header>
    <p class="reg-card__desc">{{ regulator.description }}</p>
    <dl class="reg-card__facts">
      <div v-if="regulator.investorProtection && regulator.investorProtection.amount > 0">
        <dt>{{ $t('regulator.protection') }}</dt>
        <dd>
          <strong>{{ formatAmount(regulator.investorProtection.amount, regulator.investorProtection.currency) }}</strong>
          <span class="reg-card__sub">{{ regulator.investorProtection.description }}</span>
        </dd>
      </div>
      <div v-else>
        <dt>{{ $t('regulator.protection') }}</dt>
        <dd class="reg-card__warn">{{ $t('regulator.no_protection') }}</dd>
      </div>
      <div v-if="regulator.verificationUrl">
        <dt>{{ $t('regulator.verification') }}</dt>
        <dd>
          <a :href="regulator.verificationUrl" target="_blank" rel="noopener">
            {{ $t('regulators.verify_on', { name: regulator.shortName ?? regulator.name }) }}
            <span aria-hidden="true">↗</span>
          </a>
        </dd>
      </div>
    </dl>
  </article>
  <article v-else class="reg-card reg-card--offshore">
    <header class="reg-card__head">
      <RegulatorBadge :code="code" />
      <h3 class="reg-card__name">{{ code }}</h3>
    </header>
    <p class="reg-card__warn">
      ⚠️ {{ code }} is not in our regulator database. {{ $t('regulators.warning_offshore') }}
    </p>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { REGULATORS_BY_CODE } from '~/data/regulators'

const props = defineProps<{ code: string }>()

const regulator = computed(() => REGULATORS_BY_CODE[props.code])

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}
</script>

<style scoped>
.reg-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  background: var(--color-surface);
}
.reg-card--tier1    { border-left: 3px solid var(--regulator-tier1); }
.reg-card--tier2    { border-left: 3px solid var(--regulator-tier2); }
.reg-card--tier3    { border-left: 3px solid var(--regulator-tier3); }
.reg-card--offshore { border-left: 3px solid var(--regulator-offshore); background: var(--score-bad-bg); }

.reg-card__head { display: flex; align-items: center; gap: var(--sp-3); flex-wrap: wrap; }
.reg-card__name { margin: 0; font-size: var(--text-base); font-weight: 700; }

.reg-card__desc {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-2);
  line-height: var(--leading-relaxed);
}

.reg-card__facts { margin: 0; display: grid; gap: var(--sp-2); }
.reg-card__facts > div {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px;
  padding-block: var(--sp-2);
  border-bottom: 1px solid var(--color-border);
}
.reg-card__facts > div:last-child { border-bottom: none; }
.reg-card__facts dt { font-size: var(--text-xs); color: var(--color-text-3); margin: 0; text-transform: uppercase; letter-spacing: .04em; }
.reg-card__facts dd { margin: 0; font-size: var(--text-sm); }
.reg-card__facts strong { display: block; font-size: var(--text-base); font-weight: 700; }
.reg-card__sub { color: var(--color-text-3); font-size: var(--text-xs); }

.reg-card__facts a { color: var(--color-text-link); font-weight: 600; }
.reg-card__facts a:hover { text-decoration: underline; }

.reg-card__warn { color: var(--score-bad); font-size: var(--text-sm); font-weight: 600; margin: 0; }
</style>