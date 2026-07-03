<!--
  HeroAmbient — abstract background art used on the homepage hero.
  Pure SVG, inline, no external dependency.  Inspired by TradingView's
  subtle "data-rhythm" feel: layered soft gradients + faint sparkline
  silhouettes.  Designed to render behind text without competing for
  attention.  Pointer-events disabled so it never intercepts clicks.
-->
<template>
  <div class="hero-ambient" aria-hidden="true">
    <svg
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      class="hero-ambient__svg"
    >
      <defs>
        <!-- Base wash gradient -->
        <linearGradient id="ambient-wash" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#eef3ff" stop-opacity="0.95" />
          <stop offset="60%" stop-color="#f7f9fc" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>

        <!-- Glow blob behind search box -->
        <radialGradient id="ambient-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#2962FF" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#2962FF" stop-opacity="0" />
        </radialGradient>

        <!-- Dotted grid mask -->
        <pattern id="ambient-dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1" fill="#1652f0" fill-opacity="0.06" />
        </pattern>
      </defs>

      <!-- Base wash -->
      <rect width="1200" height="400" fill="url(#ambient-wash)" />

      <!-- Dot grid -->
      <rect width="1200" height="400" fill="url(#ambient-dots)" />

      <!-- Soft glow behind hero -->
      <circle cx="600" cy="200" r="320" fill="url(#ambient-glow)" />

      <!-- Faint sparkline silhouettes (3 different shapes for rhythm) -->
      <g opacity="0.32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path
          d="M-20 320 L80 290 L160 305 L240 250 L320 270 L400 200 L480 220 L560 160 L640 180 L720 110 L800 140 L880 80 L960 100 L1040 60 L1120 70 L1200 30"
          stroke="#2962FF"
        />
        <path
          d="M-20 350 L80 335 L160 340 L240 310 L320 320 L400 280 L480 290 L560 250 L640 270 L720 220 L800 240 L880 200 L960 220 L1040 180 L1120 200 L1200 170"
          stroke="#26a69a"
        />
      </g>

      <!-- Scatter dots — like data points on a chart -->
      <g opacity="0.4">
        <circle cx="240" cy="180" r="3" fill="#2962FF" />
        <circle cx="450" cy="120" r="3" fill="#2962FF" />
        <circle cx="640" cy="160" r="3" fill="#26a69a" />
        <circle cx="820" cy="100" r="3" fill="#2962FF" />
        <circle cx="980" cy="60" r="3" fill="#26a69a" />
      </g>

      <!-- Vertical "ticker" bars -->
      <g opacity="0.18" fill="#1652f0">
        <rect x="60" y="80" width="3" height="40" />
        <rect x="80" y="100" width="3" height="20" />
        <rect x="100" y="70" width="3" height="50" />
        <rect x="120" y="90" width="3" height="30" />
        <rect x="1060" y="60" width="3" height="50" />
        <rect x="1080" y="80" width="3" height="30" />
        <rect x="1100" y="50" width="3" height="60" />
        <rect x="1120" y="70" width="3" height="40" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.hero-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.hero-ambient__svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>