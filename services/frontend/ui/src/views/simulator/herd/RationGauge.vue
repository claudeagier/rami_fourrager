<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-progress-linear
          :height="15"
          :color="totalProportion > 100 ? 'red' : color"
          :value="totalProportion"
          dense
        >
          <template v-slot:default="{ value }">
            <span class="font-weight-light"> {{ value }} % </span>
          </template>
        </v-progress-linear>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    props: {
      dataFeeds: {
        type: Array,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
    },
    computed: {
      totalProportion() {
        return Object.values(this.dataFeeds).reduce((acc, curr) => {
          const intValue = parseInt(curr.proportion, 10)
          return acc + (isNaN(intValue) ? 0 : intValue)
        }, 0)
      },
    },
  }
</script>
