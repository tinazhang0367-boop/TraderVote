// Nuxt 3 — Tradervote v2
// SSR + ISR + i18n (16 langs) + Pinia
// https://nuxt.com/docs

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/eslint',
  ],

  // Stylesheets loaded globally.
  // https://github.com/lipis/flag-icons
  css: [
    'flag-icons/css/flag-icons.min.css',
    '~/assets/css/tokens.css',
    '~/assets/css/base.css',
  ],

  // i18n: 16 languages — focus on SEA + global coverage
  // Docs: https://i18n.nuxtjs.org
  i18n: {
    strategy: 'prefix',
    defaultLocale: 'en',
    locales: [
      { code: 'en',    iso: 'en-US', name: 'English',     file: 'en.json',    dir: 'ltr' },
      { code: 'zh-CN', iso: 'zh-CN', name: '简体中文',    file: 'zh-CN.json', dir: 'ltr' },
      { code: 'zh-TW', iso: 'zh-TW', name: '繁體中文',    file: 'zh-TW.json', dir: 'ltr' },
      { code: 'ja',    iso: 'ja-JP', name: '日本語',      file: 'ja.json',    dir: 'ltr' },
      { code: 'ko',    iso: 'ko-KR', name: '한국어',      file: 'ko.json',    dir: 'ltr' },
      { code: 'th',    iso: 'th-TH', name: 'ไทย',         file: 'th.json',    dir: 'ltr' },
      { code: 'id',    iso: 'id-ID', name: 'Indonesia',   file: 'id.json',    dir: 'ltr' },
      { code: 'vi',    iso: 'vi-VN', name: 'Tiếng Việt', file: 'vi.json',    dir: 'ltr' },
      { code: 'de',    iso: 'de-DE', name: 'Deutsch',     file: 'de.json',    dir: 'ltr' },
      { code: 'fr',    iso: 'fr-FR', name: 'Français',    file: 'fr.json',    dir: 'ltr' },
      { code: 'es',    iso: 'es-ES', name: 'Español',     file: 'es.json',    dir: 'ltr' },
      { code: 'it',    iso: 'it-IT', name: 'Italiano',    file: 'it.json',    dir: 'ltr' },
      { code: 'bg',    iso: 'bg-BG', name: 'Български',   file: 'bg.json',    dir: 'ltr' },
      { code: 'hr',    iso: 'hr-HR', name: 'Hrvatski',    file: 'hr.json',    dir: 'ltr' },
      { code: 'ru',    iso: 'ru-RU', name: 'Русский',     file: 'ru.json',    dir: 'ltr' },
      { code: 'ar',    iso: 'ar-SA', name: 'عربى',        file: 'ar.json',    dir: 'rtl' },
    ],
    lazy: true,
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'tv_lang',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en',
    },
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'https://tradervote.com',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#1652f0' },
        { name: 'robots', content: 'index,follow,max-image-preview:large' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/images/brand/TV_icon_round.svg?v=2' },
        { rel: 'alternate icon', href: '/images/brand/TV_icon_round.svg?v=2' },
        { rel: 'apple-touch-icon', href: '/images/brand/TV_icon_square.svg?v=2' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Thai:wght@400;500;700&family=Noto+Sans+Vietnamese:wght@400;500;700&family=JetBrains+Mono&display=swap',
        },
      ],
    },
  },

  nitro: {
    compressPublicAssets: true,
    routeRules: {
      '/':                  { isr: 3600 },
      '/brokers':           { isr: 3600 },
      '/brokers/**':        { isr: 21600 },
      '/top':               { isr: 86400 },
      '/promotions':        { isr: 21600 },
      '/blog':              { isr: 3600 },
      '/blog/**':           { isr: 86400 },
    },
  },

  // Vite dev server config — allow custom Host headers so subdomain
  // dev.tradervote.com can reach the server during local testing.
  // See: https://vite.dev/config/server-options.html#server-allowedhosts
  vite: {
    server: {
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '184.168.127.152',
        'dev.tradervote.com',
        '.tradervote.com',  // allow any subdomain
        '.lhr.life',        // allow localhost.run tunnels
      ],
    },
  },

  // Dev server bound to all interfaces (0.0.0.0:3001) so subdomain DNS works.
  devServer: {
    host: '0.0.0.0',
    port: 3001,
  },

  image: {
    format: ['avif', 'webp'],
    quality: 80,
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
} as any)
