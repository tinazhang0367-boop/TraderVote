<template>
  <section class="auth-page">
    <div class="auth-card">
      <SiteLogo size="lg" show-text />
      <div>
        <h1>设置新密码</h1>
        <p class="muted">请输入新的登录密码。密码至少需要 8 个字符。</p>
      </div>

      <form v-if="!done" class="auth-form" @submit.prevent="submit">
        <label>
          <span>新密码</span>
          <input v-model="password" type="password" autocomplete="new-password" minlength="8" required>
        </label>
        <label>
          <span>确认新密码</span>
          <input v-model="confirmPassword" type="password" autocomplete="new-password" minlength="8" required>
        </label>
        <p v-if="error" class="auth-error">{{ error }}</p>
        <button class="btn btn--primary" type="submit" :disabled="loading">
          {{ loading ? '提交中...' : '更新密码' }}
        </button>
      </form>

      <div v-else class="success-panel">
        <strong>密码已更新</strong>
        <p>请使用新密码重新登录 TraderVote。</p>
        <NuxtLink class="btn btn--primary" :to="localePath('/login')">去登录</NuxtLink>
      </div>

      <p class="auth-alt">
        链接失效？
        <NuxtLink :to="localePath('/forgot-password')">重新发送邮件</NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const done = ref(false)

async function submit() {
  error.value = ''
  if (!route.query.token) {
    error.value = '密码重置链接无效，请重新申请。'
    return
  }
  if (password.value.length < 8) {
    error.value = '密码至少需要 8 个字符。'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致。'
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token: route.query.token, password: password.value },
    })
    done.value = true
  } catch (err: any) {
    error.value = err?.statusMessage || '链接已失效或更新失败，请重新申请。'
  } finally {
    loading.value = false
  }
}

useSeoMeta({ title: '设置新密码 - TraderVote' })
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - var(--header-h));
  display: grid;
  place-items: center;
  padding: var(--sp-12) var(--sp-4);
  background: linear-gradient(180deg, #f8fafc, #eef6f8);
}
.auth-card {
  width: min(460px, 100%);
  display: grid;
  gap: var(--sp-5);
  padding: var(--sp-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
}
.auth-card h1 { margin: 0 0 var(--sp-1); font-size: var(--text-3xl); }
.auth-form { display: grid; gap: var(--sp-4); }
.auth-form label { display: grid; gap: 8px; font-weight: 700; color: var(--color-text-2); }
.auth-form input {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  font: inherit;
}
.auth-error { margin: 0; color: var(--score-bad); font-weight: 700; }
.auth-alt { margin: 0; color: var(--color-text-2); }
.success-panel {
  display: grid;
  gap: var(--sp-3);
  padding: var(--sp-4);
  border: 1px solid rgba(20, 184, 166, .24);
  border-radius: var(--radius-md);
  background: rgba(20, 184, 166, .08);
}
.success-panel p { margin: 0; color: var(--color-text-2); }
</style>
