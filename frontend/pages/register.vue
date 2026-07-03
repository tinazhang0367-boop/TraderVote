<template>
  <section class="auth-page">
    <div class="auth-card">
      <SiteLogo size="lg" show-text />

      <div>
        <h1>创建账户</h1>
        <p class="muted">注册后系统会发送邮箱验证邮件。第一位注册用户会自动成为管理员。</p>
      </div>

      <a class="google-button" :href="googleLoginUrl">
        <span class="google-button__icon" aria-hidden="true">G</span>
        <span>使用 Google 注册或登录</span>
      </a>

      <div class="auth-divider"><span>或使用邮箱注册</span></div>

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
        <button class="btn btn--primary btn--block" type="submit" :disabled="loading">
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
const googleLoginUrl = computed(() => `/api/auth/google?redirect=${encodeURIComponent(localePath('/'))}`)

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

.auth-card h1 {
  margin: 0 0 var(--sp-1);
  font-size: var(--text-3xl);
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-3);
  width: 100%;
  min-height: 46px;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #fff;
  color: var(--color-text-1);
  font-weight: 700;
  text-decoration: none;
  transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
}

.google-button:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
}

.google-button__icon {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #4285f4;
  font-weight: 800;
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  color: var(--color-text-3);
  font-size: var(--text-xs);
  font-weight: 700;
}

.auth-divider::before,
.auth-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.auth-form {
  display: grid;
  gap: var(--sp-4);
}

.auth-form label {
  display: grid;
  gap: 8px;
  font-weight: 700;
  color: var(--color-text-2);
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

@media (max-width: 420px) {
  .auth-card {
    padding: var(--sp-6);
  }
}
</style>
