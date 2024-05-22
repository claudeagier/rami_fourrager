// mixins/navigationGuard.js
export default {
  beforeRouteLeave(to, from, next) {
    if (from.fullPath.includes('simulation') && to.fullPath.includes('simulation')) {
      next() // ne fait rien
      return
    }
    if (this.$options.confirmNavigation) {
      this.$options.confirmNavigation.call(this, (confirmed) => {
        if (confirmed) {
          next()
        } else {
          next(false)
        }
      })
    } else {
      next()
    }
  },
}
