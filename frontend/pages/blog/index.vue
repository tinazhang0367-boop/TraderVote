<template>
  <div class="container section">
    <header class="blog-head">
      <h1>{{ $t('blog.title') }}</h1>
      <p class="blog-sub">{{ $t('blog.subtitle') }}</p>
    </header>

    <div v-if="pending" class="loading">{{ $t('common.loading') }}</div>
    <div v-else class="blog-grid">
      <article v-for="post in posts" :key="post.slug" class="blog-card">
        <NuxtLink :to="localePath(`/blog/${post.slug}`)" class="blog-card__cover" :style="{ background: post.coverColor }">
          <span class="blog-card__category">{{ post.category }}</span>
        </NuxtLink>
        <h2 class="blog-card__title">
          <NuxtLink :to="localePath(`/blog/${post.slug}`)">{{ post.title }}</NuxtLink>
        </h2>
        <p class="blog-card__excerpt">{{ post.excerpt }}</p>
        <div class="blog-card__meta">
          <span>{{ post.readingTime }} min read</span>
          <span>·</span>
          <span>{{ post.locale.toUpperCase() }}</span>
          <span>·</span>
          <time>{{ formatDate(post.publishedAt) }}</time>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

interface Post {
  slug: string; title: string; excerpt: string; category: string;
  readingTime: number; locale: string; publishedAt: string; coverColor: string;
}

const { data: posts, pending } = await useFetch<Post[]>('/api/blog/posts', { default: () => [] })

useSeoMeta({
  title: 'Blog — Tradervote',
  description: 'Forex education, market analysis and SEA broker guides.',
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.section { padding: var(--sp-12) 0; }
.blog-head { margin-bottom: var(--sp-8); }
.blog-sub { color: var(--color-text-3); margin-top: var(--sp-2); }
.blog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--sp-6); }
.blog-card { display: flex; flex-direction: column; gap: var(--sp-2); }
.blog-card__cover { aspect-ratio: 16/9; border-radius: var(--radius-lg); padding: var(--sp-3); display: flex; align-items: end; text-decoration: none; }
.blog-card__category { background: rgba(255,255,255,.15); backdrop-filter: blur(4px); color: #fff; font-size: var(--text-xs); font-weight: 700; padding: 4px 10px; border-radius: var(--radius-pill); }
.blog-card__title { font-size: var(--text-xl); }
.blog-card__title a { color: var(--color-text-1); text-decoration: none; }
.blog-card__title a:hover { color: var(--color-brand-500); }
.blog-card__excerpt { color: var(--color-text-2); font-size: var(--text-sm); }
.blog-card__meta { font-size: var(--text-xs); color: var(--color-text-3); display: flex; gap: var(--sp-2); }
.loading { padding: var(--sp-12); text-align: center; color: var(--color-text-3); }
</style>
