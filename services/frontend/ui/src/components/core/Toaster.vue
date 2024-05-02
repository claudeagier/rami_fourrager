<!-- components/Toaster.vue -->
<template>
  <div>
    <v-snackbar
      v-for="(notification, index) in notifications"
      :value="notification.show"
      :key="index"
      :timeout="notification.timeout || timeout"
      :color="notification.color || 'info'"
      :top="notification.top || top"
      :bottom="notification.bottom || bottom"
      :left="notification.left || left"
      :right="notification.right || right"
      :multi-line="notification.multiLine || multiLine"
      :vertical="notification.vertical || vertical"
      :absolute="notification.absolute || absolute"
      :dark="notification.dark || dark"
      :outlined="notification.outlined || outlined"
      :rounded="notification.rounded || rounded"
      :shaped="notification.shaped || shaped"
      :tile="notification.tile || tile"
      @click="removeNotification(index)"
    >
      {{ $t(notification.message) }}

      <v-icon @click="removeNotification(index)"> $vuetify.icons.cancel </v-icon>
    </v-snackbar>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  export default {
    data() {
      return {
        timeout: 2000,
        top: true,
        bottom: false,
        left: false,
        right: true,
        multiLine: false,
        vertical: false,
        absolute: false,
        dark: false,
        outlined: false,
        rounded: false,
        shaped: false,
        tile: false,
      }
    },
    computed: {
      ...mapState('toaster', {
        notifications: (state) => state.notifications,
      }),
      // notifications() {
      //   return this.$store.state.notification.notifications
      // },
    },
    methods: {
      removeNotification(index) {
        this.$store.dispatch('toaster/removeNotification', index)
      },
    },
  }
</script>
