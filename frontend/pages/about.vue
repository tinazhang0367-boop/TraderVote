<template>
  <div class="container section">
    <header class="page-head">
      <h1>About Tradervote</h1>
      <p class="muted">Independent margin-trading reviews since 2019.</p>
    </header>
    <div class="about">
      <p>
        Tradervote is a Trustpilot-style review platform built specifically for
        the forex and CFD industry. We collect verified trader reviews, surface
        regulator licenses, and rank brokers using a transparent methodology
        that puts weight on what actually matters to real traders: withdrawal
        speed, regulation tier, platform reliability, and pricing.
      </p>
      <p>
        We do not sell leads, run paid placements, or accept payment to
        influence Trust Scores. Broker subscriptions unlock operational
        features (replies, insights) but never the score itself.
      </p>
      <h2>Methodology</h2>
      <p>
        Trust Score is a 0–5 weighted average of: verified trader reviews
        (60%), regulator tier (20%), withdrawal speed (10%), spread
        competitiveness (10%). Reviews are de-duplicated, validated against
        withdrawal proof where supplied, and re-weighted quarterly.
      </p>
      <h2>Team</h2>
      <p>
        Tradervote is operated by a small independent team based in
        Southeast Asia. We focus on traders in TH, VN, ID, MY, PH, SG and
        publish English, Thai, Vietnamese, Indonesian, and Simplified
        Chinese.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'About — Tradervote' })
</script>

<style scoped>
.page-head { margin-bottom: var(--sp-6); }
.page-head h1 { font-size: var(--text-3xl); margin: 0 0 var(--sp-2); letter-spacing: -.01em; }
.about { max-width: 70ch; }
.about h2 { font-size: var(--text-xl); margin: var(--sp-6) 0 var(--sp-2); }
.about p { margin-bottom: var(--sp-3); line-height: var(--leading-relaxed); }
</style>