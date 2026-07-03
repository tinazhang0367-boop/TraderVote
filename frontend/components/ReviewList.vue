<template>
  <div class="review-list">
    <div v-for="review in reviews" :key="review.id" class="review-list__item">
      <header class="review-list__head">
        <div class="review-list__avatar" :style="{ background: bandColor(review) }">
          {{ initialOf(review.authorName) }}
        </div>
        <div class="review-list__meta">
          <div class="review-list__name">{{ review.authorName }}</div>
          <div class="review-list__sub">
            <FlagIcon v-if="countryFlagCode(review.authorCountry)" :code="countryFlagCode(review.authorCountry)" size="xs" :title="review.authorCountry" />
            {{ review.authorCountry }} ·
            {{ relativeTime(review.createdAt) }} ·
            <span v-if="review.verified" class="review-list__verified">✓ Verified</span>
          </div>
        </div>
        <div class="review-list__rating" :aria-label="`${review.rating}/5`">
          <span class="review-list__stars review-list__stars--filled">{{ '★'.repeat(review.rating) }}</span><span class="review-list__stars review-list__stars--empty">{{ '★'.repeat(5 - review.rating) }}</span>
        </div>
      </header>
      <h4 v-if="review.title" class="review-list__title">{{ review.title }}</h4>
      <p class="review-list__body">{{ displayBody(review) }}</p>
      <footer class="review-list__foot">
        <span class="review-list__helpful">👍 {{ review.helpful }} helpful</span>
        <button type="button" class="review-list__report">{{ $t('review.report') }}</button>
      </footer>
    </div>

    <div v-if="!reviews.length" class="review-list__empty">{{ $t('review.empty') }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Review, LocaleCode } from '~/types/broker'
import { bandFromScore, TRUST_BAND_COLOR } from '~/utils/trust-score'

const props = defineProps<{
  reviews: Review[]
  preferredLocale?: LocaleCode
}>()

const { locale } = useI18n()

/**
 * Country name (English) → ISO alpha-2 code, used to render a flag in review
 * meta lines where the API only ships the human-readable name. Keep this
 * table in sync with server/api/countries.get.ts and the broker data.
 */
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  'Thailand': 'th',
  'Vietnam': 'vn',
  'Indonesia': 'id',
  'Malaysia': 'my',
  'Singapore': 'sg',
  'Philippines': 'ph',
  'Cambodia': 'kh',
  'Myanmar': 'mm',
  'China': 'cn',
  'Taiwan': 'tw',
  'Japan': 'jp',
  'Korea': 'kr',
  'South Korea': 'kr',
  'India': 'in',
  'Australia': 'au',
}

function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}

function countryFlagCode(name: string): string | null {
  return COUNTRY_NAME_TO_CODE[name] ?? null
}
function bandColor(r: Review): string {
  return TRUST_BAND_COLOR[bandFromScore(r.rating)]
}
function displayBody(r: Review): string {
  const lang = (props.preferredLocale || (locale.value as LocaleCode))
  return r.translations?.[lang] ?? r.body
}
function relativeTime(iso: string): string {
  const d = new Date(iso)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`
  return d.toLocaleDateString()
}
</script>

<style scoped>
.review-list { display: grid; gap: var(--sp-4); }
.review-list__item {
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-lg); padding: var(--sp-4); display: grid; gap: var(--sp-2);
}
.review-list__head { display: flex; align-items: center; gap: var(--sp-3); }
.review-list__avatar {
  width: 40px; height: 40px; border-radius: 50%; color: #fff; font-weight: 700;
  display: grid; place-items: center; flex-shrink: 0;
}
.review-list__meta { flex: 1; }
.review-list__name { font-weight: 600; font-size: var(--text-sm); }
.review-list__sub { font-size: var(--text-xs); color: var(--color-text-3); }
.review-list__verified { color: var(--color-success); font-weight: 600; }
.review-list__rating {
  font-size: var(--text-xl);
  letter-spacing: 3px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.review-list__stars--filled { color: #D4AF37; font-size: 1.3em; }   /* gold — user score */
.review-list__stars--empty  { color: var(--color-border-strong); font-size: 1.3em; opacity: .45; }
.review-list__title { font-size: var(--text-base); font-weight: 600; }
.review-list__body { font-size: var(--text-sm); color: var(--color-text-2); line-height: 1.6; }
.review-list__foot { display: flex; justify-content: space-between; font-size: var(--text-xs); color: var(--color-text-3); }
.review-list__report { background: none; border: none; color: var(--color-text-3); cursor: pointer; }
.review-list__report:hover { color: var(--color-danger); }
.review-list__empty { padding: var(--sp-8); text-align: center; color: var(--color-text-3); }
</style>
