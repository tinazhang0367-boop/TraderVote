<template>
  <div class="container section">
    <header class="page-head">
      <h1>Contact</h1>
      <p class="muted">Get in touch with the Tradervote team.</p>
    </header>
    <div class="contact">
      <section>
        <h2>For traders</h2>
        <p>Questions about a review, your account, or to report an issue:</p>
        <p><a href="mailto:hello@tradervote.com">hello@tradervote.com</a></p>
      </section>
      <section>
        <h2>For brokers</h2>
        <p>To claim your profile, upgrade to Pro / Enterprise, or explore partnerships:</p>
        <p><a href="mailto:brokers@tradervote.com">brokers@tradervote.com</a></p>
      </section>
      <section>
        <h2>Press</h2>
        <p>Media inquiries and statistics:</p>
        <p><a href="mailto:press@tradervote.com">press@tradervote.com</a></p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Contact — Tradervote' })
</script>

<style scoped>
.page-head { margin-bottom: var(--sp-6); }
.page-head h1 { font-size: var(--text-3xl); margin: 0 0 var(--sp-2); letter-spacing: -.01em; }
.contact { max-width: 60ch; display: grid; gap: var(--sp-8); }
.contact h2 { font-size: var(--text-lg); margin: 0 0 var(--sp-2); }
.contact a { color: var(--color-brand-600); font-weight: 600; }
.contact a:hover { text-decoration: underline; }
</style>