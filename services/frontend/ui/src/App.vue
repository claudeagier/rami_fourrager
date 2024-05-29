<template>
  <div>
    <router-view />
    <modals-container></modals-container>
  </div>
</template>

<script>
  import { ModalsContainer } from 'vue-final-modal'
  export default {
    name: 'App',
    components: {
      ModalsContainer,
    },
  }
</script>
