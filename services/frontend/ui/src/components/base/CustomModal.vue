<template>
  <vue-final-modal
    v-bind="$attrs"
    classes="modal-container"
    content-class="modal-content"
    v-on="$listeners"
  >
    <template v-slot="{ params }">
      <span class="modal__title">
        <slot name="title"></slot>
      </span>
      <div class="modal__content">
        <slot v-bind:params="params"></slot>
      </div>
      <!-- <div class="modal__action">
        <v-btn @click="$emit('confirm', close)">confirm</v-btn>
        <v-btn @click="$emit('cancel', close)">cancel</v-btn>
      </div> -->
      <v-icon
        class="modal__close"
        @click="close"
      >
        mdi-close
      </v-icon>
    </template>
  </vue-final-modal>
</template>
<script>
  export default {
    name: 'CustomModal',
    inheritAttrs: false,
    methods: {
      close() {
        this.$emit('input', false)
      },
    },
  }
</script>
<style scoped>
  ::v-deep .modal-container {
    display: flex;
    justify-content: start;
    align-items: start;
  }
  ::v-deep .modal-content {
    min-width: 750px;
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: 90%;
    margin: 0 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
    box-shadow:
      0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14),
      0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  }
  .modal__title {
    margin: 0 2rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  .modal__content {
    flex-grow: 1;
    overflow-y: auto;
  }
  .modal__action {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    padding: 1rem 0 0;
  }
  .modal__close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
</style>

<style scoped>
  .dark-mode div::v-deep .modal-content {
    border-color: #2d3748;
    background-color: #1a202c;
  }
</style>
