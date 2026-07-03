<template>
  <section class="auth-page">
    <div class="auth-card">
      <SiteLogo size="lg" show-text />
      <div>
        <h1>创建账户</h1>
        <p class="muted">注册后系统会发送邮箱验证邮件。第一位注册用户会自动成为管理员。</p>
      </div>

      <form class="auth-form" @submit.prevent="submit">
        <label>
          <span>姓名</span>
          <input v-model="name" type="text" autocomplete="name" required>
        </label>
        <label>
          <span>邮箱</span>
          <input v-model="email" type="email" autocomplete="email" required>
        </label>
        <label>
          <span>密码</span>
          <input v-model="password" type="password" autocomplete="new-password" minlength="8" required>
        </label>
        <p v-if="error" class="auth-error">{{ error }}</p>
        <button class="btn btn--primary" type="submit" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <p class="auth-alt">
        已有账户？
        <NuxtLink :to="localePath('/login')">登录</NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const user = await $fetch<{ role: string }>('/api/auth/register', {
      method: 'POST',
      body: { name: name.value, email: email.value, password: password.value },
    })
    await navigateTo(localePath(user.role === 'ADMIN' ? '/admin' : '/login'))
  } catch (err: any) {
    error.value = err?.statusMessage || '注册失败，请稍后再试。'
  } finally {
    loading.value = false
  }
}

useSeoMeta({ title: '注册 - TraderVote' })
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
</style>
