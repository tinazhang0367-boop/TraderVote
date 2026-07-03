<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// flag-icons: SVG country flags via CSS sprite. Imported here so it's always
// loaded before the LanguageSwitcher component mounts.
import 'flag-icons/css/flag-icons.min.css'

useHead({
  htmlAttrs: { lang: 'en' },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
})
</script>
