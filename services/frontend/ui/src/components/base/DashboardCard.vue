<template>
  <v-card
    :color="cardColor"
    :class="cardClasses"
    min-height="100px"
    :dark="dark"
    width="100%"
    :height="forcedHeight"
  >
    <v-sheet :color="titleColor">
      <v-card-title class="">
        <v-row>
          <v-col cols="1">
            <v-icon
              medium
              left
              v-if="icon"
            >
              {{ icon }}
            </v-icon>
          </v-col>
          <v-col cols="8">
            <div
              class="card-title text-h3 font-weight-light"
              style="font-size: 18px !important"
            >
              {{ $t(title) }}
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col
            v-if="withButton"
            class="pa-0 ma-0"
          >
            <slot name="button"></slot>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle class="mt-0 text-subtitle-1 font-weight-light">
        <slot name="subtitle"></slot>
      </v-card-subtitle>
    </v-sheet>
    <v-card-text
      class="text-body-1 ma-0"
      style="background-color: #ffffff38; height: 100%"
    >
      <slot name="content"></slot>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'Dashboard-Card',

    created() {},
    data() {
      return {}
    },
    props: {
      icon: {
        type: String,
        required: false,
        default: undefined,
      },
      title: {
        type: String,
        required: true,
      },
      titleColor: {
        type: String,
        required: false,
        default: 'transparent',
      },
      cardColor: {
        type: String,
        required: true,
        default: 'white',
      },
      dark: {
        type: Boolean,
        required: false,
        default: false,
      },
      withButton: {
        type: Boolean,
        required: false,
        default: false,
      },
      forcedHeight: {
        type: String,
        required: false,
      },
      classes: {
        type: String,
        required: false,
      },
    },
    methods: {},
    computed: {
      cardClasses() {
        return 'pb-0 mb-3 mt-0 ma-0 ' + this.classes
      },
    },
  }
</script>
