<template>
  <footer class="site-footer">
    <aside class="risk-warning risk-warning--banner risk-warning--dark container">
      <strong>{{ $t('risk.warning_title') }}</strong>
      <p>{{ $t('risk.warning_body') }}</p>
    </aside>

    <div class="container site-footer__grid">
      <section class="site-footer__brand-section">
        <NuxtLink :to="localePath('/')" class="site-footer__logo-link">
          <SiteLogo size="lg" variant="full" />
        </NuxtLink>
        <p class="site-footer__tagline muted">{{ $t('footer.tagline') }}</p>
        <p class="site-footer__meta muted text-xs">
          {{ $t('footer.independent') }}
        </p>
      </section>

      <section>
        <h4>{{ $t('nav.brokers') }}</h4>
        <ul>
          <li><NuxtLink :to="localePath('/top')">{{ $t('footer.top_brokers') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/regulators')">{{ $t('footer.regulators') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/write-review')">{{ $t('nav.write_review') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/promotions')">{{ $t('nav.promotions') }}</NuxtLink></li>
        </ul>
      </section>

      <section>
        <h4>{{ $t('footer.learn') }}</h4>
        <ul>
          <li><NuxtLink :to="localePath('/methodology')">{{ $t('footer.methodology') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/learn/regulation')">{{ $t('footer.regulation_guide') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/blog/glossary')">{{ $t('footer.glossary') }}</NuxtLink></li>
        </ul>
      </section>

      <section>
        <h4>{{ $t('footer.company') }}</h4>
        <ul>
          <li><NuxtLink :to="localePath('/about')">{{ $t('footer.about') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/contact')">{{ $t('footer.contact') }}</NuxtLink></li>
        </ul>
      </section>

      <section class="site-footer__lang">
        <h4>🌐 {{ $t('footer.language') }}</h4>
        <LanguageSwitcher compact />
      </section>
    </div>

    <div class="container site-footer__legal">
      <span>{{ $t('footer.copyright') }}</span>
      <div class="site-footer__legal-links">
        <NuxtLink :to="localePath('/risk-disclosure')">{{ $t('footer.risk') }}</NuxtLink>
        <NuxtLink :to="localePath('/privacy')">{{ $t('footer.privacy') }}</NuxtLink>
        <NuxtLink :to="localePath('/terms')">{{ $t('footer.terms') }}</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>

<style scoped>
.site-footer {
  /* Deep navy gradient echoes the brand — footer becomes a brand surface */
  background:
    linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
  color: #E2E8F0;
  margin-top: var(--sp-16);
  padding-block: var(--sp-12) var(--sp-6);
  position: relative;
  overflow: hidden;
}
/* Decorative K-line + TV mark in the footer corner — gold + teal */
.site-footer::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 320px;
  height: 100%;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 400' preserveAspectRatio='xMaxYMin slice'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%2314B8A6' stop-opacity='0.18'/><stop offset='1' stop-color='%23D4AF37' stop-opacity='0.06'/></linearGradient></defs><path d='M280 350 L240 320 L200 335 L160 280 L120 290 L80 240 L40 250 L0 200' fill='none' stroke='url(%23g)' stroke-width='2' opacity='0.5'/></svg>");
  background-size: contain;
  background-repeat: no-repeat;
  pointer-events: none;
  opacity: .55;
}

.site-footer__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-8);
  position: relative;
  z-index: 1;
}
@media (min-width: 700px) {
  .site-footer__grid { grid-template-columns: 2fr 1fr 1fr 1fr 1fr; }
}

/* ─── Brand section ─── */
.site-footer__brand-section {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.site-footer__logo-link {
  display: inline-flex;
  align-items: center;
  margin-bottom: var(--sp-4);
  text-decoration: none;
  max-width: 240px;
}
.site-footer__logo-link:hover { text-decoration: none; }
.site-footer__slogan {
  margin: 0 0 var(--sp-2);
  font-size: var(--text-base);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -.005em;
}
.site-footer__slogan--white { color: #F8FAFC; font-weight: 700; }                /* near-white, NOT gold (avoid colour clash with broker cards) */
.site-footer__slogan--teal  { color: #5EEAD4; font-weight: 700; }                /* Bright teal (matches V) */
.site-footer__tagline {
  margin: var(--sp-2) 0 var(--sp-1);
  color: #94A3B8;
  font-size: var(--text-sm);
  max-width: 36ch;
}
.site-footer__meta { margin: 0; color: #64748B; font-size: var(--text-xs); }

.site-footer h4 {
  font-size: var(--text-xs);
  font-weight: 700;
  margin: 0 0 var(--sp-3);
  text-transform: uppercase;
  letter-spacing: .06em;
  color: #94A3B8;
}
.site-footer ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-2);
}
.site-footer li a {
  font-size: var(--text-sm);
  color: #CBD5E1;
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-out);
}
.site-footer li a:hover { color: #5EEAD4; text-decoration: underline; text-decoration-color: #5EEAD4; }

/* ─── Dark risk warning override (used inside the navy footer) ─── */
.risk-warning--dark {
  background: rgba(239, 68, 68, .08);
  border: 1px solid rgba(239, 68, 68, .35);
  color: #FCA5A5;
  margin-bottom: var(--sp-8);
}
.risk-warning--dark strong { color: #FCA5A5; }
.risk-warning--dark p { color: #FCA5A5; opacity: .9; }

.site-footer__legal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-top: var(--sp-8);
  padding-top: var(--sp-4);
  border-top: 1px solid #1E293B;
  font-size: var(--text-xs);
  color: #94A3B8;
}
.site-footer__legal-links { display: flex; gap: var(--sp-4); flex-wrap: wrap; }
.site-footer__legal-links a { color: #94A3B8; text-decoration: none; transition: color var(--dur-fast) var(--ease-out); }
.site-footer__legal-links a:hover { color: #5EEAD4; text-decoration: underline; }
</style>
