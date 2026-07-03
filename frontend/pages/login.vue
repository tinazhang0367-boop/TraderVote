<template>
  <section class="auth-page">
    <div class="auth-card">
      <SiteLogo size="lg" show-text />

      <div>
        <h1>登录 TraderVote</h1>
        <p class="muted">进入账户，管理评论和后台运营任务。</p>
      </div>

      <form class="auth-form" @submit.prevent="submit">
        <div class="auth-field">
          <label for="login-email">邮箱</label>
          <input id="login-email" v-model="email" type="email" autocomplete="email" required>
        </div>

        <div class="auth-field">
          <div class="auth-field__head">
            <label for="login-password">密码</label>
            <NuxtLink class="auth-forgot" :to="localePath('/forgot-password')">忘记密码？</NuxtLink>
          </div>
          <input id="login-password" v-model="password" type="password" autocomplete="current-password" required>
        </div>

        <p v-if="error" class="auth-error">{{ error }}</p>

        <button class="btn btn--primary btn--block" type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div v-if="user && !user.emailVerifiedAt" class="verify-notice">
        <strong>邮箱尚未验证</strong>
        <p>请查看收件箱里的 TraderVote 验证邮件。</p>
        <button class="btn btn--ghost btn--sm" type="button" @click="resendVerification">
          {{ resendStatus || '重新发送验证邮件' }}
        </button>
      </div>

      <p class="auth-alt">
        还没有账户？
        <NuxtLink :to="localePath('/register')">注册</NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const resendStatus = ref('')
const user = ref<{ emailVerifiedAt?: string | null } | null>(null)

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const loggedIn = await $fetch<{ role: string; emailVerifiedAt?: string | null }>('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    user.value = loggedIn
    if (!loggedIn.emailVerifiedAt) return
    await navigateTo(localePath(loggedIn.role === 'ADMIN' ? '/admin' : '/'))
  } catch (err: any) {
    error.value = err?.statusMessage || '登录失败，请检查邮箱和密码。'
  } finally {
    loading.value = false
  }
}

async function resendVerification() {
  resendStatus.value = '发送中...'
  try {
    await $fetch('/api/auth/resend-verification', { method: 'POST' })
    resendStatus.value = '已发送'
  } catch (err: any) {
    resendStatus.value = err?.statusMessage || '发送失败'
  }
}

useSeoMeta({ title: '登录 - TraderVote' })
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

.auth-card h1 {
  margin: 0 0 var(--sp-1);
  font-size: var(--text-3xl);
}

.auth-form {
  display: grid;
  gap: var(--sp-4);
}

.auth-field {
  display: grid;
  gap: 8px;
}

.auth-field label {
  font-weight: 700;
  color: var(--color-text-2);
}

.auth-field__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  min-width: 0;
}

.auth-forgot {
  flex-shrink: 0;
  color: var(--color-text-link);
  font-size: var(--text-sm);
  font-weight: 700;
  line-height: var(--leading-snug);
}

.auth-forgot:hover {
  color: var(--color-brand-700);
  text-decoration: none;
}

.auth-form input {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  font: inherit;
}

.auth-error {
  margin: 0;
  color: var(--score-bad);
  font-weight: 700;
}

.auth-alt {
  margin: 0;
  color: var(--color-text-2);
}

.auth-alt a {
  color: var(--color-text-link);
  font-weight: 700;
}

.verify-notice {
  display: grid;
  gap: 8px;
  padding: var(--sp-3);
  border: 1px solid rgba(20, 184, 166, .24);
  border-radius: var(--radius-md);
  background: rgba(20, 184, 166, .08);
  text-align: left;
}

.verify-notice p {
  margin: 0;
  color: var(--color-text-2);
}

@media (max-width: 420px) {
  .auth-card {
    padding: var(--sp-6);
  }

  .auth-field__head {
    align-items: flex-start;
  }
}
</style>
