<template>
  <section class="verify-page">
    <div class="verify-card">
      <SiteLogo size="lg" show-text />

      <div v-if="pending" class="verify-state">
        <h1>正在验证邮箱</h1>
        <p class="muted">请稍等，我们正在确认你的邮箱地址。</p>
      </div>

      <div v-else-if="success" class="verify-state">
        <div class="verify-icon verify-icon--ok">✓</div>
        <h1>邮箱验证成功</h1>
        <p class="muted">你的 TraderVote 账户已经完成邮箱验证。</p>
        <NuxtLink :to="localePath('/')" class="btn btn--primary">返回首页</NuxtLink>
      </div>

      <div v-else class="verify-state">
        <div class="verify-icon verify-icon--bad">!</div>
        <h1>验证链接无效</h1>
        <p class="muted">{{ errorMessage }}</p>
        <NuxtLink :to="localePath('/login')" class="btn btn--primary">去登录</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const route = useRoute()
const pending = ref(true)
const success = ref(false)
const errorMessage = ref('验证链接可能已经过期，请登录后重新发送验证邮件。')

onMounted(async () => {
  try {
    await $fetch('/api/auth/verify-email', {
      method: 'POST',
      body: { token: String(route.query.token || '') },
    })
    success.value = true
  } catch (err: any) {
    success.value = false
    errorMessage.value = err?.statusMessage || errorMessage.value
  } finally {
    pending.value = false
  }
})

useSeoMeta({ title: '邮箱验证 - TraderVote' })
</script>

<style scoped>
.verify-page {
  min-height: calc(100vh - var(--header-h));
  display: grid;
  place-items: center;
  padding: var(--sp-12) var(--sp-4);
  background: linear-gradient(180deg, #f8fafc, #eef6f8);
}
.verify-card {
  width: min(480px, 100%);
  display: grid;
  gap: var(--sp-5);
  padding: var(--sp-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
  text-align: center;
}
.verify-state {
  display: grid;
  justify-items: center;
  gap: var(--sp-3);
}
.verify-state h1 {
  margin: 0;
  font-size: var(--text-3xl);
}
.verify-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: #fff;
  font-size: var(--text-2xl);
  font-weight: 900;
}
.verify-icon--ok { background: var(--score-excellent); }
.verify-icon--bad { background: var(--score-bad); }
</style>

