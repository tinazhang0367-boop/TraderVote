<template>
  <div
    ref="rootEl"
    :class="[
      'lang-switcher',
      `lang-switcher--${size}`,
      { 'lang-switcher--open': open, 'lang-switcher--compact': compact },
    ]"
  >
    <button
      type="button"
      class="lang-switcher__trigger"
      :aria-expanded="open"
      :aria-haspopup="true"
      :aria-label="$t('common.language') || 'Language'"
      @click="toggle"
      @blur="onBlur"
    >
      <FlagIcon v-if="!compact" :lang="currentLocaleCode" size="xs" :title="currentName" />
      <span v-if="!compact" class="lang-switcher__name">{{ currentName }}</span>
      <span v-else class="lang-switcher__compact-label">{{ currentLocaleCode.toUpperCase() }}</span>
      <svg v-if="!compact" class="lang-switcher__caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M2 4 L5 7 L8 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <ul v-if="open" class="lang-switcher__menu" role="menu">
      <li v-for="l in availableLocales" :key="l.code" role="none">
        <button
          type="button"
          role="menuitem"
          :class="['lang-switcher__item', { active: l.code === locale }]"
          @click="setLocale(l.code); close()"
        >
          <FlagIcon :lang="l.code" size="xs" :title="l.name" />
          <span class="lang-switcher__name">{{ l.name }}</span>
          <span v-if="l.code === locale" class="lang-switcher__check" aria-hidden="true">✓</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const { locale, locales, setLocale: i18nSetLocale } = useI18n()
const router = useRouter()
const route = useRoute()

const props = withDefaults(defineProps<{
  size?: 'sm' | 'md'
  compact?: boolean
}>(), {
  size: 'sm',
  compact: false,
})

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)

function toggle() { open.value = !open.value }
function close()  { open.value = false }

function setLocale(code: string) {
  // Cast: setLocale is typed as the literal union, but the call site
  // already validates the value via the dropdown.
  ;(i18nSetLocale as (l: string) => Promise<void>)(code)
  const newPath = switchLocalePath(code)
  if (newPath && newPath !== route.fullPath) router.push(newPath)
}

function switchLocalePath(code: string): string {
  const segments = route.path.split('/').filter(Boolean)
  if (segments.length === 0) return `/${code}`
  const known = ['en','th','vi','id','zh-CN','zh-TW','ja','ko','de','fr','es','it','bg','hr','ru','ar']
  if (known.includes(segments[0])) segments.shift()
  return `/${code}${segments.length ? '/' + segments.join('/') : ''}`
}

function onBlur(e: FocusEvent) {
  const next = e.relatedTarget as Node | null
  if (!next || !(rootEl.value?.contains(next))) close()
}
function onDocClick(e: MouseEvent) {
  if (!rootEl.value) return
  if (!rootEl.value.contains(e.target as Node)) close()
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) close()
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})

const availableLocales = computed(() => {
  const declared = (locales.value as Array<{ code: string; name: string; iso?: string; dir?: 'ltr' | 'rtl' }>)
  return declared.map(l => ({ code: l.code, name: l.name, iso: l.iso, dir: l.dir }))
})

const currentLocaleCode = computed(() => String(locale.value))
const currentName = computed(() => {
  const m = availableLocales.value.find(l => l.code === locale.value)
  return m?.name ?? String(locale.value)
})
</script>

<style scoped>
.lang-switcher { position: relative; display: inline-block; }

.lang-switcher__trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  color: var(--color-text-2);
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  transition: all var(--dur-fast) var(--ease-out);
}
.lang-switcher__trigger:hover { background: var(--color-bg-muted); color: var(--color-text-1); }
.lang-switcher--open .lang-switcher__trigger { color: var(--color-text-1); background: var(--color-bg-muted); }

/* Compact — code only, tiny pill */
.lang-switcher--compact .lang-switcher__trigger {
  padding: 4px 8px;
  min-width: 38px;
  justify-content: center;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}
.lang-switcher--compact .lang-switcher__trigger:hover {
  border-color: var(--color-brand-500);
  color: var(--color-brand-600);
}
.lang-switcher__compact-label {
  font-weight: 700;
  font-size: 10px;
  letter-spacing: .04em;
  color: var(--color-text-2);
}

.lang-switcher__name { font-weight: 500; }
.lang-switcher__caret { margin-left: 2px; opacity: .6; transition: transform var(--dur-fast) var(--ease-out); }
.lang-switcher--open .lang-switcher__caret { transform: rotate(180deg); }

.lang-switcher__menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 200px;
  max-height: 320px;
  overflow-y: auto;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
}

.lang-switcher__item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: none;
  background: none;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  color: var(--color-text-1);
  text-align: left;
  cursor: pointer;
}
.lang-switcher__item:hover { background: var(--color-bg-muted); }
.lang-switcher__item.active {
  background: var(--color-brand-50);
  color: var(--color-brand-700);
  font-weight: 600;
}
.lang-switcher__item .lang-switcher__name { flex: 1; }

.lang-switcher__check { color: var(--color-brand-500); font-weight: 700; }
</style>