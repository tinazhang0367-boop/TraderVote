<template>
  <div class="error-page">
    <section class="container section">
      <div class="error-card">
        <div class="error-card__icon" aria-hidden="true">
          <svg viewBox="0 0 96 96" width="96" height="96" fill="none">
            <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="4" stroke-dasharray="6 6" opacity=".4"/>
            <text x="48" y="58" text-anchor="middle" font-size="36" font-weight="800" fill="currentColor" font-family="Inter, system-ui, sans-serif">
              {{ statusCode }}
            </text>
          </svg>
        </div>
        <p class="error-card__eyebrow">{{ statusCode === 404 ? $t('error.not_found_eyebrow') : $t('error.error_eyebrow') }}</p>
        <h1 class="error-card__title">{{ statusCode === 404 ? $t('error.not_found_title') : $t('error.error_title') }}</h1>
        <p class="error-card__body">
          {{ statusCode === 404 ? $t('error.not_found_body') : $t('error.error_body') }}
        </p>
        <div class="error-card__actions">
          <NuxtLink :to="localePath('/')" class="btn btn--primary">
            {{ $t('error.back_home') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/brokers')" class="btn btn--ghost">
            {{ $t('error.browse_brokers') }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

const localePath = useLocalePath()

const statusCode = computed(() => props.error?.statusCode ?? 500)

useSeoMeta({
  title: () => statusCode.value === 404
    ? 'Page not found — Tradervote'
    : 'Something went wrong — Tradervote',
  description: 'The page you are looking for could not be found.',
  robots: 'noindex',
})
</script>

<style scoped>
.error-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.error-card {
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
  padding: var(--sp-12) var(--sp-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-3);
}
.error-card__icon { color: var(--color-brand-500); margin-bottom: var(--sp-2); }
.error-card__eyebrow {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--color-text-3);
}
.error-card__title {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  letter-spacing: -.02em;
}
.error-card__body {
  margin: 0;
  color: var(--color-text-2);
  line-height: var(--leading-relaxed);
  max-width: 44ch;
}
.error-card__actions {
  display: flex;
  gap: var(--sp-2);
  margin-top: var(--sp-3);
  flex-wrap: wrap;
  justify-content: center;
}
</style>
