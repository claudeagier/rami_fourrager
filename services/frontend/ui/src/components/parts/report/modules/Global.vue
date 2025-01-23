<template>
  <v-container>
    <v-overlay
      :value="loading"
      z-index="9999"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="70"
      ></v-progress-circular>
    </v-overlay>
    <v-row class="mt-4">
      <v-spacer></v-spacer>
      <v-btn
        class="mr-2"
        color="primary"
        outlined
        @click="makePreview"
      >
        {{ $t('btn.previewpdf') }}
      </v-btn>
      <v-btn
        color="primary"
        outlined
        @click="handlePrintPDF('view')"
      >
        {{ $t('btn.downloadpdf') }}
      </v-btn>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="45em"
      >
        <v-card>
          <v-card-title class="text-h5">{{ $t('report.main.modules.global.print.preview.title') }}</v-card-title>
          <v-card-text>
            <div
              v-if="previewImage"
              class="bordered-image"
            >
              <v-img
                :src="previewImage"
                :alt="$t('report.main.modules.global.print.preview.imagealt')"
              />
            </div>
            <div v-else>{{ $t('report.main.modules.global.print.preview.placeholder') }}</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="grey"
              @click="closeModal"
            >
              {{ $t('btn.close') }}
            </v-btn>
            <v-btn
              outlined
              color="primary"
              @click="handlePrintPDF('modal')"
            >
              {{ $t('btn.downloadpdf') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <div
        id="printable-area"
        ref="printTemplate"
      >
        <v-row>
          <v-col cols="8">
            <v-card
              outlined
              elevation="2"
            >
              <v-card-title>
                {{ $t('report.main.modules.global.print.template.simulation.name', { name: simulation.name }) }}
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <div>
                  {{
                    $t('report.main.modules.global.print.template.simulation.description', {
                      description: simulation.description,
                    })
                  }}
                </div>
              </v-card-text>
            </v-card>

            <v-card
              outlined
              elevation="2"
            >
              <v-card-title> {{ $t('report.main.modules.global.print.template.rotation') }}</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <rotation-graph />
              </v-card-text>
            </v-card>
            <v-card
              outlined
              elevation="2"
            >
              <v-card-title> {{ $t('report.main.modules.global.print.template.herd') }}</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <herd-print-area />
              </v-card-text>
            </v-card>

            <v-card
              outlined
              elevation="2"
            >
              <v-card-title>
                {{ $t('report.main.modules.stockNcost.stockGraph.title') }}
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <stock-graph
                  :withToolBox="false"
                  :withLegend="false"
                  :withYaxis="true"
                />
                <div style="padding-left: 80px">
                  <harvest :withTotal="false" />
                  <surplus :withTotal="false" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="4">
            <v-card
              outlined
              elevation="2"
            >
              <v-card-title>{{ $t('report.main.modules.global.print.template.climat.title') }}</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-list
                  dense
                  class="transparent"
                >
                  <v-list-item
                    v-for="(item, index) in climat"
                    :key="index"
                  >
                    <v-list-item-icon>
                      <v-icon
                        :color="item.iconColor"
                        dark
                      >
                        {{ item.icon }}
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="text-h4 indigo--text font-italic">
                        {{ $t('report.main.modules.global.print.template.climat.' + item.name + '.title') }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="font-weight-bold text-lg">
                        {{ item.value }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <v-card
              outlined
              elevation="2"
            >
              <v-card-title>
                {{ $t('report.main.modules.global.print.template.dimensioning') }}
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <dimensioning />
              </v-card-text>
            </v-card>

            <v-card
              outlined
              elevation="2"
            >
              <v-card-title>
                {{ $t('report.main.modules.global.print.template.autonomy.title') }}
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <autonomy />
                <div>
                  {{ $t('report.main.modules.global.print.template.autonomy.value', { value: autonomy }) }}
                </div>
                <div>
                  {{ $t('report.main.modules.global.print.template.potential.value', { value: potential }) }}
                </div>
              </v-card-text>
            </v-card>
            <v-card
              outlined
              elevation="2"
            >
              <v-card-title>
                {{ $t('report.main.modules.global.print.template.feeds.title') }}
              </v-card-title>
              <v-card-text>
                <graph-feeds-requirements-legend />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-row>
  </v-container>
</template>
<script>
  import { jsPDF } from 'jspdf'
  import html2canvas from 'html2canvas'
  import { mapState, mapGetters } from 'vuex'
  import { getCurrentDateTime } from '@/plugins/utils'

  import Harvest from '@/components/parts/farm/Harvest.vue'
  import Surplus from '@/components/parts/farm/Surplus.vue'
  import Autonomy from '@/components/parts/print/Autonomy.vue'
  import StockGraph from '@/components/parts/barn/StockGraph.vue'
  import RotationGraph from '@/components/parts/farm/RotationGraph.vue'
  import Dimensioning from '@/components/parts/report/Dimensioning.vue'
  import HerdPrintArea from '@/components/parts/herd/HerdPrintArea.vue'
  import GraphFeedsRequirementsLegend from '@/components/parts/herd/GraphFeedsRequirementsLegend.vue'

  export default {
    name: 'PrintableArea',
    components: {
      Surplus,
      Harvest,
      Autonomy,
      StockGraph,
      Dimensioning,
      RotationGraph,
      HerdPrintArea,
      GraphFeedsRequirementsLegend,
    },
    data() {
      return {
        dialog: false,
        previewImage: null,
        previewCanvas: null,
        loading: false,
      }
    },
    computed: {
      ...mapState('simulator', {
        simulation: (state) => state,
      }),
      ...mapGetters('referential', {
        getItemById: 'getItemById',
      }),
      ...mapGetters('auth', {
        user: 'getUser',
      }),
      ...mapGetters('simulator/report', {
        autonomy: 'getAutonomy',
        potential: 'getPotential',
      }),
      site() {
        return this.getItemById('sites', this.simulation.site)
      },
      climaticYear() {
        return this.getItemById('climatic_years', this.simulation.climaticYear)
      },
      date() {
        return getCurrentDateTime(false)
      },
      climat() {
        return [
          {
            name: 'site',
            value: this.getItemById('sites', this.simulation.site).name,
            icon: 'mdi-earth',
            iconColor: 'blue darken-4',
          },
          {
            name: 'climaticyear',
            value: this.getItemById('climatic_years', this.simulation.climaticYear).name,
            icon: 'mdi-chart-line',
            iconColor: 'blue darken-4',
          },
        ]
      },
    },
    methods: {
      closeModal() {
        this.dialog = false
        this.previewImage = null
        this.previewCanvas = null
      },
      async loadCanvas() {
        const element = this.$refs.printTemplate
        if (!element) {
          throw new Error('Aucun élément à capturer')
        }
        if (this.previewCanvas === null) {
          const canvas = await html2canvas(element, {
            scale: 3,
          })
          this.previewCanvas = canvas
        }
      },
      loadPreviewImage() {
        if (this.previewImage === null) {
          this.previewImage = this.previewCanvas.toDataURL('image/png')
        }
      },
      async makePreview() {
        this.dialog = true
        await this.loadCanvas()
        this.loadPreviewImage()
      },
      async handlePrintPDF(who) {
        this.loading = who === 'view'
        try {
          await this.printPDF()
        } catch (error) {
          console.error('Erreur lors du téléchargement du PDF :', error)
        } finally {
          if (who === 'modal') {
            this.closeModal()
          } else {
            this.loading = false
          }
        }
      },
      async printPDF() {
        try {
          await this.loadCanvas()
          this.loadPreviewImage()

          const pdf = new jsPDF('p', 'mm', 'a4')

          const canvasWidth = this.previewCanvas.width
          const canvasHeight = this.previewCanvas.height
          const pdfWidth = pdf.internal.pageSize.getWidth() // Largeur d'une page A4
          const pdfHeight = pdf.internal.pageSize.getHeight() // Hauteur d'une page A4
          const imgWidth = pdfWidth
          const imgHeight = (canvasHeight * imgWidth) / canvasWidth
          const date = new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
          // Ajouter une entête avec la date
          pdf.setFontSize(8)
          // pdf.text(`Date de génération : ${date}`, 10, 10)
          pdf.text(`Atelier réalisé le : ${date}`, 8, 8) // Ajouter l'entête sur chaque page
          if (this.user.username) {
            pdf.text(`par : ${this.user.username}`, 100, 8)
          }
          // Découpage manuel des pages
          let heightLeft = imgHeight
          let position = 20 // Ajustement pour ne pas superposer avec l'entête
          while (heightLeft > 0) {
            pdf.addImage(this.previewImage, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pdfHeight
            if (heightLeft > 0) {
              pdf.addPage()
              position = -imgHeight + heightLeft + 20 // Décaler pour la page suivante
            }
          }

          pdf.save(`bilan_simulation_${this.date}.pdf`, { returnPromise: true })
        } catch (error) {
          console.error('Erreur lors de la génération du PDF :', error)
        } finally {
          this.previewImage = null
          this.previewCanvas = null
        }
      },
    },
  }
</script>
<style scoped>
  #printable-area {
    padding: 0px 50px 50px 50px;
  }
  .bordered-image {
    border: 1px solid #ddd;
    padding: 10px;
  }
  #printable-area .v-card {
    page-break-inside: avoid !important;
  }
</style>
