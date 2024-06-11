<template>
  <div>
    <v-checkbox v-model="pastureStrategy"></v-checkbox>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'PastureCheck',
    props: {
      selectedLot: {
        type: null,
        required: true,
      },
      period: {
        type: Number,
        required: true,
      },
    },
    watch: {
      selectedLot: {
        immediate: true,
        handler(newValue, oldValue) {
          this.batch = this.getBatch(newValue)
        },
      },
    },
    data() {
      return {
        batch: null,
      }
    },
    computed: {
      ...mapGetters('simulator/herd', {
        getBatch: 'getBatch',
        strategy: [],
      }),
      pastureStrategy: {
        get() {
          return this.batch.pastureStrategy[this.period].carryOver
        },
        set(val) {
          this.setPastureStrategy({
            batchId: this.selectedLot,
            periodId: this.period,
            val: this.pastureStrategy,
          })
        },
      },
    },
    methods: {
      ...mapMutations('simulator/herd', {
        setPastureStrategy: 'setPastureStrategy',
      }),
    },
  }
</script>
