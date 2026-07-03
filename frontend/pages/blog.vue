<template>
  <div class="container section legal-page">
    <header class="page-head">
      <h1>Blog</h1>
      <p class="muted">Forex education, market analysis, and SEA broker guides.</p>
    </header>
    <div class="blog-grid">
      <article v-for="post in posts" :key="post.slug" class="blog-card card card--hover">
        <div class="blog-card__tag">{{ post.tag }}</div>
        <h3 class="blog-card__title">{{ post.title }}</h3>
        <p class="muted blog-card__excerpt">{{ post.excerpt }}</p>
        <div class="blog-card__meta">
          <span>{{ post.date }}</span>
          <span>·</span>
          <span>{{ post.readTime }} min read</span>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Post { slug: string; tag: string; title: string; excerpt: string; date: string; readTime: number }
const posts: Post[] = [
  {
    slug: 'understanding-fca-protection',
    tag: 'Regulation',
    title: 'What the FCA FSCS £85,000 protection actually covers (and what it does not)',
    excerpt: 'Many UK traders believe the FCA protects them against all broker failure. It does not. Here is what the Financial Services Compensation Scheme actually covers in 2024.',
    date: '2026-06-15',
    readTime: 6,
  },
  {
    slug: 'why-spread-matters',
    tag: 'Education',
    title: 'Why a 0.6-pip spread difference costs you $3,000 a year',
    excerpt: 'Spread differences look small in isolation, but compound quickly. Here is a worked example with a real position size.',
    date: '2026-06-08',
    readTime: 4,
  },
  {
    slug: 'offshore-brokers-thailand',
    tag: 'Warning',
    title: 'The 5 offshore brokers Thai traders are filing complaints about this month',
    excerpt: 'Aggregated complaint patterns from our review queue. Names withheld, patterns not.',
    date: '2026-06-01',
    readTime: 5,
  },
]
useSeoMeta({ title: 'Blog — Tradervote' })
</script>

<style scoped>
.page-head { margin-bottom: var(--sp-6); }
.page-head h1 { font-size: var(--text-3xl); margin: 0 0 var(--sp-2); letter-spacing: -.01em; }
.blog-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-4);
}
@media (min-width: 700px) { .blog-grid { grid-template-columns: repeat(3, 1fr); } }
.blog-card { display: flex; flex-direction: column; gap: var(--sp-2); }
.blog-card__tag {
  display: inline-flex;
  padding: 2px 10px;
  border-radius: var(--radius-pill);
  background: var(--color-brand-50);
  color: var(--color-brand-700);
  font-size: var(--text-xs);
  font-weight: 700;
  width: fit-content;
}
.blog-card__title { margin: 0; font-size: var(--text-base); }
.blog-card__excerpt { margin: 0; font-size: var(--text-sm); }
.blog-card__meta { display: flex; gap: 6px; font-size: var(--text-xs); color: var(--color-text-3); margin-top: auto; }
</style>