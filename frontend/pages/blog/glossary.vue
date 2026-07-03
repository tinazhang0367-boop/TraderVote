<template>
  <div class="container section">
    <header class="page-head">
      <h1>Trading Glossary</h1>
      <p class="muted">Plain-English definitions for trading jargon.</p>
    </header>
    <div class="glossary">
      <details v-for="(entry, i) in entries" :key="i" class="glossary__item">
        <summary>
          <strong>{{ entry.term }}</strong>
          <span class="glossary__short muted">{{ entry.short }}</span>
        </summary>
        <p>{{ entry.body }}</p>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
const entries = [
  { term: 'CFD',     short: 'Contract for Difference', body: 'A derivative that pays the difference between an asset\'s open and close price. You don\'t own the underlying.' },
  { term: 'Spread',  short: 'Bid-ask difference', body: 'The gap between the buy (ask) and sell (bid) price. The broker\'s main revenue source.' },
  { term: 'Leverage', short: 'Borrowed capital', body: 'A multiplier that lets you control a larger position with less capital. Amplifies gains and losses.' },
  { term: 'Pip',     short: 'Percentage in point', body: 'The smallest standard price move. For most FX pairs, 0.0001.' },
  { term: 'ECN',     short: 'Electronic Communications Network', body: 'A broker model that passes orders directly to liquidity providers, usually with tighter spreads and a per-lot commission.' },
  { term: 'STP',     short: 'Straight Through Processing', body: 'Broker model where orders are sent straight to liquidity providers without a dealing desk.' },
  { term: 'Slippage', short: 'Difference between expected and executed price', body: 'Occurs when the market moves between order placement and execution, often during volatile periods.' },
  { term: 'Margin Call', short: 'Broker demand for more funds', body: 'When account equity falls below the required margin, the broker may close positions or demand a top-up.' },
  { term: 'KYC',     short: 'Know Your Customer', body: 'Regulatory identity verification required of brokers by most financial regulators.' },
  { term: 'ICF',     short: 'Investor Compensation Fund', body: 'Cyprus-based compensation scheme covering up to €20,000 per claimant if a CySEC-regulated broker fails.' },
  { term: 'FSCS',    short: 'Financial Services Compensation Scheme', body: 'UK compensation covering up to £85,000 per claimant if an FCA-regulated broker fails.' },
  { term: 'Segregated Funds', short: 'Client money kept separate', body: 'Tier-1 regulators require brokers to hold client money in separate bank accounts from operating funds.' },
]

useSeoMeta({ title: 'Glossary — Tradervote' })
</script>

<style scoped>
.page-head { margin-bottom: var(--sp-6); }
.page-head h1 { font-size: var(--text-3xl); margin: 0 0 var(--sp-2); letter-spacing: -.01em; }
.glossary { max-width: 70ch; display: grid; gap: var(--sp-1); }
.glossary__item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0;
  background: var(--color-surface);
  transition: border-color var(--dur-fast) var(--ease-out);
}
.glossary__item[open] { border-color: var(--color-brand-500); }
.glossary__item summary {
  padding: var(--sp-3) var(--sp-4);
  cursor: pointer;
  display: flex;
  align-items: baseline;
  gap: var(--sp-2);
  list-style: none;
  font-size: var(--text-base);
}
.glossary__item summary::-webkit-details-marker { display: none; }
.glossary__item summary::before {
  content: '›';
  display: inline-block;
  transition: transform var(--dur-fast) var(--ease-out);
  color: var(--color-text-3);
  font-weight: 400;
}
.glossary__item[open] summary::before { transform: rotate(90deg); }
.glossary__short { font-size: var(--text-sm); }
.glossary__item p { padding: 0 var(--sp-4) var(--sp-3); margin: 0; color: var(--color-text-2); line-height: var(--leading-relaxed); }
</style>