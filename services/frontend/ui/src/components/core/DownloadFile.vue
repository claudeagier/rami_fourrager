<template>
  <v-row
    justify="center"
    class="pt-0 pb-0"
  >
    <v-col
      cols="12"
      class="pt-0 pb-0"
    >
      <v-card
        :elevation="2"
        hover
        @click="downloadFile"
        class="pt-0 pb-0"
      >
        <v-alert
          color="primary lighten-3"
          icon="mdi-cloud-download-outline"
          border="left"
          prominent
          dense
          class="mt-0"
        >
          <v-row align="center">
            <v-col> {{ $t('herd.main.btn_download') }}</v-col>
          </v-row>
        </v-alert>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
  export default {
    name: 'donwload-file',
    methods: {
      async downloadFile() {
        this.$store
          .dispatch('referential/downloadFile')
          .then((res) => {
            this.$toast({
              message: this.$t('notifications.download.success'),
              type: 'success', // 'info', 'warning', 'error'
              timeout: 300, // optional, defaults to 5000
            })
          })
          .catch((error) => {
            console.error('Erreur lors du téléchargement du fichier:', error)

            this.$toast({
              message: this.$t('notifications.download.error'),
              type: 'error', // 'info', 'warning', 'error'
              icon: 'mdi-check-circle', // any Vuetify icon
              timeout: 5000, // optional, defaults to 5000
            })
          })
      },
    },
  }
</script>
