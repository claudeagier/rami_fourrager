<template>
  <v-container
    id="workspace"
    fluid
    tag="section"
  >
    <div>
      <actions />
    </div>
  </v-container>
</template>
<script>
  import Actions from './Actions.vue'
  export default {
    name: 'workspaceView',
    components: {
      Actions,
    },
  }
</script>
