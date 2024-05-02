<template>
  <v-main>
    <app-core-toaster />

    <router-view />

    <app-core-footer />
  </v-main>
</template>

<script>
  export default {
    name: 'AppCoreView',

    components: {
      AppCoreToaster: () => import('@/components/core/Toaster'),
      AppCoreFooter: () => import('./Footer'),
    },
  }
</script>
