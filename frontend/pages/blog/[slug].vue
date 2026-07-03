<template>
  <article v-if="post" class="container section article">
    <header class="article__head">
      <span class="article__cat">{{ post.category }}</span>
      <h1>{{ post.title }}</h1>
      <p class="article__excerpt">{{ post.excerpt }}</p>
      <div class="article__meta">
        <span>{{ post.author }}</span>
        <span>·</span>
        <time>{{ formatDate(post.publishedAt) }}</time>
        <span>·</span>
        <span>{{ post.readingTime }} min read</span>
      </div>
    </header>

    <div class="article__cover" :style="{ background: post.coverColor }"></div>

    <div class="article__body" v-html="post.html"></div>

    <footer class="article__foot">
      <RiskWarning variant="banner" />
    </footer>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug))

interface Post {
  slug: string; title: string; excerpt: string; category: string;
  readingTime: number; publishedAt: string; coverColor: string;
  html: string; author: string;
}

const { data: post } = await useFetch<Post | null>(() => `/api/blog/posts/${slug.value}`, { default: () => null })

if (!post.value) throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })

useSeoMeta({
  title: () => `${post.value!.title} — Tradervote Blog`,
  description: () => post.value!.excerpt,
  ogType: 'article',
  ogTitle: () => post.value!.title,
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.section { padding: var(--sp-12) 0; max-width: 800px; margin-inline: auto; }
.article__cat { background: var(--color-brand-50); color: var(--color-brand-500); padding: 4px 12px; border-radius: var(--radius-pill); font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
.article__head h1 { font-size: var(--text-4xl); margin-top: var(--sp-3); }
.article__excerpt { color: var(--color-text-2); font-size: var(--text-lg); margin-top: var(--sp-3); }
.article__meta { font-size: var(--text-sm); color: var(--color-text-3); margin-top: var(--sp-4); display: flex; gap: var(--sp-2); flex-wrap: wrap; }
.article__cover { aspect-ratio: 21/9; border-radius: var(--radius-lg); margin: var(--sp-8) 0; }
.article__body { font-size: var(--text-base); line-height: 1.8; color: var(--color-text-2); }
.article__body :deep(h2) { font-size: var(--text-2xl); margin-top: var(--sp-8); color: var(--color-text-1); }
.article__body :deep(p) { margin-top: var(--sp-4); }
.article__body :deep(code) { background: var(--color-bg-muted); padding: 2px 6px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: .9em; }
.article__foot { margin-top: var(--sp-12); }
</style>
