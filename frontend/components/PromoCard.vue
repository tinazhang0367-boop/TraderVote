<template>
  <article class="promo-card">
    <header class="promo-card__head" :style="{ background: bandBg }">
      <div class="promo-card__type">{{ typeLabel }}</div>
      <div class="promo-card__amount">{{ promotion.amount }}</div>
      <div v-if="promotion.daysLeft != null" class="promo-card__expires">
        ⏰ {{ $t('promo.days_left', { n: promotion.daysLeft }) }}
      </div>
    </header>

    <div class="promo-card__body">
      <div class="promo-card__broker">
        <img v-if="promotion.brokerLogoUrl" :src="promotion.brokerLogoUrl" :alt="promotion.brokerName" width="48" height="48" loading="lazy" />
        <div>
          <div class="promo-card__broker-name">{{ promotion.brokerName }}</div>
          <div class="promo-card__broker-reg">{{ promotion.description }}</div>
        </div>
      </div>

      <p class="promo-card__desc">{{ promotion.title }}</p>

      <div class="promo-card__actions">
        <a :href="promotion.affiliateUrl" rel="nofollow noopener" target="_blank" class="btn btn--primary">
          {{ $t('promo.claim') }}
        </a>
        <NuxtLink :to="localePath(`/brokers/${promotion.brokerSlug}`)" class="btn btn--ghost">
          {{ $t('broker.read_review') }}
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Promotion } from '~/types/broker'
const localePath = useLocalePath()

const props = defineProps<{ promotion: Promotion }>()

const typeMap: Record<Promotion['type'], { label: string; bg: string }> = {
  welcome_bonus:   { label: '🎁 WELCOME BONUS',  bg: 'var(--score-excellent)' },
  cashback:        { label: '💸 CASHBACK',       bg: 'var(--score-average)' },
  no_deposit:      { label: '🆓 NO DEPOSIT',     bg: 'var(--score-poor)' },
  free_withdrawal: { label: '🏦 FREE WITHDRAWAL', bg: '#7c3aed' },
}
const typeLabel = computed(() => typeMap[props.promotion.type].label)
const bandBg = computed(() => typeMap[props.promotion.type].bg)
</script>

<style scoped>
.promo-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; display: flex; flex-direction: column; }
.promo-card__head { color: #fff; padding: var(--sp-4); display: flex; flex-direction: column; gap: var(--sp-2); }
.promo-card__type { font-size: var(--text-xs); font-weight: 600; letter-spacing: .04em; }
.promo-card__amount { font-size: var(--text-3xl); font-weight: 800; line-height: 1; }
.promo-card__expires { font-size: var(--text-xs); opacity: .9; }
.promo-card__body { padding: var(--sp-4); display: flex; flex-direction: column; gap: var(--sp-3); flex: 1; }
.promo-card__broker { display: flex; align-items: center; gap: var(--sp-3); }
.promo-card__broker img { border-radius: var(--radius-md); }
.promo-card__broker-name { font-weight: 700; font-size: var(--text-base); }
.promo-card__broker-reg { font-size: var(--text-xs); color: var(--color-text-3); }
.promo-card__desc { font-size: var(--text-sm); color: var(--color-text-2); flex: 1; }
.promo-card__actions { display: flex; gap: var(--sp-2); }
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 10px 16px; border-radius: var(--radius-md); font-weight: 600; font-size: var(--text-sm);
  border: 1px solid transparent; text-decoration: none;
}
.btn--primary { background: var(--color-brand-500); color: #fff; }
.btn--primary:hover { background: var(--color-brand-600); text-decoration: none; }
.btn--ghost { background: #fff; color: var(--color-brand-500); border-color: var(--color-brand-500); }
.btn--ghost:hover { background: var(--color-brand-50); text-decoration: none; }
</style>
