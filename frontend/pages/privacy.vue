<template>
  <div class="container section legal-page">
    <header class="page-head">
      <h1>Privacy Policy</h1>
      <p class="muted">How we collect, use, and protect your data.</p>
    </header>
    <div class="legal-body">
      <h2>Information we collect</h2>
      <ul>
        <li>Account information you provide (display name, country, experience level)</li>
        <li>Reviews you submit (text, ratings, optional screenshot uploads)</li>
        <li>Email address (used only to verify reviews and important account actions)</li>
        <li>Standard web analytics (pages visited, browser type, country — anonymized)</li>
      </ul>
      <h2>What we never do</h2>
      <ul>
        <li>Sell your personal data to third parties</li>
        <li>Share your email with brokers (claimed profiles get aggregated, anonymized engagement stats only)</li>
        <li>Display your email publicly on the site</li>
      </ul>
      <h2>Your rights</h2>
      <ul>
        <li>Request a copy of all data we hold about you</li>
        <li>Delete your account and all associated data</li>
        <li>Edit or remove any review you wrote</li>
      </ul>
      <p>Email <a href="mailto:privacy@tradervote.com">privacy@tradervote.com</a> for any privacy-related request.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Privacy Policy — Tradervote' })
</script>

<style scoped>
.page-head { margin-bottom: var(--sp-6); }
.page-head h1 { font-size: var(--text-3xl); margin: 0 0 var(--sp-2); letter-spacing: -.01em; }
.legal-page { max-width: 70ch; }
.legal-body h2 { font-size: var(--text-xl); margin: var(--sp-6) 0 var(--sp-2); }
.legal-body p, .legal-body ul { margin-bottom: var(--sp-3); line-height: var(--leading-relaxed); }
.legal-body li { margin-bottom: var(--sp-2); }
.legal-body a { color: var(--color-brand-600); }
</style>