<!-- ConfirmationDialog.vue -->
<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="text-h5">{{ $t('confirmation_dialog.title') }}</v-card-title>
      <v-card-text class="text-body-1 text-center">
        <!-- {{ $t('confirmation_dialog.description') }} -->
        <!-- <br /> -->
        {{ $t('confirmation_dialog.question') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="confirm"
          outlined
        >
          {{ $t('confirmation_dialog.btn_confirm') }}
        </v-btn>
        <v-btn
          color="error"
          @click="cancel"
          outlined
        >
          {{ $t('confirmation_dialog.btn_cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'ConfirmationDialog',
    data() {
      return {
        dialog: false,
        confirmCallback: null,
      }
    },
    methods: {
      confirm() {
        this.dialog = false
        this.confirmCallback(true)
      },
      cancel() {
        this.dialog = false
        this.confirmCallback(false)
      },
      open(confirmCallback) {
        this.confirmCallback = confirmCallback
        this.dialog = true
      },
    },
  }
</script>
