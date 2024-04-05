<template>
  <v-breadcrumbs :items="breadCrumbs">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item
        :to="item.to"
        class="text-subtitle-2 crumb-item"
        :disabled="item.disabled"
        exact
      >
        {{ $t(item.text) }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
  export default {
    name: 'AppCoreBreadcrumbs',
    computed: {
      breadCrumbs() {
        if (typeof this.$route.meta.breadCrumb === 'function') {
          return this.$route.meta.breadCrumb.call(this, this.$route)
        }
        return this.$route.meta.breadCrumb
      },
      // breadCrumbs() {
      //   var breadCrumb = {}
      //   if (typeof this.$route.meta.breadCrumb === 'function') {
      //     breadCrumb = this.$route.meta.breadCrumb.call(this, this.$route)
      //   }
      //   const index = this.bcs.indexOf(breadCrumb)
      //   if (index < 0) {
      //     console.log('is not in', breadCrumb, this.bcs.indexOf(breadCrumb))
      //     this.bcs.push(breadCrumb)
      //   } else {
      //     console.log('is in')
      //     this.bcs.splice(index, this.bcs.length - (index + 1))
      //   }
      //   console.log('bcs', this.bcs)
      //   return this.bcs
      //   // return this.$route.meta.breadCrumb
      // },
    },
  }
</script>
