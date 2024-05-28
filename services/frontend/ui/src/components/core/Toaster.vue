<template>
  <transition-group
    name="toast"
    tag="div"
    class="toast-container"
  >
    <v-alert
      v-for="(toast, index) in visibleToasts"
      :key="toast.id"
      :type="toast.type"
      dismissible
      @input="removeToast(index)"
      :value="true"
      width="25em"
    >
      {{ toast.message }}
    </v-alert>
  </transition-group>
</template>

<script>
  export default {
    data() {
      return {
        toasts: [],
        toastTimeouts: {},
      }
    },
    computed: {
      visibleToasts() {
        return this.toasts.slice(0, 5)
      },
    },
    methods: {
      addToast(toast) {
        const id = Math.floor(Math.random() * 500000)
        this.toasts.push({ id, ...toast })

        // Start the timeout for the toast if it's within the visible range
        this.manageTimeouts()
      },
      removeToast(index) {
        const [removedToast] = this.toasts.splice(index, 1)
        if (removedToast && this.toastTimeouts[removedToast.id]) {
          clearTimeout(this.toastTimeouts[removedToast.id])
          delete this.toastTimeouts[removedToast.id]
        }
        this.manageTimeouts()
      },
      removeToastById(id) {
        const index = this.toasts.findIndex((toast) => toast.id === id)
        if (index !== -1) {
          this.removeToast(index)
        }
      },
      startTimeout(id, timeoutDuration) {
        this.toastTimeouts[id] = setTimeout(() => {
          this.removeToastById(id)
        }, timeoutDuration)
      },
      manageTimeouts() {
        this.visibleToasts.forEach((toast, index) => {
          if (index === 0 && !this.toastTimeouts[toast.id]) {
            // Start timeout for the first visible toast
            const timeoutDuration = toast.timeout || 5000
            this.startTimeout(toast.id, timeoutDuration)
          } else if (
            index > 0 &&
            this.toastTimeouts[this.visibleToasts[index - 1].id] &&
            !this.toastTimeouts[toast.id]
          ) {
            // Start timeout for the next toast only after the previous one has been removed
            this.$nextTick(() => {
              const previousToastId = this.visibleToasts[index - 1].id
              const previousTimeoutRemaining = this.toastTimeouts[previousToastId]
              if (!previousTimeoutRemaining) {
                const timeoutDuration = toast.timeout || 5000
                this.startTimeout(toast.id, timeoutDuration)
              }
            })
          }
        })
      },
    },
    watch: {
      toasts() {
        this.manageTimeouts()
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
