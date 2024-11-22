<template>
  <v-main id="printable-area">
    <router-view />
    <!-- <app-core-footer /> -->
  </v-main>
</template>

<script>
  export default {
    name: 'AppCoreView',
    components: {
      // AppCoreFooter: () => import('./Footer'),
    },
  }
</script>
