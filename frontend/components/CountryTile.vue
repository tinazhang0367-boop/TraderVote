<template>
  <NuxtLink :to="localePath(`/countries/${country.code}`)" class="country-tile card card--hover">
    <FlagIcon :code="country.alpha2 ?? country.code" size="lg" />
    <span class="country-tile__name">{{ name }}</span>
    <span class="country-tile__count">
      {{ $t('country.broker_count', { count: country.brokerCount }) }}
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Country } from '~/types/broker'

const props = defineProps<{
  country: Country
}>()

const localePath = useLocalePath()
const { t } = useI18n()

const name = computed(() => {
  // Try i18n first, fall back to country.name
  return t(`countries.${props.country.code}` as any, { default: props.country.name })
})
</script>

<style scoped>
.country-tile {
  display: grid;
  gap: var(--sp-2);
  padding: var(--sp-4);
  text-decoration: none;
  color: var(--color-text-1);
}
.country-tile:hover { text-decoration: none; }
.country-tile__name { font-weight: 600; font-size: var(--text-sm); }
.country-tile__count { font-size: var(--text-xs); color: var(--color-text-3); }
</style>