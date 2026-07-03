<template>
  <div class="container section legal-page">
    <header class="page-head">
      <h1>Terms of Service</h1>
      <p class="muted">Rules for using Tradervote.</p>
    </header>
    <div class="legal-body">
      <h2>1. Service</h2>
      <p>Tradervote provides a public review platform for forex and CFD brokers. We do not provide investment advice, broker services, or financial products.</p>
      <h2>2. User accounts</h2>
      <p>You are responsible for keeping your account secure. Don't share credentials. Don't impersonate other traders or brokers.</p>
      <h2>3. Reviews</h2>
      <p>Reviews must be based on your own first-hand experience. We may remove reviews that are:</p>
      <ul>
        <li>Not from a real customer of the broker</li>
        <li>Defamatory, hateful, or harassing</li>
        <li>Spam or promotional</li>
        <li>Obvious conflicts of interest without disclosure (e.g. employee of a competitor broker)</li>
      </ul>
      <h2>4. Broker claims</h2>
      <p>Brokers can claim their profile to reply to reviews and access insights. Claiming does not influence Trust Score. Claimed profiles do not get review removal privileges, only the right to publicly respond.</p>
      <h2>5. No advice</h2>
      <p>Tradervote is informational. We do not recommend brokers, products, or strategies. Past performance is not indicative of future results.</p>
      <h2>6. Liability</h2>
      <p>Tradervote is provided "as is". We do our best to keep the platform accurate and fair, but we are not liable for trading losses or decisions made based on our content.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Terms of Service — Tradervote' })
</script>

<style scoped>
.page-head { margin-bottom: var(--sp-6); }
.page-head h1 { font-size: var(--text-3xl); margin: 0 0 var(--sp-2); letter-spacing: -.01em; }
.legal-page { max-width: 70ch; }
.legal-body h2 { font-size: var(--text-xl); margin: var(--sp-6) 0 var(--sp-2); }
.legal-body p, .legal-body ul { margin-bottom: var(--sp-3); line-height: var(--leading-relaxed); }
.legal-body li { margin-bottom: var(--sp-2); }
</style>