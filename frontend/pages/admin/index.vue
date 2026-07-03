<template>
  <section class="admin-page">
    <div class="container admin-wrap">
      <header class="admin-head">
        <div>
          <p class="admin-kicker">Operations Console</p>
          <h1>TraderVote 后台</h1>
          <p class="muted">管理 Broker 数据、评论审核、内容和 AI Agent 任务。</p>
        </div>
        <button class="btn btn--ghost" type="button" @click="logout">退出登录</button>
      </header>

      <div v-if="summaryError" class="admin-empty card">
        <h2>需要管理员登录</h2>
        <p class="muted">请先登录管理员账户。第一位注册用户会自动成为管理员。</p>
        <NuxtLink :to="localePath('/login')" class="btn btn--primary">去登录</NuxtLink>
      </div>

      <template v-else>
        <div class="metric-grid">
          <article v-for="item in metrics" :key="item.label" class="metric-card">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>

        <div class="admin-tabs">
          <button v-for="tab in tabs" :key="tab.key" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
            {{ tab.label }}
          </button>
        </div>

        <div v-if="activeTab === 'brokers'" class="admin-panel card">
          <header class="panel-head">
            <h2>经纪商管理</h2>
            <span class="muted">数据库来源</span>
          </header>
          <div class="table-wrap">
            <table>
              <thead><tr><th>名称</th><th>监管</th><th>评分</th><th>评论</th><th>状态</th></tr></thead>
              <tbody>
                <tr v-for="broker in brokers" :key="broker.id">
                  <td><strong>{{ broker.name }}</strong><small>{{ broker.slug }}</small></td>
                  <td>{{ parseList(broker.regulators).join(', ') }}</td>
                  <td>{{ broker.trustScore.toFixed(1) }}</td>
                  <td>{{ broker.reviewCount }}</td>
                  <td><span class="status">{{ broker.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else-if="activeTab === 'reviews'" class="admin-panel card">
          <header class="panel-head">
            <h2>评论审核</h2>
            <span class="muted">用户提交后默认进入待审核</span>
          </header>
          <div class="review-admin-list">
            <article v-for="review in reviews" :key="review.id" class="review-admin">
              <div>
                <strong>{{ review.title || '无标题评论' }}</strong>
                <p>{{ review.body }}</p>
                <small>{{ review.broker?.name }} · {{ review.authorName }} · {{ review.rating.toFixed(1) }}</small>
              </div>
              <div class="review-actions">
                <span class="status">{{ review.status }}</span>
                <button class="btn btn--sm btn--primary" @click="setReviewStatus(review.id, 'APPROVED')">通过</button>
                <button class="btn btn--sm btn--ghost" @click="setReviewStatus(review.id, 'REJECTED')">拒绝</button>
              </div>
            </article>
          </div>
        </div>

        <div v-else-if="activeTab === 'content'" class="admin-panel card">
          <header class="panel-head">
            <h2>内容管理</h2>
            <span class="muted">博客与新闻草稿</span>
          </header>
          <div class="content-grid">
            <div>
              <h3>Articles</h3>
              <p v-if="!articles.length" class="muted">暂无文章，后续由 AI Agent 生成草稿。</p>
              <p v-for="article in articles" :key="article.id">{{ article.title }} · {{ article.status }}</p>
            </div>
            <div>
              <h3>News</h3>
              <p v-if="!news.length" class="muted">暂无新闻，后续由新闻采集 Agent 写入。</p>
              <p v-for="item in news" :key="item.id">{{ item.title }} · {{ item.status }}</p>
            </div>
          </div>
        </div>

        <div v-else class="admin-panel card">
          <header class="panel-head">
            <h2>AI Agent 任务</h2>
            <div class="panel-actions">
              <button class="btn btn--sm btn--ghost" @click="sendTestEmail">
                {{ mailStatus || '测试邮件' }}
              </button>
              <button class="btn btn--sm btn--primary" @click="queueTask">新增测试任务</button>
            </div>
          </header>
          <div class="task-list">
            <article v-for="task in aiTasks" :key="task.id" class="task-row">
              <strong>{{ task.type }}</strong>
              <span>{{ task.targetType || '-' }}</span>
              <span class="status">{{ task.status }}</span>
              <small>{{ new Date(task.createdAt).toLocaleString() }}</small>
            </article>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const activeTab = ref<'brokers' | 'reviews' | 'content' | 'ai'>('brokers')
const mailStatus = ref('')

const { data: summary, error: summaryError, refresh: refreshSummary } = await useFetch<any>('/api/admin/summary')
const { data: brokers, refresh: refreshBrokers } = await useFetch<any[]>('/api/admin/brokers', { default: () => [] })
const { data: reviews, refresh: refreshReviews } = await useFetch<any[]>('/api/admin/reviews', { default: () => [] })
const { data: articles } = await useFetch<any[]>('/api/admin/articles', { default: () => [] })
const { data: news } = await useFetch<any[]>('/api/admin/news', { default: () => [] })
const { data: aiTasks, refresh: refreshTasks } = await useFetch<any[]>('/api/admin/ai-tasks', { default: () => [] })

const tabs = [
  { key: 'brokers', label: '经纪商' },
  { key: 'reviews', label: '评论审核' },
  { key: 'content', label: '内容' },
  { key: 'ai', label: 'AI 任务' },
] as const

const metrics = computed(() => [
  { label: 'Broker', value: summary.value?.brokers ?? 0 },
  { label: '待审评论', value: summary.value?.reviewsPending ?? 0 },
  { label: '用户', value: summary.value?.users ?? 0 },
  { label: 'AI 队列', value: summary.value?.aiQueued ?? 0 },
])

function parseList(value: string) {
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

async function setReviewStatus(id: number, status: string) {
  await $fetch(`/api/admin/reviews/${id}`, { method: 'PATCH', body: { status } })
  await Promise.all([refreshReviews(), refreshSummary(), refreshBrokers()])
}

async function queueTask() {
  await $fetch('/api/admin/ai-tasks', {
    method: 'POST',
    body: { type: 'BROKER_DIAGNOSIS', targetType: 'broker', targetId: 'exness' },
  })
  await Promise.all([refreshTasks(), refreshSummary()])
}

async function sendTestEmail() {
  mailStatus.value = '发送中...'
  try {
    await $fetch('/api/admin/mail-test', { method: 'POST' })
    mailStatus.value = '已发送'
  } catch (err: any) {
    mailStatus.value = err?.statusMessage || '发送失败'
  }
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo(localePath('/login'))
}

useSeoMeta({ title: '后台 - TraderVote' })
</script>

<style scoped>
.admin-page { background: #f7fafc; min-height: calc(100vh - var(--header-h)); padding: var(--sp-8) 0 var(--sp-12); }
.admin-wrap { display: grid; gap: var(--sp-5); }
.admin-head { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-4); }
.admin-head h1 { margin: 0 0 var(--sp-1); font-size: var(--text-4xl); }
.admin-kicker { margin: 0 0 var(--sp-1); color: var(--color-brand-600); font-size: var(--text-xs); font-weight: 900; text-transform: uppercase; }
.admin-empty { display: grid; gap: var(--sp-3); padding: var(--sp-6); }
.metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--sp-3); }
.metric-card { padding: var(--sp-4); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: #fff; }
.metric-card span { display: block; color: var(--color-text-3); font-weight: 700; }
.metric-card strong { display: block; margin-top: 6px; font-size: var(--text-3xl); }
.admin-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.admin-tabs button { border: 1px solid var(--color-border); border-radius: var(--radius-pill); background: #fff; padding: 8px 14px; font-weight: 800; cursor: pointer; }
.admin-tabs button.active { background: var(--color-brand-500); border-color: var(--color-brand-500); color: #fff; }
.admin-panel { padding: var(--sp-5); }
.panel-head { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-3); margin-bottom: var(--sp-4); }
.panel-head h2 { margin: 0; }
.panel-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 12px; border-bottom: 1px solid var(--color-border); text-align: left; }
td small { display: block; color: var(--color-text-3); margin-top: 3px; }
.status { display: inline-flex; padding: 4px 8px; border-radius: var(--radius-pill); background: var(--color-bg-muted); font-size: var(--text-xs); font-weight: 800; }
.review-admin-list, .task-list { display: grid; gap: var(--sp-3); }
.review-admin { display: grid; grid-template-columns: 1fr auto; gap: var(--sp-4); padding: var(--sp-4); border: 1px solid var(--color-border); border-radius: var(--radius-md); }
.review-admin p { margin: 6px 0; color: var(--color-text-2); }
.review-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4); }
.task-row { display: grid; grid-template-columns: 1fr 160px 100px 220px; gap: var(--sp-3); align-items: center; padding: var(--sp-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); }
@media (max-width: 760px) {
  .admin-head, .review-admin { grid-template-columns: 1fr; display: grid; }
  .metric-grid, .content-grid { grid-template-columns: 1fr; }
  .task-row { grid-template-columns: 1fr; }
}
</style>
