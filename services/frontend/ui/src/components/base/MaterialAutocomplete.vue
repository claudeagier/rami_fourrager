<template>
  <v-autocomplete
    v-model="selectedItemInternal"
    :items="items"
    v-bind="$attrs"
    class="transparent-background"
    @change="onItemSelected"
  >
    <!-- <template v-slot:item="{ item }">
      {{ item }}
    </template> -->
  </v-autocomplete>
</template>

<script>
  export default {
    props: {
      items: {
        type: Array,
        required: true,
      },
      selectedItem: {
        type: null,
      },
    },
    data() {
      return {
        selectedItemInternal: this.selectedItem,
      }
    },
    methods: {
      onItemSelected(selectedItem) {
        this.$emit('update:selectedItem', selectedItem)
      },
    },
  }
</script>

<style>
  /* .theme--light.v-text-field--filled  */
  .transparent-background .v-input__control .v-input__slot {
    background-color: transparent !important;
  }
</style>
