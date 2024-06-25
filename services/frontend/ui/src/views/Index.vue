<template>
  <v-app>
    <app-core-app-bar />

    <app-core-drawer />

    <app-core-view />

    <!-- <app-core-settings /> -->
  </v-app>
</template>

<script>
  export default {
    name: 'AppIndex',

    components: {
      AppCoreAppBar: () => import('@/components/core/AppBar'),
      AppCoreDrawer: () => import('@/components/core/Drawer'),
      // AppCoreSettings: () => import('@/components/core/Settings'),
      AppCoreView: () => import('@/components/core/View'),
    },

    data: () => ({
      expandOnHover: false,
    }),
    created() {
      this.$store.dispatch('auth/fetchStatus')
    },
  }
</script>
