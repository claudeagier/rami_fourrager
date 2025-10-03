<template>
  <div>
    <v-dialog
      v-model="showModal"
      persistent
      no-click-animation
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ $t('workspace.content.export.preview.title') }}</span>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-data-table
            :headers="headers"
            :items="rows"
            dense
            class="elevation-1"
            :items-per-page="10"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>
                  {{ $t('workspace.content.export.preview.tableTitle') }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="cancelModal"
            color="grey"
            text
          >
            {{ $t('btn.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            outlined
            @click="downloadCsv(rows)"
          >
            {{ $t('btn.export') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'PreviewModal',
    props: {
      rows: {
        type: Array,
        required: true,
      },
      forceOpen: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        showModal: false,
      }
    },
    watch: {
      forceOpen: {
        immediate: true,
        handler(newVal) {
          this.showModal = newVal
        },
      },
    },
    computed: {
      headers() {
        if (!this.rows.length) return []
        return Object.keys(this.rows[0]).map((key) => ({
          text: key === 'simulation_name' ? this.$t(`export.columns.${key}`) : key,
          value: key,
        }))
      },
    },
    methods: {
      cancelModal() {
        this.showModal = false
        this.$emit('close-modal', 'preview')
      },
      downloadCsv(rows) {
        const csvContent = this.generateCsv(rows)
        const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)

        const date = new Date().toISOString().slice(0, 10)
        const filename = `export_${date}.csv`

        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        this.showModal = false
        this.$emit('close-modal', 'preview')
      },
      generateCsv(rows) {
        if (!rows.length) return ''

        const keys = Object.keys(rows[0])
        const header = keys.join(';')

        const data = rows
          .map((row) =>
            keys
              .map((key) => {
                const val = row[key]

                if (val === null || val === undefined || val === '') return '""'

                // // Numérique : nombre formaté avec virgule
                // if (typeof val === 'number') {
                //   return String(val).replace('.', ',')
                // }

                // String classique : échappée et entourée de guillemets
                const str = String(val).replace(/"/g, '""')
                return `"${str}"`
              })
              .join(';')
          )
          .join('\r\n')

        return `${header}\r\n${data}`
      },
    },
  }
</script>

<style scoped>
  .v-data-table {
    max-height: 70vh;
    overflow-y: auto;
  }
</style>
