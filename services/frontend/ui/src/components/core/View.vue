<template>
  <v-content>
    <router-view />

    <app-core-footer />
  </v-content>
</template>

<script>
  export default {
    name: 'DashboardCoreView',

    components: {
      AppCoreFooter: () => import('./Footer'),
    },
  }
</script>
