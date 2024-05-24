<template>
  <transition-group
    name="toast"
    tag="div"
    class="toast-container"
  >
    <v-alert
      v-for="(toast, index) in toasts"
      :key="toast.id"
      :type="toast.type"
      dismissible
      @input="removeToast(index)"
      :value="true"
    >
      {{ $t(toast.message) }}
    </v-alert>
  </transition-group>
</template>

<script>
  export default {
    data() {
      return {
        toasts: [],
      }
    },
    methods: {
      addToast(toast) {
        const id = Math.floor(Math.random() * 500000)
        this.toasts.push({ id, ...toast })
        if (!toast.timeout) {
          setTimeout(() => {
            this.removeToastById(id)
          }, 5000) // Default timeout
        } else {
          setTimeout(() => {
            this.removeToastById(id)
          }, toast.timeout)
        }
      },
      removeToast(index) {
        this.toasts.splice(index, 1)
      },
      removeToastById(id) {
        this.toasts = this.toasts.filter((toast) => toast.id !== id)
      },
    },
  }
</script>

<style scoped>
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
  }
  .toast-enter-active,
  .toast-leave-active {
    transition: opacity 0.5s;
  }
  .toast-enter,
  .toast-leave-to {
    opacity: 0;
  }
</style>
