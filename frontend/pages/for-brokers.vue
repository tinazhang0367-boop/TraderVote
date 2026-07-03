<template>
  <div class="for-brokers-page">
    <!-- Hero -->
    <section class="fb-hero">
      <div class="container fb-hero__inner">
        <p class="hero__eyebrow">For Brokers</p>
        <h1 class="fb-hero__title">{{ $t('for_brokers.title') }}</h1>
        <p class="fb-hero__sub">{{ $t('for_brokers.subtitle') }}</p>
        <div class="fb-hero__cta">
          <a href="mailto:brokers@tradervote.com" class="btn btn--primary btn--lg">
            {{ $t('for_brokers.cta_contact') }}
          </a>
          <span class="muted text-sm">
            Free to claim. No credit card.
          </span>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="container section">
      <h2 class="text-center">{{ $t('for_brokers.cta_title') }}</h2>
      <p class="muted text-center" style="max-width: 60ch; margin-inline: auto">{{ $t('for_brokers.cta_sub') }}</p>

      <div class="benefit-grid">
        <article class="card benefit">
          <div class="benefit__icon">🏆</div>
          <h3 class="benefit__title">{{ $t('for_brokers.benefit_reputation') }}</h3>
          <p class="muted">{{ $t('for_brokers.benefit_reputation_body') }}</p>
        </article>
        <article class="card benefit">
          <div class="benefit__icon">📈</div>
          <h3 class="benefit__title">{{ $t('for_brokers.benefit_seo') }}</h3>
          <p class="muted">{{ $t('for_brokers.benefit_seo_body') }}</p>
        </article>
        <article class="card benefit">
          <div class="benefit__icon">📊</div>
          <h3 class="benefit__title">{{ $t('for_brokers.benefit_insights') }}</h3>
          <p class="muted">{{ $t('for_brokers.benefit_insights_body') }}</p>
        </article>
      </div>
    </section>

    <!-- Pricing -->
    <section class="container section">
      <h2 class="text-center">{{ $t('for_brokers.pricing_title') }}</h2>
      <div class="pricing-grid">
        <article class="card plan">
          <h3 class="plan__title">{{ $t('for_brokers.plan_free') }}</h3>
          <div class="plan__price">$0<span>/mo</span></div>
          <p class="muted">{{ $t('for_brokers.plan_free_body') }}</p>
          <a href="mailto:brokers@tradervote.com?subject=Claim" class="btn btn--ghost btn--block">
            {{ $t('for_brokers.cta_claim') }}
          </a>
        </article>
        <article class="card plan plan--featured">
          <span class="plan__badge">Popular</span>
          <h3 class="plan__title">{{ $t('for_brokers.plan_pro') }}</h3>
          <div class="plan__price">$199<span>/mo</span></div>
          <p class="muted">{{ $t('for_brokers.plan_pro_body') }}</p>
          <a href="mailto:brokers@tradervote.com?subject=Pro plan" class="btn btn--primary btn--block">
            {{ $t('for_brokers.cta_contact') }}
          </a>
        </article>
        <article class="card plan">
          <h3 class="plan__title">{{ $t('for_brokers.plan_enterprise') }}</h3>
          <div class="plan__price">Custom</div>
          <p class="muted">{{ $t('for_brokers.plan_enterprise_body') }}</p>
          <a href="mailto:brokers@tradervote.com?subject=Enterprise plan" class="btn btn--ghost btn--block">
            {{ $t('for_brokers.cta_contact') }}
          </a>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Tradervote for brokers — SEO, replies and trust insights',
  description: 'Turn your Tradervote TrustScore into trust. Reply to reviews, embed SEO widgets, get insights.',
})
</script>

<style scoped>
/* Hero — reuses home hero styles */
.fb-hero {
  background: linear-gradient(180deg, var(--color-brand-50) 0%, var(--color-bg) 100%);
  padding-block: var(--sp-16);
  text-align: center;
}
.fb-hero__inner { display: flex; flex-direction: column; align-items: center; gap: var(--sp-3); }
.hero__eyebrow {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--color-brand-600);
}
.fb-hero__title {
  font-size: clamp(2rem, 5vw, var(--text-5xl));
  margin: 0;
  max-width: 18ch;
}
.fb-hero__sub {
  margin: 0;
  font-size: var(--text-base);
  color: var(--color-text-2);
  max-width: 60ch;
}
.fb-hero__cta { display: flex; align-items: center; gap: var(--sp-3); margin-top: var(--sp-3); }

/* Benefits */
.benefit-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-4);
  margin-top: var(--sp-8);
}
@media (min-width: 700px) { .benefit-grid { grid-template-columns: repeat(3, 1fr); } }
.benefit { display: flex; flex-direction: column; gap: var(--sp-2); }
.benefit__icon { font-size: var(--text-3xl); }
.benefit__title { margin: 0; font-size: var(--text-lg); font-weight: 700; }

/* Pricing */
.pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-4);
  margin-top: var(--sp-8);
}
@media (min-width: 700px) { .pricing-grid { grid-template-columns: repeat(3, 1fr); } }
.plan { display: flex; flex-direction: column; gap: var(--sp-3); position: relative; }
.plan__title { margin: 0; font-size: var(--text-xl); }
.plan__price {
  font-size: var(--text-4xl);
  font-weight: 800;
  color: var(--color-text-1);
  line-height: 1;
}
.plan__price span { font-size: var(--text-base); font-weight: 500; color: var(--color-text-3); }
.plan--featured {
  border-color: var(--color-brand-500);
  border-width: 2px;
  background: var(--color-brand-50);
}
.plan__badge {
  position: absolute;
  top: -10px;
  right: var(--sp-4);
  padding: 2px 12px;
  border-radius: var(--radius-pill);
  background: var(--color-brand-500);
  color: #fff;
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .04em;
}
</style>