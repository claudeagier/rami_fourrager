<template>
  <v-main>
    <router-view />

    <app-core-footer />
  </v-main>
</template>

<script>
  export default {
    name: 'AppCoreView',

    components: {
      AppCoreFooter: () => import('./Footer'),
    },
  }
</script>
