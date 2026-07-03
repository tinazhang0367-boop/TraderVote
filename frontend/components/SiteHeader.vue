<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <!-- Brand -->
      <NuxtLink :to="localePath('/')" class="site-header__brand">
        <SiteLogo size="md" show-text />
      </NuxtLink>

      <!-- Primary nav (desktop only) -->
      <nav class="site-header__nav" aria-label="Primary">
        <NuxtLink :to="localePath('/brokers')" class="site-header__link">{{ $t('nav.brokers') }}</NuxtLink>
        <NuxtLink :to="localePath('/regulators')" class="site-header__link">{{ $t('nav.regulators') }}</NuxtLink>
        <NuxtLink :to="localePath('/top')" class="site-header__link">{{ $t('nav.top') }}</NuxtLink>
        <NuxtLink :to="localePath('/reviews')" class="site-header__link">{{ $t('nav.reviews') }}</NuxtLink>
        <NuxtLink :to="localePath('/promotions')" class="site-header__link">{{ $t('nav.promotions') }}</NuxtLink>
      </nav>

      <!-- Right actions -->
      <div class="site-header__actions">
        <NuxtLink :to="localePath('/write-review')" class="site-header__write">
          {{ $t('nav.write_review') }}
        </NuxtLink>

        <div class="site-header__divider" aria-hidden="true"/>

        <NuxtLink :to="localePath('/login')" class="site-header__login">
          登录
        </NuxtLink>

        <LanguageSwitcher compact />

        <button
          type="button"
          class="site-header__menu-toggle"
          :aria-expanded="mobileOpen"
          aria-label="Toggle menu"
          @click="mobileOpen = !mobileOpen"
        >
          <span aria-hidden="true">{{ mobileOpen ? '✕' : '☰' }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile menu drawer -->
    <Transition name="slide-down">
      <div v-if="mobileOpen" class="site-header__mobile">
        <NuxtLink v-for="link in mobileLinks" :key="link.path" :to="localePath(link.path)" class="site-header__mobile-link" @click="mobileOpen = false">
          {{ $t(link.label) }}
        </NuxtLink>
        <div class="site-header__mobile-divider"/>
        <NuxtLink :to="localePath('/write-review')" class="site-header__mobile-link site-header__mobile-link--accent" @click="mobileOpen = false">
          ✍ {{ $t('nav.write_review') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/for-brokers')" class="site-header__mobile-link" @click="mobileOpen = false">
          {{ $t('nav.for_brokers') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/login')" class="site-header__mobile-link" @click="mobileOpen = false">
          登录 / 后台
        </NuxtLink>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const mobileOpen = ref(false)

const mobileLinks = [
  { path: '/brokers',    label: 'nav.brokers' },
  { path: '/regulators', label: 'nav.regulators' },
  { path: '/top',        label: 'nav.top' },
  { path: '/reviews',    label: 'nav.reviews' },
  { path: '/promotions', label: 'nav.promotions' },
]

const route = useRoute()
watch(() => route.fullPath, () => { mobileOpen.value = false })
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: rgba(255, 255, 255, .96);
  backdrop-filter: saturate(180%) blur(10px);
  -webkit-backdrop-filter: saturate(180%) blur(10px);
  border-bottom: 1px solid var(--color-border);
}

.site-header__inner {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  height: 72px;
  min-height: 72px;
}

/* Brand */
.site-header__brand {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
  position: relative;
  padding: 4px 3px;
  border-radius: var(--radius-md);
  transition: background var(--dur-fast) var(--ease-out);
}
.site-header__brand:hover {
  text-decoration: none;
  background: linear-gradient(135deg, rgba(212, 175, 55, .05) 0%, rgba(20, 184, 166, .05) 100%);
}

/* Primary nav (hidden on mobile, shown ≥960px) */
.site-header__nav {
  display: none;
  align-items: center;
  gap: 2px;
  margin-inline-start: var(--sp-2);
  flex: 0 1 auto;
}
@media (min-width: 960px) {
  .site-header__nav { display: flex; }
}
.site-header__link {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  color: var(--color-text-2);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out);
}
.site-header__link:hover {
  color: var(--color-text-1);
  background: var(--color-bg-muted);
  text-decoration: none;
}
.site-header__link.router-link-active {
  color: var(--color-brand-600);
  font-weight: 700;
  background: var(--color-brand-50);
}

/* Right side actions */
.site-header__actions {
  margin-inline-start: auto;
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

/* Write review — primary CTA */
.site-header__write {
  display: inline-flex;
  align-items: center;
  padding: 7px 14px;
  background: var(--color-brand-500);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: background var(--dur-fast) var(--ease-out);
}
.site-header__write:hover {
  background: var(--color-brand-600);
  text-decoration: none;
}
.site-header__write.router-link-active {
  background: var(--color-brand-600);
}
.site-header__login {
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  color: var(--color-text-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}
.site-header__login:hover {
  color: var(--color-brand-600);
  background: var(--color-brand-50);
  text-decoration: none;
}
@media (max-width: 639px) {
  .site-header__write,
  .site-header__login { display: none; }
}

/* Divider between CTAs and utility */
.site-header__divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
  margin: 0 var(--sp-1);
}
@media (max-width: 639px) {
  .site-header__divider { display: none; }
}

/* Mobile menu toggle — only mobile */
.site-header__menu-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  font-size: var(--text-base);
  cursor: pointer;
  flex-shrink: 0;
}
@media (min-width: 960px) {
  .site-header__menu-toggle { display: none; }
}

/* Mobile menu drawer */
.site-header__mobile {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--sp-3) var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-shadow: var(--shadow-md);
  z-index: var(--z-sticky);
  max-height: calc(100vh - 68px);
  overflow-y: auto;
}
.site-header__mobile-link {
  display: flex;
  align-items: center;
  padding: var(--sp-3) var(--sp-3);
  border-radius: var(--radius-sm);
  color: var(--color-text-1);
  font-weight: 500;
  text-decoration: none;
  font-size: var(--text-base);
  min-height: 44px;
}
.site-header__mobile-link:hover { background: var(--color-bg-muted); text-decoration: none; }
.site-header__mobile-link.router-link-active { color: var(--color-brand-600); font-weight: 700; background: var(--color-brand-50); }
.site-header__mobile-link--accent { color: var(--color-brand-600); font-weight: 700; }
.site-header__mobile-divider { height: 1px; background: var(--color-border); margin: var(--sp-2) 0; }

.slide-down-enter-active, .slide-down-leave-active {
  transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out);
}
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
