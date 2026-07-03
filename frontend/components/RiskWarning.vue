<template>
  <aside class="risk-warning" :class="`risk-warning--${variant}`">
    <strong>{{ $t('risk.warning_title') }}</strong>
    <p>{{ $t('risk.warning_body') }}</p>
  </aside>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'inline' | 'banner' | 'modal' }>(), { variant: 'inline' })
</script>

<style scoped>
.risk-warning {
  display: grid; gap: var(--sp-2); padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md); font-size: var(--text-xs);
}
.risk-warning--inline { background: var(--color-bg-muted); border-left: 3px solid var(--color-warning); }
.risk-warning--banner { background: #fff7e6; border: 1px solid var(--color-warning); }
.risk-warning--modal  { background: var(--color-text-1); color: #fff; }
.risk-warning strong { color: var(--color-danger); }
.risk-warning--modal strong { color: var(--color-warning); }
.risk-warning p { color: inherit; }
</style>
