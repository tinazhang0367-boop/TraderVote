<template>
  <section class="auth-page">
    <div class="auth-card">
      <SiteLogo size="lg" show-text />
      <div>
        <h1>找回密码</h1>
        <p class="muted">输入注册邮箱。如果账号存在，系统会发送一封密码重置邮件。</p>
      </div>

      <form class="auth-form" @submit.prevent="submit">
        <label>
          <span>邮箱</span>
          <input v-model="email" type="email" autocomplete="email" required>
        </label>
        <p v-if="message" class="auth-success">{{ message }}</p>
        <p v-if="error" class="auth-error">{{ error }}</p>
        <button class="btn btn--primary" type="submit" :disabled="loading">
          {{ loading ? '发送中...' : '发送重置邮件' }}
        </button>
      </form>

      <p class="auth-alt">
        想起密码了？
        <NuxtLink :to="localePath('/login')">返回登录</NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

async function submit() {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })
    message.value = '如果该邮箱已注册，我们已经发送密码重置邮件。请查看收件箱或垃圾箱。'
  } catch (err: any) {
    error.value = err?.statusMessage || '发送失败，请稍后再试。'
  } finally {
    loading.value = false
  }
}

useSeoMeta({ title: '找回密码 - TraderVote' })
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
.auth-success { margin: 0; color: var(--score-good); font-weight: 700; }
.auth-alt { margin: 0; color: var(--color-text-2); }
</style>
