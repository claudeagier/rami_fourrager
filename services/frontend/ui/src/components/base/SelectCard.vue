<template>
  <v-card
    v-bind="$attrs"
    :class="classes"
    class="v-card--material pa-3 mb-1"
  >
    <div class="d-flex grow flex-wrap">
      <v-sheet
        :class="{
          'pa-4': !$slots.image,
        }"
        :color="color"
        :max-height="icon ? 90 : undefined"
        :width="icon ? 'auto' : '100%'"
        elevation="6"
        class="text-start v-card--material__heading mb-n6"
        dark
      >
        <v-icon
          v-if="icon"
          size="32"
        >
          {{ icon }}
        </v-icon>

        <div
          v-if="text"
          class="text-h5 font-weight-thin"
          v-text="text"
        />
      </v-sheet>
      <div
        v-if="icon && title"
        class="ml-auto text-right"
      >
        <div
          class="text-lg-h4 text-sm-h6 text-md-h5 font-weight-light"
          v-text="title"
        />
      </div>
    </div>
    <div class="ml-auto text-right">
      <v-select
        v-if="dropdownOptions"
        v-model="selectedItem"
        :items="dropdownOptions"
        item-text="name"
        item-value="id"
      ></v-select>
    </div>
    <template v-if="$slots.actions">
      <v-divider class="mt-2" />

      <v-card-actions class="pb-0">
        <slot name="actions" />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
  export default {
    name: 'SelectCard',

    props: {
      avatar: {
        type: String,
        default: '',
      },
      color: {
        type: String,
        default: 'success',
      },
      icon: {
        type: String,
        default: undefined,
      },
      image: {
        type: Boolean,
        default: false,
      },
      text: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
      dropdownOptions: {
        type: Array,
        default: () => [],
      },
      model: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        selectedOption: null,
      }
    },
    computed: {
      classes() {
        return {
          'v-card--material--has-heading': this.hasHeading,
        }
      },
      hasHeading() {
        return Boolean(this.$slots.heading || this.title || this.icon)
      },
      hasAltHeading() {
        return Boolean(this.$slots.heading || (this.title && this.icon))
      },
      selectedItem: {
        get() {
          return this.model
        },
        set(val) {
          this.$emit('change', val)
        },
      },
    },
    methods: {},
  }
</script>

<style>
  .select-card-icon {
    width: 65px;
    position: relative;
    top: -1px;
    left: -20px;
  }
</style>
