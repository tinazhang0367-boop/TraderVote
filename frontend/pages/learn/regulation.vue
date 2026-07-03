<template>
  <div class="container section legal-page">
    <header class="page-head">
      <h1>Regulation guide</h1>
      <p class="muted">A primer on FX regulation tiers, jurisdictions, and what each one actually protects.</p>
    </header>
    <div class="legal-body">
      <h2>What is a regulator?</h2>
      <p>
        A financial regulator is a government or quasi-government body that
        supervises brokers. They enforce capital requirements, license
        standards, segregation of client funds, complaint handling, and
        sometimes offer statutory investor compensation if a broker fails.
      </p>
      <h2>Tier 1 — Strong oversight</h2>
      <p>
        Top-tier regulators (FCA, ASIC, BaFin, MAS, CySEC) conduct active
        supervision and offer some form of investor compensation. Examples:
      </p>
      <ul>
        <li><strong>FCA (UK)</strong> — £85,000 per claimant via FSCS</li>
        <li><strong>ASIC (Australia)</strong> — Segregated funds required; no statutory compensation</li>
        <li><strong>BaFin (Germany)</strong> — €100,000 deposit protection</li>
      </ul>
      <h2>Tier 2 — Mid-tier</h2>
      <p>
        Adequate regulation but typically no compensation scheme. Examples:
        FSCA (South Africa).
      </p>
      <h2>Tier 3 — Light-touch</h2>
      <p>
        Limited regulatory supervision. Examples: IFSC (Belize).
      </p>
      <h2>Offshore / Unverified</h2>
      <p>
        Offshore jurisdictions like St. Vincent & the Grenadines do not
        regulate FX trading at all. "SVG FSA" registrations are company
        registry listings, not financial regulation. Brokers using these
        designations are not subject to capital or conduct rules, and offer
        no investor protection if they fail.
      </p>
      <h2>EU passporting</h2>
      <p>
        Brokers regulated by an EU member state (commonly CySEC) can
        "passport" their services to other EEA countries. This means a
        CySEC-regulated broker can serve German, French, and Italian
        clients. The home regulator (CySEC, in this case) remains the
        primary supervisor.
      </p>
      <h2>Multi-regulation</h2>
      <p>
        Many serious brokers hold multiple licenses (e.g. Exness holds
        CySEC, FCA, FSA, CMA). This gives clients access to multiple
        compensation schemes and means the broker is supervised by more
        than one authority. It's a positive signal.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Regulation Guide — Tradervote' })
</script>

<style scoped>
.page-head { margin-bottom: var(--sp-6); }
.page-head h1 { font-size: var(--text-3xl); margin: 0 0 var(--sp-2); letter-spacing: -.01em; }
.legal-page { max-width: 70ch; }
.legal-body h2 { font-size: var(--text-xl); margin: var(--sp-6) 0 var(--sp-2); }
.legal-body p, .legal-body ul { margin-bottom: var(--sp-3); line-height: var(--leading-relaxed); }
.legal-body li { margin-bottom: var(--sp-2); }
</style>