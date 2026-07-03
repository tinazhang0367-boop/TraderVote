<template>
  <div class="site">
    <SiteHeader />
    <main class="site__main">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.site { display: flex; flex-direction: column; min-height: 100dvh; }
.site__main { flex: 1; }
</style>
