<template>
  <div class="write-page">
    <section class="container section">
      <header class="write-header">
        <h1 class="write-header__title">{{ $t('write.title') }}</h1>
        <p class="muted">{{ $t('write.subtitle') }}</p>
      </header>

      <!-- Progress steps -->
      <ol class="stepper" aria-label="Progress">
        <li
          v-for="(s, i) in steps"
          :key="s.key"
          :class="['stepper__item', {
            'stepper__item--done':   i < currentStep,
            'stepper__item--active': i === currentStep,
          }]"
        >
          <span class="stepper__num">{{ i + 1 }}</span>
          <span class="stepper__label">{{ s.label }}</span>
        </li>
      </ol>

      <!-- Steps -->
      <div class="write-card card">
        <!-- Step 1: Pick a broker -->
        <div v-if="currentStep === 0" class="write-step">
          <h2 class="card__title">{{ $t('write.step_broker') }}</h2>
          <div class="field">
            <label class="field__label" for="broker-search">{{ $t('write.select_broker') }}</label>
            <input
              id="broker-search"
              v-model="brokerQuery"
              type="search"
              class="input"
              :placeholder="$t('write.select_broker')"
              autocomplete="off"
            />
            <p v-if="filteredBrokers.length === 0" class="muted text-sm">
              {{ $t('common.no_results') }}
            </p>
            <ul v-else class="broker-pick">
              <li v-for="b in filteredBrokers" :key="b.id">
                <button type="button" class="broker-pick__btn" @click="pickBroker(b)">
                  <FlagIcon v-if="b.regulators[0]" :code="b.regulators[0]" size="xs" />
                  <span class="broker-pick__name">{{ b.name }}</span>
                  <span class="broker-pick__meta">
                    <span>{{ b.regulators.slice(0, 2).join(' · ') }}</span>
                    <span class="broker-pick__score">★ {{ b.trustScore.toFixed(1) }}</span>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Step 2: Experience level -->
        <div v-else-if="currentStep === 1" class="write-step">
          <h2 class="card__title">{{ $t('write.step_experience') }}</h2>
          <div class="exp-grid">
            <label
              v-for="opt in experienceOptions"
              :key="opt.value"
              :class="['exp-card', { 'exp-card--active': form.experience === opt.value }]"
            >
              <input
                type="radio"
                name="experience"
                :value="opt.value"
                v-model="form.experience"
                class="visually-hidden"
              />
              <span class="exp-card__title">{{ opt.label }}</span>
              <span class="exp-card__sub muted">{{ opt.sub }}</span>
            </label>
          </div>
          <div class="field" style="margin-top: var(--sp-4)">
            <label class="field__label">{{ $t('write.traded_label') }}</label>
            <div class="chip-row">
              <label
                v-for="opt in assetOptions"
                :key="opt.value"
                :class="['chip-toggle', { 'chip-toggle--active': form.assets.includes(opt.value) }]"
              >
                <input
                  type="checkbox"
                  :value="opt.value"
                  v-model="form.assets"
                  class="visually-hidden"
                />
                {{ opt.label }}
              </label>
            </div>
          </div>
        </div>

        <!-- Step 3: 4-axis ratings -->
        <div v-else-if="currentStep === 2" class="write-step">
          <h2 class="card__title">{{ $t('write.step_ratings') }}</h2>
          <div class="rating-form">
            <div v-for="axis in ratingAxes" :key="axis.key" class="rating-form__row">
              <div class="rating-form__label">
                <span class="rating-form__title">{{ axis.label }}</span>
                <span class="muted text-sm">{{ axis.help }}</span>
              </div>
              <div class="rating-form__stars" role="radiogroup" :aria-label="axis.label">
                <button
                  v-for="n in 5"
                  :key="n"
                  type="button"
                  :class="['rating-form__star', { 'rating-form__star--active': n <= form.ratings[axis.key] }]"
                  :aria-label="`${n} out of 5`"
                  @click="form.ratings[axis.key] = n"
                >★</button>
              </div>
              <span class="rating-form__num">{{ form.ratings[axis.key] }}/5</span>
            </div>
          </div>
        </div>

        <!-- Step 4: Write the review -->
        <div v-else-if="currentStep === 3" class="write-step">
          <h2 class="card__title">{{ $t('write.step_review') }}</h2>
          <div class="field">
            <label class="field__label" for="review-title">{{ $t('write.title_label') }}</label>
            <input
              id="review-title"
              v-model="form.title"
              type="text"
              class="input"
              :placeholder="$t('write.title_placeholder')"
              maxlength="120"
            />
          </div>
          <div class="field" style="margin-top: var(--sp-3)">
            <label class="field__label" for="review-body">{{ $t('write.body_label') }}</label>
            <textarea
              id="review-body"
              v-model="form.body"
              class="textarea"
              :placeholder="$t('write.body_placeholder')"
              rows="6"
            ></textarea>
            <p class="field__hint" :class="{ 'field__hint--warn': form.body.length < 50 }">
              {{ form.body.length }} / 50 — {{ $t('write.min_chars_label', { n: Math.max(0, 50 - form.body.length) }) }}
            </p>
          </div>

          <!-- Honeypot for bots -->
          <div class="field honeypot" aria-hidden="true">
            <label>Website</label>
            <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
          </div>
        </div>

        <!-- Step 5: Verify -->
        <div v-else-if="currentStep === 4" class="write-step">
          <h2 class="card__title">{{ $t('write.step_verify') }}</h2>
          <div class="field">
            <label class="field__label" for="review-email">{{ $t('write.email_label') }}</label>
            <input
              id="review-email"
              v-model="form.email"
              type="email"
              class="input"
              required
            />
            <p class="field__hint">{{ $t('write.email_help') }}</p>
          </div>
          <div class="field" style="margin-top: var(--sp-3)">
            <label class="field__label" for="review-country">{{ $t('write.country_label') }}</label>
            <select id="review-country" v-model="form.country" class="select">
              <option v-for="c in countryOptions" :key="c.code" :value="c.code">{{ c.name }}</option>
            </select>
          </div>
        </div>

        <!-- Step 6: Done -->
        <div v-else class="write-step write-step--done">
          <div class="write-success">
            <div class="write-success__icon">✓</div>
            <h2 class="card__title">{{ $t('write.thanks_title') }}</h2>
            <p class="muted">{{ $t('write.thanks_body') }}</p>
            <NuxtLink :to="localePath('/')" class="btn btn--primary">
              {{ $t('common.view_all') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Step nav -->
        <div v-if="currentStep < steps.length - 1" class="write-step__nav">
          <button
            v-if="currentStep > 0"
            type="button"
            class="btn btn--ghost"
            @click="prev"
          >
            ← {{ $t('write.back') }}
          </button>
          <button
            type="button"
            class="btn btn--primary"
            :disabled="!canAdvance"
            @click="next"
          >
            {{ submitLabel }} →
          </button>
        </div>
      </div>

      <!-- Helper note -->
      <p v-if="currentStep === 4" class="muted text-sm text-center">
        {{ $t('write.submit_help') }}
      </p>
      <p v-if="submitError" class="submit-error text-sm text-center">
        {{ submitError }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Broker, CountryCode, ExperienceLevel, RatingBreakdown, TradedAsset } from '~/types/broker'
import { BROKERS } from '~/data/brokers'

definePageMeta({ middleware: [] })

const localePath = useLocalePath()
const route = useRoute()

// Preselect broker from query param ?broker=slug
const preselectedSlug = computed(() => String(route.query.broker || ''))

const steps = computed(() => [
  { key: 'broker',  label: useI18n().t('write.step_broker') },
  { key: 'exp',     label: useI18n().t('write.step_experience') },
  { key: 'rate',    label: useI18n().t('write.step_ratings') },
  { key: 'write',   label: useI18n().t('write.step_review') },
  { key: 'verify',  label: useI18n().t('write.step_verify') },
  { key: 'done',    label: useI18n().t('write.step_done') },
])

const currentStep = ref(0)
const submitting = ref(false)
const submitError = ref('')

interface FormState {
  broker: Broker | null
  experience: ExperienceLevel
  assets: TradedAsset[]
  ratings: RatingBreakdown
  title: string
  body: string
  email: string
  country: CountryCode
  website: string  // honeypot
}

const form = reactive<FormState>({
  broker: BROKERS.find(b => b.slug === preselectedSlug.value) ?? null,
  experience: 'intermediate',
  assets: [],
  ratings: { withdrawal: 0, platform: 0, support: 0, pricing: 0 },
  title: '',
  body: '',
  email: '',
  country: 'TH',
  website: '',
})

const { t } = useI18n()

const experienceOptions = computed(() => [
  { value: 'beginner'     as ExperienceLevel, label: t('write.experience_beginner'),     sub: '< 1 year trading' },
  { value: 'intermediate' as ExperienceLevel, label: t('write.experience_intermediate'), sub: '1–3 years' },
  { value: 'pro'          as ExperienceLevel, label: t('write.experience_pro'),          sub: '3+ years' },
])

const assetOptions: { value: TradedAsset; label: string }[] = [
  { value: 'forex',      label: 'Forex' },
  { value: 'crypto',     label: 'Crypto' },
  { value: 'stocks',     label: 'Stocks' },
  { value: 'commodities', label: 'Commodities' },
  { value: 'indices',    label: 'Indices' },
  { value: 'cfd',        label: 'CFD' },
]

const ratingAxes = computed(() => [
  { key: 'withdrawal' as const, label: t('broker.rating_withdrawal'), help: t('write.rating_withdrawal_help') },
  { key: 'platform'   as const, label: t('broker.rating_platform'),   help: t('write.rating_platform_help') },
  { key: 'support'    as const, label: t('broker.rating_support'),    help: t('write.rating_support_help') },
  { key: 'pricing'    as const, label: t('broker.rating_pricing'),    help: t('write.rating_pricing_help') },
])

const countryOptions: { code: CountryCode; name: string }[] = [
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'PH', name: 'Philippines' },
  { code: 'CN', name: 'China' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'US', name: 'United States' },
]

const brokerQuery = ref('')
const filteredBrokers = computed(() => {
  const q = brokerQuery.value.trim().toLowerCase()
  if (!q) return BROKERS.slice(0, 8)
  return BROKERS
    .filter(b => b.name.toLowerCase().includes(q) || b.regulators.join(' ').toLowerCase().includes(q))
    .slice(0, 8)
})

function pickBroker(b: Broker) {
  form.broker = b
  currentStep.value = 1
}

const canAdvance = computed(() => {
  if (submitting.value) return false
  switch (currentStep.value) {
    case 0: return !!form.broker
    case 1: return !!form.experience && form.assets.length > 0
    case 2: return form.ratings.withdrawal > 0
              && form.ratings.platform   > 0
              && form.ratings.support    > 0
              && form.ratings.pricing    > 0
    case 3: return form.title.trim().length >= 5 && form.body.trim().length >= 50
    case 4: return /\S+@\S+\.\S+/.test(form.email)
    default: return false
  }
})

const submitLabel = computed(() => {
  if (submitting.value) return '提交中...'
  return currentStep.value === steps.value.length - 2 ? t('write.submit') : t('write.next')
})

async function submitReview() {
  if (!form.broker) return
  submitting.value = true
  submitError.value = ''
  try {
    await $fetch('/api/reviews', {
      method: 'POST',
      body: {
        brokerId: form.broker.id,
        authorEmail: form.email,
        authorCountry: form.country,
        experienceLevel: form.experience,
        tradedAssets: form.assets,
        ratingBreakdown: form.ratings,
        title: form.title,
        body: form.body,
        website: form.website,
      },
    })
    currentStep.value++
  } catch (err: any) {
    submitError.value = err?.statusMessage || '提交失败，请稍后再试。'
  } finally {
    submitting.value = false
  }
}

function next() {
  if (!canAdvance.value) return
  if (currentStep.value === steps.value.length - 2) {
    submitReview()
    return
  }
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++
  }
}
function prev() {
  if (currentStep.value > 0) currentStep.value--
}

useSeoMeta({
  title: 'Write a review — Tradervote',
  description: 'Help thousands of traders choose wisely. Real reviews from real accounts.',
})
</script>

<style scoped>
.write-header {
  text-align: center;
  margin-bottom: var(--sp-8);
}
.write-header__title {
  font-size: var(--text-4xl);
  margin: 0 0 var(--sp-2);
}

/* ─── Stepper ─── */
.submit-error {
  color: var(--score-bad);
  font-weight: 700;
}

.stepper {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--sp-6);
  display: flex;
  gap: var(--sp-2);
  overflow-x: auto;
}
.stepper__item {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-pill);
  background: var(--color-bg-muted);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-3);
  white-space: nowrap;
}
.stepper__num {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--color-bg);
  display: grid;
  place-items: center;
  font-size: var(--text-xs);
  font-weight: 700;
}
.stepper__item--done {
  background: var(--score-excellent-bg);
  color: var(--score-excellent);
}
.stepper__item--done .stepper__num {
  background: var(--score-excellent);
  color: #fff;
}
.stepper__item--active {
  background: var(--color-brand-500);
  color: #fff;
}
.stepper__item--active .stepper__num {
  background: #fff;
  color: var(--color-brand-500);
}

/* ─── Card & step ─── */
.write-card { padding: var(--sp-8); }
.write-step { display: flex; flex-direction: column; gap: var(--sp-4); }
.write-step__nav {
  display: flex;
  justify-content: space-between;
  gap: var(--sp-3);
  margin-top: var(--sp-6);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--color-border);
}
.write-step__nav .btn { min-width: 100px; }
.write-step__nav .btn:only-child { margin-inline-start: auto; }

/* ─── Broker picker ─── */
.broker-pick {
  list-style: none;
  padding: 0;
  margin: var(--sp-2) 0 0;
  display: grid;
  gap: var(--sp-2);
  max-height: 360px;
  overflow-y: auto;
}
.broker-pick__btn {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--sp-3);
  align-items: center;
  width: 100%;
  padding: var(--sp-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  text-align: left;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}
.broker-pick__btn:hover { border-color: var(--color-brand-500); background: var(--color-brand-50); }
.broker-pick__name { font-weight: 700; }
.broker-pick__meta { display: flex; gap: var(--sp-3); font-size: var(--text-xs); color: var(--color-text-3); }
.broker-pick__score { color: #D4AF37; font-weight: 700; }    /* gold star */

/* ─── Experience cards ─── */
.exp-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-3);
}
@media (min-width: 600px) { .exp-grid { grid-template-columns: repeat(3, 1fr); } }
.exp-card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  padding: var(--sp-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}
.exp-card:hover { border-color: var(--color-brand-500); }
.exp-card--active {
  border-color: var(--color-brand-500);
  background: var(--color-brand-50);
  box-shadow: var(--shadow-focus);
}
.exp-card__title { font-weight: 700; }

/* ─── Chips ─── */
.chip-row { display: flex; flex-wrap: wrap; gap: var(--sp-2); }
.chip-toggle {
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}
.chip-toggle:hover { border-color: var(--color-brand-500); }
.chip-toggle--active {
  background: var(--color-brand-500);
  color: #fff;
  border-color: var(--color-brand-500);
}

/* ─── Rating form ─── */
.rating-form { display: flex; flex-direction: column; gap: var(--sp-4); }
.rating-form__row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: var(--sp-4);
  padding-block: var(--sp-3);
  border-bottom: 1px solid var(--color-border);
}
.rating-form__row:last-child { border-bottom: none; }
.rating-form__title { display: block; font-weight: 600; }
.rating-form__stars { display: flex; gap: 4px; }
.rating-form__star {
  width: 36px; height: 36px;
  font-size: 24px;
  color: var(--color-border-strong);
  cursor: pointer;
  transition: color var(--dur-fast) var(--ease-out);
}
.rating-form__star--active,
.rating-form__star:hover {
  color: #D4AF37;    /* gold, matches logo T */
}
.rating-form__num {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-1);
  min-width: 40px;
  text-align: right;
}

/* ─── Honeypot ─── */
.honeypot {
  position: absolute;
  left: -9999px;
  width: 1px; height: 1px;
  overflow: hidden;
}

/* ─── Success state ─── */
.write-step--done {
  align-items: center;
  text-align: center;
}
.write-success { padding: var(--sp-8); display: flex; flex-direction: column; align-items: center; gap: var(--sp-3); }
.write-success__icon {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: var(--score-excellent);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 32px;
  font-weight: 700;
}
</style>
