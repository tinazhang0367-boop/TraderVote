<template>
  <NuxtLink :to="localePath(`/category/${category.slug}`)" class="cat-tile card card--hover">
    <div class="cat-tile__icon" :style="{ background: tint(category.color) }">
      <span class="cat-tile__glyph">{{ category.icon }}</span>
    </div>
    <div class="cat-tile__body">
      <h3 class="cat-tile__title">{{ category.title }}</h3>
      <p class="cat-tile__sub">{{ category.description }}</p>
    </div>
    <span class="cat-tile__arrow" aria-hidden="true">→</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { CategoryDef } from '~/data/categories'

defineProps<{
  category: CategoryDef
}>()

const localePath = useLocalePath()

function tint(hex: string): string {
  // Mix 12% of the brand color into white to get a soft tint
  if (!hex || !hex.startsWith('#')) return 'var(--color-bg-muted)'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, .12)`
}
</script>

<style scoped>
.cat-tile {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-4) var(--sp-6);
  text-decoration: none;
  color: var(--color-text-1);
}
.cat-tile:hover { text-decoration: none; }

.cat-tile__icon {
  width: 48px; height: 48px;
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}
.cat-tile__glyph { display: inline-block; }

.cat-tile__body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.cat-tile__title { font-size: var(--text-base); font-weight: 700; }
.cat-tile__sub {
  font-size: var(--text-sm);
  color: var(--color-text-3);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cat-tile__arrow {
  color: var(--color-text-3);
  font-size: var(--text-lg);
  font-weight: 600;
  transition: transform var(--dur-fast) var(--ease-out);
}
.cat-tile:hover .cat-tile__arrow {
  transform: translateX(4px);
  color: var(--color-brand-500);
}
</style>