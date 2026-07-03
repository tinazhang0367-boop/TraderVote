<template>
  <div class="regulators-page">
    <!-- Hero with search -->
    <section class="reg-hero">
      <div class="container reg-hero__inner">
        <p class="reg-hero__eyebrow">Regulators</p>
        <h1>{{ $t('regulators.title') }}</h1>
        <p class="reg-hero__sub">{{ $t('regulators.subtitle') }}</p>
        <form class="reg-search" @submit.prevent="onSearch">
          <span class="reg-search__icon" aria-hidden="true">🛡️</span>
          <input
            v-model="searchQ"
            type="search"
            class="reg-search__input"
            :placeholder="$t('regulators.search_placeholder')"
            :aria-label="$t('regulators.search_placeholder')"
          >
          <button type="submit" class="btn btn--primary reg-search__btn">
            {{ $t('common.search') }}
          </button>
        </form>
      </div>
    </section>

    <section class="container section">
      <!-- Tier 1: Strong regulation -->
      <header class="reg-group__head">
        <h2>
          <span class="reg-group__pip reg-group__pip--tier1"/>
          {{ $t('regulators.tier1') }} — {{ $t('regulators.tier1_sub') }}
        </h2>
        <p class="muted">{{ $t('regulators.tier1_body') }}</p>
      </header>
      <div class="reg-grid">
        <RegulatorCard v-for="r in tier1" :key="r.code" :code="r.code" />
      </div>

      <!-- Tier 2 -->
      <header class="reg-group__head">
        <h2>
          <span class="reg-group__pip reg-group__pip--tier2"/>
          {{ $t('regulators.tier2') }} — {{ $t('regulators.tier2_sub') }}
        </h2>
        <p class="muted">{{ $t('regulators.tier2_body') }}</p>
      </header>
      <div class="reg-grid">
        <RegulatorCard v-for="r in tier2" :key="r.code" :code="r.code" />
      </div>

      <!-- Tier 3 -->
      <header v-if="tier3.length" class="reg-group__head">
        <h2>
          <span class="reg-group__pip reg-group__pip--tier3"/>
          {{ $t('regulators.tier3') }} — {{ $t('regulators.tier3_sub') }}
        </h2>
        <p class="muted">{{ $t('regulators.tier3_body') }}</p>
      </header>
      <div v-if="tier3.length" class="reg-grid">
        <RegulatorCard v-for="r in tier3" :key="r.code" :code="r.code" />
      </div>

      <!-- Offshore / Unverified — big risk callout -->
      <header class="reg-group__head reg-group__head--warn">
        <h2>
          <span class="reg-group__pip reg-group__pip--offshore"/>
          {{ $t('regulators.offshore') }} — {{ $t('regulators.offshore_sub') }}
        </h2>
        <p class="muted">{{ $t('regulators.warning_offshore') }}</p>
      </header>
      <div class="reg-grid">
        <RegulatorCard v-for="r in offshore" :key="r.code" :code="r.code" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { REGULATORS } from '~/data/regulators'

const router = useRouter()
const searchQ = ref('')

const tier1     = computed(() => REGULATORS.filter(r => r.tier === 'tier1'))
const tier2     = computed(() => REGULATORS.filter(r => r.tier === 'tier2'))
const tier3     = computed(() => REGULATORS.filter(r => r.tier === 'tier3'))
const offshore = computed(() => REGULATORS.filter(r => r.tier === 'offshore'))

function onSearch() {
  const q = searchQ.value.trim()
  if (!q) return
  router.push({ path: '/brokers', query: { q } })
}

useSeoMeta({
  title: '监管查询 — FCA / ASIC / CySEC 等监管机构 | Tradervote',
  description: '按监管等级查询外汇经纪商牌照、投资者保护额度与风险提示。',
})
</script>

<style scoped>
.reg-hero {
  background: linear-gradient(180deg, #f8fafc 0%, var(--color-bg) 100%);
  border-bottom: 1px solid var(--color-border);
  padding-block: var(--sp-12) var(--sp-8);
}
.reg-hero__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
  text-align: center;
}
.reg-hero__eyebrow {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--color-brand-600);
}
.reg-hero h1 { font-size: clamp(1.75rem, 4vw, var(--text-4xl)); margin: 0; letter-spacing: -.02em; }
.reg-hero__sub { margin: 0; font-size: var(--text-base); color: var(--color-text-2); max-width: 60ch; }

.reg-search {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 560px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 4px 4px 4px var(--sp-4);
  margin-top: var(--sp-4);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--dur-base) var(--ease-out);
}
.reg-search:focus-within { box-shadow: var(--shadow-md); border-color: var(--color-brand-500); }
.reg-search__icon { font-size: var(--text-base); margin-right: var(--sp-2); opacity: .5; }
.reg-search__input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--text-base);
  padding: 10px 4px;
  outline: none;
  min-width: 0;
}
.reg-search__btn { flex-shrink: 0; border-radius: var(--radius-sm); }

.reg-group__head {
  margin: var(--sp-8) 0 var(--sp-3);
  padding-bottom: var(--sp-3);
  border-bottom: 1px solid var(--color-border);
}
.reg-group__head:first-of-type { margin-top: 0; }
.reg-group__head h2 {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--text-xl);
  margin: 0 0 4px;
}
.reg-group__head p { margin: 0; }
.reg-group__head--warn { border-bottom-color: var(--regulator-offshore); }
.reg-group__head--warn h2 { color: var(--regulator-offshore); }

.reg-group__pip {
  width: 12px; height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}
.reg-group__pip--tier1    { background: var(--regulator-tier1); }
.reg-group__pip--tier2    { background: var(--regulator-tier2); }
.reg-group__pip--tier3    { background: var(--regulator-tier3); }
.reg-group__pip--offshore { background: var(--regulator-offshore); }

.reg-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-3);
}
@media (min-width: 700px) { .reg-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1100px) { .reg-grid { grid-template-columns: 1fr 1fr 1fr; } }
</style>