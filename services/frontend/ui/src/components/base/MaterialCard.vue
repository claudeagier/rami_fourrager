<template>
  <v-card
    v-bind="$attrs"
    :class="classes"
    class="v-card--material pa-3"
  >
    <div class="d-flex grow flex-wrap">
      <v-avatar
        v-if="avatar"
        size="128"
        class="mx-auto v-card--material__avatar elevation-6"
        color="grey"
      >
        <v-img :src="avatar" />
      </v-avatar>

      <v-sheet
        v-else
        :class="{
          'pa-5': !$slots.image,
        }"
        :color="color"
        :max-height="icon ? 50 : undefined"
        :width="icon ? 'auto' : '100%'"
        elevation="6"
        class="text-start v-card--material__heading mb-n6"
        dark
      >
        <slot
          v-if="$slots.heading"
          name="heading"
        />

        <slot
          v-else-if="$slots.image"
          name="image"
        />

        <div
          v-else-if="title && !icon"
          class="text-h4 font-weight-light"
          v-text="title"
        />

        <v-icon
          v-else-if="icon"
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
        v-if="$slots['after-heading']"
        class="ml-6"
      >
        <slot name="after-heading" />
      </div>

      <div
        v-else-if="icon && title"
        class="ml-4"
      >
        <div
          class="card-title font-weight-light"
          v-text="title"
        />
      </div>
    </div>

    <slot></slot>
    <v-card-text
      v-if="$slots.content"
      class="text-body-1 ma-0"
      style="background-color: #ffffff38; height: 100%"
    >
      <slot name="content"></slot>
    </v-card-text>

    <template v-if="$slots.actions">
      <v-card-actions class="pa-0">
        <slot name="actions" />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
  export default {
    name: 'MaterialCard',

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
    },
  }
</script>

<style lang="sass">
  .v-card--material
    &__avatar
      position: relative
      top: -64px
      margin-bottom: -32px

    &__heading
      position: relative
      top: -40px
      transition: .3s ease
      z-index: 1
</style>
