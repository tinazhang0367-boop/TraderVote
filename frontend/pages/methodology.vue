<template>
  <div class="container section">
    <header class="page-head">
      <h1>Methodology</h1>
      <p class="muted">How Tradervote scores brokers.</p>
    </header>
    <div class="methodology">
      <h2>Trust Score</h2>
      <p>
        Trust Score is a 0–5 weighted average. Bands are:
      </p>
      <ul>
        <li><strong>4.5–5.0 — Excellent</strong> (green): tier-1 regulated, fast withdrawals, low complaint volume</li>
        <li><strong>4.0–4.4 — Great</strong> (light green): strong regulatory coverage, generally positive reviews</li>
        <li><strong>3.5–3.9 — Average</strong> (yellow): mixed reviews, some friction</li>
        <li><strong>3.0–3.4 — Poor</strong> (orange): significant complaint volume or weak regulation</li>
        <li><strong>&lt;3.0 — Bad</strong> (red): systemic issues, offshore-only, or regulator warnings</li>
      </ul>

      <h2>Weights</h2>
      <ul>
        <li><strong>Verified trader reviews (60%)</strong> — last 12 months, deduped, with proof preferred</li>
        <li><strong>Regulation tier (20%)</strong> — Tier-1 (FCA, ASIC, BaFin, CySEC, MAS) → Tier-3 → Offshore</li>
        <li><strong>Withdrawal speed (10%)</strong> — last 90 days of review mentions</li>
        <li><strong>Spread competitiveness (10%)</strong> — relative to category average</li>
      </ul>

      <h2>Review verification</h2>
      <p>
        Reviews can be marked "Verified" if the author uploads a screenshot
        of a deposit or withdrawal. Verified reviews are weighted higher
        and surface a verified badge.
      </p>

      <h2>What we don't do</h2>
      <ul>
        <li>No paid placements or boosted reviews.</li>
        <li>No edit of negative reviews.</li>
        <li>No sale of trader leads to brokers.</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Methodology — Tradervote' })
</script>

<style scoped>
.page-head { margin-bottom: var(--sp-6); }
.page-head h1 { font-size: var(--text-3xl); margin: 0 0 var(--sp-2); letter-spacing: -.01em; }
.methodology { max-width: 70ch; }
.methodology h2 { font-size: var(--text-xl); margin: var(--sp-6) 0 var(--sp-2); }
.methodology p, .methodology ul { margin-bottom: var(--sp-3); line-height: var(--leading-relaxed); }
.methodology li { margin-bottom: var(--sp-2); }
</style>