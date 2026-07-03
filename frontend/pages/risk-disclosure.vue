<template>
  <div class="container section legal-page">
    <header class="page-head">
      <h1>Risk Disclosure</h1>
      <p class="muted">Trading leveraged products carries significant risk.</p>
    </header>
    <div class="legal-body">
      <p>
        <strong>CFDs are complex instruments and come with a high risk of losing money
        rapidly due to leverage.</strong> Between 70% and 80% of retail investor
        accounts lose money when trading CFDs with margin. You should consider
        whether you understand how these instruments work and whether you can
        afford to take the high risk of losing your money.
      </p>
      <h2>Specific risks</h2>
      <ul>
        <li><strong>Market risk</strong> — prices can move against you rapidly, especially around news events.</li>
        <li><strong>Liquidity risk</strong> — some instruments may be impossible to close at a fair price.</li>
        <li><strong>Counterparty risk</strong> — your broker may fail (especially with offshore / unregulated brokers). This is why regulator tier matters.</li>
        <li><strong>Platform risk</strong> — software outages, slippage, requotes, and stop-loss gaps can turn winning trades into losses.</li>
        <li><strong>Currency risk</strong> — for non-USD accounts, exchange-rate moves add another layer of risk.</li>
        <li><strong>Bonus restrictions</strong> — deposit bonuses often come with turnover requirements that make withdrawals impossible until the bonus is fully "earned".</li>
      </ul>
      <h2>What Tradervote does</h2>
      <p>
        Tradervote does not provide investment advice. Our Trust Score and
        AI summaries are informational only, based on aggregated trader
        reviews. They do not predict future performance. You should always
        do your own research and consider consulting a licensed financial
        advisor in your jurisdiction.
      </p>
      <h2>Regulator-specific protections</h2>
      <p>
        Some regulators offer statutory investor compensation (e.g. FCA's
        FSCS, ASIC's schemes, CySEC's ICF). These typically cover a limited
        amount per claimant and only certain failure modes. Offshore and
        unverified brokers offer no such protection.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Risk Disclosure — Tradervote' })
</script>

<style scoped>
.page-head { margin-bottom: var(--sp-6); }
.page-head h1 { font-size: var(--text-3xl); margin: 0 0 var(--sp-2); letter-spacing: -.01em; }
.legal-page { max-width: 70ch; }
.legal-body h2 { font-size: var(--text-xl); margin: var(--sp-6) 0 var(--sp-2); }
.legal-body p, .legal-body ul { margin-bottom: var(--sp-3); line-height: var(--leading-relaxed); }
.legal-body li { margin-bottom: var(--sp-2); }
</style>